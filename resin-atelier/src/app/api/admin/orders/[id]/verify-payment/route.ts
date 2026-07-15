import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

const schema = z.object({
  status: z.enum(["PAID", "FAILED"]),
});

// Admin-only: after checking the UPI ID / bank statement for the incoming transfer,
// the admin marks the payment as verified (or failed) here. Marking PAID also
// advances the order to CONFIRMED if it's still awaiting payment.
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { payment: true } });
  if (!order || !order.payment) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  await prisma.payment.update({
    where: { id: order.payment.id },
    data: {
      status: parsed.data.status,
      verifiedAt: new Date(),
    },
  });

  if (parsed.data.status === "PAID" && order.status === "PENDING_PAYMENT") {
    await prisma.order.update({ where: { id: order.id }, data: { status: "CONFIRMED" } });
  }

  const updated = await prisma.order.findUnique({ where: { id: order.id }, include: { payment: true } });

  return NextResponse.json({ order: updated });
}
