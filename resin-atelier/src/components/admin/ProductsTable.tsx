"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import { formatINR } from "@/lib/utils";
import type { ProductWithRelations } from "@/types";

export function ProductsTable({ products }: { products: ProductWithRelations[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);

  async function handleDeactivate(id: string) {
    if (!confirm("Deactivate this product? It will be hidden from the storefront.")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to update product");
      toast.success("Product deactivated");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Products</h1>
        <Link href="/admin/products/new" className="btn-primary !px-5 !py-2.5 text-sm">
          <PlusCircle className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="card-atelier overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-ink-900/8 text-xs uppercase tracking-wide text-ink-400">
              <th className="px-5 py-3">Product</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Price</th>
              <th className="px-5 py-3">Stock</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-ink-900/5 last:border-0 hover:bg-ink-900/[0.02]">
                <td className="flex items-center gap-3 px-5 py-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-blush-50">
                    <Image src={p.images[0]?.url || "/placeholder-product.svg"} alt={p.name} fill className="object-cover" sizes="40px" />
                  </div>
                  <span className="font-medium text-ink-900">{p.name}</span>
                </td>
                <td className="px-5 py-3 text-ink-500">{p.category.name}</td>
                <td className="px-5 py-3 text-ink-500">{formatINR(p.basePrice)}</td>
                <td className="px-5 py-3">
                  <span className={p.stock <= 5 ? "font-medium text-red-500" : "text-ink-500"}>{p.stock}</span>
                </td>
                <td className="px-5 py-3">
                  <span className={`badge ${p.isActive ? "bg-green-100 text-green-700" : "bg-ink-100 text-ink-500"}`}>
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${p.id}`} className="rounded-lg p-2 text-ink-500 hover:bg-lavender-50 hover:text-lavender-600">
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      disabled={busyId === p.id}
                      onClick={() => handleDeactivate(p.id)}
                      className="rounded-lg p-2 text-ink-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-10 text-center text-ink-400">No products yet. Add your first one!</p>}
      </div>
    </div>
  );
}
