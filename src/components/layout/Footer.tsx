"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Boutique: [
    { label: "Artisanat", href: "/shop?cat=artisanat" },
    { label: "Alimentaire", href: "/shop?cat=alimentaire" },
    { label: "Traditionnel", href: "/shop?cat=traditionnel" },
    { label: "Nouveautés", href: "/shop" },
  ],
  Entreprise: [
    { label: "À propos", href: "/about" },
    { label: "Nos artisans", href: "/#artisans" },
    { label: "Blog", href: "/blog" },
    { label: "Carrières", href: "/careers" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api'}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubscribed(true);
        setEmail("");
        setTimeout(() => setSubscribed(false), 5000);
      }
    } catch (error) {
      console.error("Newsletter subscription failed:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <footer className="bg-brand-blue text-white/90">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-heading font-bold text-xl mb-1">
                Restez connecté
              </h3>
              <p className="text-white/60 text-sm">
                Recevez nos offres exclusives et découvertes artisanales
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-2">
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-6 py-3 bg-brand-green/10 text-brand-green rounded-xl text-sm font-bold border border-brand-green/20"
                >
                  <CheckCircle2 size={16} /> Merci pour votre inscription !
                </motion.div>
              ) : (
                <>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="w-full md:w-72 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-sm placeholder:text-white/40 focus:outline-none focus:border-brand-green transition-colors disabled:opacity-50"
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-6 py-3 bg-brand-green hover:bg-brand-green-light rounded-xl text-sm font-semibold whitespace-nowrap transition-colors disabled:opacity-50"
                  >
                    {loading ? "Chargement..." : "S'inscrire"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden transition-transform group-hover:scale-110">
                <Image
                  src="/logo_baysawarr.jpg"
                  alt="Baysawarr Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-heading font-bold text-lg">
                Baysawarr
              </span>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              La marketplace premium de l&apos;artisanat et des produits
              authentiques du Sénégal.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-white/70">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Baysawarr. Tous droits réservés.
          </p>
          <p className="text-xs text-white/40 flex items-center gap-1">
            Fait avec <Heart size={12} className="text-brand-green" /> au
            Sénégal
          </p>
        </div>
      </div>
    </footer>
  );
}
