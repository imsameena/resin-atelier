import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatINR, cn, ORDER_STATUS_LABELS } from "@/lib/utils";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Orders" };

const STATUSES = Object.keys(ORDER_STATUS_LABELS);

export default async function AdminOrdersPage({ searchParams }: { searchParams: { status?: string } }) {
  const { status } = searchParams;

  const orders = await prisma.order.findMany({
    where: status ? { status: status as any } : {},
    include: { items: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">Orders</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn("rounded-full border px-4 py-1.5 text-xs font-medium", !status ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-900/12 text-ink-600")}
        >
          All
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn("rounded-full border px-4 py-1.5 text-xs font-medium", status === s ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-900/12 text-ink-600")}
          >
            {ORDER_STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <div className="card-atelier overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3">Order</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Items</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]">
                <td className="px-5 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-ink-900 hover:text-blush-600">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink-500">{order.user?.name || order.guestName || "Guest"}</td>
                <td className="px-5 py-3 text-ink-500">{format(order.createdAt, "d MMM yyyy")}</td>
                <td className="px-5 py-3 text-ink-500">{order.items.length}</td>
                <td className="px-5 py-3 font-medium text-ink-900">{formatINR(order.total)}</td>
                <td className="px-5 py-3"><OrderStatusBadge status={order.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-10 text-center text-ink-400">No orders found.</p>}
      </div>
    </div>
  );
}
