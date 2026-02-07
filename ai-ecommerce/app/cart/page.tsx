'use client';

import Link from 'next/link';
import {
  MinusIcon,
  PlusIcon,
  TrashIcon,
  ArrowLeftIcon,
  ShoppingCartIcon,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { useCart } from '@/lib/cart-context';
import { categoryEmoji, formatEUR } from '@/lib/utils';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          Shopping Cart
          {totalItems > 0 && (
            <span className="ml-3 text-base font-normal text-muted-foreground">
              ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          /* ── Empty state ── */
          <div className="mt-16 flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <ShoppingCartIcon className="size-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="mt-5 font-display text-xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Browse our catalog to find the best tech deals.
            </p>
            <Link
              href="/catalog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* ── Items list ── */}
            <div className="flex flex-col gap-4">
              {items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 rounded-xl border bg-card p-4"
                >
                  {/* Image */}
                  <Link
                    href={`/product/${product.slug}`}
                    className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-muted/50"
                  >
                    <span className="text-3xl select-none opacity-40" aria-hidden="true">
                      {categoryEmoji(product.categoryId)}
                    </span>
                  </Link>

                  {/* Info */}
                  <div className="flex flex-1 flex-col min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                      {product.brand.replace('-', ' ')}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="text-sm font-medium leading-snug hover:text-primary transition-colors duration-200 truncate"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      {/* Quantity */}
                      <div className="flex h-8 items-center rounded-lg border">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          disabled={quantity <= 1}
                          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <MinusIcon className="size-3.5" aria-hidden="true" />
                        </button>
                        <span className="flex h-full w-8 items-center justify-center border-x text-xs font-semibold tabular-nums">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="flex h-full w-8 items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground"
                          aria-label="Increase quantity"
                        >
                          <PlusIcon className="size-3.5" aria-hidden="true" />
                        </button>
                      </div>

                      {/* Price + Remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold tabular-nums">
                          {formatEUR(product.price * quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeItem(product.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-destructive/10 hover:text-destructive"
                          aria-label={`Remove ${product.name} from cart`}
                        >
                          <TrashIcon className="size-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear */}
              <button
                type="button"
                onClick={clearCart}
                className="self-start text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-destructive"
              >
                Clear cart
              </button>
            </div>

            {/* ── Summary ── */}
            <div className="h-fit rounded-xl border bg-card p-6">
              <h2 className="font-display text-lg font-bold">Order Summary</h2>

              <div className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold tabular-nums">{formatEUR(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-base">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold tabular-nums">{formatEUR(totalPrice)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-6 flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Checkout
              </button>

              <Link
                href="/catalog"
                className="mt-3 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                <ArrowLeftIcon className="size-3.5" aria-hidden="true" />
                Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
