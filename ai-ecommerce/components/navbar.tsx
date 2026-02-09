'use client';

import Link from 'next/link';
import {
  SearchIcon,
  ZapIcon,
  ShoppingCartIcon,
  UserIcon,
  SparklesIcon,
  LogOutIcon,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useChatDrawer } from '@/lib/chat-drawer-context';
import { useAuth } from '@/lib/auth-context';
import { AgentSelector } from '@/components/agent-selector';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  /** Highlight the active nav item */
  active?: 'home' | 'catalog';
}

export function Navbar({ active }: NavbarProps) {
  const { totalItems } = useCart();
  const { toggle } = useChatDrawer();
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const linkClass = (name: string) =>
    `font-medium transition-colors duration-200 ${
      active === name ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
    }`;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  return (
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
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Search products, brands, categories…"
              autoComplete="off"
              className="h-10 w-full rounded-lg border bg-background pl-10 pr-4 text-sm outline-none transition-colors duration-200 placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
              aria-label="Search products"
            />
          </div>
        </div>

        {/* Links */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          <Link href="/catalog" className={linkClass('catalog')}>Catalog</Link>
          <AgentSelector />
        </div>

        {/* Icons */}
        <div className="ml-auto flex items-center gap-1">
          {/* Mobile AI Chat button */}
          <button
            type="button"
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground md:hidden"
            aria-label="Open AI Chat"
          >
            <SparklesIcon className="size-[18px]" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-1.5 font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm"
          >
            <SparklesIcon className="size-3.5" aria-hidden="true" />
            AI&nbsp;Chat
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
                aria-label="User menu"
              >
                <UserIcon className="size-[18px]" aria-hidden="true" />
                <span className="hidden text-sm font-medium md:inline">{user.name}</span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border bg-card p-1.5 shadow-lg">
                  <div className="px-3 py-2 text-xs text-muted-foreground border-b mb-1.5 pb-2">
                    {user.email}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground transition-colors duration-200 hover:bg-muted"
                  >
                    <LogOutIcon className="size-4" aria-hidden="true" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            >
              <UserIcon className="size-[18px]" aria-hidden="true" />
              <span className="hidden md:inline">Sign in</span>
            </Link>
          )}

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-200 hover:bg-muted hover:text-foreground"
            aria-label="Shopping cart"
          >
            <ShoppingCartIcon className="size-[18px]" aria-hidden="true" />
            {totalItems > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground tabular-nums">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
