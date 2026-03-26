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
  ChevronRight,
  Upload,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { products as initialProducts } from "@/data/products";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminProductsPage() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };
  
  const defaultForm = {
    name: "",
    category: "",
    price: 0,
    stock: 10,
    description: "",
    image: ""
  };
  const [formData, setFormData] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.get<any[]>("/products"),
        api.get<any[]>("/categories")
      ]);
      setDbProducts(prodsRes);
      setCategories(catsRes);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        toast.info(editingId ? "Mise à jour en cours..." : "Création en cours...", {
          icon: <Loader2 size={18} className="animate-spin text-brand-blue" />,
          className: "rounded-2xl font-semibold text-xs border border-slate-100",
          autoClose: 2000
        });
        const res = await api.upload<{ url: string }>("/upload", selectedFile);
        imageUrl = res.url;
      }

      const dataToSave = { ...formData, image: imageUrl };

      if (editingId) {
        await api.put(`/products/${editingId}`, dataToSave);
        toast.success("Produit mis à jour avec succès");
      } else {
        if (!imageUrl) {
          toast.error("Veuillez sélectionner une image");
          setLoading(false);
          return;
        }
        await api.post("/products", dataToSave);
        toast.success("Produit créé avec succès");
      }
      
      setShowModal(false);
      setSelectedFile(null);
      fetchData();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setSelectedFile(null);
    if (categories.length > 0) setFormData(prev => ({ ...prev, category: categories[0].slug }));
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setSelectedFile(null);
    setFormData({
      name: product.name,
      category: typeof product.category === 'object' ? product.category.slug : product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image || defaultForm.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    toast.info("Suppression en cours...", { autoClose: 1000 });
    try {
      await api.delete(`/products/${id}`);
      toast.success("Produit supprimé avec succès");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handleExportProducts = () => {
    toast.info("Génération de l'export PDF...", {
      autoClose: 1500,
      icon: <Download size={18} className="text-brand-blue" />
    });

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("CATALOGUE PRODUITS - BAYSAWARR", 14, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Généré le: ${new Date().toLocaleString('fr-FR')}`, 14, 28);
      doc.text(`Total produits: ${dbProducts.length}`, 14, 33);

      autoTable(doc, {
        startY: 40,
        head: [['ID', 'Nom', 'Catégorie', 'Prix', 'Stock']],
        body: dbProducts.map(p => [
          p.id.slice(0, 8).toUpperCase(),
          p.name,
          typeof p.category === 'object' ? p.category.name : p.category,
          `${p.price.toLocaleString()} FCFA`,
          p.stock.toString()
        ]),
        headStyles: { fillColor: [59, 130, 246] },
      });

      doc.save(`catalogue_produits_${new Date().toISOString().slice(0,10)}.pdf`);
      toast.success("Catalogue exporté !");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Erreur d'exportation");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData(prev => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const filtered = dbProducts.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.id.toLowerCase().includes(search.toLowerCase());
    const catName = typeof p.category === 'object' ? p.category.name : p.category;
    const matchesCategory = selectedCategory === "Tous" || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Compact Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-blue/10 text-brand-blue rounded-xl flex items-center justify-center">
              <Package size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Catalogue Produits</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{dbProducts.length} articles au total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleExportProducts}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <Download size={14} /> Export
            </button>
            <button 
              onClick={openCreateModal}
              className="flex items-center gap-2 px-6 py-2 bg-brand-green text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-green/10"
            >
              <Plus size={16} /> Nouveau
            </button>
          </div>
        </div>

        {/* Compact Search & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, SKU..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:ring-4 focus:ring-brand-blue/5 focus:border-brand-blue transition-all"
            />
          </div>
          <div className="lg:col-span-6 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
            {["Tous", ...categories.map(c => c.name)].map((cat, i) => (
              <button 
                key={cat || i} 
                onClick={() => setSelectedCategory(cat)}
                className={`flex-1 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? "bg-slate-900 text-white" 
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile-Friendly Cards (Visible on mobile only) */}
        <div className="md:hidden space-y-4 pb-12">
          {filtered.map((product: any, i: number) => {
            const isExpanded = expandedRows.has(product.id);
            const stock = product.stock ?? 0;
            let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
            let dotColor = "bg-emerald-500 animate-pulse";
            let statusText = "En Stock";

            if (stock === 0) {
              statusColor = "bg-rose-50 text-rose-700 border-rose-100";
              dotColor = "bg-rose-500";
              statusText = "Rupture";
            } else if (stock <= 10) {
              statusColor = "bg-amber-50 text-amber-700 border-amber-100";
              dotColor = "bg-amber-500 animate-bounce";
              statusText = "Stock Faible";
            }

            return (
              <motion.div
                key={product.id || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Compact Row */}
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50 transition-colors"
                  onClick={() => toggleRow(product.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isExpanded ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-slate-100 text-slate-400"}`}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Produit</span>
                      <span className="font-heading font-black text-slate-900 tracking-tight text-sm truncate max-w-[150px]">
                        {product.name}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 relative">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                        sizes="40px"
                      />
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
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Identifiant Unique</span>
                             <span className="text-[10px] font-bold text-slate-500 tracking-tighter bg-white px-2 py-1 rounded-lg border border-slate-100">{product.id}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Catégorie</span>
                            <span className="inline-flex px-2 py-1 bg-white border border-slate-100 text-slate-600 text-[10px] font-black rounded-lg uppercase tracking-tight">
                              {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Prix</span>
                            <span className="text-sm font-black text-slate-900">
                              {product.price.toLocaleString()} <span className="text-[9px] text-slate-400">FCFA</span>
                            </span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Disponibilité</span>
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${statusColor}`}>
                              <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                              {statusText} ({stock} en stock)
                            </div>
                          </div>
                        </div>

                        {/* Mobile Actions */}
                        <div className="pt-4 flex items-center gap-2 border-t border-slate-100/50">
                           <Link 
                             href={`/shop/product/${product.id}`} 
                             target="_blank"
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-all shadow-sm"
                           >
                              <ExternalLink size={14} /> Voir
                           </Link>
                           <button 
                             onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-sm"
                           >
                              <Edit2 size={14} /> Éditer
                           </button>
                           <button 
                             onClick={(e) => { e.stopPropagation(); setDeleteId(product.id); }}
                             className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-all shadow-sm"
                           >
                              <Trash2 size={14} /> Effacer
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
               <Package size={32} className="mx-auto text-slate-200 mb-4" />
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aucun produit trouvé</p>
            </div>
          )}
        </div>

        {/* Dense Products Table (Desktop Only) */}
        <div className="hidden md:block bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] w-[40%]">Détails Produit</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Catégorie</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Prix</th>
                  <th className="px-4 py-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Statut</th>
                  <th className="px-6 py-4 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((product: any, i: number) => (
                  <motion.tr 
                    key={product.id || i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-100 relative">
                          <Image 
                            src={product.image} 
                            alt={product.name} 
                            fill 
                            className="object-cover" 
                            sizes="40px"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-heading font-black text-slate-900 tracking-tight text-sm truncate max-w-[200px]">
                            {product.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest truncate">ID: {product.id.substring(0,8)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 bg-slate-100 text-slate-600 text-[9px] font-black rounded-lg uppercase tracking-tight">
                        {product.category && typeof product.category === 'object' ? (product.category as any).name : product.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-heading font-black text-slate-900 text-sm">
                      {product.price.toLocaleString()} <span className="text-[9px] text-slate-400 font-bold uppercase ml-1">FCFA</span>
                    </td>
                    <td className="px-4 py-3">
                      {(() => {
                        const stock = product.stock ?? 0;
                        let statusColor = "bg-emerald-50 text-emerald-700 border-emerald-100";
                        let dotColor = "bg-emerald-500 animate-pulse";
                        let statusText = "En Stock";
 
                        if (stock === 0) {
                          statusColor = "bg-rose-50 text-rose-700 border-rose-100";
                          dotColor = "bg-rose-500";
                          statusText = "Rupture";
                        } else if (stock <= 10) {
                          statusColor = "bg-amber-50 text-amber-700 border-amber-100";
                          dotColor = "bg-amber-500 animate-bounce";
                          statusText = "Stock Faible";
                        }
 
                        return (
                          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${statusColor}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                            {statusText} ({stock})
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                        <Link href={`/shop/product/${product.id}`} target="_blank" className="p-2 text-slate-400 hover:text-brand-blue hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                          <ExternalLink size={14} />
                        </Link>
                        <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100">
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <MoreHorizontal size={16} className="text-slate-200 group-hover:hidden ml-auto" />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} résultats</p>
            <div className="flex items-center gap-1">
              {[1, 2].map((n: number) => (
                <button key={n} className={`w-8 h-8 rounded-lg font-black text-[10px] transition-all ${n === 1 ? "bg-brand-blue text-white" : "bg-white border border-slate-100 text-slate-400"}`}>
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Add Product Modal */}
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
              className="relative bg-white rounded-[32px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">{editingId ? "Modifier" : "Ajouter"} un produit</h2>
                  <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">Édition du catalogue</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Nom du produit</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="Nom de l'article"
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Catégorie</label>
                    <select
                      required
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-blue transition-all appearance-none"
                    >
                      <option value="" disabled>Choisir...</option>
                      {categories.map((cat) => (
                         <option key={cat.id} value={cat.slug}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Prix (FCFA)</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Stock</label>
                      <input
                        type="number"
                        required
                        value={formData.stock}
                        onChange={e => setFormData({...formData, stock: parseInt(e.target.value)})}
                        className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold focus:outline-none focus:border-brand-blue transition-all"
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Image du Produit</label>
                    
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                           <input 
                             type="file" 
                             ref={fileInputRef}
                             className="hidden" 
                             accept="image/*"
                             onChange={handleFileChange}
                           />
                           <button
                             type="button"
                             onClick={() => fileInputRef.current?.click()}
                             className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-6 hover:border-brand-blue hover:bg-brand-blue/5 transition-all group"
                           >
                             <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mb-2 group-hover:text-brand-blue group-hover:bg-brand-blue/10 transition-all">
                               <Upload size={20} />
                             </div>
                             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                               {selectedFile ? selectedFile.name : "Cliquez pour uploader"}
                             </span>
                           </button>
                        </div>
                      </div>
                      
                      {formData.image && (
                        <div className="w-32 h-32 rounded-xl overflow-hidden border border-slate-100 relative shrink-0 bg-slate-50">
                          <Image src={formData.image} alt="Preview" fill className="object-cover" />
                          <button 
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, image: "" }));
                              setSelectedFile(null);
                            }}
                            className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      {!formData.image && (
                        <div className="w-32 h-32 rounded-xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center bg-slate-50/50 shrink-0">
                          <Package size={24} className="text-slate-200 mb-1" />
                          <span className="text-[8px] font-black uppercase text-slate-300">Aucune image</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Description</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium focus:outline-none focus:border-brand-blue transition-all resize-none"
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-slate-100 rounded-xl font-black text-[10px] uppercase tracking-widest text-slate-400"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-brand-green text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-green/10"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 size={14} className="animate-spin" />
                        <span className="animate-pulse italic opacity-80">En cours...</span>
                      </div>
                    ) : (
                      editingId ? "Mettre à jour" : "Ajouter au catalogue"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modern Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-xs bg-white rounded-[32px] p-8 text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Trash2 size={24} />
              </div>
              <h2 className="font-heading font-black text-xl text-slate-900 mb-2">Confirmer ?</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-8">
                Cette action supprimera définitivement le produit.
              </p>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setDeleteId(null)} 
                  className="flex-1 py-3 border border-slate-100 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all cursor-pointer"
                >
                  Non
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (deleteId) handleDelete(deleteId);
                  }} 
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20 cursor-pointer"
                >
                  Oui
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
