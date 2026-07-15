"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, UploadCloud, X, Plus } from "lucide-react";
import { slugify, rupeesToPaise, cn } from "@/lib/utils";
import type { Category } from "@prisma/client";
import type { ProductWithRelations } from "@/types";

type ImageItem = { url: string; alt?: string };

export function ProductForm({
  categories,
  initialProduct,
}: {
  categories: Category[];
  initialProduct?: ProductWithRelations;
}) {
  const router = useRouter();
  const isEdit = !!initialProduct;
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState(categories);

  const [form, setForm] = useState({
    name: initialProduct?.name || "",
    slug: initialProduct?.slug || "",
    description: initialProduct?.description || "",
    shortDescription: initialProduct?.shortDescription || "",
    basePrice: initialProduct ? (initialProduct.basePrice / 100).toString() : "",
    compareAtPrice: initialProduct?.compareAtPrice ? (initialProduct.compareAtPrice / 100).toString() : "",
    categoryId: initialProduct?.categoryId || categories[0]?.id || "",
    stock: initialProduct?.stock?.toString() || "0",
    sku: initialProduct?.sku || "",
    isActive: initialProduct?.isActive ?? true,
    isFeatured: initialProduct?.isFeatured ?? false,
    allowsCustomName: initialProduct?.allowsCustomName ?? true,
    allowsColorChoice: initialProduct?.allowsColorChoice ?? true,
    allowsGlitter: initialProduct?.allowsGlitter ?? true,
    allowsPhotoUpload: initialProduct?.allowsPhotoUpload ?? false,
    allowsMessage: initialProduct?.allowsMessage ?? true,
    colorOptions: initialProduct?.colorOptions?.join(", ") || "",
    materialInfo: initialProduct?.materialInfo || "",
    careInstructions: initialProduct?.careInstructions || "",
  });

  const [images, setImages] = useState<ImageItem[]>(
    initialProduct?.images.map((i) => ({ url: i.url, alt: i.alt || undefined })) || []
  );

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImages((imgs) => [...imgs, { url: data.url, alt: form.name }]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleAddCategory() {
    if (!newCategoryName.trim()) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategoryName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCategoryList((c) => [...c, data.category]);
      update("categoryId", data.category.id);
      setNewCategoryName("");
      toast.success("Category added");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not add category");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please add at least one product image.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug || slugify(form.name),
        description: form.description,
        shortDescription: form.shortDescription,
        basePrice: rupeesToPaise(Number(form.basePrice)),
        compareAtPrice: form.compareAtPrice ? rupeesToPaise(Number(form.compareAtPrice)) : null,
        categoryId: form.categoryId,
        stock: Number(form.stock),
        sku: form.sku,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        allowsCustomName: form.allowsCustomName,
        allowsColorChoice: form.allowsColorChoice,
        allowsGlitter: form.allowsGlitter,
        allowsPhotoUpload: form.allowsPhotoUpload,
        allowsMessage: form.allowsMessage,
        colorOptions: form.colorOptions.split(",").map((c) => c.trim()).filter(Boolean),
        materialInfo: form.materialInfo,
        careInstructions: form.careInstructions,
        images,
      };

      const res = await fetch(isEdit ? `/api/products/${initialProduct!.id}` : "/api/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save product");

      toast.success(isEdit ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="card-atelier p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Basic Information</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-atelier">Product Name</label>
            <input
              required
              className="input-atelier"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              onBlur={() => !form.slug && update("slug", slugify(form.name))}
            />
          </div>
          <div>
            <label className="label-atelier">Slug</label>
            <input required className="input-atelier" value={form.slug} onChange={(e) => update("slug", e.target.value)} />
          </div>
          <div>
            <label className="label-atelier">SKU</label>
            <input required className="input-atelier" value={form.sku} onChange={(e) => update("sku", e.target.value)} />
          </div>
          <div>
            <label className="label-atelier">Category</label>
            <div className="flex gap-2">
              <select required className="input-atelier" value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)}>
                {categoryList.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-2 flex gap-2">
              <input
                placeholder="New category name"
                className="input-atelier !py-1.5 text-xs"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="button" onClick={handleAddCategory} className="btn-secondary !px-3 !py-1.5 text-xs">
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="label-atelier">Short Description</label>
            <input className="input-atelier" value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label-atelier">Full Description</label>
            <textarea required rows={4} className="input-atelier resize-none" value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="card-atelier p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Pricing &amp; Inventory</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="label-atelier">Base Price (₹)</label>
            <input required type="number" min={1} className="input-atelier" value={form.basePrice} onChange={(e) => update("basePrice", e.target.value)} />
          </div>
          <div>
            <label className="label-atelier">Compare-at Price (₹, optional)</label>
            <input type="number" min={1} className="input-atelier" value={form.compareAtPrice} onChange={(e) => update("compareAtPrice", e.target.value)} />
          </div>
          <div>
            <label className="label-atelier">Stock Quantity</label>
            <input required type="number" min={0} className="input-atelier" value={form.stock} onChange={(e) => update("stock", e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} /> Active (visible on storefront)
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-600">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} /> Featured / Bestseller
          </label>
        </div>
      </div>

      <div className="card-atelier p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Customization Options</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            ["allowsCustomName", "Allow custom name / text"],
            ["allowsColorChoice", "Allow color choice"],
            ["allowsGlitter", "Allow glitter selection"],
            ["allowsPhotoUpload", "Allow photo upload"],
            ["allowsMessage", "Allow custom message"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 text-sm text-ink-600">
              <input
                type="checkbox"
                checked={form[key as keyof typeof form] as boolean}
                onChange={(e) => update(key as keyof typeof form, e.target.checked as any)}
              />
              {label}
            </label>
          ))}
        </div>
        <div className="mt-4">
          <label className="label-atelier">Color Options (comma separated)</label>
          <input
            className="input-atelier"
            placeholder="Clear, Blush Pink, Lavender, Ivory Gold"
            value={form.colorOptions}
            onChange={(e) => update("colorOptions", e.target.value)}
          />
        </div>
      </div>

      <div className="card-atelier p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Product Images</h2>
        <div className="flex flex-wrap gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative h-24 w-24 overflow-hidden rounded-xl">
              <Image src={img.url} alt={img.alt || ""} fill className="object-cover" sizes="96px" />
              <button
                type="button"
                onClick={() => setImages((imgs) => imgs.filter((_, i) => i !== idx))}
                className="absolute right-1 top-1 rounded-full bg-ink-900/70 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className={cn("flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-ink-900/15 text-ink-400 hover:border-gold-400", uploading && "opacity-50")}>
            {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
            <span className="text-[10px]">Add Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
              }}
            />
          </label>
        </div>
      </div>

      <div className="card-atelier p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink-900">Material &amp; Care (optional)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-atelier">Material Info</label>
            <textarea rows={2} className="input-atelier resize-none" value={form.materialInfo} onChange={(e) => update("materialInfo", e.target.value)} />
          </div>
          <div>
            <label className="label-atelier">Care Instructions</label>
            <textarea rows={2} className="input-atelier resize-none" value={form.careInstructions} onChange={(e) => update("careInstructions", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
