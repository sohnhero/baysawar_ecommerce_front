export interface DashboardStat {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

export const dashboardStats: DashboardStat[] = [
  { label: "Revenus", value: "2 450 000 FCFA", change: "+18.2%", positive: true, icon: "revenue" },
  { label: "Commandes", value: "342", change: "+12.5%", positive: true, icon: "orders" },
  { label: "Visiteurs", value: "8 924", change: "+24.1%", positive: true, icon: "visitors" },
  { label: "Produits", value: "68", change: "+5", positive: true, icon: "products" },
];

export interface MonthlySale {
  month: string;
  revenue: number;
}

export const monthlySales: MonthlySale[] = [
  { month: "Sep", revenue: 1200000 },
  { month: "Oct", revenue: 1450000 },
  { month: "Nov", revenue: 1380000 },
  { month: "Déc", revenue: 2100000 },
  { month: "Jan", revenue: 1750000 },
  { month: "Fév", revenue: 1980000 },
  { month: "Mar", revenue: 2450000 },
];

export interface RecentOrder {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: "delivered" | "shipped" | "processing" | "cancelled";
}

export const recentOrders: RecentOrder[] = [
  { id: "ORD-342", customer: "Aminata Diallo", date: "2026-03-18", amount: 22000, status: "processing" },
  { id: "ORD-341", customer: "Ousmane Ba", date: "2026-03-17", amount: 45000, status: "shipped" },
  { id: "ORD-340", customer: "Fatou Sow", date: "2026-03-17", amount: 15000, status: "delivered" },
  { id: "ORD-339", customer: "Moussa Ndiaye", date: "2026-03-16", amount: 8500, status: "delivered" },
  { id: "ORD-338", customer: "Marie Leclerc", date: "2026-03-16", amount: 75000, status: "processing" },
];
