"use client";

import { motion } from "framer-motion";
import { RotateCcw, ShieldCheck, Mail, Clock, HelpCircle, Sparkles, Scale } from "lucide-react";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-brand-blue py-24 relative overflow-hidden text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Politique de retour</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Satisfait ou <span className="text-brand-green">Remboursé.</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/60 text-lg font-medium">
            Votre satisfaction est notre priorité. Si un produit ne vous convient pas, nous facilitons son retour.
          </p>
        </div>
      </div>

      {/* Steps Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid md:grid-cols-3 gap-8">
           {[
             { icon: <RotateCcw />, title: "Délai de 14 jours", desc: "Vous avez 14 jours calendrier pour changer d'avis après la réception." },
             { icon: <ShieldCheck />, title: "État d'origine", desc: "L'article doit être inutilisé et dans son emballage d'origine scellé." },
             { icon: <Mail />, title: "Notification", desc: "Contactez-nous par email pour obtenir votre bordereau de retour." }
           ].map((step, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className="bg-white p-10 rounded-[40px] shadow-xl border border-slate-100 text-center"
             >
               <div className="w-16 h-16 bg-brand-green/5 rounded-2xl flex items-center justify-center mx-auto mb-8 text-brand-green">
                  {step.icon}
               </div>
               <h3 className="text-xl font-black text-brand-blue mb-4">{step.title}</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed">{step.desc}</p>
             </motion.div>
           ))}
        </div>

        {/* Legal Text */}
        <div className="mt-24 grid lg:grid-cols-2 gap-16 items-start">
           <div className="bg-white p-12 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex items-center gap-4">
                 <Scale size={24} className="text-brand-green" />
                 <h2 className="text-2xl font-black text-brand-blue tracking-tight">Conditions Générales</h2>
              </div>
              <div className="space-y-6 text-slate-600 font-medium text-sm leading-loose">
                 <p>
                    <span className="font-black text-brand-blue">1. Frais de retour :</span> Les frais de transport pour le renvoi d'un produit sont à la charge du client, sauf en cas d'erreur de notre part ou de produit défectueux à l'arrivée.
                 </p>
                 <p>
                    <span className="font-black text-brand-blue">2. Remboursement :</span> Une fois l'article vérifié par nos équipes, le remboursement sera effectué sous 7 à 10 jours ouvrés via le même mode de paiement utilisé lors de l'achat.
                 </p>
                 <p>
                    <span className="font-black text-brand-blue">3. Articles non-retournables :</span> Pour des raisons d'hygiène, les produits cosmétiques ou alimentaires ouverts ne peuvent faire l'objet d'un retour.
                 </p>
              </div>
           </div>

           <div className="space-y-10">
              <h2 className="text-4xl font-black text-brand-blue tracking-tighter">Besoin d'aide avec un retour ?</h2>
              <p className="text-slate-500 font-medium">Nos conseillers sont disponibles pour vous accompagner dans votre démarche de 9h à 18h.</p>
              
              <div className="space-y-4">
                 {[
                   { icon: <Clock size={18} />, title: "Préparation", desc: "Préparez votre numéro de commande pour un traitement rapide." },
                   { icon: <HelpCircle size={18} />, title: "Support Client", desc: "support@baysawarr.sn | +221 78 634 95 73" }
                 ].map((v, i) => (
                   <div key={i} className="flex gap-4 p-6 rounded-3xl bg-white/60 backdrop-blur-sm border border-slate-100">
                      <div className="text-brand-green shrink-0">{v.icon}</div>
                      <div>
                         <h4 className="font-black text-brand-blue text-xs uppercase tracking-widest">{v.title}</h4>
                         <p className="text-slate-500 text-xs font-medium mt-1">{v.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="pt-8">
                 <div className="bg-brand-green p-8 rounded-[32px] text-white shadow-xl shadow-brand-green/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-[100px] group-hover:scale-110 transition-transform duration-700" />
                    <p className="font-black text-lg mb-2 tracking-tight">Qualité Garantie</p>
                    <p className="text-sm font-medium opacity-80 leading-relaxed">Chaque artisanat que nous vendons est inspecté pour garantir sa longévité et sa beauté.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
