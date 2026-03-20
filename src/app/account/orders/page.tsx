"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OrderTracker from "@/components/shared/OrderTracker";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  ArrowLeft,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";

const userOrders = [
  {
    id: "ORD-2026-004",
    date: "18 Mars 2026",
    status: "processing",
    total: 24500,
    items: [
      { ...products[0], quantity: 1 },
      { ...products[2], quantity: 2 }
    ]
  },
  {
    id: "ORD-2026-001",
    date: "10 Janvier 2026",
    status: "delivered",
    total: 12000,
    items: [
      { ...products[5], quantity: 1 }
    ]
  }
];

const statusStyles = {
  processing: { label: "En cours de préparation", icon: <Clock size={14} />, color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
  shipped: { label: "En cours de livraison", icon: <Truck size={14} />, color: "text-blue-600 bg-blue-50 border-blue-100" },
  delivered: { label: "Livré", icon: <CheckCircle2 size={14} />, color: "text-green-600 bg-green-50 border-green-100" },
  cancelled: { label: "Annulé", icon: <Package size={14} />, color: "text-red-600 bg-red-50 border-red-100" },
};

export default function ClientOrdersPage() {
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  const getOrderStatus = (orderId: string): "processing" | "shipped" | "delivered" | "cancelled" => {
    const order = userOrders.find(o => o.id === orderId);
    const status = order?.status;
    if (status === "processing" || status === "shipped" || status === "delivered" || status === "cancelled") {
      return status;
    }
    return "processing";
  };
  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/account" className="inline-flex items-center gap-2 text-sm text-muted hover:text-brand-green mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à Mon Compte
        </Link>
        
        <div className="mb-10">
          <h1 className="font-heading font-black text-3xl mb-2">Historique des Commandes</h1>
          <p className="text-muted text-sm">Suivez vos colis et consultez vos factures en un clic.</p>
        </div>

        <div className="space-y-6">
          {userOrders.map((order) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-3xl border border-border-color overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="p-6 border-b border-border-color bg-surface/30 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted uppercase tracking-widest">Numéro</p>
                    <p className="font-bold text-brand-blue">{order.id}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Date</p>
                  <p className="font-bold">{order.date}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Total</p>
                  <p className="font-bold text-brand-green">{order.total.toLocaleString()} FCFA</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${statusStyles[order.status as keyof typeof statusStyles].color}`}>
                  {statusStyles[order.status as keyof typeof statusStyles].icon}
                  {statusStyles[order.status as keyof typeof statusStyles].label}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0 border border-border-color">
                          <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.name}</p>
                          <p className="text-xs text-muted">Quantité: {item.quantity} · {item.price.toLocaleString()} FCFA</p>
                        </div>
                        <Link href={`/shop/${item.id}`} className="p-2 rounded-xl hover:bg-surface text-muted hover:text-brand-green transition-all">
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="md:w-64 flex flex-col gap-3">
                    <button 
                      onClick={() => setTrackingOrder(order.id)}
                      className="w-full py-3 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20"
                    >
                      Suivre le Colis
                    </button>
                    <button className="w-full py-3 border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-surface transition-all">
                      Facture PDF
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tracking Modal */}
        <AnimatePresence>
          {trackingOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setTrackingOrder(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-xl bg-background rounded-3xl border border-border-color shadow-2xl p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-heading font-black text-2xl">Suivez votre commande</h3>
                  <button onClick={() => setTrackingOrder(null)} className="p-2 hover:bg-surface rounded-xl transition-colors">
                    <Package size={20} className="text-muted" />
                  </button>
                </div>
                
                <div className="mb-8 p-4 bg-surface rounded-2xl border border-border-color">
                  <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">Numéro de Commande</p>
                  <p className="font-black text-brand-blue">{trackingOrder}</p>
                </div>

                <div className="py-4">
                  <OrderTracker currentStatus={getOrderStatus(trackingOrder)} />
                </div>

                <button 
                  onClick={() => setTrackingOrder(null)}
                  className="w-full mt-10 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20"
                >
                  Fermer
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
