import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(10, "Enter a valid 10-digit phone number")
    .max(15)
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const customizationSchema = z.object({
  customName: z.string().max(40).optional().or(z.literal("")),
  customColor: z.string().max(40).optional().or(z.literal("")),
  customGlitterColor: z.string().max(40).optional().or(z.literal("")),
  customTasselColor: z.string().max(40).optional().or(z.literal("")),
  customShape: z.string().max(40).optional().or(z.literal("")),
  customFont: z.string().max(40).optional().or(z.literal("")),
  customDecoration: z.string().max(40).optional().or(z.literal("")),
  customMessage: z.string().max(200).optional().or(z.literal("")),
  customPhotoUrl: z.string().url().optional().or(z.literal("")),
  customNotes: z.string().max(300).optional().or(z.literal("")),
});
export type CustomizationInput = z.infer<typeof customizationSchema>;

export const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Enter a valid phone number").max(15),
  line1: z.string().min(4, "Address is required"),
  line2: z.string().optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(4, "Enter a valid PIN code").max(10),
});
export type AddressInput = z.infer<typeof addressSchema>;

export const checkoutSchema = z.object({
  guestEmail: z.string().email("Enter a valid email").optional(),
  guestName: z.string().min(2).optional(),
  guestPhone: z.string().min(10).optional(),
  address: addressSchema,
  orderNotes: z.string().max(500).optional().or(z.literal("")),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().optional().or(z.literal("")),
  message: z.string().min(10, "Tell us a little more (min 10 characters)"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  shortDescription: z.string().optional().or(z.literal("")),
  basePrice: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional().nullable(),
  categoryId: z.string().min(1),
  stock: z.number().int().min(0),
  sku: z.string().min(2),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  allowsCustomName: z.boolean().default(true),
  allowsColorChoice: z.boolean().default(true),
  allowsGlitter: z.boolean().default(true),
  allowsPhotoUpload: z.boolean().default(false),
  allowsMessage: z.boolean().default(true),
  colorOptions: z.array(z.string()).default([]),
  materialInfo: z.string().optional().or(z.literal("")),
  careInstructions: z.string().optional().or(z.literal("")),
  images: z.array(z.object({ url: z.string(), alt: z.string().optional() })).default([]),
});
export type ProductInput = z.infer<typeof productSchema>;

export const orderStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "PAID",
    "CONFIRMED",
    "IN_PROGRESS",
    "READY_TO_SHIP",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});