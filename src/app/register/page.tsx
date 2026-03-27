"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { api } from "@/lib/api";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Format d'e-mail invalide"),
  phone: z.string().regex(/^(77|78|76|70|75)[0-9]{7}$/, "Numéro de téléphone sénégalais invalide (ex: 771234567)"),
  address: z.string().min(5, "L'adresse est trop courte"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");

    try {
      await api.post("/auth/register", data);
      toast.success("Compte créé avec succès ! Veuillez vous connecter.");
      router.push("/login?registered=true");
    } catch (err: any) {
      const msg = err.message === "User already exists" ? "Cet utilisateur existe déjà" : err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-green">
        <Image
          src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=1200&auto=format&fit=crop"
          alt="Baysawarr Craft"
          fill
          className="object-cover opacity-50 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/80 via-brand-green/40 to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="relative w-12 h-12 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <Image 
                  src="/logo_baysawarr.jpg" 
                  alt="Baysawarr Logo" 
                  fill 
                  className="object-contain"
                  priority
                />
             </div>
             <span className="text-white font-heading font-black text-2xl tracking-tighter">Baysa<span className="text-slate-900">warr</span></span>
          </Link>

          <div className="max-w-md text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rejoignez la Communauté</span>
            </motion.div>
            <h2 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
              L&apos;Artisanat <br />
              <span className="text-slate-900">À Votre Portée.</span>
            </h2>
            
            <div className="space-y-4">
               {[
                 "Accès exclusif aux nouvelles collections",
                 "Suivi de commande en temps réel",
                 "Offres spéciales pour les membres",
                 "Support artisanat local direct"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-slate-900" />
                    <span className="text-lg font-medium opacity-90">{text}</span>
                 </div>
               ))}
            </div>
          </div>

          <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
            © 2026 Baysawarr — Sénégal
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:px-12 overflow-y-auto h-full scrollbar-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Back link */}
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-green mb-4 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la connexion
          </Link>

          <div className="mb-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Créer un compte</h1>
            <p className="text-slate-500 font-medium text-xs">Rejoignez-nous en quelques secondes.</p>
          </div>

          <div className="h-10 mb-2">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 rounded-[16px] bg-red-50 border border-red-100 text-red-600 text-[9px] font-black uppercase tracking-widest flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom Complet</label>
              <div className="relative group">
                <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  {...register("name")}
                  placeholder="Amadou Diallo"
                  className={`w-full pl-14 pr-8 py-2.5 rounded-[20px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                    errors.name ? "border-red-500" : "border-slate-200 focus:border-brand-green"
                  }`}
                />
              </div>
              {errors.name && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse Email</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  {...register("email")}
                  placeholder="nom@exemple.com"
                  className={`w-full pl-14 pr-8 py-2.5 rounded-[20px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                    errors.email ? "border-red-500" : "border-slate-200 focus:border-brand-green"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Téléphone</label>
              <div className="relative group">
                <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  {...register("phone")}
                  placeholder="77 123 45 67"
                  className={`w-full pl-14 pr-8 py-2.5 rounded-[20px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                    errors.phone ? "border-red-500" : "border-slate-200 focus:border-brand-green"
                  }`}
                />
              </div>
              {errors.phone && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Mot de Passe</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full pl-14 pr-12 py-2.5 rounded-[20px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                    errors.password ? "border-red-500" : "border-slate-200 focus:border-brand-green"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.password.message}</p>}
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse de livraison</label>
              <div className="relative group">
                <MapPin size={16} className="absolute left-6 top-4 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <textarea
                  {...register("address")}
                  rows={2}
                  placeholder="Ex: Sacré-Cœur, Villa 123, Dakar"
                  className={`w-full pl-14 pr-8 py-2.5 rounded-[20px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm resize-none ${
                    errors.address ? "border-red-500" : "border-slate-200 focus:border-brand-green"
                  }`}
                />
              </div>
              {errors.address && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.address.message}</p>}
            </div>

            <div className="md:col-span-2 flex items-start gap-3 p-3 bg-slate-100 rounded-[18px]">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-brand-green rounded" />
              <label htmlFor="terms" className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                J&apos;accepte les <Link href="#" className="text-brand-green hover:underline">Conditions Générales</Link> et la <Link href="#" className="text-brand-green hover:underline">Politique de Confidentialité</Link>.
              </label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="md:col-span-2 w-full py-4 bg-brand-green text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[24px] transition-all shadow-xl shadow-brand-green/30 hover:shadow-brand-green/40 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? "Création en cours..." : "Créer mon compte"}
                {loading && <Sparkles size={14} className="animate-spin" />}
              </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-xs font-medium text-slate-500">
              Déjà membre ?{" "}
              <Link
                href="/login"
                className="text-brand-green font-black hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
