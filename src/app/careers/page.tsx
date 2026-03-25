"use client";

import { motion } from "framer-motion";
import { Sparkles, Users, Coffee, Rocket, Heart, Briefcase, ArrowRight, UserCheck } from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const jobs = [
    { title: "Responsable Logistique", location: "Dakar, Sénégal", type: "CDI" },
    { title: "Développeur FullStack Next.js", location: "Remote / Dakar", type: "CDI" },
    { title: "Chargé de Relation Artisans", location: "Saint-Louis, Sénégal", type: "Freelance" },
    { title: "Designer UI/UX", location: "Remote", type: "CDD" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-blue py-32 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] border border-white/20 rounded-full animate-ping" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Rejoignez l'aventure</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
            Façonnez <span className="text-brand-green">l'Avenir</span> <br /> de l'Artisanat.
          </h1>
          <p className="max-w-xl mx-auto text-white/60 text-lg font-medium">
            Nous recherchons des talents passionnés pour transformer la manière dont le monde découvre et achète l'artisanat sénégalais.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: <Coffee />, title: "Culture inclusive", desc: "Un environnement où chaque voix compte." },
            { icon: <Rocket />, title: "Croissance", desc: "Apprentissage continu et défis stimulants." },
            { icon: <Heart />, title: "Impact", desc: "Contribuez directement au succès des artisans." },
            { icon: <Users />, title: "Équipe passionnée", desc: "Travaillez avec les meilleurs dans leur domaine." }
          ].map((perk, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:scale-[1.02] transition-all group"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-brand-green group-hover:text-white transition-all text-brand-green">
                {perk.icon}
              </div>
              <h3 className="font-black text-brand-blue mb-2 uppercase text-[10px] tracking-widest">{perk.title}</h3>
              <p className="text-slate-500 font-medium text-sm leading-relaxed">{perk.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-blue tracking-tighter mb-4">Postes Ouverts</h2>
            <div className="w-20 h-1.5 bg-brand-green mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {jobs.map((job, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-8 rounded-[32px] border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-2xl transition-all"
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Briefcase size={16} className="text-brand-green" />
                    <h3 className="text-xl font-black text-brand-blue">{job.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>{job.location}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                    <span className="text-brand-green">{job.type}</span>
                  </div>
                </div>
                <Link 
                  href="#"
                  className="inline-flex items-center gap-3 px-6 py-3 bg-brand-blue text-white font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-brand-green transition-all group-hover:scale-105"
                >
                  Postuler <UserCheck size={16} />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-slate-500 font-medium text-sm mb-6 italic">
              "Vous ne voyez pas de poste correspondant ? Envoyez-nous une candidature spontanée !"
            </p>
            <Link href="#" className="font-black text-brand-green hover:underline uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2">
              Nous contacter <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
