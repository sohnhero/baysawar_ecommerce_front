export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: string;
  categorySlug: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  artisan: string;
  artisanId: string;
  badge?: string;
  tags: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Beurre de Karité Bio Premium",
    slug: "beurre-karite-bio-premium",
    description: "Beurre de karité 100% naturel, récolté à la main dans les savanes du Sénégal. Hydratation intense pour peau et cheveux.",
    longDescription: "Notre beurre de karité est récolté de manière traditionnelle par les femmes des coopératives rurales du Sénégal oriental. Non raffiné et sans additifs chimiques, il conserve toutes ses propriétés nourrissantes et réparatrices. Riche en vitamines A, E et F, il offre une hydratation profonde et durable pour tous types de peau et de cheveux. Chaque pot contribue directement au développement économique des communautés locales.",
    price: 8500,
    originalPrice: 12000,
    image: "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/30754235/pexels-photo-30754235.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Alimentaire",
    categorySlug: "alimentaire",
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    artisan: "Coopérative Njaay",
    artisanId: "1",
    badge: "Best-seller",
    tags: ["bio", "naturel", "soin"],
  },
  {
    id: "2",
    name: "Panier Tressé Artisanal Wolof",
    slug: "panier-tresse-artisanal-wolof",
    description: "Panier traditionnel tressé à la main avec des fibres naturelles. Pièce unique d'artisanat sénégalais.",
    longDescription: "Ce panier est tressé à la main par les artisanes de la région de Thiès, selon des techniques ancestrales transmises de mère en fille. Les motifs géométriques wolof sont uniques à chaque pièce, faisant de chaque panier une œuvre d'art originale. Fabriqué à partir de fibres de rônier et de palme, teintées avec des colorants naturels. Parfait comme décoration murale ou comme panier de rangement élégant.",
    price: 15000,
    image: "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/29663367/pexels-photo-29663367.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Artisanat",
    categorySlug: "artisanat",
    rating: 4.9,
    reviewCount: 87,
    inStock: true,
    artisan: "Atelier Ndoye",
    artisanId: "2",
    badge: "Nouveau",
    tags: ["décoration", "fait-main", "wolof"],
  },
  {
    id: "3",
    name: "Thiouraye Encens Traditionnel",
    slug: "thiouraye-encens-traditionnel",
    description: "Encens traditionnel sénégalais aux parfums envoûtants. Mélange de bois précieux et de résines naturelles.",
    longDescription: "Le thiouraye est un élément incontournable de la culture sénégalaise. Notre mélange exclusif combine des copeaux de bois de santal, de la gomme arabique et des épices sélectionnées pour créer une fragrance unique et apaisante. Utilisé depuis des générations pour parfumer les maisons et les vêtements lors des cérémonies, il apporte une ambiance chaleureuse et accueillante à tout espace.",
    price: 3500,
    image: "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Traditionnel",
    categorySlug: "traditionnel",
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    artisan: "Maison Diop",
    artisanId: "3",
    tags: ["parfum", "cérémonie", "tradition"],
  },
  {
    id: "4",
    name: "Tissu Wax Premium Dakar",
    slug: "tissu-wax-premium-dakar",
    description: "Tissu wax haute qualité, motifs exclusifs inspirés de Dakar. 6 yards de tissu 100% coton.",
    longDescription: "Ce tissu wax premium est issu de notre collection exclusive 'Dakar Modern'. Les motifs sont créés par des designers sénégalais contemporains qui s'inspirent de l'architecture et des paysages de Dakar. Imprimé sur du coton égyptien de haute qualité, les couleurs sont résistantes au lavage et ne se dégradent pas avec le temps. Parfait pour la couture de vêtements, d'accessoires ou pour la décoration intérieure.",
    price: 25000,
    originalPrice: 30000,
    image: "https://images.unsplash.com/photo-1640746942093-cec8e647596d?q=80&w=600&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1640746942093-cec8e647596d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1640746942093-cec8e647596d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1640746942093-cec8e647596d?q=80&w=800&auto=format&fit=crop",
    ],
    category: "Artisanat",
    categorySlug: "artisanat",
    rating: 4.6,
    reviewCount: 56,
    inStock: true,
    artisan: "Atelier Ndoye",
    artisanId: "2",
    tags: ["mode", "tissu", "wax"],
  },
  {
    id: "5",
    name: "Café Touba Moulu Artisanal",
    slug: "cafe-touba-moulu-artisanal",
    description: "Café Touba authentique, torréfié et moulu artisanalement. Saveur épicée unique au djar (poivre de Selim).",
    longDescription: "Le Café Touba est la boisson emblématique du Sénégal, originaire de la ville sainte de Touba. Notre café est torréfié de manière traditionnelle avec du djar (poivre de Selim) et du gingembre, lui conférant sa saveur épicée et réconfortante si caractéristique. Les grains sont soigneusement sélectionnés et torréfiés en petites quantités pour garantir une fraîcheur et une qualité optimales.",
    price: 5000,
    image: "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/942803/pexels-photo-942803.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Alimentaire",
    categorySlug: "alimentaire",
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    artisan: "Torréfaction Sall",
    artisanId: "4",
    badge: "Populaire",
    tags: ["café", "épice", "touba"],
  },
  {
    id: "6",
    name: "Bijoux en Perles de Waist Beads",
    slug: "bijoux-perles-waist-beads",
    description: "Bijoux de taille en perles traditionnelles. Couleurs vibrantes, signification culturelle profonde.",
    longDescription: "Les waist beads sont des bijoux de taille traditionnels portés par les femmes d'Afrique de l'Ouest depuis des millénaires. Nos perles sont sélectionnées à la main et enfilées selon des motifs traditionnels, chaque couleur ayant une signification culturelle particulière. Elles sont portées pour leur beauté, leur symbolisme et leurs bienfaits spirituels. Chaque pièce est ajustable et livrée avec un guide des significations des couleurs.",
    price: 7500,
    image: "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Artisanat",
    categorySlug: "artisanat",
    rating: 4.8,
    reviewCount: 145,
    inStock: true,
    artisan: "Coopérative Njaay",
    artisanId: "1",
    tags: ["bijoux", "perles", "culture"],
  },
  {
    id: "7",
    name: "Bissap Séché Premium",
    slug: "bissap-seche-premium",
    description: "Fleurs d'hibiscus séchées de qualité supérieure pour préparer le fameux jus de bissap sénégalais.",
    longDescription: "Notre bissap est cultivé de manière biologique dans la région de Casamance, connue pour la richesse de ses sols. Les fleurs d'hibiscus sont récoltées à maturité puis séchées naturellement au soleil, préservant ainsi toute leur richesse en saveurs et en nutriments. Riche en vitamine C et en antioxydants, le bissap est la boisson nationale du Sénégal, appréciée aussi bien froide que chaude.",
    price: 4000,
    originalPrice: 5500,
    image: "https://images.pexels.com/photos/6608542/pexels-photo-6608542.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/6608542/pexels-photo-6608542.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/6608542/pexels-photo-6608542.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/6608542/pexels-photo-6608542.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Alimentaire",
    categorySlug: "alimentaire",
    rating: 4.7,
    reviewCount: 189,
    inStock: true,
    artisan: "Torréfaction Sall",
    artisanId: "4",
    badge: "Promo",
    tags: ["boisson", "bio", "hibiscus"],
  },
  {
    id: "8",
    name: "Masque Décoratif Sérère",
    slug: "masque-decoratif-serere",
    description: "Masque en bois sculpté à la main. Art sérère traditionnel, pièce de collection unique.",
    longDescription: "Ce masque est une création originale du maître sculpteur Ibrahima Ndoye, héritier d'une lignée d'artisans sérères. Sculpté dans du bois d'ébène provenant de forêts durablement gérées, chaque masque nécessite plus de 40 heures de travail minutieux. Les motifs représentent les esprits protecteurs de la tradition sérère et sont uniques à chaque pièce. Livré avec un certificat d'authenticité et un support mural.",
    price: 45000,
    image: "https://images.pexels.com/photos/4946654/pexels-photo-4946654.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/4946654/pexels-photo-4946654.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/4946654/pexels-photo-4946654.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/4946654/pexels-photo-4946654.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Artisanat",
    categorySlug: "artisanat",
    rating: 5.0,
    reviewCount: 28,
    inStock: true,
    artisan: "Atelier Ndoye",
    artisanId: "2",
    badge: "Exclusif",
    tags: ["sculpture", "art", "sérère"],
  },
  {
    id: "9",
    name: "Huile de Baobab Pressée à Froid",
    slug: "huile-baobab-pressee-froid",
    description: "Huile de baobab vierge, pressée à froid. Soin multi-usage pour peau, cheveux et ongles.",
    longDescription: "L'huile de baobab est extraite des graines du baobab, l'arbre emblématique de l'Afrique. Notre huile est pressée à froid pour conserver intactes toutes ses propriétés nutritives exceptionnelles. Riche en acides gras essentiels, en vitamines A, D, E et F, elle nourrit, régénère et protège la peau en profondeur. Son utilisation remonte à des siècles dans la pharmacopée traditionnelle sénégalaise.",
    price: 12000,
    image: "https://images.pexels.com/photos/13418938/pexels-photo-13418938.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/13418938/pexels-photo-13418938.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/13418938/pexels-photo-13418938.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/13418938/pexels-photo-13418938.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Alimentaire",
    categorySlug: "alimentaire",
    rating: 4.8,
    reviewCount: 97,
    inStock: true,
    artisan: "Coopérative Njaay",
    artisanId: "1",
    tags: ["soin", "naturel", "baobab"],
  },
  {
    id: "10",
    name: "Sac à Main en Cuir Tanné",
    slug: "sac-main-cuir-tanne",
    description: "Sac à main en cuir de chèvre tanné artisanalement. Design moderne, savoir-faire ancestral.",
    longDescription: "Ce sac est fabriqué en cuir de chèvre tanné selon la méthode traditionnelle de Mékhé, le village des tanneurs du Sénégal. Le processus de tannage végétal, utilisant des écorces et des feuilles locales, dure plusieurs semaines et confère au cuir sa souplesse et sa durabilité remarquables. Le design mêle lignes contemporaines et motifs traditionnels, pour un accessoire qui traverse les modes.",
    price: 35000,
    originalPrice: 42000,
    image: "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/33159732/pexels-photo-33159732.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Artisanat",
    categorySlug: "artisanat",
    rating: 4.7,
    reviewCount: 64,
    inStock: true,
    artisan: "Maison Diop",
    artisanId: "3",
    badge: "Promo",
    tags: ["mode", "cuir", "sac"],
  },
  {
    id: "11",
    name: "Épices Yassa Authentiques",
    slug: "epices-yassa-authentiques",
    description: "Mélange d'épices pour le fameux poulet Yassa. Recette traditionnelle de Casamance.",
    longDescription: "Ce mélange d'épices a été élaboré par Mame Fatou Sall, grande cuisinière de renommée à Ziguinchor. Il contient tous les ingrédients nécessaires pour préparer un Yassa authentique : oignons séchés, moutarde locale, citron vert déshydraté, piment oiseau et un bouquet d'épices secrètes. Un sachet suffit pour préparer un plat pour 6 personnes. Instructions de préparation incluses.",
    price: 2500,
    image: "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/674483/pexels-photo-674483.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Alimentaire",
    categorySlug: "alimentaire",
    rating: 4.9,
    reviewCount: 256,
    inStock: true,
    artisan: "Torréfaction Sall",
    artisanId: "4",
    badge: "Best-seller",
    tags: ["cuisine", "épices", "yassa"],
  },
  {
    id: "12",
    name: "Djembé Artisanal Sculpté",
    slug: "djembe-artisanal-sculpte",
    description: "Djembé professionnel en bois de lenke, peau de chèvre. Son puissant et profond.",
    longDescription: "Ce djembé est fabriqué par les maîtres luthiers de la région de Tambacounda, gardiens d'un savoir-faire séculaire. Le fût est sculpté dans un seul tronc de lenke, bois réputé pour ses qualités acoustiques exceptionnelles. La peau de chèvre est sélectionnée et tendue selon les techniques traditionnelles mandingues. Chaque djembé est testé et accordé par un griot professionnel avant expédition.",
    price: 75000,
    image: "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
    images: [
      "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
      "https://images.pexels.com/photos/11379510/pexels-photo-11379510.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop",
    ],
    category: "Traditionnel",
    categorySlug: "traditionnel",
    rating: 4.9,
    reviewCount: 42,
    inStock: true,
    artisan: "Maison Diop",
    artisanId: "3",
    badge: "Premium",
    tags: ["musique", "instrument", "mandingue"],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.badge === "Best-seller" || p.badge === "Populaire");
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.includes(q))
  );
}
