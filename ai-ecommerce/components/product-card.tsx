import { StarIcon, TruckIcon } from "lucide-react";
import type { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
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

      {/* Image placeholder */}
      <div className="relative flex aspect-square items-center justify-center bg-muted/50 p-6 transition-colors duration-200 group-hover:bg-muted/80">
        <div className="text-4xl select-none opacity-40">
          {product.categoryId === "laptops" && "💻"}
          {product.categoryId === "components" && "🔧"}
          {product.categoryId === "monitors" && "🖥️"}
          {product.categoryId === "peripherals" && "⌨️"}
          {product.categoryId === "storage" && "💾"}
          {product.categoryId === "smartphones" && "📱"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Brand */}
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {product.brand.replace("-", " ")}
        </p>

        {/* Name */}
        <h3 className="line-clamp-2 text-sm font-medium leading-snug min-w-0">
          {product.name}
        </h3>

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
            {product.price.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through tabular-nums">
              {product.originalPrice.toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
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
      </div>
    </div>
  );
}
