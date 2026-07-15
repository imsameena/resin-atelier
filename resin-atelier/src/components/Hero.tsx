"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-blush-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-72 w-72 rounded-full bg-lavender-200/40 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-gold-100/50 blur-3xl" />

      <div className="container-atelier relative flex flex-col items-center gap-8 py-20 text-center sm:py-28">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="badge gap-1.5 border border-gold-300/60 bg-white/70 text-gold-600 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" /> Handmade in small batches
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="max-w-3xl font-display text-4xl font-semibold leading-tight text-ink-900 sm:text-5xl lg:text-6xl"
        >
          Resin Keepsakes, <span className="text-gradient-gold">Poured with Love</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="max-w-xl text-base text-ink-500 sm:text-lg"
        >
          Custom keychains, name tags and photo frames — handcrafted in resin, glitter and gold leaf,
          personalised just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link href="/shop" className="btn-primary">
            Shop the Collection <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/shop?category=name-stands" className="btn-secondary">
            Customize a Name Stand
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium uppercase tracking-wide text-ink-400"
        >
          <span>✓ Made to Order</span>
          <span>✓ Secure UPI Payments</span>
          <span>✓ Pan-India Shipping</span>
          <span>✓ 500+ Happy Customers</span>
        </motion.div>
      </div>
    </section>
  );
}
