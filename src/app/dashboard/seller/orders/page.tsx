"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Package,
  CreditCard,
  User,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  Filter,
  MapPin
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";

const statusConfig: Record<string, any> = {
  pending: {
    label: "En attente",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: <Clock size={12} />,
    step: 1
  },
  delivered: {
    label: "Livré",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: <CheckCircle2 size={12} />,
    step: 5
  },
  shipped: {
    label: "Expédié",
    color: "bg-blue-50 text-blue-600 border-blue-100",
    icon: <Truck size={12} />,
    step: 4
  },
  processing: {
    label: "En cours",
    color: "bg-indigo-50 text-indigo-600 border-indigo-100",
    icon: <Clock size={12} />,
    step: 3
  },
  cancelled: {
    label: "Annulé",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    icon: <XCircle size={12} />,
    step: 0
  },
};

export default function SellerOrdersPage() {
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const ordersData = await api.get<any[]>("/orders/seller");
      setDbOrders(ordersData);
    } catch (error) {
      console.error("Failed to fetch seller orders:", error);
      toast.error("Erreur de chargement des commandes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      toast.info("Mise à jour du statut...", { autoClose: 1000 });
      await api.patch(`/orders/seller/${id}`, { status: newStatus });
      fetchData();
      if (selectedOrder && selectedOrder.dbId === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      toast.success("Statut mis à jour");
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  const orders = dbOrders.map(o => ({
    dbId: o.id,
    id: o.id.substring(0, 8).toUpperCase(),
    customer: o.user?.name || "Client",
    date: new Date(o.createdAt).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: parseFloat(o.totalAmount),
    status: o.status,
    items: o.items,
    phone: o.phone,
    address: o.shippingAddress,
    paymentMethod: o.paymentMethod
  }));

  const filteredOrders = orders.filter((order: any) => {
    const matchesSearch = order.customer.toLowerCase().includes(search.toLowerCase()) ||
                          order.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const pagedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <ShoppingCart size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Mes Ventes</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{orders.length} commandes en rapport avec vos produits</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
        <div className="relative flex-1 group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Rechercher par client ou #ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 text-xs font-bold focus:outline-none focus:border-indigo-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {["all", "pending", "processing", "shipped", "delivered"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === f
                  ? "bg-slate-900 text-white"
                  : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "Toutes" : statusConfig[f]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
             <Loader2 size={32} className="animate-spin text-indigo-500" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chargement de vos commandes...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <ShoppingCart size={32} className="text-slate-200" />
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-2">Aucune commande</h3>
             <p className="text-xs text-slate-400 font-medium max-w-[240px] leading-relaxed mb-6 uppercase tracking-tight">
               Vous n'avez pas encore de commandes pour vos produits. Elles apparaîtront ici dès qu'un client passera commande.
             </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-50">
              {pagedOrders.map((order) => {
                const status = statusConfig[order.status] || { label: order.status, color: "bg-slate-50" };
                const isExpanded = expandedRows.has(order.dbId);
                return (
                  <div key={order.dbId} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs">
                          {order.customer[0]}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-xs">{order.customer}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">#{order.id}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tight border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                        <p className="text-[10px] text-slate-600 font-bold">{order.date}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 text-right">Montant</p>
                        <p className="text-xs text-indigo-600 font-black text-right">{order.amount.toLocaleString()} F</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                       <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-slate-100 flex items-center justify-center gap-2"
                      >
                        <Eye size={14} /> Voir Détails
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Commande</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Client</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pagedOrders.map((order) => {
                    const status = statusConfig[order.status] || { label: order.status, color: "bg-slate-50" };
                    return (
                      <tr key={order.dbId} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">#{order.id}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-black text-[10px]">
                              {order.customer[0]}
                            </div>
                            <span className="font-black text-slate-900 text-xs">{order.customer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-slate-500 font-bold">{order.date}</span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${status.color}`}>
                            {status.icon && React.cloneElement(status.icon, { size: 10 })}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => setSelectedOrder(order)}
                              className="p-2.5 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-slate-50 flex items-center justify-between gap-4">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                  Page <span className="text-slate-900 font-black">{currentPage}</span> sur <span className="text-slate-900 font-black">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="p-2 rounded-xl bg-slate-50 text-slate-400 hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative bg-white rounded-[40px] p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Détails Vente</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{selectedOrder.id}</span>
                  </div>
                  <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">{selectedOrder.customer}</h2>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"><XCircle size={20} /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><MapPin size={12} /> Livraison</h4>
                   <p className="font-black text-slate-900 text-sm mb-1">{selectedOrder.customer}</p>
                   <p className="text-xs text-slate-500 font-bold mb-3">{selectedOrder.phone}</p>
                   <p className="text-xs font-medium text-slate-400 leading-relaxed bg-white p-3 rounded-xl border border-slate-100 italic">{selectedOrder.address}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                   <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><CreditCard size={12} /> Paiement</h4>
                   <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100">
                      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 font-black text-[10px]">{selectedOrder.paymentMethod?.toUpperCase()}</div>
                      <div>
                        <p className="text-xs font-black text-slate-900">{selectedOrder.paymentMethod === 'om' ? 'Orange Money' : selectedOrder.paymentMethod === 'wave' ? 'Wave' : 'Cash à la livraison'}</p>
                        <p className="text-[9px] text-emerald-600 font-black uppercase tracking-widest mt-0.5">Statut: Encaissé</p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Articles de votre boutique</h4>
                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden divide-y divide-slate-50">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-100 shadow-sm shrink-0">
                          {item.product?.image && <Image src={item.product.image} alt={item.product.name} fill className="object-cover" />}
                        </div>
                        <div>
                          <p className="font-heading font-black text-slate-900 uppercase text-[11px] tracking-tight">{item.product?.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Qté: {item.quantity} × {parseFloat(item.price).toLocaleString()} F</p>
                        </div>
                      </div>
                      <p className="font-black text-indigo-600 text-sm">{(item.quantity * parseFloat(item.price)).toLocaleString()} <span className="text-[10px]">FCFA</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                <div className="flex-1 space-y-2">
                   <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Mettre à jour le statut</label>
                   <div className="flex gap-2">
                      {["pending", "processing", "shipped", "delivered"].map((st) => (
                        <button 
                          key={st}
                          onClick={() => handleUpdateStatus(selectedOrder.dbId, st)}
                          className={`flex-1 py-3 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all border ${
                            selectedOrder.status === st 
                            ? "bg-slate-900 text-white border-slate-900" 
                            : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"
                          }`}
                        >
                          {statusConfig[st]?.label || st}
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
