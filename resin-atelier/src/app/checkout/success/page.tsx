import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
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
      {searchParams.order && (
        <p className="rounded-full bg-lavender-50 px-5 py-2 text-sm font-medium text-lavender-600">
          Order Number: {searchParams.order}
        </p>
      )}
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <Link href="/account" className="btn-primary">View My Orders</Link>
        <Link href="/shop" className="btn-secondary">Continue Shopping</Link>
      </div>
    </div>
  );
}
