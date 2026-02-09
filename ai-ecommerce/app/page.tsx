"use client";
import { Navbar } from "@/components/navbar";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import brandsData from "@/data/brands.json";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import { useChatDrawer } from "@/lib/chat-drawer-context";
import type { Brand, Category, Product } from "@/lib/types";
import {
  ArrowRightIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TruckIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const categories = categoriesData as unknown as Category[];
const products = productsData as unknown as Product[];
const brands = brandsData as unknown as Brand[];

const featured = products
  .filter(
    (p) => p.badges.includes("Best Seller") || p.badges.includes("Trending"),
  )
  .slice(0, 8);

const perks = [
  {
    icon: TruckIcon,
    title: "Free Shipping",
    desc: "On orders over 49\u00a0\u20ac",
  },
  { icon: ShieldCheckIcon, title: "2-Year Warranty", desc: "On all products" },
  { icon: RotateCcwIcon, title: "30-Day Returns", desc: "No questions asked" },
  { icon: SparklesIcon, title: "AI Assistant", desc: "24/7 smart support" },
];

export default function Home() {
  const { toggle } = useChatDrawer();
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      <Navbar active="home" />

      <main id="main">
        {/* ── Hero ── */}
        <section className="relative min-h-[28rem] overflow-hidden border-b md:min-h-[32rem]">
          <Image
            src="/hero-background.png"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-background/75 backdrop-blur-[1px]" />
          <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl flex-col justify-center px-6 py-16 md:min-h-[32rem] md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="animate-reveal mb-5 inline-flex items-center gap-2 rounded-full border bg-card/90 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <SparklesIcon
                  className="size-3.5 text-primary"
                  aria-hidden="true"
                />
                AI-Powered Electronics Marketplace
              </div>

              <h1 className="animate-reveal delay-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Find the best tech, <span className="text-primary">faster</span>
              </h1>

              <p className="animate-reveal delay-2 mt-5 text-lg text-muted-foreground">
                Browse thousands of products or let our AI assistant help you
                find exactly what you need.
              </p>

              <div className="animate-reveal delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Button asChild>
                  <Link href="/catalog">
                    Browse Catalog
                    <ArrowRightIcon className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
                <Button onClick={toggle} variant="outline">
                  <SparklesIcon
                    className="size-4 text-primary"
                    aria-hidden="true"
                  />
                  Chat with AI
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Perks strip ── */}
        <section className="border-b">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {perks.map((p) => (
              <div
                key={p.title}
                className="flex items-center gap-3 bg-background px-6 py-4"
              >
                <p.icon
                  className="size-5 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Categories
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  Shop by Category
                </h2>
              </div>
              <Link
                href="/catalog"
                className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className={`animate-reveal delay-${i + 1} group flex flex-col overflow-hidden rounded-xl border bg-card text-center transition-all duration-200 hover:border-primary/30 hover:shadow-md`}
                >
                  <div className="relative aspect-square w-full bg-muted">
                    {cat.landingImage ? (
                      <Image
                        src={cat.landingImage}
                        alt={cat.name}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      />
                    ) : (
                      <span
                        className="flex h-full items-center justify-center text-4xl"
                        role="img"
                        aria-label={cat.name}
                      >
                        {cat.emoji}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 p-3">
                    <p className="text-sm font-semibold truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                      {cat.productCount.toLocaleString()} products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured products ── */}
        <section className="border-t bg-muted/30 py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Trending
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                  Featured Products
                </h2>
              </div>
              <Link
                href="/catalog"
                className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80"
              >
                View all &rarr;
              </Link>
            </div>

            <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Brands ── */}
        <section className="border-t py-12">
          <div className="mx-auto max-w-7xl px-6">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Trusted Brands
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {brands.slice(0, 10).map((b) => (
                <span
                  key={b.id}
                  className="text-sm font-semibold text-muted-foreground/60 transition-colors duration-200 hover:text-foreground"
                >
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-14 text-center text-primary-foreground md:px-16">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,oklch(1_0_0/0.1),transparent_60%)]" />
              <h2 className="relative font-display text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
                Not sure what to buy?
              </h2>
              <p className="relative mx-auto mt-4 max-w-md text-primary-foreground/80">
                Our AI assistant knows the entire catalog. Ask for
                recommendations, comparisons, or help building your setup.
              </p>
              <Button
                onClick={toggle}
                className="relative mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-card px-6 text-sm font-semibold text-foreground shadow transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <SparklesIcon
                  className="size-4 text-primary"
                  aria-hidden="true"
                />
                Chat with AI
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <ZapIcon
                  className="size-3 text-primary-foreground"
                  aria-hidden="true"
                />
              </div>
              <span className="font-display text-sm font-bold">Nova</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Nova Electronics. Built with
              Mastra, AI&nbsp;SDK&nbsp;&amp;&nbsp;AI&nbsp;Elements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
