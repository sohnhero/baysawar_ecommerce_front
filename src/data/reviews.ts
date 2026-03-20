export interface Review {
  id: string;
  productId: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}

export const reviews: Review[] = [
  { id: "r1", productId: "1", author: "Aminata D.", avatar: "https://i.pravatar.cc/40?img=1", rating: 5, date: "2026-02-15", comment: "Excellent beurre de karité ! Très hydratant, je recommande à 100%.", verified: true },
  { id: "r2", productId: "1", author: "Fatou S.", avatar: "https://i.pravatar.cc/40?img=5", rating: 5, date: "2026-02-10", comment: "La qualité est incomparable. Mes cheveux ont retrouvé leur éclat.", verified: true },
  { id: "r3", productId: "1", author: "Moussa N.", avatar: "https://i.pravatar.cc/40?img=8", rating: 4, date: "2026-01-28", comment: "Bon produit, livraison rapide. Je commande régulièrement.", verified: true },
  { id: "r4", productId: "2", author: "Marie L.", avatar: "https://i.pravatar.cc/40?img=9", rating: 5, date: "2026-03-01", comment: "Magnifique panier ! Les motifs sont d'une beauté incroyable.", verified: true },
  { id: "r5", productId: "2", author: "Ousmane B.", avatar: "https://i.pravatar.cc/40?img=11", rating: 5, date: "2026-02-20", comment: "Cadeau parfait pour ma mère. La qualité artisanale est évidente.", verified: false },
  { id: "r6", productId: "5", author: "Ibrahima K.", avatar: "https://i.pravatar.cc/40?img=12", rating: 5, date: "2026-03-05", comment: "Le meilleur Café Touba que j'ai goûté en dehors du Sénégal !", verified: true },
  { id: "r7", productId: "5", author: "Awa M.", avatar: "https://i.pravatar.cc/40?img=20", rating: 5, date: "2026-02-28", comment: "Saveur authentique, on se croirait à Touba. Merci Baysawarr !", verified: true },
  { id: "r8", productId: "8", author: "Jean-Pierre R.", avatar: "https://i.pravatar.cc/40?img=15", rating: 5, date: "2026-03-10", comment: "Une pièce d'art exceptionnelle. Le travail du bois est remarquable.", verified: true },
  { id: "r9", productId: "12", author: "Cheikh A.", avatar: "https://i.pravatar.cc/40?img=18", rating: 5, date: "2026-01-15", comment: "Son magnifique, grave et résonnant. Un vrai instrument de professionnel.", verified: true },
  { id: "r10", productId: "10", author: "Sophie T.", avatar: "https://i.pravatar.cc/40?img=25", rating: 4, date: "2026-02-05", comment: "Très beau sac, le cuir est souple et sent bon. Juste un peu plus petit que prévu.", verified: true },
  { id: "r11", productId: "4", author: "Ndeye F.", avatar: "https://i.pravatar.cc/40?img=30", rating: 5, date: "2026-03-12", comment: "Les motifs sont superbes et le tissu est de très haute qualité !", verified: true },
  { id: "r12", productId: "7", author: "Abdou S.", avatar: "https://i.pravatar.cc/40?img=32", rating: 4, date: "2026-02-18", comment: "Très bon bissap, je prépare du jus tous les jours maintenant.", verified: true },
];

export function getReviewsByProductId(productId: string): Review[] {
  return reviews.filter((r) => r.productId === productId);
}
