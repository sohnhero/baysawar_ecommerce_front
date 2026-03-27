"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Search,
  User,
  ChevronRight,
  ArrowLeft,
  Store
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import LogoutConfirmModal from "@/components/ui/LogoutConfirmModal";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard/seller", color: "text-brand-green" },
  { icon: Package, label: "Mes Produits", href: "/dashboard/seller/products", color: "text-amber-500" },
  { icon: ShoppingCart, label: "Mes Commandes", href: "/dashboard/seller/orders", color: "text-brand-blue" },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user, isAuthenticated } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [artisan, setArtisan] = useState<any>(null);
  const [loadingArtisan, setLoadingArtisan] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      if (!mounted) return;

      if (!isAuthenticated || user?.role !== 'vendeur') {
        // Double check with artisan status if role not yet updated in store but user is logged in
        try {
          const profile = await api.get<any>("/artisans/me");
          if (profile.status === 'approved') {
            setArtisan(profile);
            setLoadingArtisan(false);
            return;
          }
        } catch (e) {
          // Fall through
        }
        router.push("/account");
        toast.error("Accès réservé aux vendeurs approuvés");
      } else {
        // Already vendeur role
        try {
           const profile = await api.get<any>("/artisans/me");
           setArtisan(profile);
        } catch(e) {}
        setLoadingArtisan(false);
      }
    };

    checkAccess();
  }, [mounted, isAuthenticated, user, router]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted || loadingArtisan) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans border-t-4 border-brand-green">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium uppercase text-[10px] tracking-widest">Initialisation de votre espace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-brand-blue/10">
      {/* Premium Dark Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-72 bg-[#0f172a] text-slate-400 border-r border-white/5 relative overflow-hidden h-screen sticky top-0">
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-110">
              <Image 
                src="/logo_baysawarr.jpg" 
                alt="Baysawarr Logo" 
                fill 
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-lg tracking-tighter text-white leading-none">
                Baysa<span className="text-brand-green">warr</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mt-1">Espace Vendeur</span>
            </div>
          </Link>
          
          <Link 
            href="/account" 
            className="mt-8 flex items-center justify-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Mon compte client
          </Link>
        </div>

        <nav className="relative z-10 flex-1 px-4 py-2 space-y-2 overflow-y-auto no-scrollbar">
          <p className="px-4 mb-4 text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">Ma Boutique</p>
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-[20px] text-xs font-black transition-all group ${
                  active
                    ? "bg-white/10 text-white shadow-2xl shadow-black/20"
                    : "hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${active ? "bg-emerald-500 text-white" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                    <item.icon size={16} />
                  </div>
                  {item.label}
                </div>
                {active && (
                  <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 p-6 mt-auto">
          <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[24px] border border-white/5 mb-6">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 relative">
                    <span className="text-white font-black uppercase text-base">{artisan?.name?.[0] || user?.name?.[0] || "V"}</span>
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <Store size={8} className="text-white" />
                    </div>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-white truncate uppercase tracking-tight">{artisan?.name || user?.name || "Vendeur"}</p>
                  <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Vendeur Actif</p>
                </div>
             </div>
             <button
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-rose-500/20"
            >
              <LogOut size={14} />
              Déconnexion
             </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scroll-smooth">
        <header className={`sticky top-0 z-[100] transition-all duration-300 px-4 lg:px-12 ${
            scrolled 
            ? "bg-white border-b border-slate-200 py-3 lg:py-4 shadow-sm" 
            : "bg-slate-50 border-b border-transparent py-4 lg:py-6"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-4 rounded-2xl bg-white shadow-xl shadow-slate-900/5 text-slate-900"
              >
                <Menu size={24} />
              </button>

              <div className="hidden lg:flex items-center flex-1 max-w-2xl relative group">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher mes produits, commandes..."
                  className="w-full pl-16 pr-8 py-4 bg-white/50 border border-slate-200 rounded-[24px] text-sm font-medium focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-black text-[10px] lg:text-xs">
                    {(artisan?.name || user?.name || "V")?.[0]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-6 lg:px-12 pb-20 pt-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-[200] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="absolute top-0 left-0 bottom-0 w-80 bg-[#0f172a] shadow-[40px_0_80px_rgba(0,0,0,0.5)] flex flex-col pt-12"
            >
              <div className="px-10 mb-12 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden">
                    <Image src="/logo_baysawarr.jpg" alt="Logo" fill className="object-contain" />
                  </div>
                  <span className="font-heading font-black text-2xl tracking-tighter text-white">
                    Baysa<span className="text-brand-green">warr</span>
                  </span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 rounded-xl bg-white/5 text-slate-400 border border-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 mb-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-black">
                     {(artisan?.name || user?.name || "V")?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{artisan?.name || user?.name || "Vendeur"}</p>
                    <p className="text-[10px] text-emerald-500 font-bold">Espace Vendeur</p>
                  </div>
                </div>
              </div>

              <nav className="flex-1 px-4 space-y-2">
                {menuItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${
                        active
                          ? "bg-emerald-500 text-white shadow-xl shadow-emerald-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-8">
                <button
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout();
          setShowLogoutConfirm(false);
          router.push("/login");
          toast.success("Déconnexion réussie");
        }}
      />
    </div>
  );
}
