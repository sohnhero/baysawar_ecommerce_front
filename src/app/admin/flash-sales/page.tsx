"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Filter, MoreVertical, Edit3, Trash2, Calendar, Clock, ArrowRight, Zap, CheckCircle2, ChevronRight, Package, Tag, AlertCircle, X, CheckCircle, ArrowUpRight, TrendingUp, BarChart3 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminFlashSalesPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [flashSales, setFlashSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    active: false,
    productIds: [] as string[],
    discountPercent: 20,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const [campaignsData, productsData] = await Promise.all([
        api.get<any[]>("/flash-sales"),
        api.get<any[]>("/products")
      ]);
      setFlashSales(campaignsData);
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch flash sales data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDiscountChange = (discount: number) => {
    setFormData(prev => ({ ...prev, discountPercent: discount }));
  };

  const getCalculatedPrice = (productId: string) => {
    const p = products.find(prod => prod.id === productId);
    if (!p) return 0;
    return Math.round(parseFloat(p.price) * (1 - formData.discountPercent / 100));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.productIds.length === 0) {
      toast.warning("Sélectionnez au moins un produit");
      return;
    }

    try {
      const items = formData.productIds.map(pid => ({
        productId: pid,
        discountPercent: formData.discountPercent,
        flashPrice: getCalculatedPrice(pid).toString(),
      }));

      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: formData.startTime ? new Date(formData.startTime).toISOString() : new Date().toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        active: formData.active,
        items,
      };

      if (editId) {
        await api.put(`/flash-sales/${editId}`, payload);
        toast.success("Campagne mise à jour");
      } else {
        await api.post("/flash-sales", payload);
        toast.success("Nouvelle campagne créée");
      }
      
      setShowModal(false);
      setEditId(null);
      setFormData({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        active: false,
        productIds: [],
        discountPercent: 20,
      });
      fetchSales();
    } catch (error) {
      console.error("Failed to save flash sale:", error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const toggleActive = async (campaign: any) => {
    try {
      await api.put(`/flash-sales/${campaign.id}`, { active: !campaign.active });
      fetchSales();
      toast.success(campaign.active ? "Campagne désactivée" : "Campagne activée (les autres sont désactivées)");
    } catch (error) {
      toast.error("Erreur lors de la modification");
    }
  };

  const openEdit = (campaign: any) => {
    setEditId(campaign.id);
    setFormData({
      title: campaign.title,
      description: campaign.description || "",
      startTime: new Date(campaign.startTime).toISOString().slice(0, 16),
      endTime: new Date(campaign.endTime).toISOString().slice(0, 16),
      active: campaign.active,
      productIds: campaign.items?.map((i: any) => i.productId) || [],
      discountPercent: campaign.items?.[0]?.discountPercent || 20,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/flash-sales/${id}`);
      setDeleteId(null);
      fetchSales();
      toast.success("Promotion supprimée");
    } catch (error) {
      console.error("Failed to delete flash sale:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredSales = flashSales.filter(sale => {
    const now = new Date();
    const end = new Date(sale.endTime);
    if (activeTab === "active") return sale.active && end > now;
    if (activeTab === "ended") return end <= now;
    return true;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Compact Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-black uppercase tracking-widest text-brand-green bg-brand-green/5 px-3 py-1 rounded-full border border-brand-green/10 flex items-center gap-1.5">
                <Zap size={10} className="fill-brand-green" /> Promotions
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Ventes Flash</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Campagnes en cours et plannifiées</p>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="flex bg-white p-1 rounded-2xl border border-slate-100">
                {["all", "active", "ended"].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                        activeTab === t 
                        ? "bg-slate-900 text-white" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {t === "all" ? "Toutes" : t === "active" ? "Actives" : "Terminées"}
                  </button>
                ))}
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-brand-green text-white rounded-2xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-green/20"
            >
              <Plus size={16} strokeWidth={3} /> Nouvelle Campagne
            </button>
          </div>
        </div>

        {/* Compact Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { label: "Ventes Flash", value: "48", trend: "+12%", icon: <TrendingUp size={16} />, color: "text-brand-green", bg: "bg-brand-green/10" },
               { label: "Revenu", value: "8.4M FCFA", trend: "+24%", icon: <BarChart3 size={16} />, color: "text-brand-blue", bg: "bg-brand-blue/10" },
               { label: "Conversion", value: "6.8%", trend: "+1.2%", icon: <ArrowUpRight size={16} />, color: "text-amber-500", bg: "bg-amber-500/10" },
             ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.05 }}
                 className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between"
               >
                 <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                 </div>
                 <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    {stat.icon}
                 </div>
               </motion.div>
             ))}
        </div>

        {/* Compact Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          <AnimatePresence mode="wait">
            {loading ? (
               <div key="loading" className="col-span-full py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-green mx-auto mb-4"></div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[8px]">Chargement...</p>
               </div>
            ) : filteredSales.length === 0 ? (
               <div key="empty" className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Zap size={32} className="mx-auto text-slate-200 mb-4" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[8px]">Aucune campagne</p>
               </div>
            ) : (
               filteredSales.map((campaign, i) => (
                  <motion.div 
                    key={campaign.id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-brand-blue/10 transition-all duration-500"
                  >
                   <div className="relative h-48 bg-slate-100 overflow-hidden">
                     {campaign.items?.[0]?.product?.image ? (
                       <Image src={campaign.items[0].product.image} alt={campaign.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                         <Zap size={40} className="text-slate-200" />
                       </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                     
                     <div className="absolute bottom-4 left-4 right-4">
                       <h3 className="text-white font-heading font-black text-lg leading-tight tracking-tight mb-2 line-clamp-1">{campaign.title}</h3>
                       <div className="flex items-center gap-3">
                         <span className={`px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest ${
                           !campaign.active ? "bg-slate-500/50 text-white backdrop-blur-md" :
                           new Date() < new Date(campaign.startTime) ? "bg-brand-blue text-white" :
                           new Date() > new Date(campaign.endTime) ? "bg-amber-500 text-white" :
                           "bg-brand-green text-white"
                         }`}>
                           {!campaign.active ? "Inactif" :
                            new Date() < new Date(campaign.startTime) ? "Programmé" :
                            new Date() > new Date(campaign.endTime) ? "Expiré" : "Live"}
                         </span>
                         <span className="text-white/70 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                           <Clock size={10} /> {new Date(campaign.endTime).toLocaleDateString()}
                         </span>
                       </div>
                     </div>
                   </div>

                   <div className="p-6">
                     <div className="mb-4">
                       <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Produits concernés ({campaign.items?.length || 0})</span>
                       <div className="flex flex-wrap gap-2">
                         {campaign.items?.slice(0, 3).map((item: any) => (
                           <span key={item.id} className="text-[9px] font-bold bg-slate-50 text-slate-600 px-2 py-1 rounded-lg border border-slate-100">
                             {item.product?.name}
                           </span>
                         ))}
                         {campaign.items?.length > 3 && (
                           <span className="text-[9px] font-bold bg-slate-50 text-slate-400 px-2 py-1 rounded-lg">+{campaign.items.length - 3}</span>
                         )}
                       </div>
                     </div>

                     <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                        <button 
                             onClick={() => toggleActive(campaign)}
                             className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${campaign.active ? "bg-brand-green/10 text-brand-green border-brand-green/20" : "bg-slate-50 text-slate-400 border-slate-100"}`}
                        >
                          <CheckCircle2 size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">{campaign.active ? "Désactiver" : "Activer"}</span>
                        </button>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(campaign)} className="p-2.5 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 rounded-xl transition-all"><Edit3 size={16} /></button>
                          <button onClick={() => setDeleteId(campaign.id)} className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        </div>
                       </div>
                    </div>
                  </motion.div>
                ))
            )}

            <motion.button 
              key="add-new-sale-button"
              onClick={() => setShowModal(true)}
              className="group bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 hover:border-brand-green/30 hover:bg-brand-green/5 transition-all flex flex-col items-center justify-center gap-4 min-h-[280px]"
            >
               <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-brand-green transition-all">
                  <Plus size={24} strokeWidth={3} />
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest group-hover:text-brand-green">Nouvelle Campagne</p>
               </div>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* Compact Creation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl" >
              <div className="flex items-center justify-between mb-6">
                <div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-brand-blue bg-brand-blue/5 px-3 py-1 rounded-full border border-brand-blue/10">Configuration</span>
                   <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight mt-1">Nouvelle Vente</h2>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-400 transition-all border border-slate-100" >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Titre</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Soldes..." className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:bg-white focus:border-brand-blue transition-all" />
                </div>
                
                 <div>
                   <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Produit(s) à inclure</label>
                   <div className="max-h-32 overflow-y-auto rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-2">
                     {products.map((p) => (
                       <label key={p.id} className="flex items-center gap-3 cursor-pointer group">
                         <input 
                           type="checkbox" 
                           checked={formData.productIds.includes(p.id)}
                           onChange={(e) => {
                             const ids = e.target.checked 
                               ? [...formData.productIds, p.id]
                               : formData.productIds.filter(id => id !== p.id);
                             setFormData({...formData, productIds: ids});
                           }}
                           className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                         />
                         <span className="text-[10px] font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{p.name} <span className="text-slate-400">({p.price} FCFA)</span></span>
                       </label>
                     ))}
                   </div>
                 </div>

                 {formData.productIds.length > 0 && (
                   <div className="bg-brand-blue/5 border border-brand-blue/10 rounded-xl p-3">
                     <p className="text-[8px] font-black uppercase tracking-widest text-brand-blue mb-2">Aperçu des prix</p>
                     <div className="space-y-1">
                       {formData.productIds.map(pid => {
                         const p = products.find(x => x.id === pid);
                         return (
                           <div key={pid} className="flex justify-between items-center text-[9px] font-bold">
                             <span className="text-slate-500 truncate max-w-[150px]">{p?.name}</span>
                             <div className="flex items-center gap-2">
                               <span className="text-slate-400 line-through">{p?.price}</span>
                               <span className="text-brand-green">{getCalculatedPrice(pid)} FCFA</span>
                             </div>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 )}
 
                 <div className="grid grid-cols-1 gap-4">
                   <div>
                     <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Remise globale (%)</label>
                     <input type="number" required min="1" max="99" value={formData.discountPercent} onChange={e => handleDiscountChange(parseInt(e.target.value))} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:bg-white focus:border-brand-blue transition-all" />
                   </div>
                 </div>
 
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Début (Optionnel)</label>
                     <input type="datetime-local" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black focus:outline-none focus:bg-white focus:border-brand-blue transition-all" />
                   </div>
                   <div>
                     <label className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Date et Heure limite</label>
                     <input type="datetime-local" required value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black focus:outline-none focus:bg-white focus:border-brand-blue transition-all" />
                   </div>
                 </div>

                 <div className="flex items-center gap-3 px-1">
                   <input 
                      type="checkbox" 
                      id="campaign-active"
                      checked={formData.active} 
                      onChange={e => setFormData({...formData, active: e.target.checked})} 
                      className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
                   />
                   <label htmlFor="campaign-active" className="text-[10px] font-bold text-slate-600 cursor-pointer">Activer cette campagne immédiatement</label>
                 </div>
 
                <div className="pt-4 flex gap-4">
                  <button type="button" onClick={() => { setShowModal(false); setEditId(null); }} className="px-6 py-3 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400" > Abandonner </button>
                  <button type="submit" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-black/10 flex items-center justify-center gap-2" > {editId ? "Mettre à jour" : "Activer"} <ArrowRight size={14} /> </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-100 shadow-2xl p-8 text-center" >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={24} />
              </div>
              <h2 className="font-heading font-black text-xl text-slate-900 mb-2">Confirmer ?</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8"> Cette action supprimera la promotion définitivement. </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-3 border border-slate-100 rounded-xl font-black text-[9px] uppercase tracking-widest text-slate-400 hover:bg-slate-50" > Annuler </button>
                <button onClick={() => deleteId && handleDelete(deleteId)} className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20" > Supprimer </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
