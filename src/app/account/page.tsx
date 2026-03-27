"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Mail, MapPin, Phone, Edit2, Camera, Loader2, X, CheckCircle2, Store, Briefcase, FileText, LayoutDashboard, Clock, AlertCircle, ChevronRight, Truck } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

const statusStyles = {
  pending: { label: "En attente", icon: <Clock size={12} />, color: "text-amber-600 bg-amber-50 border-amber-100 shadow-[0_2px_10px_-3px_rgba(245,158,11,0.2)]" },
  processing: { label: "Préparation", icon: <Clock size={12} />, color: "text-indigo-600 bg-indigo-50 border-indigo-100 shadow-[0_2px_10px_-3px_rgba(99,102,241,0.2)]" },
  shipped: { label: "Expédition", icon: <Truck size={12} />, color: "text-blue-600 bg-blue-50 border-blue-100 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.2)]" },
  delivered: { label: "Livré", icon: <CheckCircle2 size={12} />, color: "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]" },
  cancelled: { label: "Annulé", icon: <X size={12} />, color: "text-rose-600 bg-rose-50 border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)]" },
};

import { AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  phone: z.string().regex(/^(77|78|76|70|75)[0-9]{7}$/, "Numéro de téléphone sénégalais invalide (77xxxxxxx)"),
  address: z.string().min(5, "L'adresse est trop courte"),
});

type ProfileForm = z.infer<typeof profileSchema>;

const sellerSchema = z.object({
  shopName: z.string().min(2, "Le nom de la boutique est trop court"),
  specialty: z.string().min(2, "Veuillez préciser votre spécialité"),
  bio: z.string().min(10, "La présentation doit faire au moins 10 caractères"),
  location: z.string().min(5, "Veuillez préciser la localisation de la boutique"),
  image: z.string().optional(),
});

type SellerForm = z.infer<typeof sellerSchema>;

