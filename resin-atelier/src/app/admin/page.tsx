import Link from "next/link";
import { ShoppingCart, Clock, Package, AlertTriangle, IndianRupee } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/StatCard";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const [totalOrders, pendingOrders, activeProducts, lowStock, revenueAgg, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING_PAYMENT" } }),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: true, stock: { lte: 5 } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ["CONFIRMED", "IN_PROGRESS", "READY_TO_SHIP", "SHIPPED", "DELIVERED"] } },
    }),
    prisma.order.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { items: true } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-500">A quick overview of your store&apos;s performance.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatINR(revenueAgg._sum.total ?? 0)} icon={IndianRupee} tone="gold" />
        <StatCard label="Total Orders" value={totalOrders} icon={ShoppingCart} tone="blush" />
        <StatCard label="Pending Payment" value={pendingOrders} icon={Clock} tone="lavender" />
        <StatCard label="Low Stock Items" value={lowStock} icon={AlertTriangle} tone="ink" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900">Recent Orders</h2>
        <Link href="/admin/orders" className="text-sm font-medium text-blush-600 hover:underline">View all</Link>
      </div>

      <div className="card-atelier mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => (
              <tr key={order.id} className="border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink-900 hover:text-blush-600">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-500">{format(order.createdAt, "d MMM yyyy")}</td>
                <td className="px-5 py-3 text-ink-500">{order.items.length}</td>
                <td className="px-5 py-3 font-medium text-ink-900">{formatINR(order.total)}</td>
                <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex items-center gap-2 text-sm text-ink-400">
        <Package className="h-4 w-4" /> {activeProducts} active products in catalog
      </div>
    </div>
  );
}
