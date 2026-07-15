import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
