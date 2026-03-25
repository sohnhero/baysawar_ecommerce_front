"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Percent,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles,
  Shield,
  HeartHandshake,
  ShoppingCart,
  Percent as PercentIcon
} from "lucide-react";
import { products as initialProducts } from "@/data/products";
import { categories as initialCategories } from "@/data/categories";
import { artisans as initialArtisans } from "@/data/artisans";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import ArtisanCard from "@/components/ui/ArtisanCard";
import { useCartStore } from "@/store/cart-store";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const features = [
  { icon: Sparkles, title: "100% Fait Main", desc: "Artisanat authentique" },
  { icon: Truck, title: "Livraison Rapide", desc: "Dakar 24h · Monde 5-7j" },
  { icon: Shield, title: "Paiement Sécurisé", desc: "Wave · OM · Carte" },
  { icon: HeartHandshake, title: "Commerce Équitable", desc: "Artisans rémunérés justement" },
];

// Dynamic Hero Slide Generation moved inside component
export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbArtisans, setDbArtisans] = useState<any[]>([]);
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);

  // Dynamic Data Helper
  const activeCampaign = flashSales as any;
  const products = dbProducts;

  const heroSlides = useMemo(() => {
    const baseSlides = [
      {
        tag: "Collection 2026",
        title: "Artisanat Premium",
        titleAccent: "du Sénégal",
        desc: "L'excellence du savoir-faire traditionnel, sélectionné pour votre intérieur moderne.",
        cta: "Découvrir l'Atelier",
        ctaLink: "/shop",
        image: "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        color: "from-brand-blue/95",
      }
    ];

    // Add Active Campaign Slide
    if (activeCampaign) {
      baseSlides.push({
        tag: "🔥 EN DIRECT",
        title: activeCampaign.title,
        titleAccent: "Offres Limitées",
        desc: activeCampaign.description || "Profitez de réductions exclusives sur les pépites de notre terroir.",
        cta: "Voir les Offres",
        ctaLink: "/#flash-deals",
        image: activeCampaign.image || "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        color: "from-[#1a1a2e]/95",
      });
    }

    // Add Top Featured Product Slide
    const topFeatured = products.find(p => p.featured && !activeCampaign?.items?.some((i: any) => i.productId === p.id));
    if (topFeatured) {
      baseSlides.push({
        tag: topFeatured.badge || "Coup de Coeur",
        title: topFeatured.name,
        titleAccent: `${topFeatured.price.toLocaleString()} FCFA`,
        desc: topFeatured.description,
        cta: "Commander l'Article",
        ctaLink: `/shop/${topFeatured.id}`,
        image: topFeatured.image,
        color: "from-[#2a1810]/95",
      });
    }

    return baseSlides;
  }, [products, activeCampaign]);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [p, c, a, fetchedCampaign] = await Promise.all([
          api.get<any[]>("/products"),
          api.get<any[]>("/categories"),
          api.get<any[]>("/artisans"),
          api.get<any>("/flash-sales/active"),
        ]);

        // Apply flash sale prices to products if they belong to the active campaign
        const productsWithFlash = p.map(prod => {
          const flashItem = fetchedCampaign?.items?.find((item: any) => item.productId === prod.id);
          if (flashItem) {
            return {
              ...prod,
              originalPrice: parseFloat(prod.price),
              price: parseFloat(flashItem.flashPrice),
              badge: `-${flashItem.discountPercent}%`,
              isFlash: true
            };
          }
          return prod;
        });

        setDbProducts(productsWithFlash);
        setDbCategories(c || []); // Ensure c is an array
        setDbArtisans(a || []); // Ensure a is an array
        setFlashSales(fetchedCampaign || null); // Store the campaign object in flashSales state, ensure it's not undefined
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = dbCategories;
  const artisans = dbArtisans;

  const popularProducts = products.slice(0, 8);
  const featuredProducts = activeCampaign?.items
    ?.filter((item: any) => item.product)
    ?.map((item: any) => ({
      ...item.product,
      price: parseFloat(item.flashPrice),
      originalPrice: parseFloat(item.product.price),
      badge: `-${item.discountPercent}%`,
      isLive: true,
    })) || [];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <>
      {/* ─── HERO SECTION — E-COMMERCE STYLE ─── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Slider */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2/1] group shadow-2xl border border-white/5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroSlides[currentSlide]?.image || ""}
                    alt={heroSlides[currentSlide]?.title || ""}
                    fill
                    className="object-cover transition-transform duration-[8000ms] group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide]?.color || 'from-black/60'} via-transparent to-transparent`} />
                </motion.div>
              </AnimatePresence>

              {/* Slide Content */}
              <div className="relative z-10 flex items-center h-full p-6 sm:p-10 lg:p-14">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    className="max-w-xl"
                  >
                    <motion.span 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="inline-block px-4 py-1.5 bg-brand-green/20 backdrop-blur-md border border-brand-green/30 text-brand-green-light text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-4"
                    >
                      {heroSlides[currentSlide]?.tag}
                    </motion.span>
                    
                    <motion.h1 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-heading font-black text-[22px] xs:text-2xl sm:text-4xl lg:text-6xl text-white leading-[1.15] mb-4 drop-shadow-xl"
                    >
                      {heroSlides[currentSlide]?.title}
                      <br />
                      <span className="text-brand-green-light italic font-serif opacity-90">
                        {heroSlides[currentSlide]?.titleAccent}
                      </span>
                    </motion.h1>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-white/80 text-xs sm:text-sm lg:text-lg mb-8 line-clamp-3 sm:line-clamp-none max-w-md font-medium leading-relaxed"
                    >
                      {heroSlides[currentSlide]?.desc}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Link
                        href={heroSlides[currentSlide]?.ctaLink || "/shop"}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-2xl transition-all shadow-2xl shadow-brand-green/40 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
                      >
                        {heroSlides[currentSlide]?.cta}
                        <ArrowRight size={18} className="animate-bounce-x" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows - Glassmorphism */}
              <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/5 backdrop-blur-xl border border-white/10 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowRight size={20} />
              </button>

              {/* Progress Line */}
              <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
                <motion.div 
                  key={currentSlide}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 8, ease: "linear" }}
                  className="h-full bg-brand-green"
                />
              </div>

              {/* Dots - Modern Style */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      i === currentSlide
                        ? "w-10 bg-brand-green shadow-[0_0_15px_rgba(46,204,113,0.5)]"
                        : "w-2 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Side Promo Banners */}
            <div className="hidden lg:flex flex-col gap-4">
              {products.filter(p => p.featured).slice(-2).map((p, idx) => (
                <Link key={p.id} href={`/shop/${p.id}`} className="relative flex-1 rounded-2xl overflow-hidden group shadow-lg border border-white/5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    sizes="25vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${idx === 0 ? 'from-black/90' : 'from-brand-blue/90'} to-transparent`} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className={`inline-block px-2.5 py-1 ${idx === 0 ? 'bg-red-500' : 'bg-brand-green'} text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-2`}>
                      {p.badge || (idx === 0 ? 'Tendance' : 'Nouveau')}
                    </span>
                    <p className="text-white font-heading font-black text-sm leading-tight mb-1 group-hover:text-brand-green-light transition-colors">
                      {p.name}
                    </p>
                    <p className="text-brand-green-light text-xs font-black uppercase tracking-tighter">
                      {p.price.toLocaleString()} FCFA
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES BAR ─── */}
      <section className="py-6 border-y border-border-color bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2.5 rounded-xl bg-brand-green/10 text-brand-green shrink-0">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="font-heading font-bold text-xs lg:text-sm">{f.title}</p>
                  <p className="text-[10px] lg:text-xs text-muted">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FLASH DEALS / FEATURED PRODUCTS ─── */}
      {featuredProducts.length > 0 && (
        <section id="flash-deals" className="py-10 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="flex flex-col gap-1 mb-8">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                  <Percent size={16} />
                  <span className="font-heading font-black text-sm uppercase tracking-widest">{activeCampaign?.title || "Offre Spéciale"}</span>
                </div>
                {activeCampaign?.active && (
                   <div className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-green/10 text-brand-green rounded-lg text-[10px] font-black uppercase tracking-tight border border-brand-green/20">
                      <Clock size={12} className="animate-pulse" /> Live Now
                   </div>
                )}
              </div>
              <p className="text-xs text-muted font-medium mt-2 max-w-2xl">{activeCampaign?.description || "Découvrez nos meilleures offres artisanales pour une durée limitée."}</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featuredProducts.map((p: any) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`group bg-surface rounded-2xl border border-border-color overflow-hidden hover:border-brand-green/30 hover:shadow-xl transition-all ${!p.isLive ? 'opacity-90' : ''}`}
                >
                  <Link href={`/shop/${p.id}`} className="flex gap-4 p-4 h-full">
                    <div className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-white">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 112px, 112px"
                      />
                      {p.isLive ? (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-md">
                          {p.badge}
                        </span>
                      ) : (
                        <span className="absolute inset-0 bg-brand-blue/60 flex items-center justify-center text-[10px] text-white font-black uppercase tracking-widest text-center px-2">
                           Bientôt dispo
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-brand-green font-semibold uppercase tracking-wide">
                          {p.category && typeof p.category === 'object' ? (p.category as any).name : p.category}
                        </span>
                        <h3 className="font-heading font-semibold text-sm leading-tight mt-0.5 line-clamp-2 group-hover:text-brand-green transition-colors">
                          {p.name}
                        </h3>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={
                                i < Math.round(p.rating || 5)
                                  ? "fill-brand-gold text-brand-gold"
                                  : "text-border-color"
                                }
                            />
                          ))}
                          <span className="text-[10px] text-muted ml-0.5">({p.reviewCount || 0})</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-end justify-between gap-2 mt-2">
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-1">
                            <span className="font-heading font-bold text-base text-brand-green">
                              {p.price.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-muted font-bold">FCFA</span>
                          </div>
                          {p.originalPrice && (
                            <span className="text-[10px] text-muted line-through">
                              {p.originalPrice.toLocaleString()} FCFA
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            addItem({
                              productId: p.id,
                              name: p.name,
                              price: p.price,
                              image: p.image,
                            });
                          }}
                          className="p-2 bg-brand-green hover:bg-brand-green-light text-white rounded-lg transition-colors relative z-10"
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CATEGORIES ─── */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-green font-semibold text-xs uppercase tracking-widest mb-1">
                Explorer
              </p>
              <h2 className="font-heading font-bold text-2xl md:text-3xl">
                Nos Catégories
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green-light transition-colors"
            >
              Tout voir <ChevronRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR PRODUCTS ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex items-end justify-between mb-8">
            <div>
              <p className="text-brand-green font-semibold text-xs uppercase tracking-widest mb-1">
                Tendances
              </p>
              <h2 className="font-heading font-bold text-2xl md:text-3xl">
                Produits Populaires
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-green hover:text-brand-green-light transition-colors"
            >
              Tout voir <ChevronRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {popularProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-brand-green"
            >
              Voir tous les produits <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PROMO BANNER ─── */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden aspect-[2/1] group"
            >
              <Image
                src="https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
                alt="Promo alimentaire"
                fill
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <span className="text-brand-green text-xs font-bold uppercase tracking-wider mb-2">
                  Collection Alimentaire
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                  Saveurs du<br />Sénégal
                </h3>
                <Link
                  href="/shop?cat=alimentaire"
                  className="inline-flex items-center gap-1 text-white text-sm font-semibold hover:text-brand-green transition-colors w-fit"
                >
                  Explorer <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl overflow-hidden aspect-[2/1] group"
            >
              <Image
                src="https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"
                alt="Promo traditionnel"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/90 to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-center p-8">
                <span className="text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
                  Art Traditionnel
                </span>
                <h3 className="font-heading font-bold text-2xl text-white mb-3">
                  Instruments<br />& Décoration
                </h3>
                <Link
                  href="/shop?cat=traditionnel"
                  className="inline-flex items-center gap-1 text-white text-sm font-semibold hover:text-brand-gold transition-colors w-fit"
                >
                  Explorer <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── ARTISANS ─── */}
      <section id="artisans" className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-brand-green font-semibold text-xs uppercase tracking-widest mb-1">
              Les Créateurs
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
              Artisans en Vedette
            </h2>
            <p className="text-muted max-w-xl mx-auto text-sm">
              Rencontrez les talents qui donnent vie à nos produits. Chaque artisan
              apporte son savoir-faire unique et son héritage culturel.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {artisans.map((a) => (
              <ArtisanCard key={a.id} artisan={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-blue p-10 md:p-14 text-center"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-brand-gold/10 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <h2 className="font-heading font-bold text-2xl md:text-4xl text-white mb-3">
                Prêt à découvrir le{" "}
                <span className="text-brand-green">Sénégal</span> ?
              </h2>
              <p className="text-white/60 max-w-lg mx-auto mb-6 text-sm lg:text-base">
                Rejoignez notre communauté et soutenez l&apos;artisanat
                sénégalais authentique. Chaque achat fait la différence.
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50"
              >
                Découvrir nos produits
                <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
