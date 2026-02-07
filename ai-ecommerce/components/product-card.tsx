'use client';

import Link from 'next/link';
import { StarIcon, TruckIcon, ShoppingCartIcon } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import type { Product } from '@/lib/types';
import { categoryEmoji } from '@/lib/utils';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const hasDiscount = product.discount !== null && product.discount > 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow duration-200 hover:shadow-lg">
      {/* Badges */}
      {(hasDiscount || product.badges.length > 0) && (
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
          {hasDiscount && (
            <span className="rounded-md bg-deal px-2 py-0.5 text-[11px] font-semibold text-white">
              -{product.discount}%
            </span>
          )}
          {product.badges.map((badge) => (
            <span
              key={badge}
              className="rounded-md bg-primary px-2 py-0.5 text-[11px] font-semibold text-primary-foreground"
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Image placeholder — clickable */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex aspect-square items-center justify-center bg-muted/50 p-6 transition-colors duration-200 group-hover:bg-muted/80"
      >
        <span className="text-4xl select-none opacity-40" aria-hidden="true">
          {categoryEmoji(product.categoryId)}
        </span>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand */}
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand.replace("-", " ")}
        </p>

        {/* Name — clickable */}
        <Link href={`/product/${product.slug}`} className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-amber-500">
            <StarIcon className="size-3.5 fill-current" aria-hidden="true" />
            <span className="text-xs font-semibold tabular-nums">{product.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold tabular-nums">
            {product.price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              {product.originalPrice.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          )}
        </div>

        {/* Shipping */}
        {product.freeShipping && (
          <div className="flex items-center gap-1 text-emerald-600">
            <TruckIcon className="size-3.5" aria-hidden="true" />
            <span className="text-xs font-medium">
              Free shipping &middot; {product.deliveryEstimate}
            </span>
          </div>
        )}

        {/* Add to cart */}
        <button
          type="button"
          onClick={() => addItem(product)}
          className="mt-2 flex h-9 items-center justify-center gap-2 rounded-lg border bg-background text-sm font-medium transition-colors duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ShoppingCartIcon className="size-4" aria-hidden="true" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
