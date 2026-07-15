"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

export function ProductCard({ product, index = 0 }: { product: ProductWithRelations; index?: number }) {
  const image = product.images[0]?.url || "/placeholder-product.svg";
  const outOfStock = product.stock <= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.05 }}
    >
      <Link href={`/product/${product.slug}`} className="card-atelier group block overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-blush-50 to-lavender-50">
          <Image
            src={image}
            alt={product.images[0]?.alt || product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          {product.isFeatured && (
            <span className="badge absolute left-3 top-3 gap-1 bg-gold-400/90 text-white">
              <Sparkles className="h-3 w-3" /> Bestseller
            </span>
          )}
          {outOfStock && (
            <span className="badge absolute right-3 top-3 bg-ink-900/80 text-white">Sold Out</span>
          )}
          <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-ink-900/70 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
            <span className="text-xs font-medium text-cream-50">Customize &amp; Shop →</span>
          </div>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-wide text-blush-500">{product.category.name}</p>
          <h3 className="mt-1 truncate font-display text-base font-semibold text-ink-900">{product.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-ink-900">from {formatINR(product.basePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-ink-300 line-through">{formatINR(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}