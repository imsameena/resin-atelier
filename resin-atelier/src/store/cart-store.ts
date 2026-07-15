import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartCustomization } from "@/types";

function buildLineId(productId: string, customization: CartCustomization) {
  return `${productId}::${JSON.stringify(customization)}`;
}

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (item) => {
        const lineId = buildLineId(item.productId, item.customization);
        set((state) => {
          const existing = state.items.find((i) => i.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === lineId
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock || 99) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, lineId }] };
        });
        set({ isOpen: true });
      },
      removeItem: (lineId) =>
        set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),
      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.lineId === lineId ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock || 99)) } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0),
    }),
    {
      name: "resin-atelier-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);