"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  TrendingUp, 
  Trash2, 
  Edit2, 
  Calendar,
  Tag,
  Timer,
  X,
  Zap,
  ArrowRight,
  BarChart3,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from "lucide-react";
import Image from "next/image";
import { products } from "@/data/products";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminFlashSalesPage() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const flashSales = [
    {
      id: "fs-1",
      title: "Spécial Ramadan 2026",
      discount: "25%",
      endsAt: "2026-04-15T23:59:59",
      active: true,
      productsCount: 12,
      image: products[0].image,
      revenue: "1.2M",
      conversions: "8.4%"
    },
    {
      id: "fs-2",
      title: "Vente Flash Artisanat",
      discount: "15%",
      endsAt: "2026-03-31T23:59:59",
      active: true,
      productsCount: 8,
      image: products[5].image,
      revenue: "450K",
      conversions: "5.2%"
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-12">
        {/* Premium Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green bg-brand-green/5 px-4 py-1.5 rounded-full border border-brand-green/10 flex items-center gap-2">
                <Zap size={12} className="fill-brand-green" /> Moteur de Promotions
              </span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mt-4">Ventes Flash</h1>
            <p className="text-slate-500 font-medium max-w-lg">Créez des campagnes d&apos;urgence pour stimuler vos ventes sur des périodes limitées.</p>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex bg-white p-1.5 rounded-[24px] border border-slate-100 shadow-sm">
                {["all", "active", "scheduled", "ended"].map((t) => (
                  <button 
                    key={t}
                    onClick={() => setActiveTab(t)}
                    className={`px-6 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === t 
                        ? "bg-slate-900 text-white shadow-lg shadow-black/10" 
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {t === "all" ? "Toutes" : t === "active" ? "Actives" : t === "scheduled" ? "Plannifiées" : "Terminées"}
                  </button>
                ))}
            </div>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-3 px-8 py-5 bg-brand-green text-white rounded-[28px] text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-green/30"
            >
              <Plus size={20} strokeWidth={3} /> Nouvelle Campagne
            </button>
          </div>
        </div>

        {/* Global Performance High-level Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { label: "Ventes Flash Totales", value: "48", trend: "+12%", icon: <TrendingUp size={20} />, color: "text-brand-green", bg: "bg-brand-green/10" },
               { label: "Revenu Généré", value: "8.4M FCFA", trend: "+24%", icon: <BarChart3 size={20} />, color: "text-brand-blue", bg: "bg-brand-blue/10" },
               { label: "Taux de Conversion Moy.", value: "6.8%", trend: "+1.2%", icon: <ArrowUpRight size={20} />, color: "text-amber-500", bg: "bg-amber-500/10" },
             ].map((stat, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500"
               >
                 <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}>
                        {stat.icon}
                    </div>
                    <span className="text-emerald-500 text-xs font-black">{stat.trend}</span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
               </motion.div>
             ))}
        </div>

        {/* Dynamic Campaign Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <AnimatePresence>
            {flashSales.map((sale, i) => (
              <motion.div
                key={sale.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.3 }}
                className="group bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 relative"
              >
                {/* Visual Section */}
                <div className="relative h-80 overflow-hidden">
                  <Image 
                    src={sale.image} 
                    alt={sale.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent" />
                  
                  <div className="absolute top-8 left-8">
                     <div className="px-6 py-3 bg-white/90 backdrop-blur-xl text-slate-900 text-[10px] font-black rounded-full shadow-2xl border border-white/50 flex items-center gap-2">
                        <Zap size={14} className="text-brand-green fill-brand-green" />
                        REMISE -{sale.discount}
                     </div>
                  </div>

                  <div className="absolute top-8 right-8">
                    <div className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl animate-pulse">
                      Live
                    </div>
                  </div>

                  <div className="absolute bottom-8 left-8 right-8">
                    <h3 className="text-white font-heading font-black text-4xl leading-tight tracking-tighter mb-4">{sale.title}</h3>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-widest">
                        <Clock size={16} className="text-brand-green" /> Termine le 15 Avr.
                      </div>
                      <div className="flex items-center gap-2 text-white/90 text-xs font-black uppercase tracking-widest">
                        <Tag size={16} className="text-brand-green" /> {sale.productsCount} Produits
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-10">
                   <div className="grid grid-cols-2 gap-8 mb-10">
                      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Revenu Généré</p>
                         <p className="text-xl font-black text-slate-900">{sale.revenue} <span className="text-xs">FCFA</span></p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Conversion</p>
                         <p className="text-xl font-black text-slate-900">{sale.conversions}</p>
                      </div>
                   </div>

                   <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                      <div className="flex -space-x-3">
                         {[1,2,3,4].map(idx => (
                           <div key={idx} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                             <Image src={products[idx].image} alt="p" width={40} height={40} className="object-cover" />
                           </div>
                         ))}
                         <div className="w-10 h-10 rounded-full border-2 border-white bg-brand-blue flex items-center justify-center text-white text-[10px] font-black">+{sale.productsCount - 4}</div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button className="p-4 rounded-[24px] bg-slate-50 text-slate-400 hover:text-brand-blue hover:bg-white hover:shadow-xl transition-all border border-slate-100">
                            <Edit2 size={20} />
                        </button>
                        <button className="p-4 rounded-[24px] bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-xl transition-all border border-slate-100">
                            <Trash2 size={20} />
                        </button>
                        <button className="px-8 py-4 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-slate-900/10">
                            Analytiques
                        </button>
                      </div>
                   </div>
                </div>
              </motion.div>
            ))}

            {/* Premium Create Action */}
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => setShowModal(true)}
              className="group bg-slate-50 rounded-[48px] border-4 border-dashed border-slate-200 hover:border-brand-green/30 hover:bg-brand-green/5 transition-all flex flex-col items-center justify-center gap-6 min-h-[500px]"
            >
               <div className="w-24 h-24 bg-white rounded-[32px] shadow-2xl flex items-center justify-center text-slate-300 group-hover:text-brand-green group-hover:scale-110 transition-all group-active:scale-95">
                  <Plus size={48} strokeWidth={3} />
               </div>
               <div className="text-center">
                  <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-brand-green transition-colors">Ajouter une nouvelle promotion</p>
                  <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">Configuration en 3 clics</p>
               </div>
            </motion.button>
          </AnimatePresence>
        </div>
      </div>

      {/* Redesigned Premium Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-2xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 40 }}
              className="relative w-full max-w-2xl bg-white rounded-[56px] border border-white/20 p-16 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.4)]"
            >
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                   <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue bg-brand-blue/5 px-4 py-1.5 rounded-full border border-brand-blue/10">Configuration Campagne</span>
                   <h2 className="font-heading font-black text-5xl text-slate-900 tracking-tighter mt-2">Nouvelle Vente</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-5 bg-slate-50 hover:bg-slate-100 rounded-[28px] text-slate-400 transition-all border border-slate-100 hover:scale-110 active:scale-95"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="space-y-10">
                <div className="group">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-4">Nom de la promotion</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Soldes d'Hiver Artisanat..." 
                    className="w-full px-8 py-6 rounded-[32px] bg-slate-50 border border-slate-100 text-lg font-black focus:outline-none focus:bg-white focus:border-brand-blue transition-all" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-4">Remise Globale (%)</label>
                    <div className="relative">
                       <Tag size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                        type="number" 
                        placeholder="25" 
                        className="w-full pl-16 pr-8 py-6 rounded-[32px] bg-slate-50 border border-slate-100 text-lg font-black focus:outline-none focus:bg-white focus:border-brand-blue transition-all" 
                       />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-4">Date limite</label>
                    <div className="relative">
                       <Calendar size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                       <input 
                        type="date" 
                        className="w-full pl-16 pr-8 py-6 rounded-[32px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:bg-white focus:border-brand-blue transition-all" 
                       />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Visibilité Boutique</p>
                        <div className="w-14 h-8 bg-brand-green rounded-full relative p-1 cursor-pointer">
                            <div className="w-6 h-6 bg-white rounded-full absolute right-1 shadow-sm" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        En activant cette option, un compte à rebours dynamique sera affiché sur la page d&apos;accueil et les fiches produits concernées.
                    </p>
                </div>

                <div className="pt-6 flex gap-6">
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="px-12 py-6 border-4 border-slate-100 rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-slate-400"
                  >
                    Abandonner
                  </button>
                  <button 
                    onClick={() => setShowModal(false)} 
                    className="flex-1 py-6 bg-slate-900 text-white rounded-[32px] font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-900/40 flex items-center justify-center gap-3"
                  >
                    Activer la Campagne <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
