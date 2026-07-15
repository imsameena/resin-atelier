"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatINR } from "@/lib/utils";
import { CustomizationSummary } from "@/components/CustomizationSummary";

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totalAmount = useCartStore((s) => s.totalAmount());

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-cream-50 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-ink-900/10 px-6 py-5">
              <h2 className="font-display text-xl font-semibold">Your Bag ({items.length})</h2>
              <button onClick={closeCart} className="rounded-full p-2 hover:bg-ink-900/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
                <ShoppingBag className="h-12 w-12 text-ink-100" strokeWidth={1} />
                <p className="text-ink-400">Your bag is empty — time to add some sparkle.</p>
                <Link href="/shop" onClick={closeCart} className="btn-primary mt-2">
                  Browse Products
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="flex flex-col gap-5">
                    {items.map((item) => (
                      <li key={item.lineId} className="flex gap-4 border-b border-ink-900/5 pb-5">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-blush-50">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        </div>
                        <div className="flex flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-ink-900">{item.name}</p>
                            <button onClick={() => removeItem(item.lineId)} className="text-ink-300 hover:text-blush-600">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <CustomizationSummary values={item.customization} />
                          <div className="mt-1 flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-ink-900/10 px-2 py-1">
                              <button
                                onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="text-ink-500 disabled:opacity-30"
                              >
                                <Minus className="h-3.5 w-3.5" />
                              </button>
                              <span className="w-4 text-center text-xs font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                                className="text-ink-500"
                              >
                                <Plus className="h-3.5 w-3.5" />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-ink-900">
                              {formatINR(item.unitPrice * item.quantity)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-ink-900/10 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between text-sm">
                    <span className="text-ink-500">Subtotal</span>
                    <span className="font-display text-lg font-semibold text-ink-900">{formatINR(totalAmount)}</span>
                  </div>
                  <p className="mb-4 text-xs text-ink-400">Shipping & taxes calculated at checkout.</p>
                  <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                    Proceed to Checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}