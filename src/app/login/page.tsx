"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore, UserRole } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, ShieldCheck, ArrowRight, ArrowLeft, Zap, Sparkles } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [role, setRole] = useState<UserRole>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      id: role === "admin" ? "admin-1" : "user-1",
      name: role === "admin" ? "Admin Baysawarr" : "Amadou Diallo",
      email,
      role,
    });
    router.push(role === "admin" ? "/admin" : "/");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-blue">
        <Image
          src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=1200&auto=format&fit=crop"
          alt="Baysawarr Craft"
          fill
          className="object-cover opacity-60 mix-blend-overlay scale-110 hover:scale-100 transition-transform duration-[10s]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/80 via-brand-blue/40 to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-blue font-black text-2xl shadow-2xl">B</div>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 mt-20 lg:mt-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Back link */}
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue mb-12 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la boutique
          </Link>

          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Connexion</h1>
            <p className="text-slate-500 font-medium">Choisissez votre mode d&apos;accès pour continuer.</p>
          </div>

          {/* Role Toggle Switch */}
          <div className="bg-slate-100 p-1.5 rounded-[24px] flex mb-10 border border-slate-200">
            <button
              onClick={() => setRole("client")}
              className={`flex-1 py-4 px-6 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                role === "client" ? "bg-white text-brand-green shadow-xl shadow-black/5" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Espace Client
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-4 px-6 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all ${
                role === "admin" ? "bg-white text-brand-blue shadow-xl shadow-black/5" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Panel Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse Email</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-16 pr-8 py-5 rounded-[28px] bg-white border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mot de Passe</label>
                {role === "client" && (
                  <Link href="#" className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Oublié ?</Link>
                )}
              </div>
              <div className="relative group">
                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-blue transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-16 pr-8 py-5 rounded-[28px] bg-white border border-slate-200 focus:outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all font-bold text-slate-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-6 rounded-[32px] text-white font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-2xl flex items-center justify-center gap-3 overflow-hidden relative group ${
                role === "admin" 
                ? "bg-brand-blue shadow-brand-blue/30" 
                : "bg-brand-green shadow-brand-green/30"
              }`}
            >
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" />
              {role === "admin" ? <ShieldCheck size={18} /> : <Zap size={18} />}
              Se Connecter
            </button>
          </form>

          {role === "client" && (
            <div className="mt-12 text-center">
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
          )}
        </motion.div>
      </div>
    </div>
  );
}
