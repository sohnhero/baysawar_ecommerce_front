"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, 
  Truck, 
  Check, 
  MapPin, 
  Phone, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  LogIn
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

const steps = ["Livraison", "Expédition", "Paiement", "Récapitulatif", "Succès"];

const deliveryMethods = [
  { id: "std", name: "Standard (Dakar)", price: 2000, time: "24-48h" },
  { id: "exp", name: "Express (Moins de 12h)", price: 4500, time: "Dakar uniquement" },
  { id: "reg", name: "Régions", price: 5000, time: "3-5 jours" },
];

type DeliveryMethod = typeof deliveryMethods[0];

import { z } from "zod";

const shippingSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  phone: z.string().regex(/^(77|78|76|70|75)[0-9]{7}$/, "Numéro de téléphone sénégalais invalide (77xxxxxxx)"),
  address: z.string().min(5, "L'adresse est trop courte"),
  city: z.string().min(1, "La ville est requise"),
});

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const { items, totalPrice, clearCart } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: "Dakar",
    address: user?.address || "",
    paymentMethod: "cod"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Sync with user data when it loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || ""
      }));
    }
  }, [user]);
  const shipping = deliveryMethod ? deliveryMethod.price : 0;
  const total = totalPrice() + shipping;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by waiting for mount
  if (!mounted) return null;

  // Auth guard — must be logged in to checkout
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-surface">
        <div className="text-center bg-background p-12 rounded-[40px] border border-border-color shadow-xl max-w-sm mx-4">
          <div className="w-20 h-20 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-brand-green" />
          </div>
          <h1 className="font-heading font-black text-2xl mb-2">Connexion requise</h1>
          <p className="text-muted text-sm mb-8">Veuillez vous connecter pour passer votre commande.</p>
          <Link href="/login" className="inline-block w-full py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-green/20">
            Se Connecter
          </Link>
          <Link href="/register" className="block mt-4 text-sm text-muted hover:text-brand-green transition-colors">
            Pas encore de compte ? Créer un compte
          </Link>
        </div>
      </div>
    );
  }

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


  const validateStep = () => {
    if (step === 0) {
      const result = shippingSchema.safeParse(formData);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          const path = issue.path[0];
          if (path) {
            newErrors[path.toString()] = issue.message;
          }
        });
        setErrors(newErrors);
        return false;
      }
    }

    setErrors({});
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    } else {
      toast.error("Veuillez corriger les erreurs avant de continuer.");
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep(step - 1);
  };

  const handleConfirm = async () => {
    if (!validateStep()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: parseFloat(item.price.toString())
        })),
        shippingAddress: `${formData.address}, ${formData.city}`,
        phone: formData.phone.trim(),
        totalAmount: parseFloat(total.toString()),
        paymentMethod: formData.paymentMethod
      };

      const result = await api.post<any>("/orders", orderData);

      // Paiement en ligne → le backend retourne directement paymentUrl
      if (formData.paymentMethod !== "cod" && result.paymentUrl) {
        clearCart();
        window.location.href = result.paymentUrl;
        return;
      }

      // Paiement en ligne mais échec d'initiation
      if (formData.paymentMethod !== "cod" && result.paymentError) {
        toast.error("Impossible d'initier le paiement. Réessayez ou choisissez un autre mode.");
        return;
      }

      // Paiement à la livraison → succès direct
      setOrderId(result.id);
      clearCart();
      setStep(4);
    } catch (error: any) {
      console.error("Failed to create order:", error);
      const message = error.message || "Une erreur est survenue lors de la création de la commande.";
      toast.error(message);

      // If it's a validation error about phone, go back to step 0
      if (message.toLowerCase().includes("phone") || message.toLowerCase().includes("téléphone")) {
        setStep(0);
        setErrors({ phone: "Numéro de téléphone invalide" });
      }
    } finally {
      setLoading(false);
    }
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
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({...formData, name: e.target.value});
                          if (errors.name) setErrors({...errors, name: ""});
                        }}
                        placeholder="Ex: Amadou Diallo" 
                        className={`w-full px-5 py-4 rounded-2xl bg-surface border transition-all focus:outline-none ${
                          errors.name ? "border-red-500 ring-4 ring-red-500/5" : "border-border-color focus:border-brand-green"
                        }`} 
                      />
                      {errors.name && <p className="text-[10px] text-red-500 font-bold mt-2 ml-2 tracking-wide uppercase">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Téléphone</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({...formData, phone: e.target.value});
                          if (errors.phone) setErrors({...errors, phone: ""});
                        }}
                        placeholder="+221 77 ..." 
                        className={`w-full px-5 py-4 rounded-2xl bg-surface border transition-all focus:outline-none ${
                          errors.phone ? "border-red-500 ring-4 ring-red-500/5" : "border-border-color focus:border-brand-green"
                        }`} 
                      />
                      {errors.phone && <p className="text-[10px] text-red-500 font-bold mt-2 ml-2 tracking-wide uppercase">{errors.phone}</p>}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Ville</label>
                      <select 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full px-5 py-4 rounded-2xl bg-surface border border-border-color focus:outline-none focus:border-brand-green transition-all"
                      >
                        <option>Dakar</option>
                        <option>Thies</option>
                        <option>Saint-Louis</option>
                        <option>Ziguinchor</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold text-muted uppercase tracking-wider mb-2 block">Adresse précise</label>
                      <textarea 
                        rows={3} 
                        value={formData.address}
                        onChange={(e) => {
                          setFormData({...formData, address: e.target.value});
                          if (errors.address) setErrors({...errors, address: ""});
                        }}
                        placeholder="Quartier, Rue, Porte, Indications..." 
                        className={`w-full px-5 py-4 rounded-2xl bg-surface border transition-all focus:outline-none resize-none ${
                          errors.address ? "border-red-500 ring-4 ring-red-500/5" : "border-border-color focus:border-brand-green"
                        }`} 
                      />
                      {errors.address && <p className="text-[10px] text-red-500 font-bold mt-2 ml-2 tracking-wide uppercase">{errors.address}</p>}
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
                          deliveryMethod?.id === m.id
                            ? "border-brand-green bg-brand-green/5 ring-4 ring-brand-green/5"
                            : "border-border-color hover:border-brand-green/30"
                        }`}
                        onClick={() => setDeliveryMethod(m)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${deliveryMethod?.id === m.id ? "border-brand-green" : "border-border-color"}`}>
                            {deliveryMethod?.id === m.id && <div className="w-3 h-3 bg-brand-green rounded-full" />}
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
                    <button 
                      onClick={handleNext} 
                      disabled={!deliveryMethod}
                      className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale-[0.5]"
                    >
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
                      <label 
                        key={m.id} 
                        className={`group p-6 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-4 ${
                          formData.paymentMethod === m.id ? "border-brand-green bg-brand-green/5" : "border-border-color hover:border-brand-green/30"
                        }`}
                        onClick={() => setFormData({...formData, paymentMethod: m.id})}
                      >
                        <input type="radio" name="payment" className="hidden" checked={formData.paymentMethod === m.id} readOnly />
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          formData.paymentMethod === m.id ? "bg-brand-green text-white" : "bg-surface text-muted"
                        }`}>
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
                    <button 
                      onClick={handleNext} 
                      className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3 shadow-xl"
                    >
                      Vérifier la commande <ArrowRight size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Recap/Review */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm"
                >
                  <h2 className="font-heading font-black text-2xl mb-8 flex items-center gap-3">
                    <Check className="text-brand-green" /> Récapitulatif
                  </h2>
                  
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-surface border border-border-color">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted">Informations personnelles</h3>
                        <button onClick={() => setStep(0)} className="text-[10px] font-black text-brand-blue uppercase hover:underline">Modifier</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Nom</p>
                          <p className="text-sm font-bold">{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Téléphone</p>
                          <p className="text-sm font-bold">{formData.phone}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Adresse de livraison</p>
                          <p className="text-sm font-bold">{formData.address}, {formData.city}</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface border border-border-color">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-muted">Expédition & Paiement</h3>
                        <div className="flex gap-4">
                          <button onClick={() => setStep(1)} className="text-[10px] font-black text-brand-blue uppercase hover:underline">Livraison</button>
                          <button onClick={() => setStep(2)} className="text-[10px] font-black text-brand-blue uppercase hover:underline">Paiement</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Mode d&apos;expédition</p>
                          <p className="text-sm font-bold">{deliveryMethod?.name}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted font-bold uppercase mb-1">Méthode de paiement</p>
                          <p className="text-sm font-bold uppercase">{formData.paymentMethod === 'cod' ? 'Paiement à la livraison' : formData.paymentMethod}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button onClick={handlePrev} className="px-8 py-5 border border-border-color rounded-2xl font-bold text-muted hover:bg-surface transition-all">Retour</button>
                    <button 
                      onClick={handleConfirm} 
                      disabled={loading}
                      className="flex-1 py-5 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-brand-green/20 hover:bg-brand-green-light transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                      {loading ? "Traitement..." : "Confirmer ma commande"} <Check size={18} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <motion.div
                  key="step3"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-background rounded-[40px] border border-border-color p-12 text-center shadow-sm"
                >
                  <div className="w-24 h-24 bg-brand-green/10 text-brand-green rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                    <Check size={48} />
                  </div>
                  <h2 className="font-heading font-black text-3xl mb-4">Commande Réussie ! 🎉</h2>
                  <p className="text-muted mb-8 max-w-sm mx-auto">Votre commande <span className="text-brand-blue font-bold">#{orderId?.substring(0,8).toUpperCase()}</span> a été validée. Nous vous contacterons par téléphone d&apos;ici 15 minutes.</p>
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
          {step < 4 && (
            <div className="h-fit">
              <div className="bg-background rounded-[32px] border border-border-color p-8 shadow-sm">
                <h3 className="font-heading font-black text-xl mb-6">Récapitulatif</h3>
                <div className="space-y-4 mb-8">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
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
                    <span className="text-muted">Livraison {deliveryMethod ? `(${(deliveryMethod.name || "").split(' ')[0]})` : "" }</span>
                    <span className={!deliveryMethod ? "text-brand-green font-bold animate-pulse" : ""}>
                      {deliveryMethod ? `${shipping.toLocaleString()} FCFA` : "À sélectionner"}
                    </span>
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
