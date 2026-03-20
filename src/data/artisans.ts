export interface Artisan {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  location: string;
  bio: string;
  image: string;
  productCount: number;
  rating: number;
  since: number;
}

export const artisans: Artisan[] = [
  {
    id: "1",
    name: "Coopérative Njaay",
    slug: "cooperative-njaay",
    specialty: "Cosmétiques Naturels",
    location: "Kédougou, Sénégal",
    bio: "Fondée en 2010 par un groupe de femmes de Kédougou, la Coopérative Njaay transforme les ressources naturelles locales — karité, baobab, moringa — en produits cosmétiques d'exception. Chaque produit est fabriqué à la main selon des recettes ancestrales.",
    image: "https://images.pexels.com/photos/31633685/pexels-photo-31633685.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    productCount: 15,
    rating: 4.9,
    since: 2010,
  },
  {
    id: "2",
    name: "Atelier Ndoye",
    slug: "atelier-ndoye",
    specialty: "Vannerie & Sculpture",
    location: "Thiès, Sénégal",
    bio: "Maître artisan depuis plus de 30 ans, Ibrahima Ndoye perpétue l'art de la vannerie wolof et de la sculpture sérère. Son atelier forme chaque année une dizaine de jeunes apprentis, assurant la transmission de ces savoir-faire précieux.",
    image: "https://images.pexels.com/photos/30442796/pexels-photo-30442796.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    productCount: 23,
    rating: 4.8,
    since: 1995,
  },
  {
    id: "3",
    name: "Maison Diop",
    slug: "maison-diop",
    specialty: "Maroquinerie & Parfums",
    location: "Mékhé, Sénégal",
    bio: "La Maison Diop est installée à Mékhé, capitale du cuir au Sénégal. Quatre générations de tanneurs et d'artisans du cuir ont forgé une expertise unique, alliant techniques traditionnelles de tannage végétal et design contemporain.",
    image: "https://images.pexels.com/photos/3307279/pexels-photo-3307279.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    productCount: 18,
    rating: 4.7,
    since: 1968,
  },
  {
    id: "4",
    name: "Torréfaction Sall",
    slug: "torrefaction-sall",
    specialty: "Café & Épices",
    location: "Touba, Sénégal",
    bio: "Mame Fatou Sall a transformé sa passion pour le Café Touba en une entreprise prospère. Sa torréfaction artisanale, située au cœur de Touba, produit les meilleurs cafés et mélanges d'épices du Sénégal, distribués dans tout le pays et à la diaspora.",
    image: "https://images.pexels.com/photos/33974586/pexels-photo-33974586.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    productCount: 12,
    rating: 4.9,
    since: 2005,
  },
];
