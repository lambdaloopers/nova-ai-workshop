import {
  SparklesIcon,
  ShoppingBagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: SparklesIcon,
    title: "AI-Powered Search",
    description:
      "Find exactly what you need with natural language. Our assistant understands context, not just keywords.",
  },
  {
    icon: ShoppingBagIcon,
    title: "Curated Collections",
    description:
      "Handpicked selections updated daily, powered by AI trend analysis and customer preferences.",
  },
  {
    icon: TruckIcon,
    title: "Lightning Delivery",
    description:
      "Smart logistics ensures your order arrives fast. Real-time tracking from warehouse to doorstep.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Secure Checkout",
    description:
      "End-to-end encrypted transactions with fraud detection built into every purchase.",
  },
];

const categories = [
  { name: "Electronics", count: 2340, gradient: "from-blue-500/20 to-cyan-500/20" },
  { name: "Fashion", count: 5120, gradient: "from-pink-500/20 to-rose-500/20" },
  { name: "Home & Garden", count: 1890, gradient: "from-emerald-500/20 to-green-500/20" },
  { name: "Sports", count: 980, gradient: "from-orange-500/20 to-amber-500/20" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <SparklesIcon className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Nova AI</span>
          </div>
          <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="/" className="text-foreground font-medium">Home</Link>
            <Link href="/chat" className="hover:text-foreground transition-colors">Chat</Link>
            <span className="hover:text-foreground transition-colors cursor-default">Products</span>
            <span className="hover:text-foreground transition-colors cursor-default">About</span>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <SparklesIcon className="size-3.5" />
              AI-powered shopping experience
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Shop smarter with{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI assistance
              </span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Discover products effortlessly. Our AI assistant helps you find,
              compare, and decide — all through natural conversation.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/chat"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md"
              >
                Start chatting
                <ArrowRightIcon className="size-4" />
              </Link>
              <span className="text-sm text-muted-foreground">
                Or click the chat bubble in the corner →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Why shop with Nova AI?
            </h2>
            <p className="mt-3 text-muted-foreground">
              We combine the best of AI with a seamless e-commerce experience.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border bg-background p-6 transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mb-2 font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="mb-14 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Explore categories
            </h2>
            <p className="mt-3 text-muted-foreground">
              Browse our curated collections across popular categories.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => (
              <div
                key={c.name}
                className={`group cursor-default rounded-2xl bg-linear-to-br ${c.gradient} border p-6 transition-all hover:scale-[1.02] hover:shadow-md`}
              >
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.count.toLocaleString()} products
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
                <SparklesIcon className="size-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-semibold">Nova AI</span>
            </div>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} Nova AI Store. Built with Mastra, AI SDK &amp; AI Elements.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
