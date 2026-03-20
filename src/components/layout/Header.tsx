"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { LogOut, Package, ClipboardList } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems());
  const { isDark, toggle } = useThemeStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchValue.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
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
              <Phone size={11} /> +221 33 800 00 00
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
              🚚 Livraison gratuite à partir de 25 000 FCFA
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
            <span className="text-white/30">|</span>
            <Link href="/account" className="text-white/70 hover:text-white transition-colors">
              Mon Compte
            </Link>
          </div>
        </div>
      </div>

      {/* ── MAIN HEADER ── */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
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
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-br from-brand-green via-brand-green to-brand-green-dark flex items-center justify-center text-white font-heading font-black text-lg lg:text-xl shadow-lg shadow-brand-green/20 group-hover:shadow-brand-green/40 transition-shadow">
                B
              </div>
              <div className="hidden sm:block">
                <span className="font-heading font-black text-xl lg:text-2xl tracking-tight block leading-none">
                  Baysa<span className="text-brand-green">warr</span>
                </span>
                <span className="text-[10px] text-muted tracking-[0.2em] uppercase font-medium leading-none text-foreground/60">
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

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden sm:flex p-2.5 rounded-xl hover:bg-surface transition-colors relative"
              >
                <Heart size={20} />
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </Link>

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
                              <p className="text-xs font-bold text-muted uppercase tracking-widest leading-none mb-1">Session active</p>
                              <p className="text-sm font-black truncate">{user?.email}</p>
                            </div>
                            <Link href="/account" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                              <User size={18} className="text-muted" /> Profil
                            </Link>
                            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                              <Package size={18} className="text-muted" /> Mes commandes
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-semibold transition-colors">
                              <Heart size={18} className="text-muted" /> Wishlist
                            </Link>
                            {user?.role === 'admin' && (
                              <Link href="/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-black text-brand-green transition-colors">
                                <ClipboardList size={18} /> Panel Admin
                              </Link>
                            )}
                            <button 
                              onClick={() => logout()}
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
                  {totalItems > 0 && (
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
                    {useCartStore.getState().totalPrice().toLocaleString()} FCFA
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
                  className={`flex items-center gap-2 h-12 px-6 text-sm font-semibold transition-all -ml-4 rounded-none ${
                    megaMenuOpen 
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
                      className="absolute top-12 left-0 w-[800px] bg-background rounded-b-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-border-color border-t-0 z-50 overflow-hidden"
                    >
                      <div className="flex h-full">
                        {/* Main Grid */}
                        <div className="flex-1 p-8 grid grid-cols-3 gap-8">
                          {categories.map((cat) => (
                            <div key={cat.id} className="space-y-4">
                              <div className="flex items-center gap-2 group/title">
                                <span className="text-xl bg-surface p-2 rounded-xl group-hover/title:bg-brand-green/10 transition-colors">
                                  {cat.icon}
                                </span>
                                <Link
                                  href={`/shop?cat=${cat.slug}`}
                                  className="font-heading font-bold text-base text-brand-blue hover:text-brand-green transition-colors"
                                >
                                  {cat.name}
                                </Link>
                              </div>
                              <ul className="space-y-2.5 pl-1">
                                {cat.subCategories.map((sub) => (
                                  <li key={sub.name}>
                                    <Link
                                      href={sub.href}
                                      className="text-[13px] text-muted hover:text-brand-green flex items-center gap-2 transition-all hover:translate-x-1"
                                    >
                                      <span className="w-1 h-1 rounded-full bg-border-color" />
                                      {sub.name}
                                    </Link>
                                  </li>
                                ))}
                                <li>
                                  <Link
                                    href={`/shop?cat=${cat.slug}`}
                                    className="text-[12px] font-bold text-brand-green hover:underline mt-2 inline-block"
                                  >
                                    Découvrir tout
                                  </Link>
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>

                        {/* Featured Sidebar */}
                        <div className="w-64 bg-surface p-6 flex flex-col pt-8">
                          <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-muted mb-4 px-1">
                            En Vedette
                          </h4>
                          <div className="space-y-6">
                            {categories.filter(c => c.featured).slice(0, 1).map(cat => (
                              <Link 
                                key={cat.id} 
                                href={cat.featured?.link || "#"}
                                className="group/feat block"
                              >
                                <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
                                  <Image 
                                    src={cat.featured?.image || ""} 
                                    alt={cat.featured?.title || ""} 
                                    fill 
                                    className="object-cover group-hover/feat:scale-110 transition-transform duration-500"
                                  />
                                  {cat.featured?.badge && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-brand-green text-white text-[10px] font-bold rounded-lg shadow-lg">
                                      {cat.featured.badge}
                                    </span>
                                  )}
                                </div>
                                <p className="font-heading font-bold text-sm text-brand-blue group-hover/feat:text-brand-green transition-colors px-1">
                                  {cat.featured?.title}
                                </p>
                                <p className="text-[11px] text-muted px-1 mt-0.5 group-hover/feat:text-foreground transition-colors">
                                  Qualité artisanale certifiée →
                                </p>
                              </Link>
                            ))}
                          </div>
                          
                          <div className="mt-auto pt-6 border-t border-border-color">
                            <div className="bg-brand-blue text-white p-4 rounded-2xl flex flex-col gap-1 items-center text-center">
                              <p className="text-[10px] font-bold uppercase tracking-wider opacity-60">Offre Limitée</p>
                              <p className="text-sm font-heading font-bold">-20% sur tout</p>
                              <Link href="/shop" className="text-[9px] font-bold underline hover:text-brand-green-light mt-1">CODE: BAYS2026</Link>
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
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?cat=${cat.slug}`}
                  className="h-12 flex items-center px-4 text-sm font-medium text-muted hover:text-brand-green transition-colors relative group"
                >
                  {cat.name}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
              <Link href="/admin" className="h-12 flex items-center px-4 text-sm font-medium text-muted hover:text-brand-green transition-colors relative group">
                Admin
                <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-brand-green scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Link>

              {/* Right-side promo */}
              <div className="ml-auto flex items-center gap-4">
                <span className="text-xs text-brand-green font-semibold flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                  Offres Spéciales
                </span>
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
                  className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface transition-colors">
                  🏠 Accueil
                </Link>
                <Link href="/shop" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-semibold hover:bg-surface transition-colors">
                  🛍️ Boutique
                </Link>

                <div className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider mt-2">
                  Catégories
                </div>
                {categories.map((cat) => (
                  <div key={cat.id} className="pb-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-surface transition-colors text-brand-blue"
                      onClick={(e) => {
                        const nextEl = (e.currentTarget.nextElementSibling as HTMLElement);
                        nextEl.style.display = nextEl.style.display === 'none' ? 'block' : 'none';
                      }}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span> {cat.name}
                      </span>
                      <ChevronDown size={14} />
                    </button>
                    <div className="pl-10 space-y-0.5 hidden">
                      {cat.subCategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-1.5 text-[13px] text-muted hover:text-brand-green transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="border-t border-border-color my-4" />

                <Link href="/cart" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors">
                  🛒 Panier {totalItems > 0 && `(${totalItems})`}
                </Link>
                <Link href="/account" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors">
                  👤 Mon Compte
                </Link>
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors">
                  ⚙️ Admin
                </Link>

                <button
                  onClick={() => { toggle(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium hover:bg-surface transition-colors flex items-center gap-2"
                >
                  {isDark ? <Sun size={16} /> : <Moon size={16} />}
                  {isDark ? "Mode clair" : "Mode sombre"}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
