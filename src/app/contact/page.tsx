"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageSquare, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
       setLoading(false);
       toast.success("Votre message a été envoyé avec succès ! Nous vous répondrons sous 24h.");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-brand-blue py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Contactez-nous</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Parlons de <span className="text-brand-green">vos Envies.</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/60 text-lg font-medium">
             Questions, suggestions ou simplement un coucou ? Notre équipe est à votre écoute.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Contact Info */}
           <div className="lg:col-span-1 space-y-6">
              {[
                { icon: <Mail />, title: "Ecrivez-nous", info: "contact@baysawarr.sn", sub: "Réponse sous 24h" },
                { icon: <Phone />, title: "Appelez-nous", info: "+221 78 634 95 73", sub: "Lun-Sam, 9h-18h" },
                { icon: <MapPin />, title: "Notre Bureau", info: "Dakar, Plateau", sub: "Quartier des Arts" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl flex items-center gap-6 group hover:translate-x-2 transition-all"
                >
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-brand-green group-hover:bg-brand-green group-hover:text-white transition-all">
                      {item.icon}
                   </div>
                   <div>
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{item.title}</h3>
                      <p className="font-black text-brand-blue tracking-tight">{item.info}</p>
                      <p className="text-[10px] text-slate-400 font-bold italic">{item.sub}</p>
                   </div>
                </motion.div>
              ))}

              <div className="bg-brand-green/5 p-8 rounded-[40px] border border-brand-green/10 mt-12">
                 <div className="flex items-center gap-3 mb-4">
                    <MessageSquare size={18} className="text-brand-green" />
                    <span className="font-black text-brand-blue uppercase text-[10px] tracking-widest">Support Live</span>
                 </div>
                 <p className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                    Besoin d'une réponse immédiate ? Utilisez notre chat en bas à droite de l'écran.
                 </p>
                 <button className="w-full py-4 rounded-2xl bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest hover:bg-brand-blue-light transition-all">
                    Lancer le Chat
                 </button>
              </div>
           </div>

           {/* Contact Form */}
           <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             className="lg:col-span-2 bg-white rounded-[48px] p-12 md:p-16 border border-slate-100 shadow-2xl"
           >
              <form onSubmit={handleSubmit} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom complet</label>
                       <input 
                         required
                         placeholder="Jean Dupont"
                         className="w-full px-8 py-5 rounded-[28px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-green focus:bg-white transition-all font-bold text-slate-900" 
                       />
                    </div>
                    <div className="space-y-4">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Email</label>
                       <input 
                         type="email"
                         required
                         placeholder="jean@exemple.com"
                         className="w-full px-8 py-5 rounded-[28px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-green focus:bg-white transition-all font-bold text-slate-900" 
                       />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Sujet</label>
                    <input 
                       required
                       placeholder="Comment pouvons-nous vous aider ?"
                       className="w-full px-8 py-5 rounded-[28px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-green focus:bg-white transition-all font-bold text-slate-900" 
                    />
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Message</label>
                    <textarea 
                       required
                       rows={6}
                       placeholder="Écrivez votre message ici..."
                       className="w-full px-8 py-6 rounded-[32px] bg-slate-50 border border-slate-100 focus:outline-none focus:border-brand-green focus:bg-white transition-all font-bold text-slate-900 resize-none" 
                    />
                 </div>

                 <button
                   type="submit"
                   disabled={loading}
                   className="w-full py-6 rounded-[32px] bg-brand-green text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-green/30 hover:shadow-brand-green/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {loading ? "Envoi en cours..." : "Envoyer le message"} <Send size={18} />
                 </button>
              </form>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
