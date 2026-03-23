"use client";
import { create } from "zustand";
import { api } from "@/lib/api";

export interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: any;
    rating: number;
  };
}

interface WishlistStore {
  items: WishlistItem[];
  loading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  loading: false,

  fetchWishlist: async () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("baysawarr-token") : null;
    if (!token) {
      set({ items: [], loading: false });
      return;
    }

    set({ loading: true });
    try {
      const data = await api.get<WishlistItem[]>("/wishlist");
      set({ items: data });
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    } finally {
      set({ loading: false });
    }
  },

  addToWishlist: async (productId) => {
    try {
      await api.post("/wishlist", { productId });
      await get().fetchWishlist();
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
    }
  },

  removeFromWishlist: async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      set((state) => ({
        items: state.items.filter((i) => i.productId !== productId),
      }));
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  },

  isInWishlist: (productId) => {
    return get().items.some((i) => i.productId === productId);
  },
}));
