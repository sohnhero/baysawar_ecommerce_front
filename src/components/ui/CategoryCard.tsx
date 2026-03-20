"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link href={`/shop?cat=${category.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
      >
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className="text-3xl mb-2 block">{category.icon}</span>
          <h3 className="font-heading font-bold text-xl text-white mb-1">
            {category.name}
          </h3>
          <p className="text-white/60 text-sm line-clamp-2 mb-2">
            {category.description}
          </p>
          <span className="text-xs text-brand-green font-semibold">
            {category.productCount} produits →
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
