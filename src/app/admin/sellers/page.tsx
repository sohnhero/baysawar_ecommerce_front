"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  MoreVertical,
  Filter,
  User,
  MapPin,
  Calendar,
  AlertCircle,
  Loader2,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import AdminLayout from "@/components/admin/AdminLayout";

const statusConfig: Record<string, any> = {
  approved: {
    label: "Approuvé",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    icon: <CheckCircle2 size={12} />,
  },
  pending: {
    label: "En attente",
    color: "bg-amber-50 text-amber-600 border-amber-100",
    icon: <Clock size={12} />,
  },
  rejected: {
    label: "Refusé",
    color: "bg-rose-50 text-rose-600 border-rose-100",
    icon: <XCircle size={12} />,
  },
};

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await api.get<any[]>("/artisans");
      setSellers(data);
    } catch (error) {
      console.error("Failed to fetch sellers:", error);
      toast.error("Erreur de chargement des vendeurs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id: string, status: string, adminNotes: string = "") => {
    try {
      toast.info("Mise à jour...", { autoClose: 1000 });
      await api.patch(`/artisans/${id}/status`, { status, adminNotes });
      fetchData();
      if (selectedSeller && selectedSeller.id === id) {
        setSelectedSeller({ ...selectedSeller, status });
      }
      toast.success(status === 'approved' ? "Vendeur approuvé !" : "Vendeur refusé");
    } catch (error) {
      toast.error("Erreur de mise à jour");
    }
  };

  const filteredSellers = sellers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                          s.specialty.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || s.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Vendeurs</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Gérer les demandes et profils partenaires</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          <div className="relative flex-1 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Rechercher une boutique, une spécialité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === f
                    ? "bg-slate-900 text-white"
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {f === "all" ? "Tous" : statusConfig[f]?.label || f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[400px] gap-4">
               <Loader2 size={32} className="animate-spin text-emerald-500" />
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chargement des profils...</p>
            </div>
          ) : filteredSellers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <Store size={32} className="text-slate-200" />
               </div>
               <h3 className="text-lg font-black text-slate-900 mb-2">Aucun vendeur</h3>
               <p className="text-xs text-slate-400 font-medium max-w-[240px] leading-relaxed mb-6 uppercase tracking-tight">
                 Aucun profil vendeur ne correspond à vos critères de recherche.
               </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse border-spacing-0">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Boutique</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Spécialité</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Utilisateur</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                    <th className="px-6 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredSellers.map((seller) => {
                    const status = statusConfig[seller.status] || { label: seller.status, color: "bg-slate-50" };
                    return (
                      <tr key={seller.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-[10px] relative">
                               {seller.name[0]}
                               <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${seller.status === 'approved' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            </div>
                            <span className="font-heading font-black text-slate-900 text-xs tracking-tight uppercase">{seller.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="text-xs text-slate-500 font-bold">{seller.specialty}</span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-900">{seller.user?.name || "N/A"}</span>
                            <span className="text-[9px] text-slate-400 font-bold">{seller.user?.email || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${status.color}`}>
                            {status.icon && React.cloneElement(status.icon, { size: 10 })}
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button 
                            onClick={() => setSelectedSeller(seller)}
                            className="p-2.5 text-slate-400 hover:text-emerald-600 bg-slate-50 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        <AnimatePresence>
          {selectedSeller && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedSeller(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative bg-white rounded-[40px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl no-scrollbar">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xl border border-emerald-100 shadow-sm">
                        {selectedSeller.name[0]}
                      </div>
                      <div>
                        <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight uppercase">{selectedSeller.name}</h2>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">{selectedSeller.specialty}</p>
                      </div>
                    </div>
                    <button onClick={() => setSelectedSeller(null)} className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"><XCircle size={20} /></button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><User size={12} /> Contact Information</h4>
                       <p className="font-black text-slate-900 text-sm mb-1">{selectedSeller.user?.name}</p>
                       <p className="text-xs text-slate-500 font-bold mb-1">{selectedSeller.user?.email}</p>
                       <p className="text-xs text-slate-500 font-bold">{selectedSeller.user?.phone || selectedSeller.location}</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                       <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2"><Calendar size={12} /> Détails Inscription</h4>
                       <p className="text-xs font-bold text-slate-500 mb-2">Inscrit le: <span className="text-slate-900">{new Date(selectedSeller.createdAt).toLocaleDateString()}</span></p>
                       <p className="text-xs font-bold text-slate-500">Statut actuel: <span className={`uppercase text-[10px] ml-1 font-black ${selectedSeller.status === 'approved' ? 'text-emerald-600' : 'text-amber-600'}`}>{selectedSeller.status}</span></p>
                    </div>
                 </div>

                 <div className="space-y-4 mb-10">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Biographie / Description de la boutique</h4>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 relative">
                       <div className="absolute top-4 right-4 opacity-5"><Store size={40} /></div>
                       <p className="text-sm font-medium text-slate-600 leading-relaxed indent-4">{selectedSeller.bio}</p>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
                    {selectedSeller.status !== 'approved' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedSeller.id, 'approved')}
                        className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Approuver le compte
                      </button>
                    )}
                    {selectedSeller.status !== 'rejected' && (
                      <button 
                        onClick={() => handleUpdateStatus(selectedSeller.id, 'rejected')}
                        className="flex-1 py-4 border border-rose-100 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Refuser l&apos;accès
                      </button>
                    )}
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
