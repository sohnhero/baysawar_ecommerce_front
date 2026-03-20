"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Truck, 
  Check, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import Image from "next/image";

const steps = ["Livraison", "Expédition", "Paiement", "Succès"];

const deliveryMethods = [
  { id: "std", name: "Standard (Dakar)", price: 2000, time: "24-48h" },
  { id: "exp", name: "Express (Moins de 12h)", price: 4500, time: "Dakar uniquement" },
  { id: "reg", name: "Régions", price: 5000, time: "3-5 jours" },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0]);
  const { items, totalPrice, clearCart } = useCartStore();
  const shipping = deliveryMethod.price;
  const total = totalPrice() + shipping;

  if (items.length === 0 && step < 3) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-surface">
        <div className="text-center bg-background p-12 rounded-[40px] border border-border-color shadow-xl max-w-sm mx-4">
          <div className="w-20 h-20 bg-surface rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={40} className="text-muted" />
          </div>
          <h1 className="font-heading font-black text-2xl mb-2">Votre panier est vide</h1>
          <p className="text-muted text-sm mb-8">Ajoutez des trésors de l&apos;artisanat sénégalais avant de passer commande.</p>
          <Link href="/shop" className="inline-block w-full py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-green/20">
            Explorer la boutique
          </Link>
        </div>
      </div>
    );
  }

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);
  const handleConfirm = () => {
    clearCart();
    setStep(3);
  };

  return (
    <div className="min-h-screen bg-surface py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2">
            {/* Steps Progress */}
            <div className="relative flex justify-between mb-12 px-2">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border-color -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-brand-green transition-all duration-500 -translate-y-1/2 z-0" 
                style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
              />
              
              {steps.map((s, i) => (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-4 transition-all duration-500 ${
                      i <= step
                        ? "bg-brand-green text-white border-white scale-110 shadow-lg shadow-brand-green/20"
                        : "bg-surface text-muted border-border-color"
                    }`}
                  >
                    {i < step ? <Check size={18} /> : i + 1}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${i <= step ? "text-brand-green" : "text-muted"}`}>
                    {s}
                  </span>
                </div>
              ))}
            </div>

            {/* Forms */}
            <AnimatePresence mode="wait">
              {/* Step 0: Shipping Address */}
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm"
                >
                  <h2 className="font-heading font-black text-2xl mb-8 flex items-center gap-3">
                    <MapPin className="text-brand-green" /> Informations de livraison
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Nom complet</label>
                      <input type="text" placeholder="Ex: Amadou Diallo" className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Téléphone</label>
                      <input type="tel" placeholder="+221 77 ..." className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Ville</label>
                      <select className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all">
                        <option>Dakar</option>
                        <option>Thies</option>
                        <option>Saint-Louis</option>
                        <option>Ziguinchor</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Adresse précise</label>
                      <textarea rows={3} placeholder="Quartier, Rue, Porte, Indications..." className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all resize-none" />
                    </div>
                  </div>
                  <button onClick={handleNext} className="w-full mt-10 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3">
                    Continuer <ArrowRight size={18} />
                  </button>
                </motion.div>
              )}

              {/* Step 1: Delivery Method */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm"
                >
                  <h2 className="font-heading font-black text-2xl mb-8 flex items-center gap-3">
                    <Truck className="text-brand-green" /> Mode d&apos;expédition
                  </h2>
                  <div className="space-y-4">
                    {deliveryMethods.map((m) => (
                      <label
                        key={m.id}
                        className={`group flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                          deliveryMethod.id === m.id
                            ? "border-brand-green bg-brand-green/5 ring-4 ring-brand-green/5"
                            : "border-border-color hover:border-brand-green/30"
                        }`}
                        onClick={() => setDeliveryMethod(m)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryMethod.id === m.id ? "border-brand-green" : "border-border-color"}`}>
                            {deliveryMethod.id === m.id && <div className="w-3 h-3 bg-brand-green rounded-full" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{m.name}</p>
                            <p className="text-xs text-muted font-medium">{m.time}</p>
                          </div>
                        </div>
                        <p className="font-black text-brand-green">{m.price.toLocaleString()} FCFA</p>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button onClick={handlePrev} className="px-8 py-5 border border-border-color rounded-2xl font-bold text-muted hover:bg-surface transition-all">Retour</button>
                    <button onClick={handleNext} className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3">
                      Paiement <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm"
                >
                  <h2 className="font-heading font-black text-2xl mb-8 flex items-center gap-3">
                    <CreditCard className="text-brand-green" /> Méthode de paiement
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { id: "cod", label: "Paiement à la livraison", icon: <Truck size={24} />, desc: "Payez en espèces ou Wave à réception" },
                      { id: "om", label: "Orange Money", icon: <Phone size={24} />, desc: "+221 77 ..." },
                      { id: "wave", label: "Wave", icon: <Phone size={24} />, desc: "Scannez le code QR" },
                      { id: "card", label: "Carte Bancaire", icon: <CreditCard size={24} />, desc: "Visa, Mastercard" },
                    ].map((m) => (
                      <label key={m.id} className="group p-6 rounded-2xl border-2 border-border-color hover:border-brand-green/40 cursor-pointer transition-all flex flex-col gap-4">
                        <input type="radio" name="payment" className="hidden" defaultChecked={m.id === "cod"} />
                        <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center text-muted group-hover:text-brand-green group-hover:bg-brand-green/10 transition-all">
                          {m.icon}
                        </div>
                        <div>
                          <p className="font-bold text-sm mb-1">{m.label}</p>
                          <p className="text-[10px] text-muted leading-tight">{m.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-4 mt-10">
                    <button onClick={handlePrev} className="px-8 py-5 border border-border-color rounded-2xl font-bold text-muted hover:bg-surface transition-all">Retour</button>
                    <button onClick={handleConfirm} className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3">
                      Confirmer la commande <Check size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-background rounded-[40px] border border-border-color p-12 text-center shadow-sm"
                >
                  <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                    <Check size={48} />
                  </div>
                  <h2 className="font-heading font-black text-3xl mb-4">Commande Réussie ! 🎉</h2>
                  <p className="text-muted mb-8 max-w-sm mx-auto">Votre commande <span className="text-brand-blue font-bold">#ORD-2026-004</span> a été validée. Nous vous contacterons par téléphone d&apos;ici 15 minutes.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/account/orders" className="flex-1 py-4 bg-surface border border-border-color rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-background transition-all">
                      Suivre ma commande
                    </Link>
                    <Link href="/shop" className="flex-1 py-4 bg-brand-green text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-brand-green-light shadow-lg shadow-brand-green/20 transition-all">
                      Continuer
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Summary */}
          {step < 3 && (
            <div className="h-fit">
              <div className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl mb-6">Récapitulatif</h3>
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold line-clamp-1">{item.name}</p>
                        <p className="text-[10px] text-muted">Qté: {item.quantity}</p>
                        <p className="text-xs font-black mt-1">{(item.price * item.quantity).toLocaleString()} FCFA</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-6 border-t border-border-color">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted">Sous-total</span>
                    <span>{totalPrice().toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-muted">Livraison ({deliveryMethod.name.split(' ')[0]})</span>
                    <span>{shipping.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between text-lg font-black pt-2">
                    <span>Total</span>
                    <span className="text-brand-green">{total.toLocaleString()} FCFA</span>
                  </div>
                </div>
                
                <div className="mt-8 p-4 bg-surface rounded-2xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center shrink-0">
                    <ShieldCheck size={16} />
                  </div>
                  <p className="text-[10px] text-muted leading-relaxed">
                    Paiement 100% sécurisé. Baysawarr garantit l&apos;authenticité de tous ses produits.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
