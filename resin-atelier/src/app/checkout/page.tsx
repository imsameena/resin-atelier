"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import QRCode from "qrcode";
import { Loader2, ShieldCheck, Copy, Check, ExternalLink } from "lucide-react";
import { z } from "zod";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";
import { computeShippingFee } from "@/lib/shipping";
import { addressSchema } from "@/lib/validations";

const checkoutFormSchema = addressSchema.extend({
  guestName: z.string().min(2, "Full name is required").optional(),
  guestEmail: z.string().email("Enter a valid email").optional(),
  guestPhone: z.string().min(10, "Enter a valid phone number").optional(),
  orderNotes: z.string().max(500).optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

type PaymentInfo = {
  orderId: string;
  orderNumber: string;
  total: number;
  upiId: string;
  upiUri: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const items = useCartStore((s) => s.items);
  const totalAmount = useCartStore((s) => s.totalAmount());
  const clearCart = useCartStore((s) => s.clearCart);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutFormSchema) });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted && items.length === 0 && !paymentInfo) router.replace("/cart");
  }, [mounted, items.length, paymentInfo, router]);

  if (!mounted) return null;

  const shipping = computeShippingFee(totalAmount);
  const total = totalAmount + shipping;
  const isGuest = status !== "loading" && !session?.user;

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          customization: i.customization,
        })),
        address: {
          fullName: values.fullName,
          phone: values.phone,
          line1: values.line1,
          line2: values.line2,
          city: values.city,
          state: values.state,
          pincode: values.pincode,
        },
        ...(isGuest
          ? { guestName: values.guestName, guestEmail: values.guestEmail, guestPhone: values.guestPhone }
          : {}),
        orderNotes: values.orderNotes,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Could not place your order");

      setPaymentInfo(data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  if (paymentInfo) {
    return <UpiPaymentStep info={paymentInfo} onDone={() => clearCart()} />;
  }

  return (
    <div className="container-atelier py-14">
      <h1 className="section-title mb-10">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {isGuest && (
            <div className="card-atelier p-6">
              <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Contact Details</h2>
              <p className="mb-4 text-sm text-ink-500">
                Have an account? <Link href="/login?redirect=/checkout" className="text-blush-600 hover:underline">Sign in</Link> for faster checkout, or continue as a guest.
              </p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="label-atelier">Full Name</label>
                  <input className="input-atelier" {...register("guestName")} />
                  {errors.guestName && <p className="mt-1 text-xs text-red-500">{errors.guestName.message}</p>}
                </div>
                <div>
                  <label className="label-atelier">Email</label>
                  <input type="email" className="input-atelier" {...register("guestEmail")} />
                  {errors.guestEmail && <p className="mt-1 text-xs text-red-500">{errors.guestEmail.message}</p>}
                </div>
              </div>
            </div>
          )}

          <div className="card-atelier p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Shipping Address</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label-atelier">Full Name</label>
                <input className="input-atelier" {...register("fullName")} />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
              </div>
              <div>
                <label className="label-atelier">Phone Number</label>
                <input className="input-atelier" {...register("phone")} />
                {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-atelier">Address Line 1</label>
                <input className="input-atelier" {...register("line1")} />
                {errors.line1 && <p className="mt-1 text-xs text-red-500">{errors.line1.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label-atelier">Address Line 2 (optional)</label>
                <input className="input-atelier" {...register("line2")} />
              </div>
              <div>
                <label className="label-atelier">City</label>
                <input className="input-atelier" {...register("city")} />
                {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label-atelier">State</label>
                <input className="input-atelier" {...register("state")} />
                {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
              </div>
              <div>
                <label className="label-atelier">PIN Code</label>
                <input className="input-atelier" {...register("pincode")} />
                {errors.pincode && <p className="mt-1 text-xs text-red-500">{errors.pincode.message}</p>}
              </div>
            </div>
          </div>

          <div className="card-atelier p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Order Notes</h2>
            <textarea
              rows={3}
              placeholder="Delivery instructions, gift wrapping requests, anything else we should know..."
              className="input-atelier resize-none"
              {...register("orderNotes")}
            />
          </div>
        </div>

        <div className="card-atelier h-fit p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Order Summary</h2>
          <ul className="mb-4 flex max-h-64 flex-col gap-3 overflow-y-auto">
            {items.map((item) => (
              <li key={item.lineId} className="flex gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-blush-50">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-ink-900">{item.name}</p>
                  <p className="text-ink-400">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-ink-900">{formatINR(item.unitPrice * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 border-t border-ink-900/8 pt-4 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal</span>
              <span>{formatINR(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink-900/8 pt-3 font-display text-lg font-semibold text-ink-900">
            <span>Total</span>
            <span>{formatINR(total)}</span>
          </div>

          <button type="submit" disabled={submitting} className="btn-gold mt-6 w-full">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
            {submitting ? "Placing Order..." : `Place Order — ${formatINR(total)}`}
          </button>
          <p className="mt-3 text-center text-xs text-ink-400">
            You&apos;ll pay via UPI on the next step. No card details required.
          </p>
        </div>
      </form>
    </div>
  );
}

function UpiPaymentStep({ info, onDone }: { info: PaymentInfo; onDone: () => void }) {
  const router = useRouter();
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(info.upiUri, { width: 260, margin: 1, color: { dark: "#2E2722", light: "#FFFDFB" } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [info.upiUri]);

  async function copyUpiId() {
    try {
      await navigator.clipboard.writeText(info.upiId);
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please copy it manually");
    }
  }

  async function handleConfirm() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout/confirm-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: info.orderId, utrNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      onDone();
      router.push(`/checkout/success?order=${info.orderNumber}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-atelier flex justify-center py-14">
      <div className="card-atelier w-full max-w-md p-8 text-center">
        <p className="badge mb-3 mx-auto w-fit bg-gold-100 text-gold-600">Order {info.orderNumber}</p>
        <h1 className="font-display text-2xl font-semibold text-ink-900">Pay via UPI</h1>
        <p className="mt-2 text-sm text-ink-500">
          Scan the QR code or pay directly to the UPI ID below using any UPI app — Google Pay, PhonePe, Paytm, or
          your bank&apos;s app.
        </p>

        <p className="mt-6 font-display text-3xl font-semibold text-ink-900">{formatINR(info.total)}</p>

        <div className="mx-auto mt-6 flex h-64 w-64 items-center justify-center rounded-xl2 border border-ink-900/8 bg-white p-3">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrDataUrl} alt="UPI payment QR code" className="h-full w-full" />
          ) : (
            <Loader2 className="h-6 w-6 animate-spin text-ink-300" />
          )}
        </div>

        <div className="mx-auto mt-6 flex max-w-xs items-center justify-between gap-2 rounded-full border border-ink-900/12 bg-white/80 px-4 py-2.5">
          <span className="truncate text-sm font-medium text-ink-800">{info.upiId}</span>
          <button onClick={copyUpiId} className="shrink-0 text-ink-500 hover:text-blush-600" aria-label="Copy UPI ID">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>

        <a href={info.upiUri} className="btn-secondary mt-4 w-full">
          Open in UPI App <ExternalLink className="h-4 w-4" />
        </a>

        <div className="mt-8 border-t border-ink-900/8 pt-6 text-left">
          <label className="label-atelier">UPI Transaction / Reference No. (optional)</label>
          <input
            className="input-atelier"
            placeholder="e.g. 123456789012"
            value={utrNumber}
            onChange={(e) => setUtrNumber(e.target.value)}
          />
          <p className="mt-1.5 text-xs text-ink-400">
            Adding this helps us confirm your payment faster, but it&apos;s not required.
          </p>
        </div>

        <button onClick={handleConfirm} disabled={submitting} className="btn-primary mt-4 w-full">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          I&apos;ve Completed the Payment
        </button>
        <p className="mt-3 text-xs text-ink-400">
          We&apos;ll verify your payment and confirm your order shortly — you&apos;ll see the status under My
          Orders.
        </p>
      </div>
    </div>
  );
}
