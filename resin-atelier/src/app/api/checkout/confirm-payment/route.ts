import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, buildOrderNotificationMessage } from "@/lib/whatsapp";
import { sendOrderNotificationEmail } from "@/lib/email";

const schema = z.object({
  orderId: z.string(),
  utrNumber: z.string().max(60).optional().or(z.literal("")),
});

// Called by the customer after they've completed the UPI transfer. This does NOT
// mark the order as paid — it just records that the customer says they've paid
// (plus their UTR reference, if provided) so the admin can cross-check against
// the actual UPI/bank statement before confirming the order.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { orderId, utrNumber } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true, items: true, user: true },
    });
    if (!order || !order.payment) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.payment.status === "PAID") {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber });
    }

    const finalUtrNumber = utrNumber || order.payment.utrNumber;

    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        utrNumber: finalUtrNumber,
        customerConfirmedAt: new Date(),
      },
    });

    const notificationMessage = buildOrderNotificationMessage({ ...order, utrNumber: finalUtrNumber });

    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    if (adminNumber) {
      sendWhatsAppMessage(adminNumber, notificationMessage).catch((err) =>
        console.error("Failed to send order WhatsApp notification:", err)
      );
    }

    sendOrderNotificationEmail(`New order confirmed: ${order.orderNumber}`, notificationMessage).catch((err) =>
      console.error("Failed to send order email notification:", err)
    );

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
