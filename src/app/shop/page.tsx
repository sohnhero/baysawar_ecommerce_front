"use client";

import { useState, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import SearchBar from "@/components/ui/SearchBar";
import { api } from "@/lib/api";
import { useEffect } from "react";

function ShopContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialCat = searchParams.get("cat") || "all";
  const initialSeller = searchParams.get("seller") || "";

  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCategories, setDbCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(initialSearch);
  const [selectedCat, setSelectedCat] = useState(initialCat);
  const [selectedSeller, setSelectedSeller] = useState(initialSeller);
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, c, activeCampaign] = await Promise.all([
          api.get<any[]>("/products"),
          api.get<any[]>("/categories"),
          api.get<any>("/flash-sales/active"),
        ]);

        // Apply flash sale prices to products if they belong to the active campaign
        const productsWithFlash = p.map(prod => {
          const flashItem = activeCampaign?.items?.find((item: any) => item.productId === prod.id);
          if (flashItem) {
            return {
              ...prod,
              originalPrice: parseFloat(prod.price),
              price: parseFloat(flashItem.flashPrice),
              badge: `-${flashItem.discountPercent}%`,
              isFlash: true
            };
          }
          return prod;
        });

        setDbProducts(productsWithFlash);
        setDbCategories(c);
      } catch (error) {
        console.error("Failed to fetch shop data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const products = dbProducts;
  const categories = dbCategories;

  // Sync state with URL during render to avoid useEffect cascading render warning
  const [prevParams, setPrevParams] = useState({ s: initialSearch, c: initialCat, sel: initialSeller });
  if (initialSearch !== prevParams.s || initialCat !== prevParams.c || initialSeller !== prevParams.sel) {
    setSearch(initialSearch);
    setSelectedCat(initialCat);
    setSelectedSeller(initialSeller);
    setPrevParams({ s: initialSearch, c: initialCat, sel: initialSeller });
  }

  const filtered = useMemo(() => {
    let result = [...products];

    if (selectedCat !== "all") {
      result = result.filter((p) => {
          const catSlug = typeof p.category === 'object' ? p.category.slug : p.categorySlug;
          return catSlug === selectedCat;
      });
    }
    if (selectedSeller) {
      result = result.filter((p) => p.artisanId === selectedSeller);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.tags && p.tags.some((t: string) => t.toLowerCase().includes(q)))
      );
    }

    if (minPrice) {
      result = result.filter((p) => parseFloat(p.price) >= parseFloat(minPrice));
    }
    if (maxPrice) {
      result = result.filter((p) => parseFloat(p.price) <= parseFloat(maxPrice));
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case "price-desc":
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case "rating":
        result.sort((a, b) => (parseFloat(b.rating) || 0) - (parseFloat(a.rating) || 0));
        break;
      default:
        result.sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }

    return result;
  }, [products, search, selectedCat, sortBy, minPrice, maxPrice]);

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
                  onClick={() => {
                    setSelectedCat("all");
                    setSelectedSeller("");
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    selectedCat === "all" && !selectedSeller
                      ? "bg-brand-green/10 text-brand-green font-medium"
                      : "hover:bg-surface text-muted"
                  }`}
                >
                  Tout ({products.length})
                </button>
                {categories.map((cat) => {
                  const count = products.filter(p => {
                    const catSlug = typeof p.category === 'object' ? p.category.slug : p.categorySlug;
                    return catSlug === cat.slug;
                  }).length;

                  return (
                    <button
                      key={cat.slug}
                      onClick={() => {
                        setSelectedCat(cat.slug);
                        setSelectedSeller("");
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        selectedCat === cat.slug
                          ? "bg-brand-green/10 text-brand-green font-medium"
                          : "hover:bg-surface text-muted"
                      }`}
                    >
                      {cat.icon} {cat.name} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Price Range UI */}
              <div className="mt-6 pt-6 border-t border-border-color">
                <h3 className="font-heading font-semibold text-sm mb-4 uppercase tracking-wider text-muted">
                  Prix (FCFA)
                </h3>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-color text-xs focus:outline-none focus:border-brand-green"
                  />
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-border-color text-xs focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-background rounded-[32px] border border-border-color overflow-hidden animate-pulse">
                    <div className="aspect-[4/5] bg-surface" />
                    <div className="p-6 space-y-4">
                      <div className="h-4 bg-surface rounded w-1/4" />
                      <div className="h-6 bg-surface rounded w-3/4" />
                      <div className="h-8 bg-surface rounded w-1/2" />
                      <div className="h-12 bg-surface rounded-xl w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20 px-4">
                <div className="w-20 h-20 bg-surface rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl text-muted">🔍</span>
                </div>
                <h3 className="font-heading font-black text-2xl mb-2 text-slate-900">
                  Aucun trésor trouvé
                </h3>
                <p className="text-muted text-sm max-w-xs mx-auto mb-8 font-medium">
                  Nous n&apos;avons pas trouvé d&apos;articles correspondant à &quot;{search}&quot; dans cette catégorie.
                </p>
                <button 
                  onClick={() => {
                    setSearch(""); 
                    setSelectedCat("all");
                    setSelectedSeller("");
                    setMinPrice("");
                    setMaxPrice("");
                  }}
                  className="px-8 py-4 bg-brand-green text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-brand-green/20"
                >
                  Réinitialiser les filtres
                </button>
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
