import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { OrderStatusBadge } from "@/components/OrderStatusBadge";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/account");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="container-atelier py-14">
      <h1 className="section-title mb-2">My Account</h1>
      <p className="mb-10 text-ink-500">Welcome back, {user.name}. Here&apos;s your order history.</p>

      {orders.length === 0 ? (
        <div className="card-atelier flex flex-col items-center gap-3 py-16 text-center">
          <Package className="h-10 w-10 text-ink-200" />
          <p className="text-ink-500">You haven&apos;t placed any orders yet.</p>
          <Link href="/shop" className="btn-primary mt-2">Start Shopping</Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link href={`/account/orders/${order.id}`} className="card-atelier flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-display text-base font-semibold text-ink-900">{order.orderNumber}</p>
                  <p className="text-xs text-ink-400">
                    {format(order.createdAt, "d MMM yyyy")} · {order.items.length} item{order.items.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium text-ink-900">{formatINR(order.total)}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
