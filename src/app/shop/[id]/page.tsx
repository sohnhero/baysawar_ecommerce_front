"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ChevronLeft, Check, Minus, Plus } from "lucide-react";
import { getProductById, products } from "@/data/products";
import { getReviewsByProductId } from "@/data/reviews";
import { useCartStore } from "@/store/cart-store";
import ProductCard from "@/components/ui/ProductCard";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = getProductById(id);
  const reviews = getReviewsByProductId(id);
  const addItem = useCartStore((s) => s.addItem);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">😕</p>
          <h1 className="font-heading font-bold text-2xl mb-2">Produit introuvable</h1>
          <Link href="/shop" className="text-brand-green text-sm hover:underline">
            Retour à la boutique
          </Link>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const related = products.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  ).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-surface border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Link href="/shop" className="hover:text-foreground transition-colors flex items-center gap-1">
              <ChevronLeft size={14} /> Boutique
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-surface mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-brand-green text-white text-sm font-semibold rounded-full">
                  {product.badge}
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? "border-brand-green ring-2 ring-brand-green/20"
                      : "border-border-color hover:border-brand-green/50"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-brand-green font-medium text-sm uppercase tracking-wider mb-2">
              {product.category}
            </p>
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(product.rating)
                        ? "fill-brand-gold text-brand-gold"
                        : "text-border-color"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted">
                ({product.reviewCount} avis)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-heading font-bold text-3xl">
                {product.price.toLocaleString()} FCFA
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted line-through">
                  {product.originalPrice.toLocaleString()} FCFA
                </span>
              )}
            </div>

            <p className="text-muted leading-relaxed mb-8">
              {product.longDescription}
            </p>

            {/* Artisan */}
            <div className="flex items-center gap-2 mb-8 px-4 py-3 bg-surface rounded-xl">
              <span className="text-sm text-muted">Par</span>
              <span className="text-sm font-semibold">{product.artisan}</span>
            </div>

            {/* Quantity + Add to cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex items-center border border-border-color rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-surface transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-3 font-medium text-sm border-x border-border-color min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-surface transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-white transition-all ${
                  added
                    ? "bg-green-600"
                    : "bg-brand-green hover:bg-brand-green-light shadow-lg shadow-brand-green/25"
                }`}
              >
                {added ? (
                  <>
                    <Check size={18} /> Ajouté !
                  </>
                ) : (
                  <>
                    <ShoppingCart size={18} /> Ajouter au panier
                  </>
                )}
              </motion.button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-surface text-xs font-medium rounded-full text-muted"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        {reviews.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl mb-8">
              Avis Clients ({reviews.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((r) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-surface rounded-2xl p-5 border border-border-color"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Image
                      src={r.avatar}
                      alt={r.author}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold flex items-center gap-1">
                        {r.author}
                        {r.verified && (
                          <Check size={12} className="text-brand-green" />
                        )}
                      </p>
                      <p className="text-xs text-muted">{r.date}</p>
                    </div>
                    <div className="ml-auto flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className={
                            i < r.rating
                              ? "fill-brand-gold text-brand-gold"
                              : "text-border-color"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted">{r.comment}</p>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading font-bold text-2xl mb-8">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
