"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ExternalLink,
  Target
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { toast } from "react-toastify";
import { generateDashboardReport } from "@/lib/reports";

const iconMap: Record<string, React.ReactElement> = {
  revenue: <DollarSign size={22} />,
  orders: <ShoppingCart size={22} />,
  visitors: <Users size={22} />,
  products: <Package size={22} />,
};

const statusConfig: Record<string, { label: string; class: string }> = {
  pending: { label: "En attente", class: "bg-amber-50 text-amber-600 border-amber-100" },
  processing: { label: "En cours", class: "bg-blue-50 text-blue-600 border-blue-100" },
  shipped: { label: "Expédié", class: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  delivered: { label: "Livré", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  cancelled: { label: "Annulé", class: "bg-rose-50 text-rose-600 border-rose-100" },
};

const PIE_COLORS = ['#3b82f6', '#0b9f0b', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function AdminPage() {
  const [stats, setStats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [salesByCategory, setSalesByCategory] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.get<any>(`/admin/stats?timeRange=${timeRange}`);
      const frontendStats = [
        { label: "Ventes Totales", value: `${data.totalRevenue.toLocaleString()} FCFA`, icon: "revenue", change: "En direct", positive: true },
        { label: "Commandes", value: data.totalOrders.toString(), icon: "orders", change: "Période", positive: true },
        { label: "Utilisateurs", value: data.totalUsers.toString(), icon: "visitors", change: "Inscrits", positive: true },
        { label: "Produits", value: data.totalProducts.toString(), icon: "products", change: "Actifs", positive: true },
      ];
      setStats(frontendStats);
      setOrders(data.recentOrders || []);
      setSalesTrend(data.salesTrend || []);
      setSalesByCategory(data.salesByCategory || []);
      setTopProducts(data.topProducts || []);
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    toast.info("Génération du rapport PDF...", {
      autoClose: 1500,
      icon: <Download size={18} className="text-brand-blue" />
    });

    try {
      // Create a simplified stats object for the report
      const reportStats = {
        totalRevenue: stats.find((s: any) => s.icon === "revenue")?.value || "0",
        totalOrders: stats.find((s: any) => s.icon === "orders")?.value || "0",
        totalUsers: stats.find((s: any) => s.icon === "visitors")?.value || "0",
        totalProducts: stats.find((s: any) => s.icon === "products")?.value || "0",
      };
      
      generateDashboardReport(reportStats, topProducts, orders, timeRange);
      toast.success("Rapport exporté avec succès !");
    } catch (error) {
      console.error("Export Error:", error);
      toast.error("Erreur lors de la génération du PDF");
    }
  };

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Compact Header with functional Time Range filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Tableau de Bord Administratif</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Intelligence système & Performance analytique</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm flex items-center gap-1">
              {[
                { id: '7d', label: '7J' },
                { id: '30d', label: '30J' },
                { id: '90d', label: '90J' },
                { id: 'all', label: 'TOTAL' }
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                    timeRange === range.id 
                      ? "bg-slate-900 text-white shadow-lg shadow-black/10" 
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
            <button 
              onClick={handleExportReport}
              className="flex items-center gap-2 px-4 py-3 bg-brand-blue text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-brand-blue/10"
            >
              <Download size={14} /> Rapport
            </button>
          </div>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-100 p-5 h-28 animate-pulse" />
            ))
          ) : (
            stats.map((stat, i) => (
              <motion.div
                key={stat.label || i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="relative group bg-white rounded-3xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${
                      stat.icon === "revenue" ? "bg-emerald-50 text-emerald-600" :
                      stat.icon === "orders" ? "bg-brand-blue/10 text-brand-blue" :
                      stat.icon === "visitors" ? "bg-amber-50 text-amber-600" :
                      "bg-rose-50 text-rose-600"
                    }`}>
                      {iconMap[stat.icon] && React.cloneElement(iconMap[stat.icon] as any, { size: 18 })}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                      stat.positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }`}>
                      {stat.positive ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="font-heading font-black text-xl text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Primary Interactive Charts Area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Detailed Performance Area Chart */}
          <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <Activity size={18} className="text-brand-green" /> Évolution de la Performance
                </h2>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Dual Metrics: Revenus & Volume de commandes</p>
              </div>
            </div>

            <div className="h-64 mt-4">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-2xl animate-pulse" />
              ) : salesTrend.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-[9px] uppercase tracking-widest italic">
                  Aucune donnée pour cette période
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesTrend}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="label" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }}
                      tickFormatter={(value) => `${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 900 }}
                      itemStyle={{ padding: '2px 0' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorRevenue)" 
                      name="Revenus (FCFA)"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#10b981" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorOrders)" 
                      name="Commandes"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Category Insights Donut */}
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
            <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2 mb-1">
              <Target size={18} className="text-amber-500" /> Par Catégorie
            </h2>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Répartition du volume de ventes</p>
            
            <div className="h-48 relative">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center animate-pulse">
                  <div className="w-32 h-32 rounded-full border-8 border-slate-50" />
                </div>
              ) : salesByCategory.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-[9px] uppercase tracking-widest italic">
                  N/A
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={salesByCategory}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {salesByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '9px', fontWeight: 900 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="mt-4 space-y-2">
               {salesByCategory.map((cat, i) => (
                 <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                       <span className="text-[10px] font-black text-slate-600 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{cat.name}</span>
                    </div>
                    <span className="text-[9px] font-black text-slate-400">{cat.value} ventes</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Top Products & Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
           {/* Top Performing Products Table */}
           <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-teal-500" /> Top Produits
                </h2>
                <Link href="/admin/products" className="text-[9px] font-black uppercase tracking-widest text-brand-green hover:underline">Catalogue</Link>
             </div>
             
             <div className="space-y-4">
                {loading ? (
                  Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />)
                ) : topProducts.length === 0 ? (
                  <div className="py-12 text-center text-slate-300 font-black text-[9px] uppercase tracking-widest mb-1 italic">Aucun mouvement commercial</div>
                ) : (
                  topProducts.map((product, i) => (
                    <motion.div 
                      key={product.id || i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                             <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900 tracking-tight leading-none mb-1">{product.name}</p>
                             <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{product.sales} ventes réalisées</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[11px] font-black text-slate-900">{product.revenue.toLocaleString()} FCFA</p>
                          <div className="w-16 h-1 bg-slate-100 rounded-full mt-2 overflow-hidden">
                             <div 
                               className="h-full bg-brand-green rounded-full shadow-[0_0_8px_rgba(11,159,11,0.5)]" 
                               style={{ width: `${(product.sales / (topProducts[0]?.sales || 1)) * 100}%` }} 
                             />
                          </div>
                       </div>
                    </motion.div>
                  ))
                )}
             </div>
           </div>

           {/* Activity Feed (formerly Recent Orders) */}
           <div className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-black text-lg text-slate-900 flex items-center gap-2">
                <Activity size={18} className="text-indigo-500" /> Activité Récente
              </h2>
              <Link href="/admin/orders" className="text-[9px] font-black uppercase tracking-widest text-brand-green hover:underline">Flux Complet</Link>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto max-h-[340px] pr-2 no-scrollbar">
              {loading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="h-14 bg-slate-50 rounded-2xl animate-pulse" />)
              ) : orders.length === 0 ? (
                <div className="py-12 text-center text-slate-300 font-black text-[9px] uppercase tracking-widest italic">Vide</div>
              ) : (
                orders.slice(0, 8).map((order: any, i: number) => (
                  <motion.div
                    key={order.id || i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-[10px] shadow-sm transform group-hover:rotate-6 transition-transform ${
                        i % 2 === 0 ? "bg-slate-900 text-white" : "bg-brand-green text-white"
                      }`}>
                        {order.customer.split(' ').map((n: string) => n[0]).join('')}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate max-w-[120px]">{order.customer}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest truncate flex items-center gap-1">
                          #{order.id.slice(-8)} <span className="w-1 h-1 rounded-full bg-slate-200" /> {order.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-brand-blue">{order.amount.toLocaleString()} FCFA</p>
                      <span className={`inline-block px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border mt-0.5 ${statusConfig[order.status]?.class || "bg-slate-50 text-slate-600"}`}>
                        {statusConfig[order.status]?.label || order.status}
                      </span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
