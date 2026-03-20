"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Calendar,
  CreditCard,
  User,
  MapPin,
  ExternalLink,
  ArrowRight
} from "lucide-react";
import { recentOrders, RecentOrder } from "@/data/admin-stats";
import AdminLayout from "@/components/admin/AdminLayout";

const statusConfig = {
  delivered: {
    label: "Livré",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: <CheckCircle2 size={12} />,
    step: 4
  },
  shipped: {
    label: "Expédié",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: <Truck size={12} />,
    step: 3
  },
  processing: {
    label: "En cours",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: <Clock size={12} />,
    step: 2
  },
  cancelled: {
    label: "Annulé",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    icon: <XCircle size={12} />,
    step: 0
  },
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<RecentOrder | null>(null);

  const filteredOrders = recentOrders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) ||
                          order.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Premium Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-green/10 text-brand-green rounded-2xl flex items-center justify-center">
                <ShoppingCart size={24} />
              </div>
              Gestion des Commandes
            </h1>
            <p className="text-slate-500 font-medium ml-16">Suivez et traitez les {recentOrders.length} commandes en attente.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={16} /> Filtres Avancés
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-blue/20">
              <Download size={16} /> Rapport Journalier
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: "En cours", count: 12, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Prêtes à expédier", count: 5, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Livrées aujourd'hui", count: 28, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Litiges", count: 1, color: "text-rose-600", bg: "bg-rose-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-2xl font-black text-slate-900">{s.count}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <Package size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6">
          <div className="relative flex-1 group">
            <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue" />
            <input
              type="text"
              placeholder="Rechercher par client, ID commande, tracking..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-6 py-5 rounded-[24px] bg-white border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue shadow-sm transition-all"
            />
          </div>
          <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm">
            {["all", "processing", "shipped", "delivered"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-slate-900 text-white shadow-lg shadow-black/10"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "Toutes" : f === "processing" ? "En cours" : f === "shipped" ? "Expédiées" : "Livrées"}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table Container */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID Commande</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client & Contact</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date / Heure</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Montant Total</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">État du Flux</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order, i) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-10 py-8">
                      <span className="text-sm font-black text-brand-blue uppercase tracking-tight bg-brand-blue/5 px-3 py-1.5 rounded-lg border border-brand-blue/10">{order.id}</span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xs">
                          {order.customer[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-sm leading-tight">{order.customer}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Client Premium</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex flex-col">
                        <span className="text-sm text-slate-900 font-black">{order.date}</span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">14:23 GMT</span>
                      </div>
                    </td>
                    <td className="px-8 py-8 text-sm font-black text-slate-900">
                      <div className="flex items-center gap-1">
                        {order.amount.toLocaleString()}
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest ml-1">FCFA</span>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight border ${statusConfig[order.status].color}`}>
                        {statusConfig[order.status].icon}
                        {statusConfig[order.status].label}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-3 text-slate-400 hover:text-brand-green hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100 group-hover:scale-110 active:scale-95"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-10 py-8 flex items-center justify-between border-t border-slate-50 bg-slate-50/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flux logistique · Page 1 sur 12</p>
            <div className="flex gap-3">
              <button className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-all font-black" disabled>
                <ChevronLeft size={20} />
              </button>
              <button className="p-3 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-black">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Redesigned Inspection Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 40 }}
                className="relative bg-white rounded-[48px] border border-white/20 p-12 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] no-scrollbar"
              >
                <div className="flex items-center justify-between mb-16">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue bg-brand-blue/5 px-4 py-1.5 rounded-full border border-brand-blue/10">Inspection Commande</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.id}</span>
                    </div>
                    <h2 className="font-heading font-black text-5xl text-slate-900 tracking-tighter mt-1">{selectedOrder.customer}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-5 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100 hover:scale-110 active:scale-95"
                  >
                    <XCircle size={28} />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  {/* Left Column: Logistics & Tracking */}
                  <div className="lg:col-span-12">
                     <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100">
                        <div className="flex items-center justify-between mb-10">
                          {["Traitement", "Préparation", "Expédition", "Livraison"].map((label, idx) => (
                            <div key={label} className="flex-1 flex items-center gap-4 relative">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-4 ${
                                statusConfig[selectedOrder.status].step > idx
                                  ? "bg-brand-green border-brand-green/20 text-white"
                                  : statusConfig[selectedOrder.status].step === idx
                                  ? "bg-white border-brand-green text-brand-green animate-pulse"
                                  : "bg-white border-slate-100 text-slate-300"
                              }`}>
                                {idx === 0 ? <CreditCard size={18} /> : idx === 1 ? <Package size={18} /> : idx === 2 ? <Truck size={18} /> : <CheckCircle2 size={18} />}
                              </div>
                              <div className="hidden xl:block">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${
                                  statusConfig[selectedOrder.status].step >= idx ? "text-slate-900" : "text-slate-300"
                                }`}>{label}</p>
                              </div>
                              {idx < 3 && <div className="flex-1 h-0.5 bg-slate-200 mx-4 hidden sm:block" />}
                            </div>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                              <User size={14} /> Informations Livraison
                            </h4>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                              <p className="font-black text-slate-900 text-sm">{selectedOrder.customer}</p>
                              <p className="text-xs text-slate-500 font-medium mt-1">+221 77 123 45 67</p>
                              <div className="mt-4 flex gap-3 text-brand-blue group cursor-pointer">
                                <MapPin size={16} className="shrink-0" />
                                <p className="text-xs font-bold leading-relaxed group-hover:underline">Villa 12, Rue de Thiong, Plateau, Dakar, Sénégal</p>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                              <CreditCard size={14} /> Mode de Paiement
                            </h4>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center text-brand-blue font-black text-xs">OM</div>
                                <div>
                                  <p className="text-sm font-black text-slate-900">Orange Money</p>
                                  <p className="text-[10px] text-emerald-600 font-black uppercase mt-0.5 tracking-tight flex items-center gap-1">
                                    <CheckCircle2 size={10} /> Transaction Confirmée
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                              <Package size={14} /> Résumé Financier
                            </h4>
                            <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-3">
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Sous-total</span>
                                <span className="text-slate-900">{(selectedOrder.amount - 2500).toLocaleString()} <span className="text-[10px]">FCFA</span></span>
                              </div>
                              <div className="flex items-center justify-between text-xs font-bold">
                                <span className="text-slate-400 uppercase tracking-widest">Livraison</span>
                                <span className="text-slate-900">2 500 <span className="text-[10px]">FCFA</span></span>
                              </div>
                              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Total</span>
                                <span className="text-lg font-black text-brand-blue">{selectedOrder.amount.toLocaleString()} <span className="text-xs tracking-normal">FCFA</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                     </div>
                  </div>

                  {/* Order Items Mockup */}
                  <div className="lg:col-span-12 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contenu du Colis</h4>
                    <div className="bg-white border border-slate-100 rounded-[32px] overflow-hidden">
                      <div className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 group">
                        <div className="flex items-center gap-6">
                          <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group-hover:scale-105 transition-transform">
                             <div className="w-full h-full bg-gradient-to-br from-brand-blue/5 to-brand-green/5 flex items-center justify-center">
                                <Package size={24} className="text-brand-blue/20" />
                             </div>
                          </div>
                          <div>
                            <p className="font-heading font-black text-slate-900 uppercase tracking-tight">Panier Tressé Artisanal</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Quantité: 2 · Réf: PT-2026</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900">12 450 FCFA</p>
                          <p className="text-[10px] text-brand-green font-black uppercase tracking-tight mt-1 flex items-center gap-1">En Stock</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 mt-16 pt-10 border-t border-slate-100">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-10 py-6 border-4 border-slate-100 rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-slate-400"
                  >
                    Fermer Inspection
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="flex-1 py-6 bg-slate-900 text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-900/40 flex items-center justify-center gap-3"
                  >
                    Marquer comme Expédié <ArrowRight size={18} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
