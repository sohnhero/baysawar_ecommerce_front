"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <Link href={`/shop/${product.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        className="group bg-background rounded-2xl overflow-hidden border border-border-color hover:border-brand-green/30 hover:shadow-2xl transition-all duration-300"
      >
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-surface">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-brand-green text-white text-xs font-semibold rounded-full">
              {product.badge}
            </div>
          )}

          {/* Discount */}
          {product.originalPrice && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Add to cart */}
          <motion.button
            onClick={handleAdd}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 right-3 p-3 bg-brand-green text-white rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-green-light shadow-lg cursor-pointer"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </motion.button>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brand-green font-medium mb-1 uppercase tracking-wide">
            {product.category}
          </p>
          <h3 className="font-heading font-semibold text-sm leading-tight mb-2 line-clamp-2 group-hover:text-brand-green transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-brand-gold text-brand-gold" />
            <span className="text-xs font-medium">{product.rating}</span>
            <span className="text-xs text-muted">({product.reviewCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-lg">
              {product.price.toLocaleString()} <span className="text-xs font-normal">FCFA</span>
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted line-through">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
