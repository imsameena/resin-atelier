import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const orderNumber = searchParams.order;

  const order = orderNumber
    ? await prisma.order.findUnique({
        where: { orderNumber },
        include: { payment: true },
      })
    : null;

  // Only treat this as a real confirmation if the order exists and the
  // customer actually went through the confirm-payment step for it.
  const isValidOrder = !!order?.payment?.customerConfirmedAt;

  if (!isValidOrder) {
    return (
      <div className="container-atelier flex flex-col items-center justify-center gap-5 py-32 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
        <h1 className="section-title">Order Not Found</h1>
        <p className="max-w-md text-ink-500">
          We couldn&apos;t find a confirmed order for that link. If you just placed an order, please complete the
          payment confirmation step, or check My Orders for its status.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <Link href="/account" className="btn-primary">View My Orders</Link>
          <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-atelier flex flex-col items-center justify-center gap-5 py-32 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </div>
      <h1 className="section-title">Order Placed!</h1>
      <p className="max-w-md text-ink-500">
        Thank you for your order. We&apos;ve received your UPI payment details and will confirm your order shortly
        — track its status anytime under My Orders.
      </p>
      <p className="rounded-full bg-lavender-50 px-5 py-2 text-sm font-medium text-lavender-600">
        Order Number: {order.orderNumber}
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link href="/account" className="btn-primary">View My Orders</Link>
        <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
