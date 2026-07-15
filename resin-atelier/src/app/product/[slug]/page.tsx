import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductDetailClient } from "./ProductDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription || product.description,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { sortOrder: "asc" } }, category: true },
  });

  if (!product || !product.isActive) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: { categoryId: product.categoryId, isActive: true, id: { not: product.id } },
    include: { images: true, category: true },
    take: 4,
  });

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}
