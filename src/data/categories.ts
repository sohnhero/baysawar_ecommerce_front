export interface SubCategory {
  name: string;
  href: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  icon: string;
  subCategories: SubCategory[];
  featured?: {
    title: string;
    image: string;
    link: string;
    badge?: string;
  };
}

export const categories: Category[] = [
  {
    id: "1",
    name: "Artisanat",
    slug: "artisanat",
    description: "Pièces uniques créées par nos artisans talentueux. Paniers, bijoux, textiles et sculptures.",
    image: "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    productCount: 15,
    icon: "🎨",
    subCategories: [
      { name: "Paniers Tressés", href: "/shop?cat=artisanat&sub=paniers" },
      { name: "Sculptures en Bois", href: "/shop?cat=artisanat&sub=sculptures" },
      { name: "Bijoux Traditionnels", href: "/shop?cat=artisanat&sub=bijoux" },
      { name: "Poterie & Céramique", href: "/shop?cat=artisanat&sub=poterie" },
      { name: "Maroquinerie", href: "/shop?cat=artisanat&sub=cuir" },
      { name: "Objets de Déco", href: "/shop?cat=artisanat&sub=deco" },
    ],
    featured: {
      title: "Artisanat du Baobab",
      image: "https://images.unsplash.com/photo-1640746942093-cec8e647596d?q=80&w=400&auto=format&fit=crop",
      link: "/shop?cat=artisanat",
      badge: "Best Seller",
    },
  },
  {
    id: "2",
    name: "Alimentaire",
    slug: "alimentaire",
    description: "Saveurs authentiques du Sénégal. Épices, cafés, huiles et produits bio de nos terroirs.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=500&fit=crop",
    productCount: 22,
    icon: "🥣",
    subCategories: [
      { name: "Café Touba", href: "/shop?cat=alimentaire&sub=cafe" },
      { name: "Épices & Condiments", href: "/shop?cat=alimentaire&sub=epices" },
      { name: "Huiles & Cosmétique", href: "/shop?cat=alimentaire&sub=huiles" },
      { name: "Thés & Infusions", href: "/shop?cat=alimentaire&sub=thes" },
      { name: "Produits Bio", href: "/shop?cat=alimentaire&sub=bio" },
      { name: "Farines & Céréales", href: "/shop?cat=alimentaire&sub=cereales" },
    ],
    featured: {
      title: "Épices de Saint-Louis",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
      link: "/shop?cat=alimentaire",
      badge: "Nouveau",
    },
  },
  {
    id: "3",
    name: "Traditionnel",
    slug: "traditionnel",
    description: "Objets culturels et traditionnels. Encens, instruments de musique et objets de cérémonie.",
    image: "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    productCount: 12,
    icon: "✨",
    subCategories: [
      { name: "Encens & Thiouraye", href: "/shop?cat=traditionnel&sub=encens" },
      { name: "Instruments (Djembé)", href: "/shop?cat=traditionnel&sub=instruments" },
      { name: "Vêtements (Boubou)", href: "/shop?cat=traditionnel&sub=vetements" },
      { name: "Tissus & Wax", href: "/shop?cat=traditionnel&sub=wax" },
      { name: "Masques Culturels", href: "/shop?cat=traditionnel&sub=masques" },
      { name: "Accessoires", href: "/shop?cat=traditionnel&sub=accessoires" },
    ],
    featured: {
      title: "Collection Djembé",
      image: "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
      link: "/shop?cat=traditionnel",
      badge: "-20%",
    },
  },
];

