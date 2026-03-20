"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, ArrowLeft, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
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
             <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-brand-green font-black text-2xl shadow-2xl">B</div>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-20 mt-20 lg:mt-0 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-lg"
        >
          {/* Back link */}
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-green mb-12 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la connexion
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Créer un compte</h1>
            <p className="text-slate-500 font-medium">Rejoignez-nous en quelques secondes.</p>
          </div>

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom Complet</label>
              <div className="relative group">
                <User size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Amadou Diallo"
                  className="w-full pl-16 pr-8 py-4 rounded-[24px] bg-white border border-slate-200 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse Email</label>
              <div className="relative group">
                <Mail size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full pl-16 pr-8 py-4 rounded-[24px] bg-white border border-slate-200 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Téléphone</label>
              <div className="relative group">
                <Phone size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  type="tel"
                  placeholder="+221 ..."
                  className="w-full pl-16 pr-8 py-4 rounded-[24px] bg-white border border-slate-200 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mot de Passe</label>
              <div className="relative group">
                <Lock size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-4 rounded-[24px] bg-white border border-slate-200 focus:outline-none focus:border-brand-green focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-start gap-3 p-4 bg-slate-100 rounded-[20px] mb-4">
              <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-brand-green rounded" />
              <label htmlFor="terms" className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                J&apos;accepte les <Link href="#" className="text-brand-green hover:underline">Conditions Générales</Link> et la <Link href="#" className="text-brand-green hover:underline">Politique de Confidentialité</Link>.
              </label>
            </div>

            <button
              type="submit"
              className="md:col-span-2 w-full py-5 bg-brand-green text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-[28px] transition-all shadow-2xl shadow-brand-green/30 hover:scale-[1.02] active:scale-95"
            >
              Créer mon compte
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-500">
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