export default function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const { user, login } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [artisan, setArtisan] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSellerModal, setShowSellerModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
  });

  const sellerForm = useForm<SellerForm>({
    resolver: zodResolver(sellerSchema),
  });

  // Fetch artisan status
  useEffect(() => {
    const fetchArtisan = async () => {
      try {
        const data = await api.get<any>("/artisans/me");
        setArtisan(data);
      } catch (error) {
        // If 404, it just means they are not a seller yet
        setArtisan(null);
      }
    };
    if (user) fetchArtisan();
  }, [user]);

  // Sync with user data
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, reset]);

  useEffect(() => {
    if (tab === "orders") {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const data = await api.get<any[]>("/orders/my");
          setOrders(data);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [tab]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.upload<{ url: string }>("/upload", file);
      const updatedUser = await api.put<any>("/users/profile", { image: res.url });

      // Update store state
      const token = localStorage.getItem("baysawarr-token") || "";
      login(updatedUser, token);

      toast.success("Photo de profil mise à jour");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Échec du téléchargement");
    } finally {
      setUploading(false);
    }
  };

  const onUpdateProfile = async (data: ProfileForm) => {
    setLoading(true);
    try {
      const updatedUser = await api.put<any>("/users/profile", data);
      const token = localStorage.getItem("baysawarr-token") || "";
      login(updatedUser, token);
      toast.success("Profil mis à jour");
      setShowEditModal(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const onApplyToBeSeller = async (data: SellerForm) => {
    setLoading(true);
    try {
      await api.post("/artisans/apply", data);
      toast.success("Votre demande a été envoyée avec succès !");
      setShowSellerModal(false);
      // Refresh artisan status
      const updatedArtisan = await api.get<any>("/artisans/me");
      setArtisan(updatedArtisan);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'envoi de la demande");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-[#0f172a] text-white py-16 relative overflow-hidden">
        {/* Abstract Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/20 rounded-full blur-[100px] -mr-48 -mt-48" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[32px] bg-white/10 flex items-center justify-center overflow-hidden border-2 border-white/5 group-hover:border-brand-green transition-all shadow-2xl">
                {user?.image ? (
                  <Image src={user.image} alt={user.name} fill className="object-cover" />
                ) : (
                  <User size={32} className="text-white/40" />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-white" />
                  </div>
                )}
              </div>
              <label
                className="absolute -bottom-2 -right-2 p-2 bg-brand-green text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
                title="Changer la photo"
              >
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
              </label>
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                <h1 className="font-heading font-black text-3xl tracking-tight">{user?.name}</h1>
                <CheckCircle2 size={18} className="text-brand-green" />
              </div>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Membre depuis  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) : "Avril 2026"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl border border-border-color p-1 mb-8 w-fit">
          <button
            onClick={() => setTab("profile")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "profile"
                ? "bg-brand-green text-white"
                : "text-muted hover:text-foreground"
              }`}
          >
            <span className="flex items-center gap-2">
              <User size={14} /> Profil
            </span>
          </button>
          {user?.role !== 'admin' && (
            <button
              onClick={() => setTab("orders")}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "orders"
                  ? "bg-brand-green text-white"
                  : "text-muted hover:text-foreground"
                }`}
            >
              <span className="flex items-center gap-2">
                <Package size={14} /> Commandes
              </span>
            </button>
          )}
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-2xl border border-border-color p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl">
                Informations personnelles
              </h2>
              <button
                onClick={() => {
                  setShowEditModal(true);
                }}
                className="flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-2xl hover:bg-brand-green hover:text-white transition-all shadow-lg shadow-brand-green/5 active:scale-95"
              >
                <Edit2 size={12} /> Modifier mon profil
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <User size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Nom complet</p>
                  <p className="text-sm font-bold text-slate-800">{user?.name || "Chargement..."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <Mail size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="text-sm font-bold text-slate-800">{user?.email || "Chargement..."}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <Phone size={18} className="text-muted" />
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Téléphone</p>
                  <p className={`text-sm font-bold ${user?.phone ? "text-slate-800" : "text-slate-400 italic font-medium"}`}>
                    {user?.phone || "Non renseigné"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-5 bg-surface rounded-[24px] border border-transparent hover:border-slate-200 transition-colors">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-muted">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Adresse de livraison</p>
                  <p className={`text-sm font-bold ${user?.address ? "text-slate-800" : "text-slate-400 italic font-medium"}`}>
                    {user?.address || "Non renseignée"}
                  </p>
                </div>
              </div>

              {/* Seller Account Section */}
              {user?.role !== 'admin' && (
                <div className="md:col-span-2 p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100/50 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-0" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600 transition-transform group-hover:scale-110">
                        <Store size={28} />
                      </div>
                      <div>
                        <h3 className="font-heading font-black text-lg text-slate-900 tracking-tight">Espace Vendeur</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600/60 mt-0.5">Programme Partenaires Baysawarr</p>
                      </div>
                    </div>

                    {!artisan ? (
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <p className="text-xs font-bold text-slate-500 max-w-[200px]">Partagez votre savoir-faire et commencez à vendre vos créations.</p>
                        <button 
                          onClick={() => setShowSellerModal(true)}
                          className="px-6 py-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center gap-2"
                        >
                          Ouvrir ma boutique <ChevronRight size={14} />
                        </button>
                      </div>
                    ) : artisan.status === "pending" ? (
                      <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-100 rounded-2xl">
                        <Clock size={18} className="text-amber-500 animate-pulse" />
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Demande en cours</p>
                          <p className="text-[9px] font-bold text-amber-500/80 uppercase">Nous étudions votre profil</p>
                        </div>
                      </div>
                    ) : artisan.status === "approved" ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Link 
                          href="/dashboard/seller"
                          className="px-8 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center gap-3"
                        >
                          <LayoutDashboard size={16} /> Gérer ma boutique
                        </Link>
                        <button 
                          onClick={() => {
                            sellerForm.reset({
                              shopName: artisan.name,
                              specialty: artisan.specialty,
                              bio: artisan.bio,
                              location: artisan.location,
                              image: artisan.image
                            });
                            setShowSellerModal(true);
                          }}
                          className="px-6 py-3 border border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                        >
                          <Edit2 size={14} /> Éditer infos
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <div className="flex items-center gap-3 px-4 py-2 bg-rose-50 border border-rose-100 rounded-xl">
                          <AlertCircle size={18} className="text-rose-500" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Inscription Refusée</span>
                        </div>
                        <button 
                          onClick={() => setShowSellerModal(true)}
                          className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline"
                        >
                          Réessayer l&apos;inscription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {loading ? (
              <div className="text-center py-20 bg-background rounded-2xl border border-border-color">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-green mx-auto mb-4"></div>
                <p className="text-muted text-xs font-black uppercase tracking-widest">Chargement...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-background rounded-2xl border border-border-color">
                <Package size={40} className="mx-auto text-muted mb-4 opacity-20" />
                <h3 className="font-heading font-black text-lg mb-1">Aucune commande</h3>
                <p className="text-muted text-xs mb-6">Vos commandes s&apos;afficheront ici.</p>
                <Link href="/shop" className="inline-flex py-3 px-8 bg-brand-green text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-brand-green-light transition-all shadow-lg shadow-brand-green/20">
                  Découvrir la boutique
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-background rounded-3xl border border-border-color overflow-hidden hover:shadow-xl transition-all group"
                >
                  <div className="p-6 border-b border-border-color bg-surface/30 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Numéro</p>
                        <p className="font-bold text-brand-blue tracking-tighter">#{order.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none mb-1">Date</p>
                      <p className="text-xs font-bold">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border flex items-center gap-2 ${
                        statusStyles[order.status as keyof typeof statusStyles]?.color || statusStyles.pending.color
                      }`}
                    >
                      {statusStyles[order.status as keyof typeof statusStyles]?.icon || statusStyles.pending.icon}
                      {statusStyles[order.status as keyof typeof statusStyles]?.label || statusStyles.pending.label}
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border-color bg-surface shrink-0">
                            <Image src={item.product?.image} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{item.product?.name || "Produit"}</p>
                            <p className="text-[10px] text-muted font-bold tracking-widest uppercase">X{item.quantity} · {parseFloat(item.price).toLocaleString()} F</p>
                          </div>
                        </div>
                        <span className="font-black text-brand-blue text-xs">
                          {(parseFloat(item.price) * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex justify-between items-center pt-4 border-t border-border-color border-dashed">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-muted uppercase tracking-widest">Total Payé</span>
                         <Link href="/account/orders" className="text-[9px] font-black text-brand-green uppercase tracking-widest hover:underline flex items-center gap-1">Suivre <ChevronRight size={10} /></Link>
                      </div>
                      <span className="font-heading font-black text-brand-green text-lg">
                        {parseFloat(order.totalAmount).toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-bl-[100px] -z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-heading font-black text-2xl text-slate-900">Modifier mon profil</h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">Édition des informations</p>
                  </div>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-5">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Nom complet</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...register("name")}
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all ${
                          errors.name ? "border-red-500" : "border-slate-100 focus:border-brand-green"
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Téléphone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        {...register("phone")}
                        placeholder="77 123 45 67"
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all ${
                          errors.phone ? "border-red-500" : "border-slate-100 focus:border-brand-green"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{errors.phone.message}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Adresse de livraison</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        {...register("address")}
                        rows={3}
                        placeholder="Quartier, Rue, Porte..."
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all resize-none ${
                          errors.address ? "border-red-500" : "border-slate-100 focus:border-brand-green"
                        }`}
                      />
                    </div>
                    {errors.address && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{errors.address.message}</p>}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 bg-brand-green hover:bg-brand-green-light text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-green/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Enregistrement...</span>
                        </div>
                      ) : (
                        "Sauvegarder"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Seller Application Modal */}
      <AnimatePresence>
        {showSellerModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSellerModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-0" />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="font-heading font-black text-2xl text-slate-900">Devenir Vendeur</h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 mt-1">Rejoignez nos vendeurs locaux</p>
                  </div>
                  <button
                    onClick={() => setShowSellerModal(false)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 transition-all border border-slate-100"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={sellerForm.handleSubmit(onApplyToBeSeller)} className="space-y-5">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Nom de la Boutique</label>
                    <div className="relative">
                      <Store size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...sellerForm.register("shopName")}
                        placeholder="Ex: Le Savoir-Faire Sénégalais"
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all ${
                          sellerForm.formState.errors.shopName ? "border-red-500" : "border-slate-100 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {sellerForm.formState.errors.shopName && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{sellerForm.formState.errors.shopName.message}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Spécialité</label>
                    <div className="relative">
                      <Briefcase size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...sellerForm.register("specialty")}
                        placeholder="Ex: Maroquinerie, Teinture..."
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all ${
                          sellerForm.formState.errors.specialty ? "border-red-500" : "border-slate-100 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {sellerForm.formState.errors.specialty && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{sellerForm.formState.errors.specialty.message}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Présentation (Bio)</label>
                    <div className="relative">
                      <FileText size={14} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        {...sellerForm.register("bio")}
                        rows={4}
                        placeholder="Parlez-nous de votre histoire et de vos produits..."
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all resize-none ${
                          sellerForm.formState.errors.bio ? "border-red-500" : "border-slate-100 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {sellerForm.formState.errors.bio && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{sellerForm.formState.errors.bio.message}</p>}
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Photo de la Boutique</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-100 flex items-center justify-center overflow-hidden relative">
                        {sellerForm.watch("image") ? (
                          <Image src={sellerForm.watch("image")!} alt="Shop" fill className="object-cover" />
                        ) : (
                          <Camera size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              toast.info("Importation...");
                              const res = await api.upload<{ url: string }>("/upload", file);
                              sellerForm.setValue("image", res.url);
                              toast.success("Image importée !");
                            } catch (error) {
                              toast.error("Échec de l'importation");
                            }
                          }}
                          className="hidden"
                          id="modal-shop-image-upload"
                        />
                        <label
                          htmlFor="modal-shop-image-upload"
                          className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 cursor-pointer transition-all inline-block"
                        >
                          Choisir une image
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Localisation de la Boutique</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        {...sellerForm.register("location")}
                        placeholder="Ex: Dakar Plateau, Rue X"
                        className={`w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border text-sm font-bold focus:outline-none transition-all ${
                          sellerForm.formState.errors.location ? "border-red-500" : "border-slate-100 focus:border-emerald-500"
                        }`}
                      />
                    </div>
                    {sellerForm.formState.errors.location && <p className="text-[8px] text-red-500 font-bold ml-1 mt-1 uppercase tracking-tighter">{sellerForm.formState.errors.location.message}</p>}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSellerModal(false)}
                      className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-[2] py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          <span>Envoi en cours...</span>
                        </div>
                      ) : (
                        "Envoyer ma demande"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
