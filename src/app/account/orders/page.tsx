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
import { api } from "@/lib/api";
import { useEffect } from "react";

const statusStyles = {
  pending: { label: "En attente", icon: <Clock size={14} />, color: "text-amber-600 bg-amber-50 border-amber-100" },
  processing: { label: "En cours de préparation", icon: <Clock size={14} />, color: "text-yellow-600 bg-yellow-50 border-yellow-100" },
  shipped: { label: "En cours de livraison", icon: <Truck size={14} />, color: "text-blue-600 bg-blue-50 border-blue-100" },
  delivered: { label: "Livré", icon: <CheckCircle2 size={14} />, color: "text-green-600 bg-green-50 border-green-100" },
  cancelled: { label: "Annulé", icon: <Package size={14} />, color: "text-red-600 bg-red-50 border-red-100" },
};

export default function ClientOrdersPage() {
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.get<any[]>("/orders/my");
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancelOrder = async () => {
    if (!cancellingOrderId) return;

    try {
      await api.patch(`/orders/my/${cancellingOrderId}/cancel`, {});
      setCancellingOrderId(null);
      const data = await api.get<any[]>("/orders/my");
      setOrders(data);
    } catch (error: any) {
      console.error("Failed to cancel order:", error);
      setCancellingOrderId(null);
    }
  };

  const getOrderStatus = (orderId: string): any => {
    const order = orders.find(o => o.id === orderId);
    return order?.status || "processing";
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
          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
              <p className="text-muted">Chargement de vos commandes...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-3xl border border-border-color">
              <Package size={48} className="mx-auto text-muted mb-4 opacity-20" />
              <h2 className="font-heading font-bold text-xl mb-2">Aucune commande trouvée</h2>
              <p className="text-muted mb-8">Vous n&apos;avez pas encore passé de commande sur Baysawarr.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs">
                Commencer mes achats
              </Link>
            </div>
          ) : (
            orders.map((order) => (
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
                    <p className="font-bold text-brand-blue">#{order.id.substring(0,8).toUpperCase()}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Date</p>
                  <p className="font-bold">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted uppercase tracking-widest">Total</p>
                  <p className="font-bold text-brand-green">{parseFloat(order.totalAmount).toLocaleString()} FCFA</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${statusStyles[order.status as keyof typeof statusStyles]?.color || statusStyles.pending.color}`}>
                  {statusStyles[order.status as keyof typeof statusStyles]?.icon || statusStyles.pending.icon}
                  {statusStyles[order.status as keyof typeof statusStyles]?.label || statusStyles.pending.label}
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4 group">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface shrink-0 border border-border-color">
                          <Image src={item.product.image} alt={item.product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.product.name}</p>
                          <p className="text-xs text-muted">Quantité: {item.quantity} · {parseFloat(item.price).toLocaleString()} FCFA</p>
                        </div>
                        <Link href={`/shop/${item.product.id}`} className="p-2 rounded-xl hover:bg-surface text-muted hover:text-brand-green transition-all">
                          <ExternalLink size={16} />
                        </Link>
                      </div>
                    ))}
                  </div>
                  
                  <div className="md:w-64 flex flex-col gap-3">
                    {order.status !== "cancelled" && (
                      <>
                        <button 
                          onClick={() => setTrackingOrder(order.id)}
                          className="w-full py-3 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20"
                        >
                          Suivre le Colis
                        </button>
                        <button className="w-full py-3 border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-surface transition-all">
                          Facture PDF
                        </button>
                      </>
                    )}
                    {order.status === "pending" && (
                      <button
                        onClick={() => setCancellingOrderId(order.id)}
                        className="w-full py-3 bg-red-50 text-red-500 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-all mt-1"
                      >
                        Annuler la commande
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )))}
        </div>

        {/* Cancellation Modal */}
        <AnimatePresence>
          {cancellingOrderId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setCancellingOrderId(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-md bg-background rounded-3xl border border-border-color shadow-2xl p-8 text-center"
              >
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Package size={32} />
                </div>
                <h3 className="font-heading font-black text-2xl mb-2 text-brand-blue">Confirmer l&apos;annulation</h3>
                <p className="text-muted text-sm mb-8">
                  Êtes-vous sûr de vouloir annuler la commande <span className="font-bold text-brand-blue">#{cancellingOrderId.substring(0,8).toUpperCase()}</span> ? Cette action est irréversible.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setCancellingOrderId(null)}
                    className="py-4 border border-border-color rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-surface transition-all"
                  >
                    Non, garder
                  </button>
                  <button 
                    onClick={handleCancelOrder}
                    className="py-4 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Oui, annuler
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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
