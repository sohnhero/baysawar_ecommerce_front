"use client";

import { motion } from "framer-motion";
import { Check, Truck, Package, Home, Clock } from "lucide-react";

interface Step {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  status: "complete" | "current" | "upcoming";
}

interface OrderTrackerProps {
  currentStatus: "processing" | "shipped" | "delivered" | "cancelled";
}

export default function OrderTracker({ currentStatus }: OrderTrackerProps) {
  const steps: Step[] = [
    {
      id: "processing",
      label: "Traitement",
      desc: "Votre commande est en préparation",
      icon: <Package size={20} />,
      status: currentStatus === "processing" ? "current" : "complete",
    },
    {
      id: "shipped",
      label: "Expédition",
      desc: "Le colis a quitté notre atelier",
      icon: <Truck size={20} />,
      status: currentStatus === "shipped" ? "current" : (currentStatus === "delivered" ? "complete" : "upcoming"),
    },
    {
      id: "delivered",
      label: "Livraison",
      desc: "Colis livré avec succès",
      icon: <Home size={20} />,
      status: currentStatus === "delivered" ? "current" : "upcoming",
    },
  ];

  if (currentStatus === "cancelled") {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-bold">Cette commande a été annulée.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Connector Line */}
      <div className="absolute top-5 left-10 right-10 h-0.5 bg-border-color z-0 hidden md:block" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {steps.map((step, idx) => (
          <div key={step.id} className="flex flex-col items-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.2 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                step.status === "complete"
                  ? "bg-brand-green border-white text-white shadow-lg shadow-brand-green/20"
                  : step.status === "current"
                  ? "bg-background border-brand-green text-brand-green animate-pulse"
                  : "bg-surface border-border-color text-muted"
              }`}
            >
              {step.status === "complete" ? <Check size={20} /> : step.icon}
            </motion.div>
            
            <div className="mt-4">
              <h4 className={`text-sm font-black uppercase tracking-widest ${step.status === "upcoming" ? "text-muted" : "text-brand-blue"}`}>
                {step.label}
              </h4>
              <p className="text-[10px] text-muted mt-1 max-w-[120px] mx-auto leading-tight">
                {step.desc}
              </p>
            </div>

            {step.status === "current" && (
              <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-[9px] font-black uppercase tracking-tighter">
                <Clock size={10} /> En cours
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
