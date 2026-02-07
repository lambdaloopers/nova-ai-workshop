'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronRightIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  CheckIcon,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { useCart } from '@/lib/cart-context';
import { categoryEmoji, formatEUR } from '@/lib/utils';
import type { Product, Category } from '@/lib/types';

interface Props {
  product: Product;
  category: Category | null;
  related: Product[];
}

export function ProductDetail({ product, category, related }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const hasDiscount = product.discount !== null && product.discount > 0;

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link href="/" className="transition-colors duration-200 hover:text-foreground">Home</Link>
          <ChevronRightIcon className="size-3.5" aria-hidden="true" />
          <Link href="/catalog" className="transition-colors duration-200 hover:text-foreground">Catalog</Link>
          {category && (
            <>
              <ChevronRightIcon className="size-3.5" aria-hidden="true" />
              <Link href={`/catalog?category=${category.slug}`} className="transition-colors duration-200 hover:text-foreground">
                {category.name}
              </Link>
            </>
          )}
          <ChevronRightIcon className="size-3.5" aria-hidden="true" />
          <span className="font-medium text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Product layout */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Left: Image */}
          <div className="relative flex aspect-square items-center justify-center rounded-2xl border bg-muted/50">
            {/* Badges */}
            {(hasDiscount || product.badges.length > 0) && (
              <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
                {hasDiscount && (
                  <span className="rounded-lg bg-deal px-3 py-1 text-xs font-semibold text-white">
                    -{product.discount}%
                  </span>
                )}
                {product.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
            <span className="text-8xl select-none opacity-30" aria-hidden="true">
              {categoryEmoji(product.categoryId)}
            </span>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            {/* Brand */}
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {product.brand.replace('-', ' ')}
            </p>

            {/* Name */}
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`size-4 ${i < Math.round(product.rating) ? 'fill-current' : 'fill-none opacity-30'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold tabular-nums">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold tabular-nums">
                {formatEUR(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through tabular-nums">
                  {formatEUR(product.originalPrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="rounded-md bg-deal/10 px-2 py-0.5 text-sm font-semibold text-deal">
                  Save {formatEUR(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            {/* Perks */}
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              {product.freeShipping && (
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <TruckIcon className="size-4" aria-hidden="true" />
                  Free shipping &middot; {product.deliveryEstimate}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4" aria-hidden="true" />
                2-year warranty
              </span>
              <span className="flex items-center gap-1.5">
                <RotateCcwIcon className="size-4" aria-hidden="true" />
                30-day returns
              </span>
            </div>

            {/* Specs */}
            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Specifications
              </h2>
              <div className="divide-y rounded-xl border">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {/* Qty selector */}
              <div className="flex h-11 w-fit items-center rounded-lg border">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground disabled:opacity-40"
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <MinusIcon className="size-4" aria-hidden="true" />
                </button>
                <span className="flex h-full w-10 items-center justify-center border-x text-sm font-semibold tabular-nums">
                  {qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
                  aria-label="Increase quantity"
                >
                  <PlusIcon className="size-4" aria-hidden="true" />
                </button>
              </div>

              {/* Add button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {added ? (
                  <>
                    <CheckIcon className="size-4" aria-hidden="true" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCartIcon className="size-4" aria-hidden="true" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Stock */}
            <p className="mt-3 text-xs text-muted-foreground">
              {product.inStock ? (
                <span className="text-emerald-600 font-medium">In stock</span>
              ) : (
                <span className="text-destructive font-medium">Out of stock</span>
              )}
            </p>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16 border-t pt-12">
            <h2 className="mb-6 font-display text-xl font-bold tracking-tight">Related Products</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
