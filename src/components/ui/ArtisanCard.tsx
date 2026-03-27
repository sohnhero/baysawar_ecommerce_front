"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";
import type { Artisan } from "@/data/artisans";

export default function ArtisanCard({ artisan }: { artisan: Artisan }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group bg-background rounded-2xl border border-border-color p-6 hover:border-brand-green/30 hover:shadow-xl transition-all duration-300 text-center"
    >
      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-brand-green/10 group-hover:ring-brand-green/30 transition-all">
        <Image
          src={artisan.image}
          alt={artisan.name}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
      <h3 className="font-heading font-bold text-lg mb-1">{artisan.name}</h3>
      <p className="text-brand-green text-sm font-medium mb-1">
        {artisan.specialty}
      </p>
      <p className="text-xs text-muted flex items-center justify-center gap-1 mb-3">
        <MapPin size={12} /> {artisan.location}
      </p>
      <div className="flex items-center justify-center gap-1 mb-3">
        <Star size={14} className="fill-brand-gold text-brand-gold" />
        <span className="text-sm font-medium">{artisan.rating}</span>
        <span className="text-xs text-muted">· Depuis {artisan.since}</span>
      </div>
      <p className="text-xs text-muted leading-relaxed line-clamp-3 mb-4">
        {artisan.bio}
      </p>
      <Link 
        href={`/shop?seller=${artisan.id}`}
        className="inline-block w-full py-2.5 border border-brand-green/30 text-brand-green rounded-xl text-xs font-bold hover:bg-brand-green hover:text-white transition-all"
      >
        Voir les produits
      </Link>
    </motion.div>
  );
}
