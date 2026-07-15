import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shop All Resin Creations" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string };
}) {
  const { category, q } = searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      include: { images: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return (
    <div className="container-atelier py-14">
      <div className="mb-10 text-center">
        <p className="badge mb-3 bg-blush-100 text-blush-600">The Collection</p>
        <h1 className="section-title">Shop All Resin Creations</h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-500">
          Every piece is made to order — pick a design, customize it, and we&apos;ll craft it just for you.
        </p>
      </div>

      <form className="mx-auto mb-8 flex max-w-md items-center gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search resin keychains, frames..."
          className="input-atelier"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button type="submit" className="btn-secondary shrink-0">
          Search
        </button>
      </form>

      <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/shop"
          className={cn(
            "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
            !category ? "border-ink-900 bg-ink-900 text-cream-50" : "border-ink-900/12 text-ink-600 hover:border-gold-400"
          )}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
              category === cat.slug
                ? "border-ink-900 bg-ink-900 text-cream-50"
                : "border-ink-900/12 text-ink-600 hover:border-gold-400"
            )}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-ink-400">No products found. Try a different search or category.</p>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
