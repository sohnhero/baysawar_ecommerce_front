"use client";

import { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Calendar, Package, ArrowLeft, Share2, Info } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import SkeletonCard from "@/components/ui/SkeletonCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { toast } from "react-toastify";

export default function BoutiquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [artisan, setArtisan] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "about">("products");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch artisan by slug
        const artisanData = await api.get<any>(`/artisans/slug/${slug}`);
        setArtisan(artisanData);

        // Fetch products for this artisan
        if (artisanData?.id) {
          const productsData = await api.get<any[]>(`/products?seller=${artisanData.id}`);
          setProducts(productsData);
        }
      } catch (error) {
        console.error("Failed to fetch boutique data:", error);
        toast.error("Boutique introuvable");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <BoutiqueSkeleton />;

  if (!artisan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} className="text-slate-400" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Boutique introuvable</h1>
          <p className="text-slate-500 max-w-xs mx-auto text-sm">
            Désolé, la boutique que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link 
            href="/shop" 
            className="inline-block px-8 py-3 bg-brand-green text-white rounded-xl font-bold text-sm shadow-lg shadow-brand-green/20"
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ─── HERO BANNER ─── */}
      <div className="relative h-[300px] md:h-[400px] overflow-hidden">
        {/* Background Image/Gradient */}
        <div className="absolute inset-0 bg-brand-blue">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent)] transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
        </div>

        {/* Navigation Overlays */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/shop" 
            className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Boutique
          </Link>
        </div>

        <div className="absolute bottom-10 left-0 right-0">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-end gap-6">
            {/* Profile Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white shadow-2xl shrink-0 z-20 group"
            >
              <Image 
                src={artisan.image} 
                alt={artisan.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700" 
              />
            </motion.div>

            {/* Title Info */}
            <div className="flex-1 pb-2 space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-brand-green/20 backdrop-blur-md border border-brand-green/30 text-brand-green text-[10px] font-black uppercase tracking-wider rounded-md">
                    Vendeur Vérifié
                  </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                  {artisan.name}
                </h1>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/80"
              >
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin size={16} className="text-brand-green" /> {artisan.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium">
                  <Star size={16} className="text-brand-gold fill-brand-gold" /> {artisan.rating} <span className="opacity-60">(Avis certifiés)</span>
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pb-2 hidden md:block"
            >
              <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2 text-xs font-bold uppercase tracking-widest shadow-xl">
                 <Share2 size={16} /> Partager
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ─── CONTENT SECTION ─── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-slate-100 mb-10 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("products")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === "products" ? "text-brand-blue" : "text-slate-400 hover:text-brand-blue"
            }`}
          >
            Produits <span className="ml-1 opacity-40 font-bold">({products.length})</span>
            {activeTab === "products" && (
              <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full" />
            )}
          </button>
          <button 
            onClick={() => setActiveTab("about")}
            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === "about" ? "text-brand-blue" : "text-slate-400 hover:text-brand-blue"
            }`}
          >
            À Propos
            {activeTab === "about" && (
              <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-blue rounded-t-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "products" ? (
            <div className="space-y-8">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto">
                    <Package size={24} className="text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                    Aucun produit pour le moment
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column: Stats */}
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-blue shadow-sm">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Membre depuis</p>
                    <p className="font-heading font-black text-slate-900">{artisan.since || 2024}</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Ventes réalisées</p>
                    <p className="font-heading font-black text-slate-900">{products.length * 12}+ pépites</p>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-gold shadow-sm">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Note globale</p>
                    <p className="font-heading font-black text-slate-900">{artisan.rating} / 5</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Bio */}
              <div className="lg:col-span-2 space-y-10">
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">L'Histoire de {artisan.name}</h2>
                  <div className="prose prose-slate max-w-none">
                    <p className="text-slate-600 leading-relaxed text-lg font-medium italic">
                      "{artisan.bio}"
                    </p>
                  </div>
                </div>

                <div className="p-10 bg-brand-blue/5 border border-brand-blue/10 rounded-[40px] space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center">
                      <Star size={18} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Garantie Baysawarr</h3>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Acheter chez <strong>{artisan.name}</strong>, c'est soutenir l'artisanat local et recevoir un produit authentique, fabriqué avec soin. Nous garantissons la qualité et la traçabilité de chaque article.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BoutiqueSkeleton() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-[300px] md:h-[400px] bg-slate-50 animate-pulse" />
      <div className="max-w-7xl mx-auto px-6 -mt-20 md:-mt-24 space-y-12">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-3xl" />
          <div className="flex-1 space-y-4 pb-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  );
}
