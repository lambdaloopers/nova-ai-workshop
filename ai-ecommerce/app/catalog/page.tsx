'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SlidersHorizontalIcon,
  XIcon,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import categoriesData from '@/data/categories.json';
import productsData from '@/data/products.json';
import brandsData from '@/data/brands.json';
import type { Product, Category, Brand } from '@/lib/types';

const categories = categoriesData as unknown as Category[];
const allProducts = productsData as unknown as Product[];
const brands = brandsData as unknown as Brand[];

type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest';

const sortLabels: Record<SortOption, string> = {
  relevance: 'Relevance',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
  rating: 'Best Rated',
  newest: 'Newest',
};

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortOption>('relevance');
  const [mobileFilters, setMobileFilters] = useState(false);

  const toggleBrand = (id: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    let result = allProducts;
    if (selectedCategory) result = result.filter((p) => p.categoryId === selectedCategory);
    if (selectedBrands.size > 0) result = result.filter((p) => selectedBrands.has(p.brand));

    switch (sort) {
      case 'price-asc': return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...result].sort((a, b) => b.price - a.price);
      case 'rating': return [...result].sort((a, b) => b.rating - a.rating);
      default: return result;
    }
  }, [selectedCategory, selectedBrands, sort]);

  const activeBrandsInCategory = useMemo(() => {
    const ids = new Set(
      (selectedCategory
        ? allProducts.filter((p) => p.categoryId === selectedCategory)
        : allProducts
      ).map((p) => p.brand)
    );
    return brands.filter((b) => ids.has(b.id));
  }, [selectedCategory]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedBrands(new Set());
  };

  const hasFilters = selectedCategory !== null || selectedBrands.size > 0;

  /* ── Sidebar content (shared between desktop & mobile) ── */
  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Category filter */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Category</p>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
                selectedCategory === cat.id
                  ? 'bg-primary/10 font-semibold text-primary'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span role="img" aria-label={cat.name}>{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
              </span>
              <span className="tabular-nums text-xs text-muted-foreground">{cat.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Brand filter */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Brand</p>
        <div className="flex flex-col gap-1 max-h-[280px] overflow-y-auto">
          {activeBrandsInCategory.map((b) => (
            <label
              key={b.id}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors duration-150 hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selectedBrands.has(b.id)}
                onChange={() => toggleBrand(b.id)}
                className="h-4 w-4 rounded border-border text-primary accent-primary"
              />
              <span>{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={clearFilters}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-150 hover:bg-muted"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar active="catalog" />

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors duration-200 hover:text-foreground">Home</Link>
          <ChevronRightIcon className="size-3.5" aria-hidden="true" />
          <span className="font-medium text-foreground">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name ?? 'Catalog'
              : 'All Products'}
          </span>
        </nav>

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {selectedCategory
                ? categories.find((c) => c.id === selectedCategory)?.name ?? 'Catalog'
                : 'All Products'}
            </h1>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground tabular-nums">
              {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              type="button"
              onClick={() => setMobileFilters(true)}
              className="flex h-9 items-center gap-2 rounded-lg border px-3 text-sm font-medium lg:hidden"
              aria-label="Open filters"
            >
              <SlidersHorizontalIcon className="size-4" aria-hidden="true" />
              Filters
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-9 appearance-none rounded-lg border bg-card pl-3 pr-8 text-sm font-medium outline-none transition-colors duration-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Sort products"
              >
                {Object.entries(sortLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Layout: sidebar + grid */}
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-[240px] shrink-0 lg:block">
            {filterContent}
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-lg font-semibold">No products found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters.</p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filters drawer ── */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileFilters(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div
            className="relative ml-auto flex h-full w-[300px] max-w-[85vw] flex-col bg-card shadow-xl"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="font-display text-lg font-bold">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                aria-label="Close filters"
              >
                <XIcon className="size-5" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {filterContent}
            </div>
            <div className="border-t px-5 py-4">
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-opacity duration-200 hover:opacity-90"
              >
                Show {filtered.length} {filtered.length === 1 ? 'Product' : 'Products'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
