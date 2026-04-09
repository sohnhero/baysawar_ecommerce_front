"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCartStore } from "./cart-store";
import { useWishlistStore } from "./wishlist-store";

export type UserRole = "client" | "admin" | "vendeur";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  image?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  artisan?: {
    id: string;
    name: string;
    [key: string]: any;
  };
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => {
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        // Clear local UI state first
        useCartStore.setState({ items: [] });
        useWishlistStore.setState({ items: [] });
        
        set({ user: null, isAuthenticated: false });
      },
      refreshAuth: async () => {
        try {
          // Use a dynamic import for api to avoid circular dependencies if any
          const { api } = await import("@/lib/api");
          const data = await api.get<{ user: User }>("/auth/me");
          if (data.user) {
            set({ user: data.user, isAuthenticated: true });
          }
        } catch (error) {
          // Token is dead or missing - clean up ghost session
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "baysawarr-auth",
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
