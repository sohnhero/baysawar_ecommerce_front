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
import SkeletonCard from "@/components/ui/SkeletonCard";
import { HeroSkeleton, CategorySkeleton, ArtisanSkeleton, ProductGridSkeleton } from "@/components/ui/HomeSkeletons";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const CountdownTimer = ({ expiryDate, light = false }: { expiryDate: string, light?: boolean }) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(expiryDate) - +new Date();
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return null;
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());
    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return null;

  const colorClass = light ? "bg-white/10 text-white border-white/20" : "bg-brand-blue/5 text-brand-blue border-brand-blue/10";
  const labelClass = light ? "text-white/40" : "text-brand-blue/40";
  const separatorClass = light ? "text-white/20" : "text-brand-blue/20";

  return (
    <div className="flex gap-1.5 sm:gap-3 items-center">
      {[
        { label: "J", value: timeLeft.days },
        { label: "H", value: timeLeft.hours },
        { label: "M", value: timeLeft.minutes },
        { label: "S", value: timeLeft.seconds },
      ].map((unit, i) => (
        <div key={unit.label} className="flex items-center gap-1.5">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClass} backdrop-blur-md rounded-xl flex items-center justify-center border shadow-sm transition-all`}>
              <span className="font-heading font-black text-lg sm:text-xl">
                {unit.value.toString().padStart(2, "0")}
              </span>
            </div>
            <span className={`text-[8px] sm:text-[9px] uppercase font-black tracking-widest mt-1 ${labelClass}`}>{unit.label}</span>
          </div>
          {i < 3 && <span className={`font-black text-lg mb-4 opacity-50 ${separatorClass}`}>:</span>}
        </div>
      ))}
    </div>
  );
};

const features = [
  { icon: Sparkles, title: "100% Fait Main", desc: "Artisanat authentique" },
  { icon: Truck, title: "Livraison Rapide", desc: "Dakar 24h · Monde 5-7j" },
  { icon: Shield, title: "Paiement Sécurisé", desc: "Wave · OM · Carte" },
  { icon: HeartHandshake, title: "Commerce Équitable", desc: "Vendeurs rémunérés justement" },
];

// Dynamic Hero Slide Generation moved inside component
export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [dbArtisans, setDbArtisans] = useState<any[]>([]);
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [dbHighlights, setDbHighlights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();

  // Dynamic Data Helper
  const activeCampaign = flashSales as any;
  const products = dbProducts;

  const heroSlides = useMemo(() => {
    const baseSlides: any[] = [];

    // Add Active Campaign Slide
    if (activeCampaign) {
      const firstProductImage = activeCampaign.items?.[0]?.product?.image;

      baseSlides.push({
        tag: "EN DIRECT",
        title: activeCampaign.title,
        titleAccent: "Offres Limitées",
        desc: activeCampaign.description || "Profitez de réductions exclusives sur les pépites de notre boutique.",
        cta: "Voir les Offres",
        ctaLink: "/#flash-deals",
        image: activeCampaign.image || firstProductImage || "https://res.cloudinary.com/drxouwbms/image/upload/v1775574363/8c6463a1f3a8d2797bea0b449a685baf_hpk0nq.jpg",
        color: "from-[#1a1a2e]/95",
      });
    }

    // Add Most Ordered Slide
    if (dbHighlights?.mostOrdered) {
      const topProd = dbHighlights.mostOrdered;
      baseSlides.push({
        tag: topProd.badge || "Le Plus Commandé",
        title: topProd.name,
        titleAccent: `${parseFloat(topProd.price).toLocaleString()} FCFA`,
        desc: topProd.description,
        cta: "Commander l'Article",
        ctaLink: `/shop/${topProd.id}`,
        image: topProd.image,
        color: "from-[#2e7d32]/95",
      });
    }

    // Add Most Liked Slide
    if (dbHighlights?.mostLiked && dbHighlights.mostLiked.id !== dbHighlights.mostOrdered?.id) {
      const likedProd = dbHighlights.mostLiked;
      baseSlides.push({
        tag: likedProd.badge || "Choix de la Communauté",
        title: likedProd.name,
        titleAccent: `${parseFloat(likedProd.price).toLocaleString()} FCFA`,
        desc: likedProd.description,
        cta: "Découvrir",
        ctaLink: `/shop/${likedProd.id}`,
        image: likedProd.image,
        color: "from-[#b71c1c]/95",
      });
    }

    // Fallback if no highlights yet
    if (!dbHighlights?.mostOrdered && !dbHighlights?.mostLiked) {
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
    }
    // Final safety fallback to prevent carousel crash if completely empty
    if (baseSlides.length === 0) {
      baseSlides.push({
        tag: "Boutique Officielle",
        title: "Baysawarr E-Commerce",
        titleAccent: "Premium",
        desc: "Découvrez notre sélection exclusive de produits locaux et artisanaux.",
        cta: "Découvrir",
        ctaLink: "/shop",
        image: "https://res.cloudinary.com/drxouwbms/image/upload/v1775574363/8c6463a1f3a8d2797bea0b449a685baf_hpk0nq.jpg",
        color: "from-brand-blue/95",
      });
    }

    return baseSlides;
  }, [products, activeCampaign, dbHighlights]);

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
        const [p, c, a, fetchedCampaign, fetchedHighlights] = await Promise.all([
          api.get<any[]>("/products"),
          api.get<any[]>("/categories"),
          api.get<any[]>("/artisans"),
          api.get<any>("/flash-sales/active"),
          api.get<any>("/products/highlights"),
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
        setDbHighlights(fetchedHighlights || null);
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
          {loading ? (
            <HeroSkeleton />
          ) : (
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
                      className="font-heading font-black text-[22px] xs:text-2xl sm:text-4xl lg:text-5xl text-white leading-[1.1] mb-3 drop-shadow-2xl line-clamp-2"
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
                      className="text-white/80 text-xs sm:text-sm lg:text-lg mb-6 line-clamp-2 sm:line-clamp-3 max-w-md font-medium leading-relaxed"
                    >
                      {heroSlides[currentSlide]?.desc}
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-10"
                    >
                      <Link
                        href={heroSlides[currentSlide]?.ctaLink || "/shop"}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-2xl transition-all shadow-2xl shadow-brand-green/40 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider shrink-0"
                      >
                        {heroSlides[currentSlide]?.cta}
                        <ArrowRight size={18} className="animate-bounce-x" />
                      </Link>

                      {heroSlides[currentSlide]?.tag === "🔥 EN DIRECT" && activeCampaign?.endTime && (
                        <div className="flex flex-col gap-2">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Fin dans :</p>
                          <CountdownTimer expiryDate={activeCampaign.endTime} light />
                        </div>
                      )}
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
                    className={`h-2 rounded-full transition-all duration-500 ${i === currentSlide
                      ? "w-10 bg-brand-green shadow-[0_0_15px_rgba(46,204,113,0.5)]"
                      : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Dynamic Side Promo Banners - Randomized */}
            <div className="hidden lg:flex flex-col gap-4">
              {(() => {
                // Stabilize random selection for the duration of the component lifecycle
                const featured = products.filter(p => p.featured);
                const regular = products.filter(p => !p.featured);

                // Shuffle both pools
                const shuffledFeatured = [...featured].sort(() => 0.5 - Math.random());
                const shuffledRegular = [...regular].sort(() => 0.5 - Math.random());

                // Merge and take top 2
                const sideProducts = [...shuffledFeatured, ...shuffledRegular].slice(0, 2);

                return sideProducts.map((p, idx) => (
                  <Link key={p.id} href={`/shop/${p.id}`} className="relative flex-1 rounded-2xl overflow-hidden group shadow-lg border border-white/5 bg-surface min-h-[160px]">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="25vw"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${idx === 0 ? 'from-black/90' : 'from-brand-blue/90'} via-transparent to-transparent`} />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${idx === 0 ? 'bg-red-500' : 'bg-brand-green'} text-white text-[9px] font-black uppercase tracking-widest rounded-lg mb-2 shadow-lg`}>
                        {p.featured ? <Star size={10} className="fill-white" /> : null}
                        {p.badge || (p.featured ? 'Sélectionné' : (idx === 0 ? 'Tendance' : 'Nouveau'))}
                      </span>
                      <p className="text-white font-heading font-black text-sm leading-tight mb-1 group-hover:text-brand-green-light transition-colors line-clamp-2">
                        {p.name}
                      </p>
                      <p className="text-brand-green-light text-xs font-black uppercase tracking-tighter">
                        {parseFloat(p.price).toLocaleString()} FCFA
                      </p>
                    </div>
                  </Link>
                ));
              })()}
            </div>
          </div>
          )}
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
            <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div className="flex flex-col gap-1">
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
              </div>

              {activeCampaign?.endTime && (
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted ml-1 md:mr-1">Temps restant :</p>
                  <CountdownTimer expiryDate={activeCampaign.endTime} />
                </div>
              )}
            </motion.div>

            {loading ? (
              <ProductGridSkeleton count={4} />
            ) : (
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
                        {user?.role !== 'admin' && (
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
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
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

          {loading ? (
            <CategorySkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
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

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {popularProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

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

      {/* ─── BRAND IDENTITY / DECORATIVE ELEMENTS ─── */}
      <section className="py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* Identity Card 1 - Effort & Craft */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative p-8 lg:p-10 rounded-[2.5rem] bg-gradient-to-br from-[#1a1a2e] to-brand-blue border border-white/5 overflow-hidden group shadow-2xl"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl group-hover:bg-brand-green/30 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col h-full items-start justify-center">
                <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-brand-green-light w-fit">
                  <Sparkles size={32} />
                </div>
                <h3 className="font-heading font-black text-2xl lg:text-3xl text-white mb-3">
                  Bay Sa Waar
                </h3>
                <p className="text-white/70 text-sm leading-relaxed font-medium">
                  &quot;Sème tes efforts, récolte l&apos;excellence.&quot; Notre philosophie place le travail artisanal acharné et la qualité au sommet.
                </p>
              </div>
            </motion.div>

            {/* Identity Card 2 - 100% Senegal */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative p-8 lg:p-10 rounded-[2.5rem] bg-brand-green border border-white/10 overflow-hidden group shadow-2xl shadow-brand-green/20"
            >
              <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "linear-gradient(#ffffff 2px, transparent 2px), linear-gradient(90deg, #ffffff 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl group-hover:bg-white/30 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col h-full items-start justify-center">
                <div className="mb-6 p-4 rounded-2xl bg-black/10 backdrop-blur-md border border-black/10 text-white w-fit">
                  <HeartHandshake size={32} />
                </div>
                <h3 className="font-heading font-black text-2xl lg:text-3xl text-white mb-3">
                  100% Sénégal
                </h3>
                <p className="text-white/90 text-sm leading-relaxed font-medium">
                  De la matière première à l&apos;œuvre finie. Nous soutenons activement les communautés locales et le commerce équitable.
                </p>
              </div>
            </motion.div>

            {/* Identity Card 3 - Quality */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-8 lg:p-10 rounded-[2.5rem] bg-white border border-border-color overflow-hidden group shadow-xl"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 opacity-50 z-0" />
              <div className="relative z-10 flex flex-col h-full items-start justify-center">
                <div className="mb-6 p-4 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 text-brand-blue w-fit">
                  <Shield size={32} />
                </div>
                <h3 className="font-heading font-black text-2xl lg:text-3xl text-brand-blue mb-3">
                  Qualité Premium
                </h3>
                <p className="text-muted text-sm leading-relaxed font-medium">
                  Une sélection rigoureuse des vendeurs pour vous garantir une authenticité et une qualité inégalées à travers le monde.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ─── ARTISANS ─── */}
      <section id="vendeurs" className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10">
            <p className="text-brand-green font-semibold text-xs uppercase tracking-widest mb-1">
              Les Partenaires
            </p>
            <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">
              Nos Vendeurs
            </h2>
            <p className="text-muted max-w-xl mx-auto text-sm">
              Rencontrez les talents qui donnent vie à nos produits. Chaque vendeur
              apporte son savoir-faire unique et son héritage culturel.
            </p>
          </motion.div>

          {loading ? (
            <ArtisanSkeleton />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {artisans.map((a) => (
                <ArtisanCard key={a.id} artisan={a} />
              ))}
            </div>
          )}
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
                Rejoignez notre communauté et soutenez nos vendeurs
                sénégalais authentiques. Chaque achat fait la différence.
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
