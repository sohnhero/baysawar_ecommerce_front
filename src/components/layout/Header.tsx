"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Search,
  Phone,
  ChevronDown,
  Heart,
  MapPin,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useThemeStore } from "@/store/theme-store";
import { useAuthStore } from "@/store/auth-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { LogOut, Package, ClipboardList, Box, ArrowRight } from "lucide-react";
import LogoutConfirmModal from "@/components/ui/LogoutConfirmModal";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const totalPrice = useCartStore((s) => s.items.reduce((sum, i) => sum + i.price * i.quantity, 0));
  const { isDark, toggle } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [accountOpen, setAccountOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const wishlistItems = useWishlistStore((s) => s.items);
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist);
  const { syncCart } = useCartStore();
  const [navCategories, setNavCategories] = useState<any[]>([]);
  const loginSyncRef = useRef<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated && user?.id) {
      // Only trigger onLogin if it hasn't run for this user session
      if (loginSyncRef.current !== user.id) {
        loginSyncRef.current = user.id;
        fetchWishlist();
        useCartStore.getState().onLogin();
      }
    } else if (!isAuthenticated) {
      // Reset ref on logout so it can trigger again on next login
      loginSyncRef.current = null;
    }

    // Fetch categories for the menu
    const fetchMenuCategories = async () => {
      try {
        const data = await api.get<any[]>("/categories");
        setNavCategories(data);
      } catch (error) {
        console.error("Failed to fetch menu categories:", error);
      }
    };
    fetchMenuCategories();
  }, [isAuthenticated, fetchWishlist, syncCart]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info("Veuillez vous connecter pour gérer votre liste de souhaits.", {
        icon: <Heart size={18} className="text-red-500" />,
        className: "rounded-2xl font-semibold text-sm",
      });
    } else {
      router.push("/wishlist");
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── TOP BAR ── */}
      <div className="bg-brand-blue text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="hidden sm:flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-white/70">
              <Phone size={11} /> +221 78 634 95 73
            </span>
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin size={11} /> Dakar, Sénégal
            </span>
          </div>
          <div className="mx-auto sm:mx-0">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white/90 font-medium"
            >
              Commandez, recevez et soyez fier de nos produits
            </motion.p>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggle}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={13} /> : <Moon size={13} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled
          ? "bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5"
          : "bg-background"
          } border-b border-border-color`}
      >
        {/* Middle Row: Logo + Search + Icons */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 -ml-2 rounded-xl hover:bg-surface transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 lg:gap-3 shrink-0 group">
              <div className="relative w-10 h-10 lg:w-14 lg:h-14 rounded-lg overflow-hidden transition-transform group-hover:scale-105">
                <Image
                  src="/logo_baysawarr.jpg"
                  alt="Baysawarr Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="block">
                <span className="font-heading font-black text-sm lg:text-2xl tracking-tight block leading-none">
                  Baysa<span className="text-brand-green">warr</span>
                </span>
                <span className="hidden sm:block text-[10px] text-muted tracking-[0.2em] uppercase font-medium leading-none text-foreground/60 mt-0.5">
                  Artisanat Premium
                </span>
              </div>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Rechercher des produits, artisans, catégories..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="w-full pl-11 pr-24 py-3 rounded-2xl bg-surface border border-border-color text-sm placeholder:text-muted focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/10 transition-all"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-brand-green hover:bg-brand-green-light text-white text-xs font-semibold rounded-xl transition-colors">
                  Chercher
                </button>
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Mobile search toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="lg:hidden p-2.5 rounded-xl hover:bg-surface transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <button
                onClick={handleWishlistClick}
                className="flex p-2 rounded-xl hover:bg-surface transition-colors relative"
              >
                <Heart size={20} className="sm:w-[22px] sm:h-[22px]" />
                {mounted && wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 sm:-top-0.5 sm:-right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Account / Auth */}
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <Link
                  href={isAuthenticated ? "/account" : "/login"}
                  className="flex items-center gap-2 p-2.5 rounded-xl hover:bg-surface transition-colors"
                >
                  <User size={20} />
                  <div className="hidden xl:block text-left">
                    <p className="text-[10px] text-muted leading-none">
                      {isAuthenticated ? `Bonjour ${user?.name.split(' ')[0]} 👋` : "Se connecter"}
                    </p>
                    <p className="text-xs font-semibold leading-tight">Mon Compte</p>
                  </div>
                </Link>

                <AnimatePresence>
                  {accountOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full pt-2 w-56 z-50"
                    >
                      <div className="bg-background rounded-2xl border border-border-color shadow-xl overflow-hidden p-2">
                        {!isAuthenticated ? (
                          <Link href="/login" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                            <User size={18} /> Se connecter
                          </Link>
                        ) : (
                          <>
                            <div className="px-4 py-3 border-b border-border-color mb-1">
                              <p className="text-[10px] font-black text-brand-green uppercase tracking-widest leading-none mb-1">Session active</p>
                              <p className="text-sm font-black truncate">{user?.name}</p>
                            </div>
                            <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                              <User size={18} className="text-muted" /> Profil
                            </Link>
                            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                              <Package size={18} className="text-muted" /> Mes commandes
                            </Link>
                            <button
                              onClick={handleWishlistClick}
                              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors text-left"
                            >
                              <Heart size={18} className="text-muted" /> Wishlist
                            </button>
                            {user?.role === 'admin' && (
                              <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-black text-brand-green transition-colors">
                                <ClipboardList size={18} /> Panel Admin
                              </Link>
                            )}
                            <button
                              onClick={() => setShowLogoutConfirm(true)}
                              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-500 text-sm font-semibold transition-colors mt-1"
                            >
                              <LogOut size={18} /> Déconnexion
                            </button>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-brand-green/5 hover:bg-brand-green/10 border border-brand-green/10 transition-colors relative group"
              >
                <div className="relative">
                  <ShoppingCart size={20} className="text-brand-green" />
                  {mounted && totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-brand-green text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-[10px] text-muted leading-none">Mon Panier</p>
                  <p className="text-xs font-bold text-brand-green leading-tight">
                    {mounted ? totalPrice.toLocaleString() : 0} FCFA
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ── NAVIGATION BAR (Desktop) ── */}
        <div className="hidden lg:block border-t border-border-color bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-0 h-12">
              {/* All Categories Button */}
              <div
                className="relative"
                onMouseEnter={() => setMegaMenuOpen(true)}
                onMouseLeave={() => setMegaMenuOpen(false)}
              >
                <button
                  className={`flex items-center gap-2 h-12 px-6 text-sm font-semibold transition-all -ml-4 rounded-none ${megaMenuOpen
                    ? "bg-brand-green-dark text-white"
                    : "bg-brand-green text-white hover:bg-brand-green-light"
                    }`}
                >
                  <Menu size={16} />
                  Toutes les Catégories
                  <ChevronDown size={14} className={`transition-transform duration-300 ${megaMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Mega Dropdown */}
                <AnimatePresence>
                  {megaMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-12 left-0 w-[850px] bg-background rounded-b-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-border-color border-t-0 z-50 overflow-hidden"
                    >
                      <div className="flex h-full min-h-[400px]">
                        {/* Main Grid */}
                        <div className="flex-1 p-8 grid grid-cols-3 gap-8 overflow-y-auto max-h-[600px] no-scrollbar">
                          {navCategories.map((cat) => (
                            <div key={cat.id} className="space-y-4">
                              <div className="flex items-center gap-3 group/title">
                                <span className="text-xl bg-surface p-2.5 rounded-2xl group-hover/title:bg-brand-green/10 transition-all group-hover/title:scale-110">
                                  {cat.icon || "📦"}
                                </span>
                                <Link
                                  href={`/shop?cat=${cat.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="font-heading font-black text-sm text-brand-blue hover:text-brand-green transition-colors uppercase tracking-tight"
                                >
                                  {cat.name}
                                </Link>
                              </div>
                              <ul className="space-y-2 pl-1">
                                {cat.products?.map((prod: any) => (
                                  <li key={prod.id}>
                                    <Link
                                      href={`/shop/${prod.id}`}
                                      onClick={() => setMegaMenuOpen(false)}
                                      className="text-[11px] text-muted hover:text-brand-green flex items-center gap-2 transition-all hover:translate-x-1 font-bold"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-border-color/40" />
                                      {prod.name}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link
                                    href={`/shop?cat=${cat.slug}`}
                                    onClick={() => setMegaMenuOpen(false)}
                                    className="text-[10px] font-black text-brand-green hover:underline mt-3 inline-flex items-center gap-1 uppercase tracking-widest"
                                  >
                                    Tout découvrir <ChevronDown size={10} className="-rotate-90" />
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Featured Sidebar / Top Category */}
                        <div className="w-72 bg-surface/50 p-8 flex flex-col border-l border-border-color">
                          <h4 className="font-heading font-black text-[10px] uppercase tracking-[0.2em] text-muted mb-6">
                            À la une
                          </h4>
                          {navCategories.length > 0 && (
                            <div className="space-y-6">
                              {navCategories.slice(0, 1).map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/shop?cat=${cat.slug}`}
                                  onClick={() => setMegaMenuOpen(false)}
                                  className="group/feat block"
                                >
                                  <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden mb-4 shadow-xl shadow-black/5 border border-white/50">
                                    {cat.image ? (
                                      <Image
                                        src={cat.image}
                                        alt={cat.name}
                                        fill
                                        className="object-cover group-hover/feat:scale-110 transition-transform duration-700"
                                      />
                                    ) : (
                                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                        <Box size={40} />
                                      </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/feat:opacity-100 transition-opacity duration-500" />
                                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-brand-blue text-[9px] font-black rounded-lg shadow-lg uppercase tracking-widest">
                                      Populaire
                                    </span>
                                  </div>
                                  <p className="font-heading font-black text-base text-brand-blue group-hover/feat:text-brand-green transition-colors leading-tight">
                                    Collection {cat.name}
                                  </p>
                                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest mt-1 group-hover/feat:text-foreground transition-colors">
                                    Savoir-faire local →
                                  </p>
                                </Link>
                              ))}
                            </div>
                          )}

                          <div className="mt-auto pt-8">
                            <div className="bg-brand-blue rounded-[20px] p-5 text-white shadow-lg shadow-brand-blue/20 relative overflow-hidden group/card">
                              <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover/card:scale-150 transition-transform duration-700" />
                              <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Privilège</p>
                              <p className="text-sm font-black tracking-tight mb-3">Profitez de nos produits locaux d'excellente qualité</p>
                              <div className="h-px bg-white/10 w-full mb-3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Nav Links */}
              <Link href="/" className="h-12 flex items-center px-4 text-sm font-medium text-foreground hover:text-brand-green transition-colors relative group">
                Accueil
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              <Link href="/shop" className="h-12 flex items-center px-4 text-sm font-medium text-muted hover:text-brand-green transition-colors relative group">
                Boutique
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>
              {navCategories.slice(0, 3).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?cat=${cat.slug}`}
                  className="h-12 flex items-center px-4 text-sm font-medium text-muted hover:text-brand-green transition-colors relative group uppercase tracking-widest text-[10px] font-black"
                >
                  {cat.name}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              {user?.role === 'admin' && (
                <Link href="/admin" className="h-12 flex items-center px-4 text-sm font-medium text-muted hover:text-brand-green transition-colors relative group">
                  Admin
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              )}

              {/* Right-side promo */}
              <div className="ml-auto flex items-center gap-4">
                <Link
                  href="/#flash-deals"
                  className="text-xs text-brand-green font-semibold flex items-center gap-1.5 hover:text-brand-green-light transition-colors animate-pulse"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  Offres Spéciales
                </Link>
                <Link href="/shop" className="text-[11px] font-bold uppercase tracking-wider text-muted hover:text-brand-blue transition-colors border-l border-border-color pl-4">
                  Nouveautés
                </Link>
              </div>
            </nav>
          </div>
        </div>

        {/* ── MOBILE SEARCH ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-border-color"
            >
              <form onSubmit={handleSearch} className="px-4 py-3">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    autoFocus
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border-color text-sm focus:outline-none focus:border-brand-green"
                  />
                  <button type="submit" className="hidden" />
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── MOBILE NAV ── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-border-color bg-background"
            >
              <nav className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
                <Link href="/" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-4 rounded-xl text-sm font-black hover:bg-surface transition-colors flex items-center gap-3 border border-transparent hover:border-border-color">
                  <span className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center text-base">🏠</span>
                  Accueil
                </Link>
                <Link href="/shop" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-4 rounded-xl text-sm font-black hover:bg-surface transition-colors flex items-center gap-3 border border-transparent hover:border-border-color">
                  <span className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center text-base">🛍️</span>
                  Boutique
                </Link>
                <Link href="/wishlist" onClick={(e) => { handleWishlistClick(e as any); setMobileOpen(false); }}
                  className="block px-4 py-4 rounded-xl text-sm font-black hover:bg-surface transition-colors flex items-center gap-3 border border-transparent hover:border-border-color">
                  <span className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-base">❤️</span>
                  Ma Liste de Souhaits
                </Link>


                <div className="px-5 py-4 text-[10px] font-black text-muted uppercase tracking-[0.2em] mt-2">
                  Mon Espace
                </div>
                {!isAuthenticated ? (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="mx-4 flex items-center justify-between p-4 rounded-2xl bg-brand-green text-white shadow-lg shadow-brand-green/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 leading-none mb-1">Bienvenue</p>
                        <p className="text-sm font-black uppercase tracking-tight">Se connecter</p>
                      </div>
                    </div>
                    <ArrowRight size={18} />
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    onClick={() => setMobileOpen(false)}
                    className="mx-4 flex items-center justify-between p-4 rounded-2xl bg-surface border border-border-color"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted leading-none mb-1">Mon Compte</p>
                        <p className="text-sm font-black uppercase tracking-tight truncate max-w-[150px]">{user?.name.split(' ')[0]}</p>
                      </div>
                    </div>
                    <ChevronDown size={18} className="-rotate-90 text-muted" />
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link href="/admin" onClick={() => setMobileOpen(false)}
                    className="block px-4 py-4 mx-4 mt-2 rounded-2xl text-sm font-black text-brand-green bg-brand-green/5 border border-brand-green/10 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-brand-green/10 text-brand-green flex items-center justify-center text-base">⚙️</span>
                    Panel Administration
                  </Link>
                )}

                <button
                  onClick={() => { toggle(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "Mode clair" : "Mode sombre"}
                </button>

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      setMobileOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full text-left px-4 py-4 mt-4 rounded-2xl text-sm font-black text-rose-500 bg-rose-50 border border-rose-100 flex items-center gap-3"
                  >
                    <span className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center text-base">
                      <LogOut size={18} />
                    </span>
                    Déconnexion
                  </button>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={() => {
          logout();
          setShowLogoutConfirm(false);
          router.push("/login");
          toast.success("Vous avez été déconnecté");
        }}
      />
    </>
  );
}
