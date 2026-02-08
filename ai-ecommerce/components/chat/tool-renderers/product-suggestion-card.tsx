'use client';

import Link from 'next/link';
import Image from 'next/image';
import { StarIcon, TruckIcon, TagIcon } from 'lucide-react';
import { formatEUR } from '@/lib/utils';

interface ProductSuggestionCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    originalPrice: number | null;
    discount: number | null;
    rating: number;
    reviewCount: number;
    image: string;
    badges: string[];
    freeShipping: boolean;
    slug: string;
  };
}

export function ProductSuggestionCard({ product }: ProductSuggestionCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex gap-3 rounded-xl border bg-card p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm"
    >
      {/* Product Image */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
        {product.discount && (
          <div className="absolute right-1 top-1 flex items-center gap-0.5 rounded-md bg-destructive px-1.5 py-0.5 text-[10px] font-bold text-destructive-foreground">
            <TagIcon className="size-2.5" aria-hidden="true" />
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-medium text-muted-foreground">{product.brand}</p>
          <p className="line-clamp-2 text-xs font-semibold leading-tight text-foreground">
            {product.name}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-bold text-foreground">
              {formatEUR(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] text-muted-foreground line-through">
                {formatEUR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
            <StarIcon className="size-3 fill-current text-amber-500" aria-hidden="true" />
            <span className="font-medium text-foreground">{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount})</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5 text-[10px]">
          {product.freeShipping && (
            <span className="flex items-center gap-0.5 text-emerald-600">
              <TruckIcon className="size-3" aria-hidden="true" />
              Free shipping
            </span>
          )}
          {product.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
