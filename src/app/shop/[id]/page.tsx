"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ChevronLeft, Check, Minus, Plus } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-toastify";
import ProductCard from "@/components/ui/ProductCard";
import { api } from "@/lib/api";
import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [dbProduct, setDbProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((s) => s.addItem);
  const { user } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [related, setRelated] = useState<any[]>([]);

  const fetchProduct = async () => {
    try {
      const [p, activeCampaign] = await Promise.all([
        api.get<any>(`/products/${id}`),
        api.get<any>("/flash-sales/active"),
      ]);

      // Check for flash sale
      const flashItem = activeCampaign?.items?.find((item: any) => item.productId === p.id);
      if (flashItem) {
        p.originalPrice = parseFloat(p.price);
        p.price = parseFloat(flashItem.flashPrice);
        p.badge = `-${flashItem.discountPercent}%`;
        p.isFlash = true;
      }

      setDbProduct(p);
      
      // Fetch related products
      if (p.categoryId) {
        const rel = await api.get<any[]>(`/products?category=${p.categoryId}`);
        setRelated(rel.filter((item: any) => item.id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const reviews = dbProduct?.reviews?.map((r: any) => ({
    id: r.id,
    author: r.user?.name || "Client",
    userId: r.userId,
    avatar: r.user?.image || null,
    rating: r.rating,
    comment: r.comment,
    date: new Date(r.createdAt).toLocaleDateString(),
    verified: true
  })) || [];

  const currentUserReview = user ? reviews.find((r: any) => r.userId === user.id) : null;

  useEffect(() => {
    if (currentUserReview) {
      setRating(currentUserReview.rating);
      setComment(currentUserReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
  }, [id, !!currentUserReview]);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent">
        <div className="bg-surface border-b border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-4 bg-border-color rounded w-48 animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
            <div>
              <div className="aspect-square bg-surface rounded-2xl mb-4" />
              <div className="flex gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-surface rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="h-4 bg-surface rounded w-1/4" />
              <div className="h-10 bg-surface rounded w-3/4" />
              <div className="h-6 bg-surface rounded w-1/3" />
              <div className="space-y-2">
                <div className="h-4 bg-surface rounded w-full" />
                <div className="h-4 bg-surface rounded w-full" />
                <div className="h-4 bg-surface rounded w-2/3" />
              </div>
              <div className="h-12 bg-surface rounded-xl w-full" />
              <div className="h-14 bg-surface rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dbProduct) {
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

  const product = {
    ...dbProduct,
    image: dbProduct.image,
    images: dbProduct.images || [dbProduct.image],
    rating: parseFloat(dbProduct.rating) || 5,
    reviewCount: dbProduct.reviewCount || 0,
    longDescription: dbProduct.longDescription || dbProduct.description,
    artisan: dbProduct.artisan?.name || "Artisan Baysawarr",
    category: dbProduct.category?.name || "Artisanat",
    categorySlug: dbProduct.category?.slug || "artisanat",
    tags: dbProduct.tags || [],
    price: parseFloat(dbProduct.price),
    originalPrice: dbProduct.originalPrice ? parseFloat(dbProduct.originalPrice) : (dbProduct.discountPrice ? parseFloat(dbProduct.discountPrice) : null)
  };

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
    toast.success(`${product.name} ajouté au panier (${quantity}) !`, {
      icon: <ShoppingCart size={18} className="text-brand-green" />,
      className: "rounded-2xl font-semibold text-xs shadow-xl",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    try {
      await api.post("/reviews", {
        productId: product.id,
        rating,
        comment,
      });
      toast.success("Votre avis a été publié !");
      setComment("");
      setRating(5);
      // Refresh product data to show new review and update stats
      fetchProduct();
    } catch (error) {
      toast.error("Erreur lors de la publication de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!currentUserReview) return;
    
    setSubmitting(true);
    try {
      await api.delete(`/reviews/${currentUserReview.id}`);
      toast.success("Avis supprimé");
      setComment("");
      setRating(5);
      setShowDeleteConfirm(false);
      fetchProduct();
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setSubmitting(false);
    }
  };

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
              {product.images.map((img: string, i: number) => (
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
              {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
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
              {product.tags.map((tag: string) => (
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

        {/* Reviews Section */}
        <section className="mt-16 pt-16 border-t border-border-color">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="font-heading font-black text-3xl text-slate-900">Avis Clients</h2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < Math.round(product.rating) ? "fill-brand-gold text-brand-gold" : "text-border-color"}
                    />
                  ))}
                </div>
                <p className="text-sm font-bold">{product.rating} sur 5</p>
                <div className="w-1 h-1 rounded-full bg-slate-300" />
                <p className="text-xs text-muted font-medium">{product.reviewCount} avis certifiés</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-1">
              {user ? (
                <div className="bg-white rounded-[32px] p-8 border border-border-color shadow-sm sticky top-24">
                  <h3 className="font-heading font-black text-lg mb-2">
                    {currentUserReview ? "Modifier votre avis" : "Laisser un avis"}
                  </h3>
                  <p className="text-xs text-muted mb-6">
                    {currentUserReview 
                      ? "Vous avez déjà noté ce produit. Vous pouvez modifier votre commentaire ou votre note." 
                      : "Partagez votre expérience avec la communauté."}
                  </p>
                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">Note</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setRating(s)}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              size={24}
                              className={s <= rating ? "fill-brand-gold text-brand-gold" : "text-slate-200"}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted mb-2 block">Commentaire</label>
                      <textarea
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Qu'avez-vous pensé de ce produit ?"
                        className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all resize-none text-sm font-medium"
                      />
                    </div>
                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={submitting || !comment.trim()}
                        className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl transition-all active:scale-95 disabled:opacity-50"
                      >
                        {submitting ? "Traitement..." : currentUserReview ? "Mettre à jour" : "Publier mon avis"}
                      </button>
                      
                      {currentUserReview && (
                        <div className="pt-2">
                          {!showDeleteConfirm ? (
                            <button
                              type="button"
                              onClick={() => setShowDeleteConfirm(true)}
                              disabled={submitting}
                              className="w-full py-3 text-red-500 hover:bg-red-50 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all disabled:opacity-50"
                            >
                              Supprimer mon avis
                            </button>
                          ) : (
                            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col gap-3">
                              <p className="text-[10px] text-red-600 font-bold text-center">Voulez-vous vraiment supprimer votre avis ?</p>
                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={handleDeleteReview}
                                  disabled={submitting}
                                  className="flex-1 py-2 bg-red-500 text-white rounded-xl font-bold text-[9px] uppercase tracking-wider"
                                >
                                  {submitting ? "..." : "Oui, supprimer"}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowDeleteConfirm(false)}
                                  disabled={submitting}
                                  className="flex-1 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl font-bold text-[9px] uppercase tracking-wider"
                                >
                                  Annuler
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-brand-blue/5 rounded-[32px] p-8 border border-brand-blue/10 text-center">
                  <p className="text-sm font-bold text-brand-blue mb-4">Vous devez être connecté pour donner votre avis.</p>
                  <Link href="/login" className="inline-block px-6 py-3 bg-brand-blue text-white rounded-xl text-xs font-black uppercase tracking-widest">
                    Se Connecter
                  </Link>
                </div>
              )}
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {reviews.map((r: any) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="bg-white rounded-[32px] p-6 border border-border-color hover:border-brand-green/30 transition-all shadow-sm group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center overflow-hidden border border-brand-green/20 relative">
                          {r.avatar ? (
                            <Image
                              src={r.avatar}
                              alt={r.author}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-brand-green font-black text-xs uppercase">
                              {r.author.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-slate-800">{r.author}</p>
                            {r.verified && (
                              <div className="flex items-center gap-1 px-2 py-0.5 bg-brand-green/10 text-brand-green rounded-full text-[9px] font-black uppercase tracking-widest">
                                <Check size={8} /> Achat vérifié
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-muted font-bold uppercase tracking-widest">{r.date}</p>
                        </div>
                        <div className="flex bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={10}
                              className={i < r.rating ? "fill-brand-gold text-brand-gold" : "text-slate-200"}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium pl-2 border-l-2 border-slate-100 italic group-hover:border-brand-green/30 transition-all">
                        &quot;{r.comment}&quot;
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-surface rounded-[40px] border border-dashed border-slate-300">
                  <p className="text-4xl mb-4 opacity-40">✨</p>
                  <p className="text-slate-400 font-bold">Aucun avis pour le moment. Soyez le premier !</p>
                </div>
              )}
            </div>
          </div>
        </section>

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
