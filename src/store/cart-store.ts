"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/api";
import { useAuthStore } from "./auth-store";

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
  addItems: (items: Omit<CartItem, "quantity">[]) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  onLogin: () => Promise<void>;
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

      addItems: (newItems) => {
        set((state) => {
          const updatedItems = [...state.items];
          newItems.forEach((item) => {
            const index = updatedItems.findIndex((i) => i.productId === item.productId);
            if (index !== -1) {
              updatedItems[index] = {
                ...updatedItems[index],
                quantity: updatedItems[index].quantity + 1,
              };
            } else {
              updatedItems.push({ ...item, quantity: 1 });
            }
          });
          return { items: updatedItems };
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
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          api.delete("/cart/clear").catch(console.error);
        }
      },

      fetchCart: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

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
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

        try {
          const items = get().items.map(i => ({
            productId: i.productId,
            quantity: i.quantity
          }));
          const data = await api.post<any[]>("/cart/sync", { items });
          
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

      onLogin: async () => {
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (!isAuthenticated) return;

        try {
          const serverData = await api.get<any[]>("/cart");
          
          const serverItems: CartItem[] = serverData.map(item => ({
            productId: item.productId,
            name: item.product?.name || "Produit",
            price: parseFloat(item.product?.price || "0"),
            image: item.product?.image || "",
            quantity: item.quantity,
          }));

          const localItems = get().items;
          const mergedItems = [...serverItems];

          localItems.forEach(local => {
            const existing = mergedItems.find(m => m.productId === local.productId);
            if (existing) {
              existing.quantity = Math.max(existing.quantity, local.quantity);
            } else {
              mergedItems.push(local);
            }
          });

          set({ items: mergedItems });

          if (mergedItems.length > 0) {
            await get().syncCart();
          }
        } catch (error) {
          console.error("Failed during cart login sync:", error);
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
