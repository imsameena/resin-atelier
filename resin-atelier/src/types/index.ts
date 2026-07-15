export type CartCustomization = {
  customName?: string;
  customColor?: string;
  customGlitterColor?: string;
  customTasselColor?: string;
  customShape?: string;
  customFont?: string;
  customDecoration?: string;
  customMessage?: string;
  customPhotoUrl?: string;
  customNotes?: string;
};

import type { Product, ProductImage, Category } from "@prisma/client";

export type ProductWithRelations = Product & {
  images: ProductImage[];
  category: Category;
};

export type CartItem = {
  lineId: string; // unique per product + customization combo
  productId: string;
  slug: string;
  name: string;
  image: string;
  unitPrice: number; // paise
  quantity: number;
  maxStock: number;
  customization: CartCustomization;
};