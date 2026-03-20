export interface Order {
  id: string;
  date: string;
  status: "delivered" | "shipped" | "processing" | "cancelled";
  items: { productId: string; name: string; quantity: number; price: number }[];
  total: number;
  trackingNumber?: string;
}

export const orders: Order[] = [
  {
    id: "ORD-2026-001",
    date: "2026-03-10",
    status: "delivered",
    items: [
      { productId: "1", name: "Beurre de Karité Bio Premium", quantity: 2, price: 8500 },
      { productId: "5", name: "Café Touba Moulu Artisanal", quantity: 1, price: 5000 },
    ],
    total: 22000,
    trackingNumber: "SN2026031099",
  },
  {
    id: "ORD-2026-002",
    date: "2026-03-15",
    status: "shipped",
    items: [
      { productId: "2", name: "Panier Tressé Artisanal Wolof", quantity: 1, price: 15000 },
    ],
    total: 15000,
    trackingNumber: "SN2026031577",
  },
  {
    id: "ORD-2026-003",
    date: "2026-03-18",
    status: "processing",
    items: [
      { productId: "10", name: "Sac à Main en Cuir Tanné", quantity: 1, price: 35000 },
      { productId: "3", name: "Thiouraye Encens Traditionnel", quantity: 3, price: 3500 },
    ],
    total: 45500,
  },
  {
    id: "ORD-2025-045",
    date: "2025-12-20",
    status: "cancelled",
    items: [
      { productId: "12", name: "Djembé Artisanal Sculpté", quantity: 1, price: 75000 },
    ],
    total: 75000,
  },
];
