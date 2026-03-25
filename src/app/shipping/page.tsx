"use client";

import { motion } from "framer-motion";
import { Truck, Globe, Clock, ShieldCheck, MapPin, Sparkles, Box } from "lucide-react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-brand-blue py-24 relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Logistique & Délais</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Livraison <span className="text-brand-green">& Suivi</span>
          </h1>
          <p className="max-w-xl mx-auto text-white/60 text-lg font-medium">
            Nous expédions vos trésors avec le plus grand soin, partout au Sénégal et dans le monde.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {[
            { icon: <Truck />, title: "Dakar & Banlieue", time: "24h - 48h", price: "À partir de 1 500 FCFA" },
            { icon: <Globe />, title: "Régions (Sénégal)", time: "3 - 5 jours", price: "À partir de 3 000 FCFA" },
            { icon: <Clock />, title: "International", time: "7 - 12 jours", price: "Sur devis personnalisé" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-10 rounded-[40px] bg-slate-50 border border-slate-100 text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm text-brand-green">
                {item.icon}
              </div>
              <h3 className="text-xl font-black text-brand-blue mb-4">{item.title}</h3>
              <div className="space-y-2">
                 <p className="text-brand-green font-black uppercase text-[10px] tracking-widest">{item.time}</p>
                 <p className="text-slate-500 font-medium text-sm">{item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative aspect-video rounded-[48px] overflow-hidden shadow-2xl">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              src="https://cdn.pixabay.com/vimeo/328229712/package-delivery-22442.mp4?width=1280&hash=8f8d6d6a2e9d9e9e9e9e9e9e9e9e9e9e"
            />
            <div className="absolute inset-0 bg-brand-blue/20" />
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-brand-blue tracking-tighter">
              Un Emballage <br />
              <span className="text-brand-green">Éco-responsable.</span>
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              Chez Baysawarr, nous portons une attention particulière à la protection de vos articles. 
              Chaque produit est soigneusement emballé dans des matériaux recyclables ou biodégradables, 
              reflétant notre engagement envers l'environnement.
            </p>
            <div className="space-y-4">
               {[
                 { icon: <ShieldCheck size={18} />, title: "Colis sécurisés", desc: "Protection renforcée pour les objets fragiles." },
                 { icon: <MapPin size={18} />, title: "Suivi en temps réel", desc: "Notifications par SMS et Email à chaque étape." },
                 { icon: <Box size={18} />, title: "Retrait en point relais", desc: "Disponible dans nos de stations partenaires." }
               ].map((v, i) => (
                 <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm border-l-4 border-l-brand-green">
                    <div className="text-brand-green shrink-0">{v.icon}</div>
                    <div>
                       <h4 className="font-black text-brand-blue text-xs uppercase tracking-widest">{v.title}</h4>
                       <p className="text-slate-500 text-xs font-medium mt-1">{v.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
