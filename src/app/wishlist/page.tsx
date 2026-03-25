"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag,
  Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const { addItem, addItems } = useCartStore();
  const { items, fetchWishlist, removeFromWishlist, loading } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface py-12 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-border-color">
            <Heart size={40} className="text-muted" />
          </div>
          <h1 className="font-heading font-black text-3xl mb-4">Ma Wishlist</h1>
          <p className="text-muted mb-10 leading-relaxed">
            Connectez-vous pour enregistrer vos articles préférés et y accéder depuis tous vos appareils.
          </p>
          <Link 
            href="/login"
            className="block w-full py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20"
          >
            Se Connecter
          </Link>
          <Link 
            href="/shop"
            className="block w-full py-4 mt-4 bg-background border border-border-color text-foreground rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-surface transition-all"
          >
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  const favorites = items.map(item => ({
    id: item.product.id,
    name: item.product.name,
    price: item.product.price,
    image: item.product.image,
    category: item.product.category,
    rating: item.product.rating || 4.5,
    stock: item.product.stock
  }));

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-green mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Continuer le shopping
        </Link>
        
        <div className="flex items-end justify-between mb-10">
          <div>
            <h1 className="font-heading font-black text-4xl mb-2 flex items-center gap-4">
              <Heart className="text-red-500 fill-red-500" size={32} /> Ma Wishlist
            </h1>
            <p className="text-muted text-sm">Retrouvez tous vos articles coup de cœur ici.</p>
          </div>
          {favorites.length > 0 && (
            <button 
              onClick={() => addItems(favorites.map(f => ({
                productId: f.id,
                name: f.name,
                price: f.price,
                image: f.image
              })))}
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-brand-blue text-white rounded-2xl font-bold text-sm shadow-xl shadow-brand-blue/20"
            >
              <ShoppingBag size={18} /> Tout ajouter au panier
            </button>
          )}
        </div>

        {favorites.length === 0 ? (
          <div className="bg-background rounded-[40px] border border-border-color p-20 text-center">
            <div className="w-24 h-24 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} className="text-muted" />
            </div>
            <h2 className="font-heading font-black text-2xl mb-2">Votre liste est vide</h2>
            <p className="text-muted mb-8 max-w-sm mx-auto">Parcourez notre collection et enregistrez vos articles préférés pour plus tard.</p>
            <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-[32px] border border-border-color overflow-hidden shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-[4/5]">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-brand-green bg-brand-green/10 px-2 py-0.5 rounded-full">
                      {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-yellow-500">
                      <Star size={12} className="fill-yellow-500" /> {product.rating}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1 group-hover:text-brand-green transition-colors">{product.name}</h3>
                  <p className="font-black text-xl mb-6">{product.price.toLocaleString()} FCFA</p>
                  
                  <button 
                    disabled={product.stock <= 0}
                    onClick={() => addItem({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    })}
                    className={`w-full py-4 border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                      product.stock <= 0 
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200" 
                        : "bg-surface hover:bg-brand-green hover:text-white"
                    }`}
                  >
                    {product.stock <= 0 ? (
                      <>Rupture de stock</>
                    ) : (
                      <>
                        <ShoppingCart size={18} /> Ajouter au panier
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
