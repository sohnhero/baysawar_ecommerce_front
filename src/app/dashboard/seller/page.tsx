"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  ArrowUpRight, 
  Activity,
  PackageCheck,
  Clock,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "En attente", class: "bg-amber-50 text-amber-600 border-amber-100" },
  processing: { label: "En cours", class: "bg-blue-50 text-blue-600 border-blue-100" },
  shipped: { label: "Expédié", class: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  delivered: { label: "Livré", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  cancelled: { label: "Annulé", class: "bg-rose-50 text-rose-600 border-rose-100" },
};

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        // We'll need a backend endpoint for seller stats. 
        // For now, let's fetch orders and derive some basic stats
        // In a real scenario, /artisans/stats would be better.
        const ordersData = await api.get<any[]>("/orders/seller");
        setOrders(ordersData);
        
        const totalRevenue = ordersData
          .filter(o => o.status === 'delivered')
          .reduce((acc, order) => {
            const orderTotal = order.items.reduce((sum: number, item: any) => sum + parseFloat(item.price) * item.quantity, 0);
            return acc + orderTotal;
          }, 0);

        const totalProducts = new Set();
        ordersData.forEach(order => {
            order.items.forEach((item: any) => totalProducts.add(item.productId));
        });

        setStats({
          revenue: totalRevenue,
          ordersCount: ordersData.length,
          pendingOrders: ordersData.filter(o => o.status === 'pending').length,
          productsCount: totalProducts.size
        });
      } catch (error) {
        console.error("Failed to fetch seller dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-white rounded-3xl border border-slate-100" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-3xl border border-slate-100" />)}
        </div>
        <div className="h-96 bg-white rounded-[32px] border border-slate-100" />
      </div>
    );
  }

  const statCards = [
    { label: "Chiffre d'Affaire", value: `${stats?.revenue.toLocaleString()} FCFA`, icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", sub: "Ventes livrées" },
    { label: "Commandes", value: stats?.ordersCount, icon: ShoppingCart, color: "text-brand-blue", bg: "bg-brand-blue/10", sub: "Total reçues" },
    { label: "En Attente", value: stats?.pendingOrders, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", sub: "À préparer" },
    { label: "Mes Produits", value: stats?.productsCount, icon: Package, color: "text-rose-600", bg: "bg-rose-50", sub: "Actifs" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Vue d&apos;ensemble de la Boutique</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Suivez vos performances en temps réel</p>
        </div>
        <div className="flex items-center gap-3">
            <Link href="/dashboard/seller/products" className="px-5 py-2.5 bg-brand-green text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-green/20">
                Nouveau Produit
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={20} />
               </div>
               <div className="px-2 py-0.5 bg-slate-50 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest">
                  Direct
               </div>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            <p className="text-[8px] font-bold text-slate-400 mt-2 flex items-center gap-1 uppercase tracking-tighter">
                <Activity size={10} className={stat.color} /> {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-brand-green" /> Commandes Récentes
              </h2>
              <Link href="/dashboard/seller/orders" className="text-[9px] font-black uppercase tracking-widest text-brand-green hover:underline">Voir tout</Link>
            </div>

            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-separate border-spacing-y-3">
                <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                    <th className="px-4 pb-2">Commande</th>
                    <th className="px-4 pb-2">Client</th>
                    <th className="px-4 pb-2">Articles</th>
                    <th className="px-4 pb-2">Total</th>
                    <th className="px-4 pb-2 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-20 text-slate-300 font-bold uppercase text-[9px] tracking-widest italic">Aucune commande pour le moment</td>
                    </tr>
                  ) : (
                    orders.slice(0, 5).map((order) => {
                      const sellerTotal = order.items.reduce((sum: number, item: any) => sum + parseFloat(item.price) * item.quantity, 0);
                      return (
                        <tr key={order.id} className="group cursor-default">
                          <td className="px-4 py-4 bg-slate-50 first:rounded-l-2xl border-y border-transparent group-hover:border-slate-100 transition-all font-black text-[10px] text-slate-900">
                            #{order.id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-4 bg-slate-50 border-y border-transparent group-hover:border-slate-100 transition-all">
                             <p className="text-[11px] font-black text-slate-900">{order.user?.name}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase">{order.phone}</p>
                          </td>
                          <td className="px-4 py-4 bg-slate-50 border-y border-transparent group-hover:border-slate-100 transition-all">
                             <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item: any, i: number) => (
                                  <div key={i} className="w-7 h-7 rounded-lg border-2 border-white bg-white shadow-sm overflow-hidden relative">
                                     <img src={item.product?.image} alt="" className="object-cover w-full h-full" />
                                  </div>
                                ))}
                                {order.items.length > 3 && (
                                  <div className="w-7 h-7 rounded-lg border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 relative">
                                    +{order.items.length - 3}
                                  </div>
                                )}
                             </div>
                          </td>
                          <td className="px-4 py-4 bg-slate-50 border-y border-transparent group-hover:border-slate-100 transition-all font-black text-[11px] text-emerald-600 whitespace-nowrap">
                            {sellerTotal.toLocaleString()} FCFA
                          </td>
                          <td className="px-4 py-4 bg-slate-50 last:rounded-r-2xl border-y border-transparent group-hover:border-slate-100 transition-all text-right">
                             <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${statusConfig[order.status]?.class || ""}`}>
                                {statusConfig[order.status]?.label || order.status}
                             </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <PackageCheck size={18} className="text-amber-500" /> Actions Rapides
                </h2>
             </div>
             <div className="space-y-3">
                {[
                  { label: "Consulter mon catalogue", href: "/dashboard/seller/products", icon: Package, color: "text-amber-500", bg: "bg-amber-50" },
                  { label: "Gérer mes ventes", href: "/dashboard/seller/orders", icon: ShoppingCart, color: "text-brand-blue", bg: "bg-brand-blue/10" },
                  { label: "Mettre à jour mon profil", href: "/account", icon: User, color: "text-emerald-500", bg: "bg-emerald-50" },
                ].map((action, i) => (
                  <Link 
                    key={i}
                    href={action.href}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                       <div className={`p-2.5 rounded-xl ${action.bg} ${action.color} transition-transform group-hover:scale-110`}>
                          <action.icon size={16} />
                       </div>
                       <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{action.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
             </div>

             <div className="mt-8 p-6 bg-slate-900 rounded-[28px] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full" />
                <p className="text-white text-xs font-black tracking-tight mb-2">Besoin d&apos;aide ?</p>
                <p className="text-white/40 text-[9px] font-medium leading-relaxed mb-4 uppercase tracking-[0.2em]">Contactez notre support dédié aux vendeurs.</p>
                <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Support Vendeur</button>
             </div>
          </div>
      </div>
    </div>
  );
}
