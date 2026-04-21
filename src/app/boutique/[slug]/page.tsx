"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star, Package, CalendarDays, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";

export default function BoutiquePage() {
  const { slug } = useParams<{ slug: string }>();
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await api.get<any>(`/artisans/slug/${slug}`);
        setArtisan(data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !artisan) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <p className="text-2xl font-black">Boutique introuvable</p>
        <p className="text-muted text-sm">Ce lien n&apos;est plus valide ou la boutique n&apos;existe pas.</p>
        <Link href="/shop" className="text-brand-green font-bold text-sm hover:underline">
          ← Retour à la boutique
        </Link>
      </div>
    );
  }

  const activeProducts = artisan.products?.filter((p: any) => p.active !== false) ?? [];

  return (
    <div className="min-h-screen bg-surface">
      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Retour à la boutique
        </Link>
      </div>

      {/* Hero vendeur */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-[32px] border border-border-color p-8 flex flex-col sm:flex-row gap-6 items-start"
        >
          {/* Avatar */}
          <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 border-border-color bg-surface">
            <Image
              src={artisan.image || "/logo_baysawarr.jpg"}
              alt={artisan.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Infos */}
          <div className="flex-1 min-w-0">
            <h1 className="font-heading font-black text-2xl mb-1">{artisan.name}</h1>
            <p className="text-brand-green text-sm font-semibold mb-3">{artisan.specialty}</p>
            <p className="text-muted text-sm leading-relaxed mb-4 line-clamp-3">{artisan.bio}</p>

            <div className="flex flex-wrap gap-4 text-xs text-muted">
              <span className="flex items-center gap-1">
                <MapPin size={13} /> {artisan.location}
              </span>
              <span className="flex items-center gap-1">
                <CalendarDays size={13} /> Depuis {artisan.since}
              </span>
              <span className="flex items-center gap-1">
                <Star size={13} className="fill-brand-gold text-brand-gold" />
                {parseFloat(artisan.rating || "0").toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Package size={13} /> {activeProducts.length} produit{activeProducts.length > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Produits */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="font-heading font-black text-xl mb-6">
          Produits de la boutique
        </h2>

        {activeProducts.length === 0 ? (
          <div className="text-center py-20 text-muted">
            <Package size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun produit disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeProducts.map((product: any) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: parseFloat(product.price),
                  discountPrice: product.discountPrice ? parseFloat(product.discountPrice) : undefined,
                  originalPrice: product.discountPrice ? parseFloat(product.price) : undefined,
                  rating: parseFloat(product.rating || "0"),
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
