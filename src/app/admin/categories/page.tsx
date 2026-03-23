"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  LayoutGrid, 
  Download, 
  MoreHorizontal,
  ArrowUpDown,
  Loader2,
  Layers,
  Upload,
  Package,
  TrendingUp,
  Box,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };
  
  const defaultForm = {
    name: "",
    slug: "",
    icon: "",
    image: "",
    order: 0,
    active: true
  };
  const [formData, setFormData] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, statsRes] = await Promise.all([
        api.get<any[]>("/categories"),
        api.get<any>("/categories/stats")
      ]);
      setCategories(catsRes);
      setStats(statsRes);
    } catch (error) {
      console.error("Failed to fetch categories data:", error);
      toast.error("Erreur lors de la récupération des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        setUploading(true);
        const res = await api.upload<{ url: string }>("/upload", selectedFile);
        imageUrl = res.url;
        setUploading(false);
      }

      const dataToSave = { ...formData, image: imageUrl };

      if (editingId) {
        await api.put(`/categories/${editingId}`, dataToSave);
        toast.success("Catégorie mise à jour");
      } else {
        await api.post("/categories", dataToSave);
        toast.success("Catégorie créée");
      }
      setShowModal(false);
      setSelectedFile(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save category:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`);
      setDeleteId(null);
      fetchData();
      toast.success("Catégorie supprimée");
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const openEditModal = (cat: any) => {
    setEditingId(cat.id);
    setSelectedFile(null);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon || "",
      image: cat.image || "",
      order: cat.order || 0,
      active: cat.active ?? true
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setSelectedFile(null);
    setShowModal(true);
  };

  const filtered = categories.filter((c: any) => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <LayoutGrid size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Gestion des Catégories</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{categories.length} segments au total</p>
            </div>
          </div>
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-600/10"
          >
            <Plus size={16} /> Nouvelle Catégorie
          </button>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
           <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
             <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <LayoutGrid size={16} className="sm:size-5" />
                </div>
                <span className="text-[7px] sm:text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-lg uppercase tracking-tight">Total</span>
             </div>
             <div>
               <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">{stats?.totalCategories || 0}</p>
               <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Catégories Actives</p>
             </div>
           </div>

           <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px]">
             <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Package size={16} className="sm:size-5" />
                </div>
                <span className="text-[7px] sm:text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-lg uppercase tracking-tight">Stocks</span>
             </div>
             <div>
               <p className="text-xl sm:text-3xl font-black text-slate-900 tracking-tighter">{stats?.totalProducts || 0}</p>
               <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none">Produits Totaux</p>
             </div>
           </div>

           <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between min-h-[110px] col-span-2 lg:col-span-1">
             <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={16} className="sm:size-5" />
                </div>
                <span className="text-[7px] sm:text-[10px] font-black text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-lg uppercase tracking-tight">Top</span>
             </div>
             <div>
               <p className="text-sm sm:text-xl font-black text-slate-900 tracking-tighter truncate uppercase">{stats?.topCategory?.name || "N/A"}</p>
               <p className="text-[8px] sm:text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5 leading-none">{stats?.topCategory?.count || 0} Produits reliés</p>
             </div>
           </div>
        </div>

        {/* Search */}
        <div className="relative group max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filtrer les catégories..."
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-emerald-600/5 focus:border-emerald-600 transition-all"
          />
        </div>

        {/* Mobile-Friendly Cards (Visible on mobile only) */}
        <div className="md:hidden space-y-4 pb-12">
          {filtered.map((cat: any, i: number) => {
            const isExpanded = expandedRows.has(cat.id);
            return (
              <motion.div
                key={cat.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Compact Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => toggleRow(cat.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-emerald-100 text-emerald-600"}`}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Catégorie</span>
                      <span className="font-heading font-black text-slate-900 tracking-tight text-sm">
                        {cat.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 relative shrink-0">
                      {cat.image ? (
                        <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-200">
                          <Box size={16} />
                        </div>
                      )}
                    </div>
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
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Lien (Slug)</span>
                             <span className="text-[11px] font-bold text-slate-500 break-all">{cat.slug}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Produits</span>
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-[11px] font-black ${cat.productCount > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-100 text-slate-400"}`}>
                              {cat.productCount || 0}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Ordre</span>
                            <span className="text-[11px] font-black text-slate-900">{cat.order}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Icône</span>
                            <span className="text-lg">{cat.icon || "—"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Statut</span>
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border ${cat.active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-500 border-slate-200"}`}>
                              {cat.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 flex items-center gap-2 border-t border-slate-100/50">
                           <button 
                             onClick={(e) => { e.stopPropagation(); openEditModal(cat); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-all shadow-sm"
                           >
                              <Edit2 size={14} /> Modifier
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setDeleteId(cat.id); }}
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
               <LayoutGrid size={32} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucune catégorie trouvée</p>
            </div>
          )}
        </div>

        {/* Categories Table (Desktop Only) */}
        <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Catégorie</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Produits</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Ordre</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Icône</th>
                  <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((cat: any, i: number) => (
                  <motion.tr 
                    key={cat.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 relative shrink-0">
                          {cat.image ? (
                            <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-200">
                              <Box size={20} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-heading font-black text-slate-900 tracking-tight text-sm uppercase">{cat.name}</span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic truncate max-w-[150px]">{cat.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center text-sm font-black text-slate-900">
                       <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${cat.productCount > 0 ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}>
                         {cat.productCount || 0}
                       </span>
                    </td>
                    <td className="px-4 py-4">
                       <div className="text-[10px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg w-fit">
                         {cat.order}
                       </div>
                    </td>
                    <td className="px-4 py-4">
                       <span className="text-xl">{cat.icon || "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-all">
                        <button onClick={() => openEditModal(cat)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-slate-50 rounded-lg transition-all border border-slate-100 shadow-sm" title="Modifier">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(cat.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border border-slate-100 shadow-sm"
                          title="Supprimer"
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
        </div>
      </div>

      {/* Modern Creation/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.98, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.98, opacity: 0, y: 10 }}
              className="relative bg-white rounded-[40px] p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading font-black text-3xl text-slate-900 tracking-tighter">{editingId ? "Édition" : "Nouvelle"} Catégorie</h2>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-1 ml-1">Configuration Segment</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3.5 rounded-2xl bg-slate-50 text-slate-400 hover:text-slate-900 transition-all border border-slate-100">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-8">
                {/* Image Upload Section */}
                <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all group relative">
                   {formData.image ? (
                     <div className="relative w-32 h-32 rounded-[24px] overflow-hidden shadow-xl ring-4 ring-white">
                        <Image src={formData.image} alt="Preview" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, image: "" }));
                            setSelectedFile(null);
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-xl shadow-lg hover:scale-110 active:scale-90 transition-all"
                        >
                          <X size={14} />
                        </button>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-white text-slate-400 rounded-[20px] flex items-center justify-center mb-4 shadow-sm border border-slate-100 group-hover:text-emerald-500 group-hover:scale-110 transition-all">
                           <Upload size={28} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Uploader une image</p>
                     </div>
                   )}
                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                   <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 w-full h-full cursor-pointer" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Désignation de la catégorie</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => {
                        const name = e.target.value;
                        setFormData({...formData, name, slug: name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '-')})
                      }}
                      placeholder="ex: Artisanat d'Exception"
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Lien permanent (Slug)</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({...formData, slug: e.target.value})}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 text-[10px] sm:text-[11px] font-black text-slate-400 focus:outline-none focus:border-emerald-500 transition-all uppercase tracking-[0.2em]"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Icône / Emoji</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={formData.icon}
                      onChange={e => setFormData({...formData, icon: e.target.value})}
                      placeholder="🏮"
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 text-base sm:text-xl font-bold focus:outline-none focus:border-emerald-500 transition-all text-center"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Ordre d'affichage</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={e => setFormData({...formData, order: parseInt(e.target.value)})}
                      className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:border-emerald-500 transition-all text-center"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 border border-slate-200 rounded-[20px] font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">
                    Annuler
                  </button>
                  <button type="submit" disabled={loading || uploading} className="flex-[2] py-4 bg-slate-900 text-white rounded-[20px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-900/20 disabled:opacity-50 hover:bg-slate-800 transition-all">
                    {loading || uploading ? (
                       <div className="flex items-center justify-center gap-3">
                          <Loader2 size={16} className="animate-spin" />
                          <span className="italic">Traitement...</span>
                       </div>
                    ) : (
                       editingId ? "Appliquer les modifications" : "Créer le segment"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.95, y: 20, opacity: 0 }} className="relative w-full max-w-sm bg-white rounded-[40px] p-10 text-center shadow-2xl border border-slate-100" >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-sm"><Trash2 size={32} /></div>
              <h2 className="font-heading font-black text-2xl text-slate-900 mb-2 tracking-tighter">Confirmation</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mb-8 leading-relaxed">
                 Cette action supprimera également le lien vers les produits associés.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setDeleteId(null)} className="py-4 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50">Abandonner</button>
                <button onClick={() => deleteId && handleDelete(deleteId)} className="py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:bg-rose-600">Supprimer</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
