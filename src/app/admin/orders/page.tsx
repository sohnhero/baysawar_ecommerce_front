"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { recentOrders as initialOrders, RecentOrder } from "@/data/admin-stats";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { generateOrdersReport } from "@/lib/reports";

const statusConfig: Record<string, any> = {
  pending: {
    label: "En attente",
    color: "bg-slate-50 text-slate-600 border-slate-100",
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
    color: "bg-amber-50 text-amber-600 border-amber-100",
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

export default function AdminOrdersPage() {
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, statsData] = await Promise.all([
        api.get<any[]>("/orders/admin"),
        api.get<any>("/admin/stats")
      ]);
      setDbOrders(ordersData);
      setStats(statsData);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/orders/admin/${id}`, { status: newStatus });
      fetchData();
      if (selectedOrder && selectedOrder.dbId === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleExportReport = async () => {
    try {
      await generateOrdersReport(dbOrders);
      toast.success("Rapport des commandes généré");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Erreur lors de la génération du rapport");
    }
  };

  const orders = dbOrders.map(o => ({
    dbId: o.id,
    id: o.id.substring(0, 8).toUpperCase(),
    customer: o.user?.name || "Client Anonyme",
    date: new Date(o.createdAt).toLocaleDateString(),
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

  const quickStats = [
    { label: "En cours", count: stats?.ordersByStatus?.pending || 0, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Expédiées", count: stats?.ordersByStatus?.shipped || 0, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Livrées", count: stats?.ordersByStatus?.delivered || 0, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Annulées", count: stats?.ordersByStatus?.cancelled || 0, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Compact Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-green/10 text-brand-green rounded-xl flex items-center justify-center">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Commandes</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{orders.length} commandes au total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
              <Filter size={14} /> Filtres
            </button>
            <button 
              onClick={handleExportReport}
              className="hidden items-center gap-2 px-4 py-2 bg-brand-blue text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-blue/10"
            >
              <Download size={14} /> Rapport
            </button>
          </div>
        </div>

        {/* Dense Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((s, i) => (
            <div key={s.label || i} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className="text-xl font-black text-slate-900">{s.count}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <Package size={16} />
              </div>
            </div>
          ))}
        </div>

        {/* Compact Filters & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue" />
            <input
              type="text"
              placeholder="Rechercher client, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            {["all", "processing", "shipped", "delivered"].map((f, i) => (
              <button
                key={f || i}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "Toutes" : f === "processing" ? "En cours" : f === "shipped" ? "Expédiées" : "Livrées"}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile-Friendly Cards (Visible on mobile only) */}
        <div className="md:hidden space-y-4 pb-12">
          {pagedOrders.map((order: any, i: number) => {
            const isExpanded = expandedRows.has(order.dbId);
            const status = statusConfig[order.status] || { label: order.status, color: "bg-slate-50" };

            return (
              <motion.div
                key={order.dbId || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Compact Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => toggleRow(order.dbId)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "bg-brand-blue/10 text-brand-blue"}`}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Commande</span>
                      <span className="font-heading font-black text-slate-900 tracking-tight text-sm">
                        #{order.id}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 block">Statut</span>
                     <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight border ${status.color}`}>
                        {status.label}
                     </span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-slate-50 space-y-4 bg-slate-50/30">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Client</span>
                             <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                                   {order.customer[0]}
                                </div>
                                <span className="text-xs font-black text-slate-900">{order.customer}</span>
                             </div>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Date</span>
                            <span className="text-[11px] font-bold text-slate-700 font-heading">{order.date}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Montant</span>
                            <span className="text-sm font-black text-slate-900">
                              {order.amount.toLocaleString()} <span className="text-[9px] text-slate-400 font-bold">FCFA</span>
                            </span>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 flex items-center gap-2 border-t border-slate-100/50">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedOrder(order); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-green transition-all shadow-sm"
                           >
                              <Eye size={14} /> Voir Détails
                           </button>
                           {order.status !== 'cancelled' && order.status !== 'delivered' && (
                             <button
                               onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order.dbId, order.status === 'pending' ? 'shipped' : 'delivered'); }}
                               className="flex-[1.5] py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                             >
                               {order.status === 'pending' ? 'Expédier' : 'Livrer'} <ArrowRight size={14} />
                             </button>
                           )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div className="py-12 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
               <ShoppingCart size={32} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune commande trouvée</p>
            </div>
          )}
        </div>

        {/* Dense Orders Table (Desktop Only) */}
        <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Montant</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Détails</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map((order: any, i: number) => (
                  <motion.tr
                    key={order.dbId || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-brand-blue uppercase tracking-tight bg-brand-blue/5 px-2 py-1 rounded-lg border border-brand-blue/10">{order.id}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-[10px]">
                          {order.customer[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-slate-900 text-xs leading-tight">{order.customer}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-900 font-bold">{order.date}</span>
                    </td>
                    <td className="px-4 py-4 text-xs font-black text-slate-900">
                      {order.amount.toLocaleString()} <span className="text-[9px] text-slate-400 ml-1">FCFA</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${statusConfig[order.status]?.color || "bg-slate-50"}`}>
                        {statusConfig[order.status]?.icon && React.cloneElement(statusConfig[order.status].icon, { size: 10 })}
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-slate-400 hover:text-brand-green hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
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
        </div>

        {/* Compact Inspection Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedOrder(null)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                className="relative bg-white rounded-[32px] p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar"
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-brand-blue bg-brand-blue/5 px-3 py-1 rounded-full border border-brand-blue/10">Inspection</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{selectedOrder.id}</span>
                    </div>
                    <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight mt-1">{selectedOrder.customer}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"
                  >
                    <XCircle size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                   <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        {["Traitement", "Préparation", "Expédition", "Livraison"].map((label, idx) => (
                          <div key={label || idx} className="flex-1 flex items-center gap-2 relative">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shrink-0 ${
                              (statusConfig[selectedOrder.status]?.step || 0) > idx
                                ? "bg-brand-green border-brand-green/20 text-white"
                                : (statusConfig[selectedOrder.status]?.step || 0) === idx
                                ? "bg-white border-brand-green text-brand-green"
                                : "bg-white border-slate-100 text-slate-300"
                            }`}>
                              {idx === 0 ? <CreditCard size={14} /> : idx === 1 ? <Package size={14} /> : idx === 2 ? <Truck size={14} /> : <CheckCircle2 size={14} />}
                            </div>
                            <p className={`text-[8px] font-black uppercase tracking-widest hidden md:block ${
                              (statusConfig[selectedOrder.status]?.step || 0) >= idx ? "text-slate-900" : "text-slate-300"
                            }`}>{label}</p>
                            {idx < 3 && <div className="flex-1 h-px bg-slate-200 mx-2 hidden sm:block" />}
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <User size={10} /> Livraison
                          </h4>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="font-black text-slate-900 text-xs">{selectedOrder.customer}</p>
                            <p className="text-[10px] text-slate-500 font-medium mt-0.5">{selectedOrder.phone || "Pas de numéro"}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-2 leading-tight">{selectedOrder.address}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <CreditCard size={10} /> Paiement
                          </h4>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-brand-blue/5 rounded-lg flex items-center justify-center text-brand-blue font-black text-[10px]">
                                {selectedOrder.paymentMethod?.toUpperCase() || "COD"}
                              </div>
                              <div>
                                <p className="text-xs font-black text-slate-900">
                                  {selectedOrder.paymentMethod === 'om' ? 'Orange Money' : selectedOrder.paymentMethod === 'wave' ? 'Wave' : 'Paiement Livraison'}
                                </p>
                                <p className="text-[8px] text-emerald-600 font-black uppercase tracking-tight flex items-center gap-1">
                                  Confirmé
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                            <Package size={10} /> Finance
                          </h4>
                          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
                            <div className="flex items-center justify-between text-[10px] font-bold">
                              <span className="text-slate-400 uppercase tracking-widest">Articles</span>
                              <span className="text-slate-900">
                                {(selectedOrder.items?.reduce((acc: number, item: any) => acc + (parseFloat(item.price) * item.quantity), 0) || 0).toLocaleString()} FCFA
                              </span>
                            </div>
                            <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-widest text-slate-900">Total</span>
                              <span className="text-sm font-black text-brand-blue">{selectedOrder.amount.toLocaleString()} FCFA</span>
                            </div>
                          </div>
                        </div>
                      </div>
                   </div>

                  <div className="space-y-3">
                    <h4 className="text-[8px] font-black uppercase tracking-widest text-slate-400 ml-1">Contenu</h4>
                    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-50">
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <div key={item.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden">
                              {item.product?.image ? (
                                <Image src={item.product.image} alt={item.product.name} width={48} height={48} className="object-cover" />
                              ) : (
                                <Package size={18} className="text-slate-300" />
                              )}
                            </div>
                            <div>
                              <p className="font-heading font-black text-slate-900 uppercase text-[10px] tracking-tight">{item.product?.name || "Produit inconnu"}</p>
                              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Quantité: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-black text-slate-900 text-xs">{parseFloat(item.price).toLocaleString()} FCFA</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="px-6 py-3 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400"
                    >
                      Fermer
                    </button>
                    {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedOrder.dbId, selectedOrder.status === 'pending' ? 'shipped' : 'delivered')}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2"
                      >
                        {selectedOrder.status === 'pending' ? 'Expédier' : 'Livrer'} <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
