"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, UserRole } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, Zap, Sparkles, Loader2, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Format d'e-mail invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError("");
    setLoading(true);

    try {
      const result = await api.post<{ user: any; token: string }>("/auth/login", data);
      login(result.user, result.token);
      toast.success(`Heureux de vous revoir, ${result.user.name.split(' ')[0]} !`);
      router.push(result.user.role === "admin" ? "/admin" : "/");
    } catch (err: any) {
      const msg = err.message === "Invalid credentials" ? "Identifiants invalides" : err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-blue">
        <Image
          src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=1200&auto=format&fit=crop"
          alt="Baysawarr Craft"
          fill
          className="object-cover opacity-60 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-blue/40 to-transparent" />
        
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
             <span className="text-white font-heading font-black text-2xl tracking-tighter">Baysa<span className="text-brand-green">warr</span></span>
          </Link>

          <div className="max-w-md">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white">Artisanat Sénégalais Premium</span>
            </motion.div>
            <h2 className="text-6xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              Redécouvrez <br />
              <span className="text-brand-green">L&apos;Excellence</span> <br />
              Locale.
            </h2>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              Connectez-vous pour accéder à une sélection curatée des meilleurs produits artisanaux du Sénégal.
            </p>
          </div>

          <div className="flex items-center gap-8 text-white/50">
             <div className="flex flex-col">
                <span className="text-2xl font-black text-white">100%</span>
                <span className="text-[10px] uppercase font-black tracking-widest">Authentique</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-white">10k+</span>
                <span className="text-[10px] uppercase font-black tracking-widest">Clients</span>
             </div>
             <div className="flex flex-col">
                <span className="text-2xl font-black text-white">4.9/5</span>
                <span className="text-[10px] uppercase font-black tracking-widest">Avis</span>
             </div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue mb-10 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la boutique
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Connexion</h1>
            <p className="text-slate-500 font-medium">Bon retour parmi nous ! Veuillez entrer vos identifiants.</p>
          </div>

          {/* Error Message Container (Fixed Height to prevent layout shift) */}
          <div className="h-14 mb-4">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 rounded-[20px] bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse Email</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  {...register("email")}
                  placeholder="nom@exemple.com"
                  className={`w-full pl-16 pr-8 py-5 rounded-[28px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-slate-900 ${
                    errors.email ? "border-red-500" : "border-slate-200 focus:border-brand-blue"
                  }`}
                />
              </div>
              {errors.email && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de Passe</label>
                <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Oublié ?</Link>
              </div>
              <div className="relative group">
                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••••••"
                  className={`w-full pl-16 pr-14 py-5 rounded-[28px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-slate-900 ${
                    errors.password ? "border-red-500" : "border-slate-200 focus:border-brand-blue"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-6 rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all bg-brand-green shadow-xl shadow-brand-green/30 hover:shadow-brand-green/40 flex items-center justify-center gap-3 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Zap size={18} />
              )}
              {loading ? "Chargement..." : "Se Connecter"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-500">
              Pas encore membre ?{" "}
              <Link
                href="/register"
                className="text-brand-green font-black hover:underline inline-flex items-center gap-1 group"
              >
                Créer un compte <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
