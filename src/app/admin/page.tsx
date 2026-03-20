"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Calendar,
  Filter,
  Download,
} from "lucide-react";
import { dashboardStats, monthlySales, recentOrders } from "@/data/admin-stats";
import AdminLayout from "@/components/admin/AdminLayout";

const iconMap: Record<string, React.ReactNode> = {
  revenue: <DollarSign size={22} />,
  orders: <ShoppingCart size={22} />,
  visitors: <Users size={22} />,
  products: <Package size={22} />,
};

const statusConfig = {
  delivered: { label: "Livré", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  shipped: { label: "Expédié", class: "bg-blue-50 text-blue-600 border-blue-100" },
  processing: { label: "En cours", class: "bg-amber-50 text-amber-600 border-amber-100" },
  cancelled: { label: "Annulé", class: "bg-rose-50 text-rose-600 border-rose-100" },
};

export default function AdminPage() {
  const maxRevenue = Math.max(...monthlySales.map((m) => m.revenue));

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header with quick actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Bonjour, Admin 👋</h1>
            <p className="text-slate-500 font-medium mt-1">Voici ce qui se passe sur Baysawarr aujourd&apos;hui.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
              <Calendar size={16} /> les 30 derniers jours
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-brand-blue text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-blue/20">
              <Download size={16} /> Rapport Complet
            </button>
          </div>
        </div>

        {/* Premium Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group bg-white rounded-[32px] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-blue/5 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className={`p-4 rounded-2xl ${
                    stat.icon === "revenue" ? "bg-emerald-50 text-emerald-600" :
                    stat.icon === "orders" ? "bg-brand-blue/10 text-brand-blue" :
                    stat.icon === "visitors" ? "bg-amber-50 text-amber-600" :
                    "bg-rose-50 text-rose-600"
                  }`}>
                    {iconMap[stat.icon]}
                  </div>
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black ${
                    stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}>
                    {stat.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="font-heading font-black text-2xl text-slate-900 tracking-tight">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts & Activity Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Sales Chart (Custom SVG implementation for "Wow" factor without external libs) */}
          <div className="xl:col-span-2 bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="font-heading font-black text-xl text-slate-900 flex items-center gap-3">
                  <Activity size={20} className="text-brand-green" /> Évolution des Revenus
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Données mensuelles (FCFA)</p>
              </div>
              <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                <button className="px-3 py-1.5 bg-white shadow-sm rounded-lg text-[10px] font-black uppercase tracking-widest">Revenus</button>
                <button className="px-3 py-1.5 text-slate-400 hover:text-slate-900 text-[10px] font-black uppercase tracking-widest transition-colors">Commandes</button>
              </div>
            </div>

            <div className="relative h-64 flex items-end justify-between gap-4 mt-8">
              {monthlySales.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="relative w-full flex items-end justify-center h-full">
                    {/* Tooltip */}
                    <div className="absolute -top-10 scale-0 group-hover:scale-100 transition-all duration-300 z-20">
                      <div className="bg-slate-900 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl">
                        {m.revenue.toLocaleString()} FCFA
                      </div>
                      <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -translate-y-1" />
                    </div>
                    
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                      transition={{ duration: 1, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                      className={`w-full max-w-[40px] rounded-t-2xl relative overflow-hidden transition-all duration-500 ${
                        i === monthlySales.length - 1 
                          ? "bg-gradient-to-t from-brand-blue to-brand-green shadow-lg shadow-brand-blue/20" 
                          : "bg-slate-100 group-hover:bg-slate-200"
                      }`}
                    >
                      {i === monthlySales.length - 1 && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      )}
                    </motion.div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    i === monthlySales.length - 1 ? "text-brand-blue" : "text-slate-400"
                  }`}>
                    {m.month}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders List with Premium Design */}
          <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-black text-xl text-slate-900">Activité Récente</h2>
              <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-brand-green hover:underline">Voir Tout</Link>
            </div>

            <div className="flex-1 space-y-6">
              {recentOrders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${
                      i % 2 === 0 ? "bg-slate-900 text-white" : "bg-brand-green text-white"
                    }`}>
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{order.customer}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{order.id} · {order.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brand-blue">{order.amount.toLocaleString()} FCFA</p>
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest border mt-1 ${statusConfig[order.status].class}`}>
                      {statusConfig[order.status].label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <button className="w-full mt-8 py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              Afficher plus d&apos;activité
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
