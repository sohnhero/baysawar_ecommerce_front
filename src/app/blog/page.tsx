"use client";

import { motion } from "framer-motion";
import { Sparkles, Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const blogPosts = [
  {
    id: 1,
    title: "L'Art de la Poterie Traditionnelle au Sénégal",
    excerpt: "Découvrez les techniques ancestrales utilisées par les artisans de la région de Casamance pour créer des pièces uniques.",
    image: "https://images.unsplash.com/photo-1565191999001-551c187427bb?q=80&w=800&auto=format&fit=crop",
    date: "24 Mars 2026",
    author: "Baysawarr Editorial",
    category: "Artisanat"
  },
  {
    id: 2,
    title: "Le Textile Sénégalais : Un Héritage de Couleurs",
    excerpt: "Plongée au cœur des ateliers de teinture de Dakar où le basin et le wax prennent vie sous les mains expertes.",
    image: "https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=800&auto=format&fit=crop",
    date: "15 Mars 2026",
    author: "Fatou Diop",
    category: "Mode"
  },
  {
    id: 3,
    title: "Consommer Local : Pourquoi c'est important ?",
    excerpt: "Comprendre l'impact économique et social de vos achats sur la plateforme Baysawarr pour les communautés locales.",
    image: "https://images.unsplash.com/photo-1590736968032-4e4ad1d65922?q=80&w=800&auto=format&fit=crop",
    date: "05 Mars 2026",
    author: "Amadou Sow",
    category: "Économie"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-brand-blue py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8"
          >
            <Sparkles size={14} className="text-brand-green" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Le Mag Baysawarr</span>
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            Récits de <span className="text-brand-green">Terroir</span>
          </h1>
          <p className="max-w-2xl mx-auto text-white/60 text-lg font-medium">
            Histoires d'artisans, guides d'achat et immersion dans la culture sénégalaise.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Featured Post */}
        <div className="mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group grid lg:grid-cols-2 bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100"
          >
            <div className="relative aspect-video lg:aspect-auto overflow-hidden">
              <Image 
                src={blogPosts[0].image} 
                alt={blogPosts[0].title} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-8 left-8">
                <span className="px-4 py-2 bg-brand-green/90 backdrop-blur-md text-white text-[10px] font-black rounded-lg uppercase tracking-widest shadow-xl">
                  À la une
                </span>
              </div>
            </div>
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <div className="flex items-center gap-6 text-[10px] font-black text-brand-green uppercase tracking-widest mb-6">
                <span className="flex items-center gap-2"><Calendar size={14} /> {blogPosts[0].date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <span className="flex items-center gap-2"><BookOpen size={14} /> {blogPosts[0].category}</span>
              </div>
              <h2 className="text-4xl font-black text-brand-blue tracking-tighter mb-8 group-hover:text-brand-green transition-colors leading-tight">
                {blogPosts[0].title}
              </h2>
              <p className="text-slate-500 font-medium text-lg mb-10 leading-relaxed italic">
                "{blogPosts[0].excerpt}"
              </p>
              <Link 
                href="#"
                className="inline-flex items-center gap-3 text-brand-blue font-black text-[10px] uppercase tracking-[0.2em] group/link"
              >
                Lire l'article complet <ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Post Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {blogPosts.slice(1).concat(blogPosts[0]).map((post, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image 
                  src={post.image} 
                  alt={post.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[9px] font-black text-brand-green uppercase tracking-[0.2em] px-3 py-1 bg-brand-green/5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">{post.date}</span>
                </div>
                <h3 className="text-xl font-black text-brand-blue mb-4 group-hover:text-brand-green transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                         <User size={14} className="text-slate-400" />
                      </div>
                      <span className="text-[10px] font-black uppercase text-slate-400">{post.author}</span>
                   </div>
                   <Link href="#" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-brand-green group-hover:text-white transition-all">
                      <ArrowRight size={18} />
                   </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
