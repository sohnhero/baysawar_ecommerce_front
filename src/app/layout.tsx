import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Baysawarr — Vendeurs & Produits Authentiques du Sénégal",
  description:
    "Découvrez les trésors du Sénégal. Vendeurs premium, produits traditionnels et agro-alimentaire d'exception. Livraison dans le monde entier.",
  icons: {
    icon: "/logo_baysawarr.jpg",
    shortcut: "/logo_baysawarr.jpg",
    apple: "/logo_baysawarr.jpg",
  },
};

import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} min-h-screen flex flex-col`}>
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  );
}
