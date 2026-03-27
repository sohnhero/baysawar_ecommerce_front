"use client";

import { motion } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowLeft, 
  ShoppingBag,
  Star,
  Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WishlistPage() {
  const addItem = useCartStore((s) => s.addItem);
  const { items, fetchWishlist, removeFromWishlist, loading } = useWishlistStore();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  
  useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [fetchWishlist, isAuthenticated, user, router]);
  

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-background rounded-3xl border border-border-color overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative aspect-square">
                  <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <button 
                    onClick={() => removeFromWishlist(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-red-500 hover:scale-110 active:scale-90 transition-all z-10"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-brand-green bg-brand-green/5 px-2 py-0.5 rounded-full">
                      {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
                    </span>
                    <div className="flex items-center gap-0.5 text-[10px] font-bold text-yellow-500">
                      <Star size={10} className="fill-yellow-500" /> {product.rating}
                    </div>
                  </div>
                  <h3 className="font-heading font-bold text-sm mb-0.5 group-hover:text-brand-green transition-colors truncate">{product.name}</h3>
                  <p className="font-black text-base mb-4">{product.price.toLocaleString()} FCFA</p>
                  
                  <button 
                    disabled={product.stock <= 0}
                    onClick={() => addItem({
                      productId: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.image
                    })}
                    className={`w-full py-2.5 border border-border-color rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
                      product.stock <= 0 
                        ? "bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100" 
                        : "bg-surface hover:bg-brand-green hover:text-white hover:border-brand-green active:scale-95"
                    }`}
                  >
                    {product.stock <= 0 ? (
                      <>Rupture</>
                    ) : (
                      <>
                        <ShoppingCart size={14} /> Panier
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
