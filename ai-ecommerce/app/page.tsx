import {
  SearchIcon,
  ZapIcon,
  ArrowRightIcon,
  ShoppingCartIcon,
  UserIcon,
  SparklesIcon,
  TruckIcon,
  ShieldCheckIcon,
  RotateCcwIcon,
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import brandsData from "@/data/brands.json";
import type { Product, Category, Brand } from "@/lib/types";

const categories = categoriesData as unknown as Category[];
const products = productsData as unknown as Product[];
const brands = brandsData as unknown as Brand[];

const featured = products.filter((p) =>
  p.badges.includes("Best Seller") || p.badges.includes("Trending")
).slice(0, 8);

const perks = [
  { icon: TruckIcon, title: "Free Shipping", desc: "On orders over 49\u00a0\u20ac" },
  { icon: ShieldCheckIcon, title: "2-Year Warranty", desc: "On all products" },
  { icon: RotateCcwIcon, title: "30-Day Returns", desc: "No questions asked" },
  { icon: SparklesIcon, title: "AI Assistant", desc: "24/7 smart support" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <ZapIcon className="size-4 text-primary-foreground" aria-hidden="true" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">Nova</span>
          </Link>

          {/* Search */}
          <div className="hidden flex-1 md:block max-w-xl">
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search products, brands, categories…"
                className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                aria-label="Search products"
              />
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            <Link href="/catalog" className="font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              Catalog
            </Link>
            <Link href="/chat" className="font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground">
              AI&nbsp;Chat
            </Link>
          </div>

          {/* Icons */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              aria-label="My account"
            >
              <UserIcon className="size-[18px]" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
              aria-label="Shopping cart"
            >
              <ShoppingCartIcon className="size-[18px]" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums">
                0
              </span>
            </button>
          </div>
        </div>
      </nav>

      <main id="main">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b bg-linear-to-b from-primary/4 to-transparent">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <div className="animate-reveal mb-5 inline-flex items-center gap-2 rounded-full border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
                <SparklesIcon className="size-3.5 text-primary" aria-hidden="true" />
                AI-Powered Electronics Marketplace
              </div>

              <h1 className="animate-reveal delay-1 font-display text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
                Find the best tech,{" "}
                <span className="text-primary">faster</span>
              </h1>

              <p className="animate-reveal delay-2 mt-5 text-lg text-muted-foreground">
                Browse thousands of products or let our AI assistant help you find exactly what you need.
              </p>

              <div className="animate-reveal delay-3 mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/catalog"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Browse Catalog
                  <ArrowRightIcon className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/chat"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border bg-card px-6 text-sm font-semibold shadow-sm transition-colors duration-200 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <SparklesIcon className="size-4 text-primary" aria-hidden="true" />
                  Ask AI
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Perks strip ── */}
        <section className="border-b">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {perks.map((p) => (
              <div key={p.title} className="flex items-center gap-3 bg-background px-6 py-4">
                <p.icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{p.desc}</p>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Categories</p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Shop by Category</h2>
              </div>
              <Link href="/catalog" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80">
                View all &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  href={`/catalog?category=${cat.slug}`}
                  className={`animate-reveal delay-${i + 1} group flex flex-col items-center gap-3 rounded-xl border bg-card p-5 text-center transition-all duration-200 hover:border-primary/30 hover:shadow-md`}
                >
                  <span className="text-3xl" role="img" aria-label={cat.name}>{cat.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{cat.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">{cat.productCount.toLocaleString()} products</p>
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
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">Trending</p>
                <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">Featured Products</h2>
              </div>
              <Link href="/catalog" className="text-sm font-medium text-primary transition-colors duration-200 hover:text-primary/80">
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
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">Trusted Brands</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {brands.slice(0, 10).map((b) => (
                <span key={b.id} className="text-sm font-semibold text-muted-foreground/60 transition-colors duration-200 hover:text-foreground">
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
                Our AI assistant knows the entire catalog. Ask for recommendations, comparisons, or help building your setup.
              </p>
              <Link
                href="/chat"
                className="relative mt-8 inline-flex h-11 items-center gap-2 rounded-lg bg-card px-6 text-sm font-semibold text-foreground shadow transition-opacity duration-200 hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                <SparklesIcon className="size-4 text-primary" aria-hidden="true" />
                Chat with AI
              </Link>
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
                <ZapIcon className="size-3 text-primary-foreground" aria-hidden="true" />
              </div>
              <span className="font-display text-sm font-bold">Nova</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Nova Electronics. Built with Mastra, AI&nbsp;SDK&nbsp;&amp;&nbsp;AI&nbsp;Elements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
