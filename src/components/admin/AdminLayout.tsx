"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin", color: "text-brand-green" },
  { icon: Package, label: "Produits", href: "/admin/products", color: "text-amber-500" },
  { icon: ShoppingCart, label: "Commandes", href: "/admin/orders", color: "text-brand-blue" },
  { icon: TrendingUp, label: "Ventes Flash", href: "/admin/flash-sales", color: "text-rose-500" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { logout, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans selection:bg-brand-blue/10">
      {/* Premium Dark Sidebar (Desktop) */}
      <aside className="hidden lg:flex flex-col w-80 bg-[#0f172a] text-slate-400 border-r border-white/5 relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-brand-blue/20 to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 rounded-[20px] bg-gradient-to-br from-brand-blue to-brand-blue-dark flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-brand-blue/30 group-hover:scale-110 transition-transform duration-500">
              B
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-black text-xl tracking-tighter text-white leading-none">
                Baysa<span className="text-brand-green">warr</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mt-1">Admin Panel</span>
            </div>
          </Link>
          
          {/* Back to Site Bridge */}
          <Link 
            href="/" 
            className="mt-10 flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white rounded-xl border border-white/5 transition-all group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Retour à la boutique
          </Link>
        </div>

        <nav className="relative z-10 flex-1 px-6 py-6 space-y-3">
          <p className="px-6 mb-6 text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">Menu Principal</p>
          {menuItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-6 py-4 rounded-[24px] text-sm font-black transition-all group ${
                  active
                    ? "bg-white/10 text-white shadow-2xl shadow-black/20"
                    : "hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${active ? "bg-brand-blue text-white" : "bg-slate-800 group-hover:bg-slate-700"}`}>
                    <item.icon size={18} />
                  </div>
                  {item.label}
                </div>
                {active && (
                  <motion.div layoutId="active" className="w-1.5 h-1.5 rounded-full bg-brand-green shadow-[0_0_12px_rgba(11,159,11,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="relative z-10 p-8">
          <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-[32px] border border-white/5 mb-8">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 relative">
                    {/* User profile image or initial */}
                    <span className="text-white font-black uppercase text-lg">{user?.name[0] || "A"}</span>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-brand-green rounded-full border-2 border-slate-900 flex items-center justify-center">
                        <ShieldCheck size={10} className="text-white" />
                    </div>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-white truncate uppercase tracking-tight">{user?.name || "Administrateur"}</p>
                  <p className="text-[10px] text-brand-green font-black uppercase tracking-widest mt-0.5 animate-pulse">En ligne</p>
                </div>
             </div>
             <button
              onClick={() => logout()}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5 hover:border-rose-500/20"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-slate-600">
             <Settings size={18} className="hover:text-white transition-colors cursor-pointer" />
             <Zap size={18} className="hover:text-amber-400 transition-colors cursor-pointer" />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto no-scrollbar">
        {/* Glassy Header */}
        <header className={`sticky top-0 z-[100] transition-all duration-500 px-6 lg:px-12 py-4 ${
            scrolled ? "bg-white/80 backdrop-blur-2xl shadow-xl shadow-slate-900/5 py-4" : "bg-transparent py-8"
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
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="text"
                  placeholder="Recherche système, commandes, membres..."
                  className="w-full pl-16 pr-8 py-4 bg-white/50 border border-slate-200 rounded-[24px] text-sm font-medium focus:outline-none focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dernière Connexion</span>
                <span className="text-[10px] font-black text-slate-900">Aujourd&apos;hui, 08:34</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="p-4 rounded-2xl bg-white shadow-xl shadow-slate-900/5 text-slate-400 hover:text-brand-blue hover:scale-110 active:scale-95 transition-all relative group">
                  <Bell size={20} />
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-[3px] border-white ring-2 ring-rose-500/20" />
                </button>
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-900/5 p-1">
                  <div className="w-full h-full rounded-xl bg-gradient-to-br from-brand-blue to-teal-500 flex items-center justify-center text-white font-black text-xs">
                    {user?.name[0] || "A"}
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

      {/* Premium Mobile Sidebar Overlay */}
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
                <span className="font-heading font-black text-2xl tracking-tighter text-white">
                  Baysa<span className="text-brand-green">warr</span>
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-3 rounded-xl bg-white/5 text-slate-400 border border-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 mb-10">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center text-white font-black">
                     {user?.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black text-white uppercase">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 font-bold">Admin Mobile</p>
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
                          ? "bg-white text-brand-blue shadow-xl shadow-brand-blue/20"
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
                  onClick={() => logout()}
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
    </div>
  );
}
