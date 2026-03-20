"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Search, 
  Package, 
  Download, 
  Filter,
  MoreHorizontal,
  ArrowUpDown,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { products } from "@/data/products";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Tous" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Enhanced Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              <div className="w-12 h-12 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center">
                <Package size={24} />
              </div>
              Catalogue Produits
            </h1>
            <p className="text-slate-500 font-medium ml-16">Gérez et optimisez vos {products.length} trésors artisanaux.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Download size={16} /> Export CSV
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-8 py-3.5 bg-brand-green text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-green/20"
            >
              <Plus size={18} /> Nouveau Produit
            </button>
          </div>
        </div>

        {/* Advanced Filters & Search Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 relative group">
            <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, SKU ou mot-clé..."
              className="w-full pl-14 pr-6 py-5 rounded-[24px] bg-white border border-slate-200 text-sm focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all shadow-sm"
            />
          </div>
          <div className="lg:col-span-5 flex bg-white p-1.5 rounded-[24px] border border-slate-200 shadow-sm overflow-x-auto no-scrollbar">
            {["Tous", "Artisanat", "Alimentaire", "Rupture"].map((cat) => (
              <button 
                key={cat} 
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 px-5 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" 
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Premium Products Table */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden border-separate">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Produit & Détails</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Catégorie</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    Prix <ArrowUpDown size={12} />
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut</th>
                  <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((product, i) => (
                  <motion.tr 
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50 relative group/img">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover group-hover/img:scale-110 transition-transform duration-700" 
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="font-heading font-black text-slate-900 tracking-tight text-base leading-tight">
                            {product.name}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">SKU-{product.id.substring(0,8)}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] text-brand-blue font-black uppercase tracking-tight">{product.reviewCount} avis</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-4 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest border border-slate-200/50">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-heading font-black text-slate-900 text-lg">
                      {product.price.toLocaleString()} <span className="text-[10px] text-slate-400 font-bold tracking-normal uppercase ml-1">FCFA</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tight border ${
                        product.inStock 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm shadow-emerald-500/5" 
                          : "bg-rose-50 text-rose-700 border-rose-100"
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
                        {product.inStock ? "Actif & Stock" : "Rupture"}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                        <Link href={`/shop/product/${product.id}`} target="_blank" className="p-3 text-slate-400 hover:text-brand-blue hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100">
                          <ExternalLink size={18} />
                        </Link>
                        <button className="p-3 text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(product.id)}
                          className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white hover:shadow-xl rounded-2xl transition-all border border-transparent hover:border-slate-100"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <button className="group-hover:hidden text-slate-300">
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Mockup */}
          <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Affichage de 1-{filtered.length} sur {products.length} produits</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(n => (
                <button key={n} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${n === 1 ? "bg-brand-blue text-white shadow-lg shadow-brand-blue/20" : "bg-white border border-slate-100 text-slate-400 hover:bg-slate-50"}`}>
                  {n}
                </button>
              ))}
              <div className="w-10 h-10 flex items-center justify-center text-slate-300">
                <ChevronRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Add Product Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              className="relative bg-white rounded-[48px] border border-white/20 p-12 w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_32px_120px_-20px_rgba(0,0,0,0.3)] no-scrollbar"
            >
              <div className="flex items-center justify-between mb-16">
                <div className="space-y-2">
                  <h2 className="font-heading font-black text-5xl text-slate-900 tracking-tighter">Nouveau Produit</h2>
                  <p className="text-slate-400 font-bold uppercase text-xs tracking-[0.2em] ml-1">Configuration du Catalogue Premium</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-5 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100 hover:scale-110 active:scale-95"
                >
                  <X size={28} />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Media Section */}
                <div className="lg:col-span-5 space-y-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Média Principal</h4>
                    <div className="aspect-[4/5] rounded-[40px] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center group hover:border-brand-blue/30 hover:bg-brand-blue/5 transition-all cursor-pointer relative overflow-hidden shadow-inner">
                      <div className="text-center p-12 group-hover:scale-110 transition-transform duration-700">
                        <div className="w-24 h-24 bg-white shadow-2xl shadow-slate-200/50 text-brand-blue rounded-[32px] flex items-center justify-center mx-auto mb-8 group-hover:bg-brand-blue group-hover:text-white transition-all">
                          <Plus size={40} />
                        </div>
                        <p className="text-xl font-black text-slate-900 tracking-tight">Glissez l&apos;image ici</p>
                        <p className="text-[10px] text-slate-400 mt-4 font-black uppercase tracking-widest">PNG, JPG jusqu&apos;à 10MB</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Galerie Additionnelle</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square rounded-[20px] bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center hover:border-brand-blue/30 transition-all cursor-pointer group">
                          <Plus size={20} className="text-slate-300 group-hover:text-brand-blue transition-colors" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-7 space-y-10">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Nom du produit</label>
                      <input
                        type="text"
                        placeholder="Ex: Panier Tressé de Casamance"
                        className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Catégorie</label>
                      <select className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all shadow-sm cursor-pointer">
                        <option>Artisanat</option>
                        <option>Alimentaire</option>
                        <option>Mode</option>
                        <option>Décoration</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Artisan Référent</label>
                      <select className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all shadow-sm cursor-pointer">
                        <option>Moussa Diouf</option>
                        <option>Fatou Sow</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Prix de Vente (FCFA)</label>
                      <input
                        type="number"
                        placeholder="25000"
                        className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Quantité Initiale</label>
                      <input
                        type="number"
                        placeholder="20"
                        className="w-full px-8 py-5 rounded-[24px] bg-slate-50 border border-slate-100 text-sm font-black focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all shadow-sm"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3 block ml-1">Storytelling & Description</label>
                      <textarea
                        rows={6}
                        placeholder="Racontez l'histoire derrière cet objet..."
                        className="w-full px-8 py-6 rounded-[32px] bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:ring-8 focus:ring-brand-blue/5 focus:border-brand-blue focus:bg-white transition-all resize-none shadow-sm leading-relaxed"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-6 pt-6">
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-6 border-2 border-slate-100 rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 transition-all text-slate-400"
                    >
                      Brouillon
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-[1.5] py-6 bg-brand-green text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(11,159,11,0.3)]"
                    >
                      Mettre en Ligne
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-[40px] border border-slate-100 shadow-2xl p-12 text-center"
            >
              <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[32px] flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Trash2 size={40} />
              </div>
              <h2 className="font-heading font-black text-3xl text-slate-900 mb-4">Confirmer ?</h2>
              <p className="text-slate-500 font-medium mb-10 px-4">
                Cette action est irréversible. Le produit sera retiré du catalogue public.
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 border-2 border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Garder
                </button>
                <button 
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
