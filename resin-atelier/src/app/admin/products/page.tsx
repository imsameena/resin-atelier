import { prisma } from "@/lib/prisma";
import { ProductsTable } from "@/components/admin/ProductsTable";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { createdAt: "desc" },
  });

  return <ProductsTable products={products} />;
}
