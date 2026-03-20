"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Truck,
  Shield,
  HeartHandshake,
  Star,
  ChevronRight,
  ShoppingCart,
  Percent,
} from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import { artisans } from "@/data/artisans";
import ProductCard from "@/components/ui/ProductCard";
import CategoryCard from "@/components/ui/CategoryCard";
import ArtisanCard from "@/components/ui/ArtisanCard";
import { useCartStore } from "@/store/cart-store";

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

const heroSlides = [
  {
    tag: "Collection 2026",
    title: "Artisanat Premium",
    titleAccent: "du Sénégal",
    desc: "Découvrez notre sélection de produits artisanaux d'exception, créés par les meilleurs artisans sénégalais.",
    cta: "Découvrir la Boutique",
    ctaLink: "/shop",
    image: "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    color: "from-brand-blue/95",
  },
  {
    tag: "🔥 Offre Spéciale",
    title: "Beurre de Karité",
    titleAccent: "-30% cette semaine",
    desc: "100% naturel, récolté à la main dans les savanes du Sénégal. Hydratation intense pour la peau et les cheveux.",
    cta: "Profiter de l'offre",
    ctaLink: "/shop/1",
    image: "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    color: "from-[#1a1a2e]/95",
  },
  {
    tag: "Nouveautés",
    title: "Café Touba",
    titleAccent: "Goût Authentique",
    desc: "Le café emblématique du Sénégal, torréfié artisanalement avec du djar et du gingembre pour une saveur unique.",
    cta: "Commander Maintenant",
    ctaLink: "/shop/5",
    image: "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    color: "from-[#2a1810]/95",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const addItem = useCartStore((s) => s.addItem);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const popularProducts = products.slice(0, 8);
  const featuredProducts = products.filter((p) => p.badge).slice(0, 3);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  return (
    <>
      {/* ─── HERO SECTION — E-COMMERCE STYLE ─── */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Slider */}
            <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-[2/1] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={heroSlides[currentSlide].image}
                    alt={heroSlides[currentSlide].title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${heroSlides[currentSlide].color} via-transparent to-transparent`} />
                </motion.div>
              </AnimatePresence>

              {/* Slide Content */}
              <div className="relative z-10 flex items-center h-full p-6 sm:p-10 lg:p-12">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="max-w-md"
                  >
                    <span className="inline-block px-3 py-1 bg-brand-green text-white text-xs font-semibold rounded-full mb-3">
                      {heroSlides[currentSlide].tag}
                    </span>
                    <h1 className="font-heading font-black text-2xl sm:text-3xl lg:text-5xl text-white leading-tight mb-2">
                      {heroSlides[currentSlide].title}
                      <br />
                      <span className="text-brand-green-light">
                        {heroSlides[currentSlide].titleAccent}
                      </span>
                    </h1>
                    <p className="text-white/70 text-sm lg:text-base mb-5 line-clamp-2 max-w-sm">
                      {heroSlides[currentSlide].desc}
                    </p>
                    <Link
                      href={heroSlides[currentSlide].ctaLink}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green hover:bg-brand-green-light text-white font-semibold rounded-xl transition-all shadow-lg shadow-brand-green/30 hover:shadow-brand-green/50 text-sm"
                    >
                      {heroSlides[currentSlide].cta}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ArrowRight size={18} />
              </button>

              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentSlide
                        ? "w-8 bg-brand-green"
                        : "w-4 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Side Promo Banners */}
            <div className="hidden lg:flex flex-col gap-4">
              {/* Banner 1 */}
              <Link href="/shop/5" className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Café Touba"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full mb-1.5">
                    PROMO
                  </span>
                  <p className="text-white font-heading font-bold text-sm leading-tight">
                    Café Touba<br />Artisanal
                  </p>
                  <p className="text-brand-green text-xs font-bold mt-1">
                    5 000 FCFA
                  </p>
                </div>
              </Link>

              {/* Banner 2 */}
              <Link href="/shop?cat=artisanat" className="relative flex-1 rounded-2xl overflow-hidden group">
                <Image
                  src="https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Artisanat"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 to-brand-blue/20" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <span className="inline-block px-2 py-0.5 bg-brand-green text-white text-[10px] font-bold rounded-full mb-1.5">
                    NOUVEAU
                  </span>
                  <p className="text-white font-heading font-bold text-sm leading-tight">
                    Paniers<br />Artisanaux
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    À partir de 15 000 FCFA
                  </p>
                </div>
              </Link>
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
      <section className="py-10 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl">
              <Percent size={16} />
              <span className="font-heading font-bold text-sm">Flash Deals</span>
            </div>
            <span className="text-xs text-muted">Offres limitées sur nos best-sellers</span>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredProducts.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -3 }}
                className="group bg-surface rounded-2xl border border-border-color overflow-hidden hover:border-brand-green/30 hover:shadow-xl transition-all"
              >
                <div className="flex gap-4 p-4">
                  <Link href={`/shop/${p.id}`} className="relative w-28 h-28 rounded-xl overflow-hidden shrink-0 bg-white">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="112px"
                    />
                    {p.originalPrice && (
                      <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded-md">
                        -{Math.round((1 - p.price / p.originalPrice) * 100)}%
                      </span>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-brand-green font-semibold uppercase tracking-wide">
                        {p.category}
                      </span>
                      <Link href={`/shop/${p.id}`}>
                        <h3 className="font-heading font-semibold text-sm leading-tight mt-0.5 line-clamp-2 group-hover:text-brand-green transition-colors">
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={
                              i < Math.round(p.rating)
                                ? "fill-brand-gold text-brand-gold"
                                : "text-border-color"
                            }
                          />
                        ))}
                        <span className="text-[10px] text-muted ml-0.5">({p.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div>
                        <span className="font-heading font-bold text-base text-brand-green">
                          {p.price.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-muted ml-1">FCFA</span>
                        {p.originalPrice && (
                          <span className="text-xs text-muted line-through ml-2">
                            {p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() =>
                          addItem({
                            productId: p.id,
                            name: p.name,
                            price: p.price,
                            image: p.image,
                          })
                        }
                        className="p-2 bg-brand-green hover:bg-brand-green-light text-white rounded-lg transition-colors"
                      >
                        <ShoppingCart size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
