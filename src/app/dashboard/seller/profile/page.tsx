"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Store,
  Briefcase,
  FileText,
  MapPin,
  Camera,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Share2,
  Check
} from "lucide-react";
import { api, validateImageSize } from "@/lib/api";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";

const profileSchema = z.object({
  name: z.string().min(2, "Le nom de la boutique est trop court"),
  specialty: z.string().min(2, "Veuillez préciser votre spécialité"),
  bio: z.string().min(10, "La présentation doit faire au moins 10 caractères"),
  location: z.string().min(5, "L'adresse est trop courte"),
  image: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function SellerProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [artisan, setArtisan] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const shopImage = watch("image");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.get<any>("/artisans/me");
        setArtisan(data);
        reset({
          name: data.name,
          specialty: data.specialty,
          bio: data.bio,
          location: data.location || "",
          image: data.image || ""
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Erreur de chargement du profil");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onUpdateProfile = async (data: ProfileForm) => {
    setSaving(true);
    try {
      await api.patch(`/artisans/${artisan.id}/status`, { 
        // We reuse the update logic in the backend which is currently attached to status update for simplicity 
        // OR better, use a dedicated update endpoint if available.
        // Actually, my backend service updateArtisan is what I should call.
        // Let's check the routes.
      });
      // Wait, I need to check the artisan routes in the backend.
    } catch (error) {
       // ...
    }
  };

  // Re-checking backend routes...
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      validateImageSize(file);
    } catch (error: any) {
      toast.error(error.message);
      e.target.value = ""; // clear input
      return;
    }

    setUploading(true);
    try {
      const res = await api.upload<{ url: string }>("/upload", file);
      setValue("image", res.url);
      toast.success("Image mise à jour");
    } catch (error) {
      toast.error("Échec de l'importation");
    } finally {
      setUploading(false);
    }
  };

  const handleCopyLink = () => {
    if (!artisan?.slug) { toast.error("Aucun slug de boutique disponible"); return; }
    const url = `${window.location.origin}/boutique/${artisan.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      // In my backend controller, applyToBeSeller also handles updates if profile exists
      await api.post("/artisans/apply", {
        shopName: data.name,
        specialty: data.specialty,
        bio: data.bio,
        location: data.location,
        image: data.image
      });
      toast.success("Profil mis à jour avec succès !");
    } catch (error: any) {
      toast.error(error.message || "Erreur de mise à jour");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 size={40} className="animate-spin text-emerald-500" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-0" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100 shadow-sm relative group">
             {shopImage ? (
               <Image src={shopImage} alt="Shop" fill className="object-cover rounded-3xl" />
             ) : (
               <Store size={32} />
             )}
             <label className="absolute -bottom-2 -right-2 p-2 bg-emerald-500 text-white rounded-xl shadow-lg cursor-pointer hover:scale-110 transition-all">
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
             </label>
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{artisan?.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Vendeur Actif</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Membre depuis {artisan?.since}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Side: Main Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> Informations Générales
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom de la Boutique</label>
                <div className="relative group">
                  <Store size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("name")}
                    className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-slate-50 border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm ${
                      errors.name ? "border-red-500" : "border-transparent focus:border-emerald-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.name.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Spécialité / Secteur</label>
                <div className="relative group">
                  <Briefcase size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("specialty")}
                    className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-slate-50 border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm ${
                      errors.specialty ? "border-red-500" : "border-transparent focus:border-emerald-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.specialty && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.specialty.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Localisation physique</label>
                <div className="relative group">
                  <MapPin size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    {...register("location")}
                    placeholder="Ex: Dakar, Sénégal"
                    className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-slate-50 border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm ${
                      errors.location ? "border-red-500" : "border-transparent focus:border-emerald-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.location && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.location.message}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
               <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> Présentation de la Boutique
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Biographie / Histoire</label>
              <div className="relative group">
                <FileText size={16} className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                <textarea
                  {...register("bio")}
                  rows={6}
                  className={`w-full pl-14 pr-8 py-5 rounded-[32px] bg-slate-50 border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm resize-none leading-relaxed ${
                    errors.bio ? "border-red-500" : "border-transparent focus:border-emerald-500 focus:bg-white"
                  }`}
                />
              </div>
              {errors.bio && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.bio.message}</p>}
            </div>
          </div>
        </div>

        {/* Right Side: Preview & Save */}
        <div className="space-y-6">
          <div className="bg-[#0f172a] p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full pointer-events-none" />
            
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500 mb-6">Aperçu Public</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 relative">
                  {shopImage ? (
                     <Image src={shopImage} alt="Preview" fill className="object-cover" />
                  ) : (
                    <Store size={24} className="text-white/20" />
                  )}
                </div>
                <div>
                   <p className="text-sm font-black tracking-tight">{watch("name") || "Votre Boutique"}</p>
                   <p className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">{watch("specialty") || "Spécialité"}</p>
                </div>
              </div>

              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-slate-400">
                    <MapPin size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-tight">{watch("location") || "Sénégal"}</span>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-300 leading-relaxed italic line-clamp-3">
                      &quot;{watch("bio") || "Votre présentation s'affichera ici..."}&quot;
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <button
               type="submit"
               disabled={saving || uploading}
               className="w-full py-6 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-[28px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center px-8 group"
             >
               <div className="flex items-center gap-4 transition-transform group-hover:scale-105">
                 {saving ? (
                   <Loader2 size={20} className="animate-spin" />
                 ) : (
                   <Save size={20} className="shrink-0" />
                 )}
                 <span className="text-center leading-tight">
                   {saving ? "Sauvegarde..." : "Enregistrer les modifications"}
                 </span>
               </div>
             </button>
             
             <p className="text-center text-[8px] font-black text-slate-400 uppercase tracking-widest mt-6">
                Dernière mise à jour : {artisan?.updatedAt ? new Date(artisan.updatedAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Jamais"}
             </p>
          </div>

          {artisan && (
            <div className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm space-y-4">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> Partager ma Boutique
              </h3>
              <div className="flex items-center gap-2 bg-slate-50 rounded-[20px] px-4 py-3 border border-slate-100">
                <Share2 size={14} className="text-emerald-500 shrink-0" />
                <span className="text-[10px] font-bold text-slate-500 truncate flex-1">
                  {artisan.slug ? `/boutique/${artisan.slug}` : "Sauvegardez d'abord votre profil"}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] bg-slate-100 hover:bg-slate-200 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-700"
                >
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                  {copied ? "Copié !" : "Copier"}
                </button>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Découvrez ma boutique sur Baysawarr : ${typeof window !== "undefined" ? window.location.origin : ""}/boutique/${artisan.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[20px] bg-[#25D366] hover:bg-[#1ebe5c] transition-colors text-[10px] font-black uppercase tracking-widest text-white"
                >
                  <Share2 size={14} />
                  WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100 flex items-start gap-4">
             <AlertCircle size={20} className="text-blue-500 shrink-0 mt-0.5" />
             <div>
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-tight">Conseil Premium</p>
                <p className="text-[10px] text-blue-700/80 font-medium leading-relaxed mt-1">
                   Une belle photo de boutique et une biographie inspirante augmentent vos chances de vente de <span className="font-black text-blue-900">30%</span>.
                </p>
             </div>
          </div>
        </div>
      </form>
    </div>
  );
}
