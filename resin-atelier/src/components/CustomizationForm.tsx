"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2 } from "lucide-react";
import type { ProductWithRelations, CartCustomization } from "@/types";
import { getCustomizationFields, type CustomizationFieldDef } from "@/lib/product-customization";
import { cn } from "@/lib/utils";

export function CustomizationForm({
  product,
  value,
  onChange,
}: {
  product: ProductWithRelations;
  value: CartCustomization;
  onChange: (val: CartCustomization) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const fields = getCustomizationFields(product.slug);

  function set<K extends keyof CartCustomization>(key: K, val: CartCustomization[K]) {
    onChange({ ...value, [key]: val });
  }

  async function handlePhotoUpload(key: CustomizationFieldDef["key"], file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      set(key, data.url);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Could not upload photo. Please sign in and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="label-atelier">
            {field.label}
            {field.required && <span className="text-blush-500"> *</span>}
          </label>

          {field.type === "text" && (
            <input
              type="text"
              maxLength={field.maxLength}
              placeholder={field.placeholder}
              className="input-atelier"
              value={(value[field.key] as string) || ""}
              onChange={(e) => set(field.key, e.target.value)}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              maxLength={field.maxLength}
              rows={2}
              placeholder={field.placeholder}
              className="input-atelier resize-none"
              value={(value[field.key] as string) || ""}
              onChange={(e) => set(field.key, e.target.value)}
            />
          )}

          {field.type === "select" && (
            <div className="flex flex-wrap gap-2">
              {field.options.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => set(field.key, option)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                    value[field.key] === option
                      ? "border-gold-400 bg-gold-50 text-gold-600"
                      : "border-ink-900/12 bg-white/70 text-ink-600 hover:border-lavender-300"
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {field.type === "photo" &&
            (value[field.key] ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={value[field.key] as string} alt="Uploaded" className="h-28 w-28 rounded-xl object-cover shadow-soft" />
                <button
                  type="button"
                  onClick={() => set(field.key, "")}
                  className="absolute -right-2 -top-2 rounded-full bg-ink-900 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label className="flex h-28 w-full max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-900/15 bg-white/50 text-ink-400 transition-colors hover:border-gold-400">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gold-500" />
                ) : (
                  <>
                    <UploadCloud className="h-6 w-6" />
                    <span className="text-xs">Click to upload (max 5MB)</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(field.key, file);
                  }}
                />
              </label>
            ))}
        </div>
      ))}

      <div>
        <label className="label-atelier">Special Instructions (optional)</label>
        <textarea
          maxLength={300}
          rows={2}
          placeholder="Any specific requests for this item — placement, size, anything else we should know."
          className="input-atelier resize-none"
          value={value.customNotes || ""}
          onChange={(e) => set("customNotes", e.target.value)}
        />
      </div>
    </div>
  );
}
