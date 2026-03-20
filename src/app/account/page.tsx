"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Package, Mail, MapPin, Phone, Edit2 } from "lucide-react";
import { orders } from "@/data/orders";

const statusColors: Record<string, string> = {
  delivered: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  shipped: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  processing: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  delivered: "Livré",
  shipped: "Expédié",
  processing: "En traitement",
  cancelled: "Annulé",
};

export default function AccountPage() {
  const [tab, setTab] = useState<"profile" | "orders">("profile");

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl">Amadou Diallo</h1>
              <p className="text-white/60 text-sm">Membre depuis Mars 2025</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-background rounded-xl border border-border-color p-1 mb-8 w-fit">
          <button
            onClick={() => setTab("profile")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "profile"
                ? "bg-brand-green text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <User size={14} /> Profil
            </span>
          </button>
          <button
            onClick={() => setTab("orders")}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              tab === "orders"
                ? "bg-brand-green text-white"
                : "text-muted hover:text-foreground"
            }`}
          >
            <span className="flex items-center gap-2">
              <Package size={14} /> Commandes
            </span>
          </button>
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-2xl border border-border-color p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-xl">
                Informations personnelles
              </h2>
              <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-brand-green border border-brand-green/30 rounded-xl hover:bg-brand-green/5 transition-colors">
                <Edit2 size={14} /> Modifier
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <User size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Nom complet</p>
                  <p className="text-sm font-medium">Amadou Diallo</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <Mail size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="text-sm font-medium">amadou@example.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <Phone size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Téléphone</p>
                  <p className="text-sm font-medium">+221 77 123 45 67</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl">
                <MapPin size={18} className="text-muted" />
                <div>
                  <p className="text-xs text-muted">Adresse</p>
                  <p className="text-sm font-medium">
                    123 Avenue Cheikh Anta Diop, Dakar
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-background rounded-2xl border border-border-color p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <div>
                    <p className="font-heading font-semibold">{order.id}</p>
                    <p className="text-xs text-muted">{order.date}</p>
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      statusColors[order.status]
                    }`}
                  >
                    {statusLabels[order.status]}
                  </span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted">
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {(item.price * item.quantity).toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-border-color">
                  <span className="text-sm text-muted">Total</span>
                  <span className="font-heading font-bold text-brand-green">
                    {order.total.toLocaleString()} FCFA
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
