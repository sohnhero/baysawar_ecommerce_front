"use client";

import { useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/data/products";
import { categories } from "@/data/categories";
import ProductCard from "@/components/ui/ProductCard";
import SearchBar from "@/components/ui/SearchBar";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("cat") || "all";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Sync state with URL during render to avoid useEffect cascading render warning
  const [prevParams, setPrevParams] = useState({ s: initialSearch, c: initialCat });
  if (initialSearch !== prevParams.s || initialCat !== prevParams.c) {
    setSearch(initialSearch);
    setSelectedCat(initialCat);
    setPrevParams({ s: initialSearch, c: initialCat });
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCat !== "all") {
      result = result.filter((p) => p.categorySlug === selectedCat);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q))
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [search, selectedCat, sortBy]);

  return (
    <div className="min-h-screen bg-surface">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading font-bold text-3xl md:text-4xl mb-2"
          >
            Notre Boutique
          </motion.h1>
          <p className="text-white/60">
            {products.length} produits authentiques
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <div className="flex gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl bg-background border border-border-color text-sm focus:outline-none focus:border-brand-green transition-colors cursor-pointer"
            >
              <option value="popular">Populaire</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="rating">Mieux noté</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`lg:hidden p-3 rounded-xl border transition-colors ${
                showFilters
                  ? "bg-brand-green text-white border-brand-green"
                  : "bg-background border-border-color"
              }`}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } lg:block w-full lg:w-56 shrink-0`}
          >
            <div className="bg-background rounded-2xl border border-border-color p-5 sticky top-24">
              <h3 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-muted">
                Catégories
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCat("all")}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCat === "all"
                      ? "bg-brand-green/10 text-brand-green font-medium"
                      : "hover:bg-surface text-muted"
                  }`}
                >
                  Tout ({products.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    onClick={() => setSelectedCat(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      selectedCat === cat.slug
                        ? "bg-brand-green/10 text-brand-green font-medium"
                        : "hover:bg-surface text-muted"
                    }`}
                  >
                    {cat.icon} {cat.name} ({cat.productCount})
                  </button>
                ))}
              </div>

              {/* Price Range UI */}
              <div className="mt-6 pt-6 border-t border-border-color">
                <h3 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-muted">
                  Prix (FCFA)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-color text-xs focus:outline-none focus:border-brand-green"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-color text-xs focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <h3 className="font-heading font-bold text-xl mb-2">
                  Aucun produit trouvé
                </h3>
                <p className="text-muted text-sm">
                  Essayez une autre recherche ou catégorie
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green"></div>
      </div>
    }>
      <ShopContent />
    </Suspense>
  );
}
