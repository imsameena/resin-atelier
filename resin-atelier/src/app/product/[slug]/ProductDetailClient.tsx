"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { ChevronRight, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { CustomizationForm } from "@/components/CustomizationForm";
import { QuantitySelector } from "@/components/QuantitySelector";
import { ProductCard } from "@/components/ProductCard";
import { useCartStore } from "@/store/cart-store";
import { formatINR, cn } from "@/lib/utils";
import { getCustomizationFields } from "@/lib/product-customization";
import type { ProductWithRelations, CartCustomization } from "@/types";

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: ProductWithRelations;
  relatedProducts: ProductWithRelations[];
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState<CartCustomization>({});
  const addItem = useCartStore((s) => s.addItem);

  const images = product.images.length > 0 ? product.images : [{ id: "placeholder", url: "/placeholder-product.svg", alt: product.name }];
  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    if (outOfStock) return;

    const requiredFields = getCustomizationFields(product.slug).filter((f) => f.required);
    const missing = requiredFields.find((f) => !customization[f.key]?.trim());
    if (missing) {
      toast.error(`Please fill in "${missing.label}" before adding to bag.`);
      return;
    }

    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: images[0].url,
      unitPrice: product.basePrice,
      quantity,
      maxStock: product.stock,
      customization,
    });
    toast.success(`${product.name} added to your bag`);
  }

  return (
    <div className="container-atelier py-10">
      <div className="mb-6 flex items-center gap-1.5 text-xs text-ink-400">
        <Link href="/shop" className="hover:text-blush-600">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{product.category.name}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink-600">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl2 bg-gradient-to-br from-blush-50 to-lavender-50 shadow-soft">
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt || product.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {product.isFeatured && (
              <span className="badge absolute left-4 top-4 gap-1 bg-gold-400/90 text-white">
                <Sparkles className="h-3 w-3" /> Bestseller
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-colors",
                    activeImage === idx ? "border-gold-400" : "border-transparent"
                  )}
                >
                  <Image src={img.url} alt={img.alt || product.name} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-blush-500">{product.category.name}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-display text-2xl font-semibold text-ink-900">{formatINR(product.basePrice)}</span>
            {product.compareAtPrice && (
              <span className="text-base text-ink-300 line-through">{formatINR(product.compareAtPrice)}</span>
            )}
            {outOfStock ? (
              <span className="badge bg-red-100 text-red-600">Out of Stock</span>
            ) : product.stock <= 5 ? (
              <span className="badge bg-gold-100 text-gold-600">Only {product.stock} left</span>
            ) : null}
          </div>

          <p className="mt-4 leading-relaxed text-ink-500">{product.shortDescription || product.description}</p>

          <div className="mt-8 rounded-xl2 border border-ink-900/8 bg-white/60 p-6">
            <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Make It Yours</h2>
            <CustomizationForm product={product} value={customization} onChange={setCustomization} />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-6">
            <div>
              <p className="label-atelier">Quantity</p>
              <QuantitySelector value={quantity} onChange={setQuantity} max={Math.max(product.stock, 1)} />
            </div>
          </div>

          <button onClick={handleAddToCart} disabled={outOfStock} className="btn-primary mt-8 w-full sm:w-auto sm:px-12">
            {outOfStock ? "Out of Stock" : `Add to Bag — ${formatINR(product.basePrice * quantity)}`}
          </button>

          <div className="mt-8 grid grid-cols-1 gap-3 border-t border-ink-900/8 pt-6 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <Truck className="h-4 w-4 text-gold-500" /> Ships in 3–5 days, made to order
            </div>
            <div className="flex items-center gap-2 text-sm text-ink-500">
              <ShieldCheck className="h-4 w-4 text-gold-500" /> Secure UPI payment
            </div>
          </div>

          {(product.materialInfo || product.careInstructions) && (
            <div className="mt-8 space-y-3 border-t border-ink-900/8 pt-6 text-sm text-ink-500">
              {product.materialInfo && (
                <div>
                  <p className="font-medium text-ink-700">Material</p>
                  <p>{product.materialInfo}</p>
                </div>
              )}
              {product.careInstructions && (
                <div>
                  <p className="font-medium text-ink-700">Care Instructions</p>
                  <p>{product.careInstructions}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-24">
          <h2 className="section-title mb-8 text-center">You May Also Love</h2>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            {relatedProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
