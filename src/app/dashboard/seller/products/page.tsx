"use client";

import { useState, useEffect, useRef } from "react";
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
  ExternalLink, 
  ChevronRight, 
  Upload, 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  Store,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-toastify";
import { api, validateImageSize } from "@/lib/api";
import { generateProductsReport } from "@/lib/reports";

export default function SellerProductsPage() {
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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
    image: "",
    images: [] as string[]
  };
  const [formData, setFormData] = useState(defaultForm);
  const [selectedFiles, setSelectedFiles] = useState<{file: File, id: string}[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodsRes, catsRes] = await Promise.all([
        api.get<any[]>("/products/seller"),
        api.get<any[]>("/categories")
      ]);
      setDbProducts(prodsRes);
      setCategories(catsRes);
    } catch (error) {
      console.error("Failed to fetch seller products:", error);
      toast.error("Erreur lors du chargement des produits");
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
      let mainImageUrl = formData.image;
      const galleryUrls = [...(formData.images || [])];

      if (selectedFiles.length > 0) {
        toast.info(editingId ? "Mise à jour en cours..." : "Création en cours...", {
          icon: <Loader2 size={18} className="animate-spin text-emerald-500" />,
          autoClose: 2000
        });

        const uploadPromises = selectedFiles.map(f => api.upload<{ url: string }>("/upload", f.file));
        const results = await Promise.all(uploadPromises);
        const newUrls = results.map(r => r.url);
        
        // If no main image exists, set the first new one as main
        if (!mainImageUrl && newUrls.length > 0) {
          mainImageUrl = newUrls[0];
        }
        
        galleryUrls.push(...newUrls);
      }

      // Ensure mainImageUrl is in galleryUrls if not present
      if (mainImageUrl && !galleryUrls.includes(mainImageUrl)) {
        galleryUrls.unshift(mainImageUrl);
      }

      const dataToSave = { 
        ...formData, 
        image: mainImageUrl, 
        images: galleryUrls 
      };

      if (editingId) {
        await api.put(`/products/${editingId}`, dataToSave);
        toast.success("Produit mis à jour");
      } else {
        if (!mainImageUrl) {
          toast.error("Image requise");
          setLoading(false);
          return;
        }
        await api.post("/products", dataToSave);
        toast.success("Produit ajouté");
      }
      
      setShowModal(false);
      setSelectedFiles([]);
      fetchData();
    } catch (error: any) {
      toast.error(error.message || "Erreur d'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setSelectedFiles([]);
    if (categories.length > 0) setFormData(prev => ({ ...prev, category: categories[0].slug }));
    setShowModal(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setSelectedFiles([]);
    const gallery = [...(product.images || [])];
    if (product.image && !gallery.includes(product.image)) {
      gallery.unshift(product.image);
    }
    
    setFormData({
      name: product.name,
      category: typeof product.category === 'object' ? product.category.slug : product.category,
      price: product.price,
      stock: product.stock,
      description: product.description,
      image: product.image || "",
      images: gallery
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Supprimé");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      toast.error("Erreur de suppression");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newFiles: {file: File, id: string}[] = [];
      files.forEach(file => {
        try {
          validateImageSize(file);
          newFiles.push({ file, id: Math.random().toString(36).substring(7) });
        } catch (error: any) {
          toast.error(`${file.name}: ${error.message}`);
        }
      });
      setSelectedFiles(prev => [...prev, ...newFiles]);
      e.target.value = ""; // clear input
    }
  };

  const filtered = dbProducts.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const catName = typeof p.category === 'object' ? p.category.name : p.category;
    const matchesCategory = selectedCategory === "Tous" || catName === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const pagedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Mes Produits</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{dbProducts.length} articles dans votre boutique</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={16} /> Ajouter un produit
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        <div className="lg:col-span-6 relative group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher mes produits..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-100 text-xs font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>
        <div className="lg:col-span-6 flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
          {["Tous", ...categories.map(c => c.name)].map((cat) => (
            <button 
              key={cat} 
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

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
             <Loader2 size={32} className="animate-spin text-emerald-500" />
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chargement du catalogue...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-center p-8">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                <Package size={32} className="text-slate-200" />
             </div>
             <h3 className="text-lg font-black text-slate-900 mb-2">Aucun produit trouvé</h3>
             <p className="text-xs text-slate-400 font-medium max-w-[240px] leading-relaxed mb-6 uppercase tracking-tight">
               Commencez à ajouter des produits pour les afficher dans votre boutique en ligne.
             </p>
             <button onClick={openCreateModal} className="text-emerald-500 font-black text-[10px] uppercase tracking-widest hover:underline">
               Ajouter mon premier produit
             </button>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-slate-50">
               {pagedProducts.map((product) => {
                 const isExpanded = expandedRows.has(product.id);
                 return (
                   <div key={product.id} className="p-4">
                     <div className="flex items-center justify-between mb-4">
                       <div className="flex items-center gap-3">
                         <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden relative bg-slate-50 shrink-0 shadow-sm">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                         </div>
                         <div className="max-w-[150px]">
                           <p className="font-heading font-black text-slate-900 tracking-tight text-xs truncate">{product.name}</p>
                           <p className="text-[10px] text-emerald-600 font-black uppercase tracking-tight mt-0.5">
                             {typeof product.category === 'object' ? product.category.name : product.category}
                           </p>
                         </div>
                       </div>
                       <button 
                         onClick={() => toggleRow(product.id)}
                         className={`p-2 rounded-xl transition-all ${isExpanded ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20" : "bg-slate-50 text-slate-400"}`}
                       >
                         {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                       </button>
                     </div>

                     <div className="grid grid-cols-2 gap-4 mb-4">
                       <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Prix</p>
                         <p className="text-xs font-black text-slate-900">{product.price.toLocaleString()} F</p>
                       </div>
                       <div>
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock</p>
                         <p className={`text-[10px] font-black uppercase ${product.stock <= 10 ? "text-amber-500" : "text-emerald-500"}`}>
                           {product.stock} Dispo
                         </p>
                       </div>
                     </div>

                     <AnimatePresence>
                       {isExpanded && (
                         <motion.div
                           initial={{ height: 0, opacity: 0 }}
                           animate={{ height: "auto", opacity: 1 }}
                           exit={{ height: 0, opacity: 0 }}
                           className="overflow-hidden pt-4 border-t border-slate-50"
                         >
                           <div className="flex gap-2">
                             <button onClick={() => openEditModal(product)} className="flex-1 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2">
                               <Edit2 size={14} /> Modifier
                             </button>
                             <button onClick={() => setDeleteId(product.id)} className="flex-1 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                               <Trash2 size={14} /> Supprimer
                             </button>
                           </div>
                         </motion.div>
                       )}
                     </AnimatePresence>
                   </div>
                 );
               })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Produit</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Catégorie</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Prix</th>
                    <th className="px-4 py-5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock</th>
                    <th className="px-6 py-5 text-right text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {pagedProducts.map((product) => (
                    <tr key={product.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden relative bg-slate-50 shrink-0 shadow-sm transition-transform group-hover:scale-105">
                            <Image src={product.image} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="font-heading font-black text-slate-900 tracking-tight text-sm truncate max-w-[180px]">{product.name}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">ID: {product.id.substring(0,8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2 py-1 bg-white border border-slate-100 text-slate-600 text-[9px] font-black rounded-lg uppercase tracking-tight">
                          {typeof product.category === 'object' ? product.category.name : product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-heading font-black text-slate-900 text-sm">
                        {product.price.toLocaleString()} <span className="text-[9px] text-slate-400">FCFA</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${
                          product.stock === 0 ? "bg-rose-50 text-rose-600 border-rose-100" :
                          product.stock <= 10 ? "bg-amber-50 text-amber-600 border-amber-100" :
                          "bg-emerald-50 text-emerald-600 border-emerald-100"
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${
                            product.stock === 0 ? "bg-rose-500" :
                            product.stock <= 10 ? "bg-amber-500 animate-pulse" :
                            "bg-emerald-500 animate-pulse"
                          }`} />
                          {product.stock} {product.stock === 0 ? "Épuisé" : "Dispo"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => openEditModal(product)} className="p-2.5 text-slate-400 hover:text-emerald-500 bg-slate-50 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteId(product.id)} className="p-2.5 text-slate-400 hover:text-rose-500 bg-slate-50 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 shadow-sm">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
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
          </>
        )}
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
            <motion.div initial={{ scale: 0.98, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0, y: 10 }} className="relative bg-white rounded-[40px] p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-heading font-black text-2xl text-slate-900 tracking-tight">{editingId ? "Éditer" : "Nouveau"} Produit</h2>
                  <p className="text-emerald-500 font-black uppercase text-[9px] tracking-[0.2em] mt-1">Espace Vendeur Baysawarr</p>
                </div>
                <button onClick={() => setShowModal(false)} className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Désignation</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ex: Panier en paille tressée" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-sm" />
                  </div>
                  
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Catégorie</label>
                    <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all appearance-none shadow-sm">
                      <option value="" disabled>Choisir...</option>
                      {categories.map((cat) => <option key={cat.id} value={cat.slug}>{cat.name}</option>)}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Prix (FCFA)</label>
                      <input type="number" required value={formData.price === 0 ? "" : formData.price} onChange={e => setFormData({...formData, price: e.target.value === "" ? 0 : parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-sm" />
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Stock</label>
                      <input type="number" required value={formData.stock === 0 ? "" : formData.stock} onChange={e => setFormData({...formData, stock: e.target.value === "" ? 0 : parseInt(e.target.value)})} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-all shadow-sm" />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Images du Produit</label>
                    
                    <div className="space-y-4">
                      {/* Upload Area */}
                      <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-4 border-2 border-dashed border-slate-200 rounded-[28px] p-8 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all group overflow-hidden">
                        <div className="w-12 h-12 bg-white rounded-2xl text-slate-400 flex items-center justify-center group-hover:text-emerald-500 group-hover:scale-110 transition-all shadow-sm border border-slate-100"><Upload size={22} /></div>
                        <div className="text-left">
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 block">Uploader des visuels</span>
                          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Format JPG, PNG • Max 2Mo par fichier</span>
                        </div>
                      </button>
                      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" multiple onChange={handleFileChange} />

                      {/* Gallery Grid */}
                      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                        {/* Existing Images */}
                        {(formData.images || []).map((img, i) => (
                          <div key={i} className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${formData.image === img ? 'border-emerald-500 shadow-lg scale-[1.02]' : 'border-slate-50 opacity-80 hover:opacity-100'}`}>
                            <Image src={img} alt="" fill className="object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1">
                               {formData.image !== img && (
                                 <button 
                                   type="button"
                                   onClick={() => setFormData({...formData, image: img})}
                                   className="p-1.5 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-tight"
                                 >
                                   Principal
                                 </button>
                               )}
                               <button 
                                 type="button"
                                 onClick={() => {
                                   const newImages = formData.images.filter(url => url !== img);
                                   const newMain = formData.image === img ? (newImages[0] || "") : formData.image;
                                   setFormData({...formData, images: newImages, image: newMain});
                                 }}
                                 className="p-1.5 bg-rose-500 text-white rounded-lg"
                               >
                                 <Trash2 size={12} />
                               </button>
                            </div>
                            {formData.image === img && (
                              <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase tracking-tighter rounded-md shadow-sm">
                                Principal
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Newly Selected Files */}
                        {selectedFiles.map((sf, i) => (
                          <div key={sf.id} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-emerald-500 border-dashed bg-emerald-50/10">
                            <Image src={URL.createObjectURL(sf.file)} alt="" fill className="object-cover opacity-60" />
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <Loader2 size={16} className="text-emerald-500 animate-spin" />
                            </div>
                            <button 
                              type="button"
                              onClick={() => setSelectedFiles(prev => prev.filter(f => f.id !== sf.id))}
                              className="absolute top-1 right-1 p-1 bg-white/80 backdrop-blur-sm rounded-lg text-rose-500 shadow-sm"
                            >
                              <X size={12} />
                            </button>
                            <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black uppercase tracking-tighter rounded-md">
                              Nouveau
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Description du produit</label>
                    <textarea rows={4} required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Décrivez les matériaux, les dimensions et l'histoire du produit..." className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-sm" />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">Annuler</button>
                  <button type="submit" disabled={loading} className="flex-[2] py-4.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50">
                    {loading ? <div className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /><span>Enregistrement...</span></div> : (editingId ? "Enregistrer les modifications" : "Lancer le produit")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative z-10 w-full max-w-xs bg-white rounded-[32px] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform hover:rotate-12"><Trash2 size={24} /></div>
              <h2 className="font-heading font-black text-xl text-slate-900 mb-2">Supprimer ?</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-8">Cette action est irréversible.</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setDeleteId(null)} className="flex-1 py-3.5 bg-slate-50 text-slate-500 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Non</button>
                <button type="button" onClick={() => { if (deleteId) handleDelete(deleteId); }} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20">Oui</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
