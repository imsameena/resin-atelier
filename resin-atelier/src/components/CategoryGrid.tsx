import Link from "next/link";
import Image from "next/image";
import type { Category } from "@prisma/client";

export function CategoryGrid({ categories }: { categories: (Category & { _count: { products: number } })[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="container-atelier py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="badge mb-3 bg-blush-100 text-blush-600">Shop by Category</p>
        <h2 className="section-title">Find Your Perfect Piece</h2>
      </div>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl2 shadow-soft transition-transform hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blush-200 via-lavender-100 to-gold-100">
              {cat.imageUrl && (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 via-ink-900/10 to-transparent" />
            <div className="relative p-4 text-cream-50">
              <p className="font-display text-lg font-semibold">{cat.name}</p>
              <p className="text-xs text-cream-100/80">{cat._count.products} designs</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
