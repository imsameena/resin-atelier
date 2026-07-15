import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { PaymentVerification } from "@/components/admin/PaymentVerification";
import { CustomizationSummary } from "@/components/CustomizationSummary";
import { formatINR } from "@/lib/utils";
import { format } from "date-fns";

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: true, payment: true, address: true, user: true },
  });

  if (!order) notFound();

  return (
    <div>
      <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-500 hover:text-blush-600">
        <ChevronLeft className="h-4 w-4" /> Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900">{order.orderNumber}</h1>
          <p className="text-sm text-ink-400">Placed on {format(order.createdAt, "d MMMM yyyy, h:mm a")}</p>
        </div>
        <OrderStatusUpdater orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card-atelier divide-y divide-ink-900/5 p-5">
            {order.items.map((item) => (
              <div key={item.id} className="flex flex-col gap-2 py-4 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between">
                  <p className="font-medium text-ink-900">{item.productName}</p>
                  <span className="font-medium text-ink-900">{formatINR(item.lineTotal)}</span>
                </div>
                <p className="text-xs text-ink-400">Qty {item.quantity} × {formatINR(item.unitPrice)}</p>
                <CustomizationSummary variant="block" values={item} />
              </div>
            ))}
          </div>

          {order.orderNotes && (
            <div className="card-atelier mt-6 p-5">
              <p className="mb-1 text-sm font-medium text-ink-900">Order Notes</p>
              <p className="text-sm text-ink-500">{order.orderNotes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="card-atelier p-5">
            <h2 className="mb-3 font-display text-base font-semibold text-ink-900">Customer</h2>
            <p className="text-sm text-ink-600">{order.user?.name || order.guestName || "Guest"}</p>
            <p className="text-sm text-ink-500">{order.user?.email || order.guestEmail}</p>
            <p className="text-sm text-ink-500">{order.user?.phone || order.guestPhone}</p>
          </div>

          <div className="card-atelier p-5">
            <h2 className="mb-3 font-display text-base font-semibold text-ink-900">Payment Summary</h2>
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : formatINR(order.shippingFee)}</span></div>
              <div className="mt-2 flex justify-between border-t border-ink-900/8 pt-2 font-semibold text-ink-900"><span>Total</span><span>{formatINR(order.total)}</span></div>
            </div>
            {order.payment && (
              <>
                <div className="mt-3 space-y-1 text-xs text-ink-400">
                  <p>Status: <b className="text-ink-600">{order.payment.status}</b></p>
                  <p>Method: {order.payment.method}</p>
                  {order.payment.upiId && <p>Paid to: {order.payment.upiId}</p>}
                  {order.payment.utrNumber && <p>Customer&apos;s UTR / reference: <b className="text-ink-600">{order.payment.utrNumber}</b></p>}
                  {order.payment.customerConfirmedAt && (
                    <p>Customer marked as paid on {new Date(order.payment.customerConfirmedAt).toLocaleString("en-IN")}</p>
                  )}
                </div>
                <PaymentVerification orderId={order.id} status={order.payment.status} />
              </>
            )}
          </div>

          {order.address && (
            <div className="card-atelier p-5">
              <h2 className="mb-3 font-display text-base font-semibold text-ink-900">Shipping Address</h2>
              <p className="text-sm text-ink-600">{order.address.fullName}</p>
              <p className="text-sm text-ink-500">{order.address.line1}{order.address.line2 ? `, ${order.address.line2}` : ""}</p>
              <p className="text-sm text-ink-500">{order.address.city}, {order.address.state} {order.address.pincode}</p>
              <p className="text-sm text-ink-500">{order.address.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
