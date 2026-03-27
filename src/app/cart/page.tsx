"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-surface flex items-center justify-center">
            <ShoppingBag size={40} className="text-muted" />
          </div>
          <h1 className="font-heading font-bold text-2xl mb-2">
            Votre panier est vide
          </h1>
          <p className="text-muted mb-6">
            Découvrez les pépites de nos vendeurs et commencez votre shopping
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand-green text-white font-semibold rounded-xl hover:bg-brand-green-light transition-colors"
          >
            Explorer la boutique <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    );
  }

  const shipping = 2500;
  const total = totalPrice();

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading font-bold text-3xl mb-8"
        >
          Mon Panier{" "}
          <span className="text-muted font-normal text-lg">
            ({items.length} article{items.length > 1 ? "s" : ""})
          </span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-background rounded-2xl border border-border-color p-4 flex gap-4"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/shop/${item.productId}`}
                      className="font-heading font-semibold text-sm hover:text-brand-green transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-brand-green font-bold mt-1">
                      {item.price.toLocaleString()} FCFA
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-border-color rounded-lg overflow-hidden">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 py-1.5 text-sm font-medium border-x border-border-color">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="px-2.5 py-1.5 hover:bg-surface transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-muted hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold">
                      {(item.price * item.quantity).toLocaleString()} FCFA
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-background rounded-2xl border border-border-color p-6 sticky top-24"
            >
              <h2 className="font-heading font-bold text-lg mb-6">
                Résumé de la commande
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Sous-total</span>
                  <span className="font-bold">{total.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm items-center">
                  <span className="text-muted">Livraison</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-brand-green bg-brand-green/5 px-2 py-1 rounded-lg animate-pulse">
                    Calculé au paiement
                  </span>
                </div>
                <div className="border-t border-border-color pt-4 flex justify-between font-heading font-black text-xl">
                  <span>Total</span>
                  <span className="text-brand-green">
                    {total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full text-center px-6 py-3.5 bg-brand-green hover:bg-brand-green-light text-white font-semibold rounded-xl transition-colors shadow-lg shadow-brand-green/25"
              >
                Passer la commande
              </Link>

              <Link
                href="/shop"
                className="block w-full text-center mt-3 text-sm text-muted hover:text-foreground transition-colors"
              >
                Continuer le shopping
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
