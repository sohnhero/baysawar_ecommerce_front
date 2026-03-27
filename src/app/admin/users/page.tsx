"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  User,
  Package,
  Trash2, 
  Search, 
  Download, 
  MoreHorizontal,
  Phone,
  MapPin,
  Calendar,
  Mail,
  X,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { generateUsersReport, generateUsersCSV } from "@/lib/reports";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
       const [usersData, statsData] = await Promise.all([
         api.get<any[]>("/users"),
         api.get<any>("/users/stats")
       ]);
       setUsers(usersData);
       setStats(statsData);
    } catch (error) {
       console.error("Failed to fetch users data:", error);
    } finally {
       setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Role changing disabled as per request
  const handleToggleRole = async (user: any) => {
    /* Functionality removed */
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/users/${id}`);
      setDeleteId(null);
      fetchData();
      toast.success("Utilisateur supprimé");
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleExportReport = async () => {
    try {
      await generateUsersReport(users);
      toast.success("Liste des membres générée (PDF)");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Erreur lors de l'exportation");
    }
  };

  const filtered = users.filter((u: any) => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
                <Users size={18} />
              </div>
              Utilisateurs
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Gestion des membres de la plateforme</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportReport}
              className="hidden items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm"
            >
              <Download size={14} /> Rapport PDF
            </button>
            <button 
              onClick={() => {
                try {
                  generateUsersCSV(users);
                  toast.success("Données exportées (CSV)");
                } catch (e) {
                  toast.error("Erreur CSV");
                }
              }}
              className="hidden items-center gap-2 px-4 py-2.5 bg-slate-900 text-white border border-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
            >
              <Download size={14} /> CSV
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
           <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                 <div className="w-7 h-7 sm:w-8 sm:w-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                   <Users size={14} className="sm:size-4" />
                 </div>
                 <span className="text-[7px] sm:text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md uppercase tracking-tight">Total</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{stats?.totalUsers || 0}</p>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest">Utilisateurs</p>
              </div>
           </div>

           <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                  <User size={14} className="sm:size-4" />
                </div>
                <span className="text-[7px] sm:text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md uppercase tracking-tight">Clients</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{stats?.totalCustomers || 0}</p>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest">Comptes Clients</p>
              </div>
           </div>

           <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:w-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Package size={14} className="sm:size-4" />
                </div>
                <span className="text-[7px] sm:text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md uppercase tracking-tight">Flux</span>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-black text-slate-900 tracking-tighter">{stats?.totalOrders || 0}</p>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest">Commandes Totales</p>
              </div>
           </div>

           <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-[28px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-7 h-7 sm:w-8 sm:w-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center text-[8px] font-black">
                   FCFA
                </div>
                <span className="text-[7px] sm:text-[8px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-md uppercase tracking-tight">Ventes</span>
              </div>
              <div>
                <p className="text-base sm:text-xl font-black text-slate-900 tracking-tight leading-none truncate">
                  {stats?.totalRevenue?.toLocaleString() || 0}
                </p>
                <p className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Volume d'affaires</p>
              </div>
           </div>
        </div>

        <div className="relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:border-purple-600 transition-all shadow-sm"
          />
        </div>

        {/* Mobile-Friendly Cards (Visible on mobile only) */}
        <div className="md:hidden space-y-4 pb-12">
          {pagedUsers.map((user: any, i: number) => {
            const isExpanded = expandedRows.has(user.id);
            return (
              <motion.div
                key={user.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Compact Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => toggleRow(user.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20" : "bg-purple-100 text-purple-600"}`}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Nom</span>
                      <span className="font-heading font-black text-slate-900 tracking-tight text-sm">
                        {user.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1 block">Rôle</span>
                    <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border border-slate-200 bg-slate-50 text-slate-600`}>
                      {user.role}
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
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email</span>
                            <span className="text-[11px] font-bold text-slate-600 break-all">{user.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Téléphone</span>
                            <span className="text-[11px] font-bold text-slate-600">{user.phone || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Dépenses</span>
                            <span className="text-[11px] font-black text-brand-blue">{user.totalSpent?.toLocaleString() || 0} FCFA</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Commandes</span>
                            <span className="text-[11px] font-black text-slate-900">{user.orderCount || 0}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Adresse</span>
                            <div className="flex items-start gap-1">
                              <MapPin size={10} className="text-slate-300 mt-0.5 shrink-0" />
                              <span className="text-[11px] font-bold text-slate-500 line-clamp-2">{user.address || "Non renseignée"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 flex items-center gap-2 border-t border-slate-100/50">
                           <button 
                             onClick={(e) => { e.stopPropagation(); setSelectedUser(user); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-all shadow-sm"
                           >
                              <Users size={14} /> Détails
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setDeleteId(user.id); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                           >
                              <Trash2 size={14} /> Supprimer
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="py-12 text-center bg-white rounded-[32px] border-2 border-dashed border-slate-100">
               <Users size={32} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun utilisateur trouvé</p>
            </div>
          )}
        </div>

        {/* Compact Desktop-Only Users Table */}
        <div className="hidden md:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Utilisateur</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Email & Téléphone</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Localisation</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Commandes</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Ressources</th>
                  <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((user: any, i: number) => (
                  <motion.tr 
                    key={user.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-100 to-brand-blue/10 flex items-center justify-center text-brand-blue text-[10px] font-black shrink-0">
                          {user.name.substring(0,2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-heading font-black text-slate-900 tracking-tight text-xs leading-none">
                            {user.name}
                          </span>
                          <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            ID: {user.id.substring(0,8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col gap-1">
                         <span className="text-[10px] font-bold text-slate-600 break-all">{user.email}</span>
                         {user.phone && <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1"><Phone size={10} /> {user.phone}</span>}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                      {user.address ? (
                        <div className="flex items-start gap-1 max-w-[150px]">
                          <MapPin size={10} className="text-slate-300 mt-0.5 shrink-0" />
                          <span className="text-[10px] text-slate-500 font-bold line-clamp-2 leading-tight">{user.address}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] text-slate-300 italic">Non renseigné</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                       <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">{user.orderCount || 0}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                       <span className="text-[10px] font-black text-brand-blue">{user.totalSpent?.toLocaleString() || 0} FCFA</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all duration-300">
                        <button 
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-slate-400 hover:text-purple-600 hover:bg-slate-50 rounded-lg transition-all border border-slate-100 shadow-sm"
                          title="Détails"
                        >
                          <Users size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(user.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border border-slate-100 shadow-sm"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
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
      </div>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center" >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={24} />
              </div>
              <h2 className="font-heading font-black text-xl text-slate-900 mb-2">Confirmer ?</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8"> Cette action est définitive. Les données seront perdues. </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:bg-slate-50" > Annuler </button>
                <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20" > Supprimer </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 20, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[40px] border border-slate-100 shadow-2xl overflow-hidden" >
              {/* Header */}
              <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center text-xl font-black shadow-lg shadow-purple-600/20">
                    {selectedUser.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-heading font-black text-xl text-slate-900 leading-tight">{selectedUser.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                        selectedUser.role === 'admin' ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-slate-200 text-slate-600 border-slate-300"
                      }`}>
                        {selectedUser.role}
                      </span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">ID: {selectedUser.id}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="w-10 h-10 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm">
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Mail size={10} /> Adresse Email
                    </p>
                    <p className="text-xs font-black text-slate-700">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Phone size={10} /> Téléphone
                    </p>
                    <p className="text-xs font-black text-slate-700">{selectedUser.phone || "Non renseigné"}</p>
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin size={10} /> Adresse de Livraison
                    </p>
                    <p className="text-xs font-black text-slate-700 leading-relaxed">{selectedUser.address || "Aucune adresse enregistrée"}</p>
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={10} /> Membre depuis 
                    </p>
                    <p className="text-xs font-black text-slate-700">{new Date(selectedUser.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Additional Stats Placeholder */}
                <div className="p-6 rounded-3xl bg-purple-50/50 border border-purple-100/50 flex items-center justify-between">
                   <div className="text-center flex-1 border-r border-purple-100/50">
                      <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Commandes</p>
                      <p className="text-xl font-black text-purple-700">{selectedUser.orderCount || 0}</p>
                   </div>
                   <div className="text-center flex-1">
                      <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Total Dépensé</p>
                      <p className="text-xl font-black text-purple-700">{selectedUser.totalSpent?.toLocaleString() || 0} FCFA</p>
                   </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 border-t border-slate-100">
                 <button onClick={() => setSelectedUser(null)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                    Fermer le profil
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
