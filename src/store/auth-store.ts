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
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("baysawarr-token", token);
        }
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        // Clear local UI state first so the changes are immediate
        useCartStore.setState({ items: [] });
        useWishlistStore.setState({ items: [] });
        
        if (typeof window !== "undefined") {
          localStorage.removeItem("baysawarr-token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
      refreshAuth: async () => {
        try {
          // Use a dynamic import for api to avoid circular dependencies if any
          const { api } = await import("@/lib/api");
          const data = await api.get<{ user: User; token: string }>("/auth/me");
          if (data.user && data.token) {
            if (typeof window !== "undefined") {
              localStorage.setItem("baysawarr-token", data.token);
            }
            set({ user: data.user, token: data.token, isAuthenticated: true });
          }
        } catch (error) {
          console.error("Auth refresh failed:", error);
        }
      },
    }),
    {
      name: "baysawarr-auth",
    }
  )
);
