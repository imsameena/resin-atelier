import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Hero } from "@/components/Hero";
import { CategoryGrid } from "@/components/CategoryGrid";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { Testimonials } from "@/components/Testimonials";
import { InstagramGallery } from "@/components/InstagramGallery";
import { FAQAccordion } from "@/components/FAQAccordion";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [categories, featuredProducts, testimonials, galleryImages, faqs] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { products: true } } } }),
    prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: { images: true, category: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.testimonial.findMany({ where: { isApproved: true }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.galleryImage.findMany({ orderBy: { sortOrder: "asc" }, take: 6 }),
    prisma.fAQItem.findMany({ orderBy: { sortOrder: "asc" }, take: 6 }),
  ]);

  return (
    <div>
      <Hero />
      <CategoryGrid categories={categories} />

      {featuredProducts.length > 0 && (
        <section className="container-atelier py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="badge mb-3 bg-gold-100 text-gold-600">Bestsellers</p>
              <h2 className="section-title">Fan Favourites</h2>
            </div>
            <Link href="/shop" className="hidden items-center gap-1 text-sm font-medium text-blush-600 hover:underline sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featuredProducts.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      <PricingSection />
      <Testimonials testimonials={testimonials} />
      <InstagramGallery images={galleryImages} />

      <section className="container-atelier py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="badge mb-3 bg-lavender-100 text-lavender-600">Questions</p>
          <h2 className="section-title">Frequently Asked</h2>
        </div>
        <div className="mt-12">
          <FAQAccordion faqs={faqs} />
        </div>
      </section>
    </div>
  );
}
