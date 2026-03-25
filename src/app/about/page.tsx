"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart, Users, Globe, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-brand-blue">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=2000&auto=format&fit=crop"
            alt="Artisanal Work"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-blue/60 to-brand-blue" />
        
        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Notre Histoire</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6"
          >
            Baysa<span className="text-brand-green">warr</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-white/70 text-lg font-medium"
          >
            La destination ultime pour l'artisanat sénégalais d'exception. 
            Nous connectons les talents locaux au monde entier.
          </motion.p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black text-brand-blue tracking-tighter mb-6">
              Notre Mission : <br />
              <span className="text-brand-green underline decoration-brand-green/30 decoration-8 underline-offset-8">Valoriser l'Excellence</span>
            </h2>
            <div className="space-y-6 text-slate-600 font-medium leading-relaxed">
              <p>
                Fondée sur une passion profonde pour l'héritage culturel du Sénégal, Baysawarr est née d'un constat simple : 
                l'artisanat local mérite une vitrine à la hauteur de sa qualité exceptionnelle.
              </p>
              <p>
                Nous travaillons main dans la main avec des artisans à travers tout le pays pour sélectionner, 
                sublimer et distribuer des produits qui racontent une histoire, porteurs d'un savoir-faire ancestral 
                transmis de génération en génération.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-8">
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-black text-brand-blue">100%</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Commerce Équitable</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-3xl font-black text-brand-blue">250+</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Artisans Partenaires</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1590736968032-4e4ad1d65922?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan at work"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-brand-blue tracking-tighter mb-4">Nos Valeurs Fondamentales</h2>
            <p className="text-slate-500 font-medium uppercase text-[10px] tracking-[0.2em]">Ce qui nous définit au quotidien</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                icon: <ShieldCheck className="text-brand-green" />, 
                title: "Authenticité", 
                desc: "Chaque produit est certifié d'origine artisanale sénégalaise, garantissant une pièce unique et véritable." 
              },
              { 
                icon: <Heart className="text-brand-green" />, 
                title: "Impact Social", 
                desc: "Nous assurons une rémunération juste et directe à nos artisans, soutenant ainsi des communautés entières." 
              },
              { 
                icon: <Award className="text-brand-green" />, 
                title: "Qualité Premium", 
                desc: "Un contrôle qualité rigoureux pour vous offrir uniquement l'excellence de l'artisanat local." 
              }
            ].map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                <div className="w-14 h-14 bg-brand-green/5 rounded-2xl flex items-center justify-center mb-6">
                  {v.icon}
                </div>
                <h3 className="text-xl font-black text-brand-blue mb-4">{v.title}</h3>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-brand-blue rounded-[50px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-brand-blue/20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-green/10 rounded-full blur-[100px] -ml-32 -mt-32" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-8 italic">
              Prêt à découvrir <br /> <span className="text-brand-green">l'authenticité ?</span>
            </h2>
            <Link 
              href="/shop"
              className="inline-flex items-center gap-3 px-10 py-5 bg-brand-green hover:bg-brand-green-light text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl shadow-brand-green/30"
            >
              Explorer la boutique <Globe size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
