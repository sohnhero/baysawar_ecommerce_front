"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Mail, MapPin, Phone, Edit2 } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";

const statusColors: Record<string, string> = {
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-100 shadow-[0_2px_10px_-3px_rgba(16,185,129,0.2)]",
  shipped: "bg-blue-50 text-blue-700 border-blue-100 shadow-[0_2px_10px_-3px_rgba(59,130,246,0.2)]",
  processing: "bg-indigo-50 text-indigo-700 border-indigo-100 shadow-[0_2px_10px_-3px_rgba(99,102,241,0.2)]",
  cancelled: "bg-rose-50 text-rose-700 border-rose-100 shadow-[0_2px_10px_-3px_rgba(244,63,94,0.2)]",
  pending: "bg-amber-50 text-amber-700 border-amber-200 shadow-[0_2px_10px_-3px_rgba(245,158,11,0.3)] animate-pulse",
};

const statusLabels: Record<string, string> = {
  delivered: "Livré",
  shipped: "Expédié",
  processing: "Préparation",
  cancelled: "Annulé",
  pending: "En attente",
};

import { AnimatePresence } from "framer-motion";
import { Camera, Loader2, X, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

export default function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");
  const { user, login } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await api.put<any>("/users/profile", editForm);
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
                  setEditForm({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    address: user?.address || ""
                  });
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
                  className="bg-background rounded-3xl border border-border-color p-6 hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-brand-green/10 text-brand-green flex items-center justify-center">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="font-heading font-black text-brand-blue uppercase tracking-tighter">#{order.id.substring(0, 8).toUpperCase()}</p>
                        <p className="text-[10px] text-muted font-black uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${statusColors[order.status] || statusColors.pending
                        }`}
                    >
                      {statusLabels[order.status] || statusLabels.pending}
                    </span>
                  </div>
                  <div className="space-y-4 mb-6 pt-6 border-t border-border-color border-dashed">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-border-color bg-surface shrink-0">
                            <Image src={item.product?.image} alt="" fill className="object-cover" sizes="48px" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 line-clamp-1">{item.product?.name || "Produit"}</p>
                            <p className="text-xs text-muted font-bold tracking-widest">Quantité: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-black text-brand-blue">
                          {(parseFloat(item.price) * item.quantity).toLocaleString()} FCFA
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-border-color">
                    <span className="text-xs font-black text-muted uppercase tracking-widest">Total Payé</span>
                    <span className="font-heading font-black text-brand-green text-xl">
                      {parseFloat(order.totalAmount).toLocaleString()} FCFA
                    </span>
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

                <form onSubmit={handleUpdateProfile} className="space-y-5">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Nom complet</label>
                    <div className="relative">
                      <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-brand-green transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Téléphone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="+221 ..."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-brand-green transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1.5 block ml-1">Adresse de livraison</label>
                    <div className="relative">
                      <MapPin size={14} className="absolute left-4 top-4 text-slate-400" />
                      <textarea
                        rows={3}
                        value={editForm.address}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        placeholder="Quartier, Rue, Porte..."
                        className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-bold focus:outline-none focus:border-brand-green transition-all resize-none"
                      />
                    </div>
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
    </div>
  );
}
