"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        });
        get().syncCart();
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
        get().syncCart();
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        }));
        get().syncCart();
      },

      clearCart: () => {
        set({ items: [] });
        const token = typeof window !== "undefined" ? localStorage.getItem("baysawarr-token") : null;
        if (token) {
          api.delete("/cart/clear").catch(console.error);
        }
      },

      fetchCart: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("baysawarr-token") : null;
        if (!token) return;

        try {
          const data = await api.get<any[]>("/cart");
          const items: CartItem[] = data.map(item => ({
            productId: item.productId,
            name: item.product?.name || "Produit",
            price: parseFloat(item.product?.price || "0"),
            image: item.product?.image || "",
            quantity: item.quantity,
          }));
          set({ items });
        } catch (error) {
          console.error("Failed to fetch cart:", error);
        }
      },

      syncCart: async () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("baysawarr-token") : null;
        if (!token) return;

        try {
          const items = get().items.map(i => ({
            productId: i.productId,
            quantity: i.quantity
          }));
          const data = await api.post<any[]>("/cart/sync", { items });
          
          // Update local state with merged data from server
          const syncedItems: CartItem[] = data.map(item => ({
            productId: item.productId,
            name: item.product?.name || "Produit",
            price: parseFloat(item.product?.price || "0"),
            image: item.product?.image || "",
            quantity: item.quantity,
          }));
          set({ items: syncedItems });
        } catch (error) {
          console.error("Failed to sync cart:", error);
        }
      },

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "baysawarr-cart",
    }
  )
);
