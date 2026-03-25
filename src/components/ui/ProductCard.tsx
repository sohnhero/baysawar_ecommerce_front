"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, Heart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "react-toastify";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  const stock = product.stock ?? (product.inStock ? 10 : 0);
  const addItem = useCartStore((s) => s.addItem);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const isFavorited = isInWishlist(product.id);
  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Connectez-vous pour ajouter cet article à vos favoris.", {
        icon: <Heart size={18} className="text-red-500" />,
        className: "rounded-2xl font-semibold text-xs",
      });
      return;
    }
    
    if (isFavorited) {
      await removeFromWishlist(product.id);
      toast.success("Article retiré des favoris");
    } else {
      await addToWishlist(product.id);
      toast.success("Article ajouté aux favoris", {
        icon: <Heart size={18} className="text-red-500 fill-red-500" />,
      });
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast.success(`${product.name} ajouté au panier !`, {
      icon: <ShoppingCart size={18} className="text-brand-green" />,
      className: "rounded-2xl font-semibold text-xs shadow-xl",
    });
  };

  return (
    <Link 
      href={stock > 0 ? `/shop/${product.id}` : "#"} 
      onClick={(e) => stock === 0 && e.preventDefault()}
      className={stock === 0 ? "cursor-default" : ""}
    >
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
            className={`object-cover transition-transform duration-500 ${stock > 0 ? 'group-hover:scale-105' : 'grayscale brightness-75 opacity-50'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />

          {/* Badge */}
          {product.badge && stock > 0 && (
            <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
              <div className="px-3 py-1 bg-brand-green text-white text-xs font-semibold rounded-full uppercase tracking-wider shadow-lg">
                {product.badge}
              </div>
              {product.badge.includes('%') && (
                <div className="px-2 py-0.5 bg-red-500 text-white text-[8px] font-black rounded-full uppercase tracking-widest shadow-md">
                  Vente Flash
                </div>
              )}
            </div>
          )}

          {/* Out of stock badge */}
          {stock === 0 && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-rose-500 text-white text-[10px] font-black rounded-full uppercase tracking-widest z-20 shadow-lg">
              Rupture de Stock
            </div>
          )}

          {/* Wishlist toggle */}
          {isAuthenticated && (
            <motion.button
              onClick={handleWishlist}
              whileTap={{ scale: 0.8 }}
              className={`absolute top-3 right-3 p-2 rounded-xl transition-all z-10 ${
                isFavorited 
                  ? "bg-white text-red-500 shadow-md" 
                  : "bg-black/20 text-white backdrop-blur-md hover:bg-white hover:text-red-500"
              }`}
            >
              <Heart size={18} className={isFavorited ? "fill-red-500" : ""} />
            </motion.button>
          )}

          {/* Discount (hidden if already shown in badge) */}
          {product.originalPrice && stock > 0 && !product.badge?.includes('%') && (
            <div className={`absolute top-3 px-2 py-1 bg-red-500 text-white text-[10px] font-black rounded-full shadow-lg ${isAuthenticated ? 'left-14' : 'right-3'}`}>
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </div>
          )}

          {/* Hover overlay */}
          <div className={`absolute inset-0 bg-black/0 transition-colors duration-300 ${stock > 0 ? 'group-hover:bg-black/10' : 'bg-white/40'}`} />

          {/* Add to cart */}
          {stock > 0 && (
            <motion.button
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              className="absolute bottom-3 right-3 p-3 bg-brand-green text-white rounded-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-brand-green-light shadow-lg cursor-pointer"
              aria-label="Ajouter au panier"
            >
              <ShoppingCart size={18} />
            </motion.button>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs text-brand-green font-medium mb-1 uppercase tracking-wide">
            {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
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
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="font-heading font-bold text-lg text-brand-green">
              {product.price.toLocaleString()} <span className="text-[10px] font-bold text-muted uppercase">FCFA</span>
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
