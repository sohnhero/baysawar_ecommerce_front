"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Phone, MapPin, ArrowLeft, ArrowRight, Sparkles, CheckCircle2, Eye, EyeOff, Store, Briefcase, FileText, Camera, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "react-toastify";
import { AnimatePresence } from "framer-motion";
import { api, validateImageSize } from "@/lib/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Format d'e-mail invalide"),
  phone: z.string().regex(/^(77|78|76|70|75)[0-9]{7}$/, "Numéro de téléphone sénégalais invalide (ex: 771234567)"),
  address: z.string().min(5, "L'adresse est trop courte"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
  isSeller: z.boolean(),
  shopName: z.string().optional(),
  shopLocation: z.string().optional(),
  shopImage: z.string().optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
}).refine((data) => {
  if (data.isSeller) {
    return !!data.shopName && !!data.specialty && !!data.bio;
  }
  return true;
}, {
  message: "Veuillez remplir tous les champs vendeur",
  path: ["shopName"], // showing error on shopName for simplicity
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      isSeller: false
    }
  });

  const isSeller = watch("isSeller");
  const name = watch("name");
  const email = watch("email");
  const phone = watch("phone");

  const nextStep = async () => {
    let fieldsToValidate: (keyof RegisterForm)[] = [];
    if (step === 1) fieldsToValidate = ["name", "email", "phone"];
    if (step === 2) fieldsToValidate = ["password", "isSeller"];
    if (step === 3) fieldsToValidate = ["address"];
    
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError("");

    try {
      const payload = {
        ...data,
        sellerData: data.isSeller ? {
          name: data.shopName,
          specialty: data.specialty,
          bio: data.bio,
          location: data.shopLocation || data.address,
          image: data.shopImage
        } : undefined
      };
      
      await api.post("/auth/register", payload);
      toast.success("Compte créé avec succès ! Veuillez vous connecter.");
      router.push("/login?registered=true");
    } catch (err: any) {
      const msg = err.message === "User already exists" ? "Cet utilisateur existe déjà" : err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen bg-slate-50 flex overflow-x-hidden lg:overflow-hidden">
      {/* Visual Side (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-green">
        <Image
          src="https://images.unsplash.com/photo-1544965850-6f8a66788f9b?q=80&w=1200&auto=format&fit=crop"
          alt="Baysawarr Craft"
          fill
          className="object-cover opacity-50 mix-blend-overlay scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-green/80 via-brand-green/40 to-transparent" />
        
        <div className="relative z-10 w-full p-20 flex flex-col justify-between">
          <Link href="/" className="flex items-center gap-3">
             <div className="relative w-12 h-12 rounded-lg overflow-hidden transition-transform hover:scale-105">
                <Image 
                   src="/logo_baysawarr.jpg" 
                   alt="Baysawarr Logo" 
                   fill 
                   className="object-contain"
                   priority
                />
             </div>
             <span className="text-white font-heading font-black text-2xl tracking-tighter">Baysa<span className="text-slate-900">warr</span></span>
          </Link>

          <div className="max-w-md text-white">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-6"
            >
              <Sparkles size={14} className="text-amber-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Rejoignez la Communauté</span>
            </motion.div>
            <h2 className="text-6xl font-black leading-[0.9] tracking-tighter mb-8">
              Le Savoir-Faire <br />
              <span className="text-slate-900">À Votre Portée.</span>
            </h2>
            
            <div className="space-y-4">
               {[
                 "Accès exclusif aux nouvelles collections",
                 "Suivi de commande en temps réel",
                 "Offres spéciales pour les membres",
                 "Support direct aux vendeurs locaux"
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-slate-900" />
                    <span className="text-lg font-medium opacity-90">{text}</span>
                 </div>
               ))}
            </div>
          </div>

          <p className="text-white/50 text-sm font-bold uppercase tracking-widest">
            © 2026 Baysawarr — Sénégal
          </p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:px-12 relative lg:overflow-y-auto no-scrollbar pb-32 lg:pb-6 font-sans">
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-lg"
        >
          {/* Header & Step Indicator */}
          <div className="mb-10 text-center lg:text-left">
            <Link href="/login" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-brand-green mb-6 transition-all group">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la connexion
            </Link>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
              {step === 1 ? "Commençons !" : step === 2 ? "Sécurité" : step === 3 ? "Localisation" : "Votre Boutique"}
            </h1>
            <p className="text-slate-500 font-medium text-xs">
              {step === 1 ? "Parlez-nous un peu de vous." : step === 2 ? "Sécurisez votre compte et choisissez votre rôle." : step === 3 ? "Dites-nous où vous résidez." : "Personnalisez votre espace de vente."}
            </p>

            {/* Progress Bar */}
            <div className="mt-8 flex items-center justify-center lg:justify-start gap-1">
              {[1, 2, 3, 4].map((num) => (
                (num < 4 || isSeller) && (
                   <div key={num} className="flex-1 flex items-center gap-1">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                          step >= num ? "bg-brand-green flex-1" : "bg-slate-200 w-4"
                        }`} 
                      />
                   </div>
                )
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="step1"
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom Complet</label>
                    <div className="relative group">
                      <User size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input
                        {...register("name")}
                        placeholder="Amadou Diallo"
                        className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.name ? "border-red-500" : "border-slate-100 focus:border-brand-green shadow-sm"
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse Email</label>
                    <div className="relative group">
                      <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input
                        {...register("email")}
                        placeholder="nom@exemple.com"
                        className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.email ? "border-red-500" : "border-slate-100 focus:border-brand-green shadow-sm"
                        }`}
                      />
                    </div>
                    {errors.email && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.email.message}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Téléphone</label>
                    <div className="relative group">
                      <Phone size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input
                        {...register("phone")}
                        placeholder="77 123 45 67"
                        className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.phone ? "border-red-500" : "border-slate-100 focus:border-brand-green shadow-sm"
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.phone.message}</p>}
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="step2"
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Mot de Passe</label>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-12 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.password ? "border-red-500" : "border-slate-100 focus:border-brand-green shadow-sm"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.password.message}</p>}
                  </div>

                  <div className="p-5 bg-emerald-50/50 rounded-[28px] border border-emerald-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                          <Store size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Partenariat</p>
                          <h3 className="text-sm font-black text-slate-900 tracking-tight">Devenir Vendeur</h3>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          {...register("isSeller")}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="step3"
                  className="space-y-1"
                >
                  <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Adresse de résidence</label>
                  <div className="relative group">
                    <MapPin size={16} className="absolute left-6 top-4 text-slate-300 group-focus-within:text-brand-green transition-colors" />
                    <textarea
                      {...register("address")}
                      rows={3}
                      placeholder="Ex: Sacré-Cœur, Villa 123, Dakar"
                      className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-brand-green/5 transition-all font-bold text-slate-900 text-sm resize-none ${
                        errors.address ? "border-red-500" : "border-slate-100 focus:border-brand-green shadow-sm"
                      }`}
                    />
                  </div>
                  {errors.address && <p className="text-[8px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.address.message}</p>}
                </motion.div>
              )}

              {step === 4 && isSeller && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  key="step4"
                  className="space-y-4 max-h-[45vh] lg:max-h-[50vh] overflow-y-auto no-scrollbar pr-1"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Nom de la Boutique</label>
                    <div className="relative group">
                      <Store size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        {...register("shopName")}
                        placeholder="Ma Superbe Boutique"
                        className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.shopName ? "border-red-500" : "border-slate-100 focus:border-emerald-500 shadow-sm"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Spécialité</label>
                    <div className="relative group">
                      <Briefcase size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      <input
                        {...register("specialty")}
                        placeholder="Cordonnerie, Bijouterie..."
                        className={`w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm ${
                          errors.specialty ? "border-red-500" : "border-slate-100 focus:border-emerald-500 shadow-sm"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Photo de la Boutique</label>
                    <div className="flex items-center gap-4 bg-white p-3 rounded-[24px] border border-slate-100 shadow-sm">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden group/img relative">
                        {watch("shopImage") ? (
                          <Image src={watch("shopImage")!} alt="Shop" fill className="object-cover" />
                        ) : (
                          <Camera size={20} className="text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              validateImageSize(file);
                              toast.info("Importation...");
                              const res = await api.upload<{ url: string }>("/upload", file);
                              const shopImageField = register("shopImage");
                              shopImageField.onChange({ target: { value: res.url, name: "shopImage" } });
                              toast.success("Image importée !");
                            } catch (error) {
                              toast.error("Échec de l'importation");
                            }
                          }}
                          className="hidden"
                          id="shop-image-upload"
                        />
                        <label
                          htmlFor="shop-image-upload"
                          className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 cursor-pointer transition-all inline-block"
                        >
                          Choisir Image
                        </label>
                        <input type="hidden" {...register("shopImage")} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-4">Bio</label>
                    <div className="relative group">
                      <FileText size={16} className="absolute left-6 top-4 text-slate-300 group-focus-within:text-emerald-500 transition-colors" />
                      <textarea
                        {...register("bio")}
                        rows={2}
                        placeholder="Votre histoire ou savoir-faire..."
                        className="w-full pl-14 pr-8 py-3.5 rounded-[24px] bg-white border border-slate-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all font-bold text-slate-900 text-sm focus:border-emerald-500 resize-none shadow-sm"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="lg:pt-6 space-y-4">
              {step === 3 && !isSeller && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[20px] border border-slate-100 mb-4 lg:mb-0">
                  <input type="checkbox" id="terms" required className="mt-1 w-4 h-4 accent-brand-green rounded" />
                  <label htmlFor="terms" className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    J&apos;accepte les <Link href="#" className="text-brand-green font-black">Conditions</Link> et la <Link href="#" className="text-brand-green font-black">Politique</Link>.
                  </label>
                </div>
              )}

              {step === 4 && (
                <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-[20px] border border-slate-100 mb-4 lg:mb-0">
                  <input type="checkbox" id="terms-seller" required className="mt-1 w-4 h-4 accent-emerald-500 rounded" />
                  <label htmlFor="terms-seller" className="text-[8px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                    J&apos;accepte les <Link href="#" className="text-emerald-500 font-black">Conditions Vendeur</Link>.
                  </label>
                </div>
              )}

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 lg:relative lg:p-0 lg:bg-transparent lg:border-t-0 flex gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="w-20 lg:w-20 h-14 bg-white border border-slate-200 lg:border-slate-100 rounded-[24px] flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-lg lg:shadow-sm"
                  >
                    <ArrowLeft size={18} />
                  </button>
                )}
                
                {((step < 3) || (step === 3 && isSeller)) ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 bg-brand-green text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-brand-green/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Suivant <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-4 font-black text-[10px] uppercase tracking-[0.2em] rounded-[24px] transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 ${
                      isSeller 
                        ? "bg-emerald-500 shadow-emerald-500/30 hover:shadow-emerald-500/40" 
                        : "bg-brand-green shadow-brand-green/30 hover:shadow-brand-green/40"
                    } text-white`}
                  >
                    {loading ? "Création..." : isSeller ? "Ouvrir ma boutique" : "Créer mon compte"}
                    {!loading && <Sparkles size={14} />}
                    {loading && <Loader2 size={14} className="animate-spin" />}
                  </button>
                )}
              </div>
            </div>
          </form>

          {step === 1 && (
            <div className="mt-10 text-center">
              <p className="text-xs font-medium text-slate-500">
                Déjà membre ?{" "}
                <Link
                  href="/login"
                  className="text-brand-green font-black hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
