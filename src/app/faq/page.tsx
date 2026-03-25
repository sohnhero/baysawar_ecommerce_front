"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown, HelpCircle, Search, Sparkles } from "lucide-react";

const faqs = [
  {
    category: "Commandes",
    questions: [
      { q: "Comment suivre ma commande ?", a: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pouvez également consulter l'état de votre commande dans votre espace 'Mon Compte'." },
      { q: "Puis-je modifier ma commande après validation ?", a: "Malheureusement, une fois la commande validée, elle entre immédiatement en préparation. Contactez notre support au plus vite pour toute demande urgente." }
    ]
  },
  {
    category: "Paiement & Sécurité",
    questions: [
      { q: "Quels sont les modes de paiement acceptés ?", a: "Nous acceptons les paiements par carte bancaire (Visa, Mastercard), Wave, Orange Money et le paiement à la livraison dans certaines zones." },
      { q: "Mes informations de paiement sont-elles sécurisées ?", a: "Absolument. Nous utilisons un cryptage SSL de pointe et ne stockons jamais vos coordonnées bancaires complètes." }
    ]
  },
  {
    category: "Livraison & Retours",
    questions: [
      { q: "Quels sont les délais de livraison ?", a: "Pour Dakar, comptez 24h à 48h. Pour les autres régions du Sénégal, entre 3 et 5 jours ouvrés." },
      { q: "Quelle est votre politique de retour ?", a: "Vous disposez de 14 jours pour nous retourner un article s'il ne vous convient pas, à condition qu'il soit dans son emballage d'origine." }
    ]
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <div className="bg-brand-blue py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Centre d'aide</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-12">
            Questions <span className="text-brand-green">Fréquentes</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative">
             <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
             <input
               type="text"
               placeholder="Une question ? Cherchez ici..."
               className="w-full pl-16 pr-8 py-6 rounded-3xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:bg-white/20 transition-all font-medium"
             />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-16">
        {faqs.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green mb-8 flex items-center gap-3">
              <span className="w-8 h-px bg-brand-green/20" />
              {group.category}
            </h2>
            <div className="space-y-4">
              {group.questions.map((faq, i) => {
                const id = `${groupIdx}-${i}`;
                const isOpen = openIndex === id;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`bg-white rounded-[28px] border transition-all duration-300 overflow-hidden ${
                       isOpen ? "border-brand-green shadow-xl shadow-brand-green/5" : "border-slate-100 shadow-sm"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : id)}
                      className="w-full p-8 flex items-center justify-between text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                           isOpen ? "bg-brand-green text-white" : "bg-slate-50 text-slate-400"
                        }`}>
                           <HelpCircle size={18} />
                        </div>
                        <span className="font-black text-brand-blue tracking-tight leading-tight">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown 
                        size={20} 
                        className={`text-slate-300 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-8 pb-8 pl-[72px] text-slate-500 font-medium leading-relaxed text-sm">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
