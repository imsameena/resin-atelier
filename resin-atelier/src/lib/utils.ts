import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format an integer amount of paise as an INR currency string, e.g. 19900 -> "₹199" */
export function formatINR(paise: number) {
  const rupees = paise / 100;
  const hasFraction = rupees % 1 !== 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: hasFraction ? 2 : 0,
  }).format(rupees);
}

export function rupeesToPaise(rupees: number) {
  return Math.round(rupees * 100);
}

export function generateOrderNumber() {
  const date = new Date();
  const ymd = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate()
  ).padStart(2, "0")}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `RA-${ymd}-${rand}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAID: "Paid",
  CONFIRMED: "Confirmed",
  IN_PROGRESS: "In Progress",
  READY_TO_SHIP: "Ready to Ship",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  PENDING_PAYMENT: "bg-ink-100 text-ink-600",
  PAID: "bg-lavender-100 text-lavender-600",
  CONFIRMED: "bg-lavender-100 text-lavender-600",
  IN_PROGRESS: "bg-gold-100 text-gold-600",
  READY_TO_SHIP: "bg-gold-100 text-gold-600",
  SHIPPED: "bg-blush-100 text-blush-600",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  REFUNDED: "bg-red-100 text-red-700",
};