"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";
import { computeShippingFee } from "@/lib/shipping";
import { CustomizationSummary } from "@/components/CustomizationSummary";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalAmount = useCartStore((s) => s.totalAmount());

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const shipping = computeShippingFee(totalAmount);

  if (items.length === 0) {
    return (
      <div className="container-atelier flex flex-col items-center justify-center gap-4 py-32 text-center">
        <ShoppingBag className="h-16 w-16 text-ink-100" strokeWidth={1} />
        <h1 className="section-title">Your bag is empty</h1>
        <p className="text-ink-500">Add a little sparkle — browse our handcrafted resin collection.</p>
        <Link href="/shop" className="btn-primary mt-2">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-atelier py-14">
      <h1 className="section-title mb-10">Your Bag</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="flex flex-col gap-6">
            {items.map((item) => (
              <li key={item.lineId} className="card-atelier flex gap-4 p-4 sm:p-5">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-blush-50 sm:h-28 sm:w-28">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="112px" />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-ink-900 sm:text-lg">{item.name}</h3>
                    <button onClick={() => removeItem(item.lineId)} className="text-ink-300 hover:text-blush-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <CustomizationSummary values={item.customization} className="mt-1" />
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3 rounded-full border border-ink-900/10 px-3 py-1.5">
                      <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)} disabled={item.quantity <= 1} className="text-ink-500 disabled:opacity-30">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="text-ink-500">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display text-lg font-semibold text-ink-900">
                      {formatINR(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-atelier h-fit p-6">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Order Summary</h2>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-ink-500">
              <span>Subtotal</span>
              <span>{formatINR(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-ink-500">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : formatINR(shipping)}</span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-gold-600">
                Add {formatINR(99900 - totalAmount)} more for free shipping!
              </p>
            )}
          </div>
          <div className="mt-4 flex justify-between border-t border-ink-900/8 pt-4 font-display text-lg font-semibold text-ink-900">
            <span>Total</span>
            <span>{formatINR(totalAmount + shipping)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">Proceed to Checkout</Link>
          <Link href="/shop" className="btn-secondary mt-3 w-full">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
