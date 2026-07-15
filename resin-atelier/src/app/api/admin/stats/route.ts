import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [totalOrders, pendingOrders, paidOrders, products, lowStock, revenueAgg, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
      prisma.order.count({ where: { status: { in: ["CONFIRMED", "IN_PROGRESS", "READY_TO_SHIP", "SHIPPED", "DELIVERED"] } } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["CONFIRMED", "IN_PROGRESS", "READY_TO_SHIP", "SHIPPED", "DELIVERED"] } },
      }),
      prisma.order.findMany({
        take: 8,
        orderBy: { createdAt: "desc" },
        include: { items: true },
      }),
    ]);

  return NextResponse.json({
    totalOrders,
    pendingOrders,
    paidOrders,
    products,
    lowStock,
    revenue: revenueAgg._sum.total ?? 0,
    recentOrders,
  });
}