import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendWhatsAppMessage, buildOrderNotificationMessage } from "@/lib/whatsapp";
import { sendOrderNotificationEmail } from "@/lib/email";

const schema = z.object({
  orderId: z.string(),
});

// Called by the customer after they've completed the UPI transfer. This does NOT
// mark the order as paid — it notifies the admin (with the buyer's address) so
// they can cross-check the incoming payment in their own UPI/bank app before
// confirming the order.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const { orderId } = parsed.data;

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

    await prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        customerConfirmedAt: new Date(),
      },
    });

    const notificationMessage = buildOrderNotificationMessage(order);

    const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER;
    const notifications: Promise<void>[] = [
      sendOrderNotificationEmail(`New order placed: ${order.orderNumber}`, notificationMessage),
    ];
    if (adminNumber) {
      notifications.push(sendWhatsAppMessage(adminNumber, notificationMessage));
    }

    // Awaited (not fire-and-forget) so the notification actually finishes sending
    // before the serverless function returns and its execution is frozen.
    const results = await Promise.allSettled(notifications);
    results.forEach((r) => {
      if (r.status === "rejected") console.error("Failed to send order notification:", r.reason);
    });

    return NextResponse.json({ success: true, orderNumber: order.orderNumber });
  } catch (err) {
    console.error("Confirm payment error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
