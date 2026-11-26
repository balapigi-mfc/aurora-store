"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";
import {
  BagIcon,
  ChevronDownIcon,
  CloseIcon,
  HeartIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
} from "@/components/icons";
import { categories } from "@/data/products";
import { classNames } from "@/lib/format";

interface SessionUser {
  name: string;
  role: "customer" | "admin";
}

const nav = [
  { label: "Shop all", href: "/products" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, hydrated, wishlist } = useStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.user) setUser(data.user);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    router.push(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="bg-ink text-paper">
        <div className="container-page flex h-9 items-center justify-center gap-6 text-[11px] uppercase tracking-[0.18em]">
          <span>Complimentary shipping over $120</span>
          <span className="hidden text-paper/40 sm:inline">·</span>
          <span className="hidden sm:inline">30-day returns</span>
          <span className="hidden text-paper/40 md:inline">·</span>
          <span className="hidden md:inline">Made in small batches</span>
        </div>
      </div>

      <div className="container-page flex h-[68px] items-center justify-between gap-6">
        <div className="flex items-center gap-3 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="rounded-full p-2 hover:bg-ink/5"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>

        <Link
          href="/"
          className="font-display text-xl tracking-[0.32em] sm:text-[22px]"
        >
          AURORA
        </Link>

        <nav className="hidden items-center gap-8 text-[13px] lg:flex">
          <div className="group relative">
            <button
              type="button"
              className="flex items-center gap-1.5 py-6 text-ink/70 transition hover:text-ink"
            >
              Shop
              <ChevronDownIcon className="h-3.5 w-3.5 transition group-hover:rotate-180" />
            </button>
            <div className="invisible absolute left-1/2 top-full w-[420px] -translate-x-1/2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
              <div className="mt-1 grid grid-cols-2 gap-1 rounded-2xl border border-ink/10 bg-paper p-3 shadow-soft">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/products?category=${category.id}`}
                    className="rounded-xl px-4 py-3 transition hover:bg-ink/5"
                  >
                    <p className="text-sm font-medium">{category.name}</p>
                    <p className="mt-0.5 text-[11px] text-ink/45">
                      {category.blurb}
                    </p>
                  </Link>
                ))}
                <Link
                  href="/products?sort=new"
                  className="col-span-2 rounded-xl bg-sand/60 px-4 py-3 text-sm font-medium transition hover:bg-sand"
                >
                  New arrivals →
                </Link>
              </div>
            </div>
          </div>

          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={classNames(
                "transition hover:text-ink",
                pathname === item.href ? "text-ink" : "text-ink/70",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen((open) => !open)}
            className="rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink sm:block"
            aria-label="Account"
          >
            <UserIcon className="h-5 w-5" />
          </Link>

          <Link
            href="/wishlist"
            className="relative rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink"
            aria-label="Saved items"
          >
            <HeartIcon className="h-5 w-5" />
            {hydrated && wishlist.length > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[10px] font-medium text-paper">
                {wishlist.length}
              </span>
            ) : null}
          </Link>

          <Link
            href="/cart"
            className="relative rounded-full p-2 text-ink/70 transition hover:bg-ink/5 hover:text-ink"
            aria-label="Shopping bag"
          >
            <BagIcon className="h-5 w-5" />
            {hydrated && count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-medium text-paper">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <div className="animate-fade border-t border-ink/10 bg-paper">
          <form
            onSubmit={submitSearch}
            className="container-page flex items-center gap-3 py-3"
          >
            <SearchIcon className="h-5 w-5 text-ink/40" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search headphones, keyboards, ceramics…"
              className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
            />
            <button type="submit" className="text-xs uppercase tracking-[0.16em]">
              Search
            </button>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="p-1 text-ink/40 hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </form>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm animate-fade flex-col bg-paper p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-lg tracking-[0.3em]">
                AURORA
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="rounded-full p-2 hover:bg-ink/5"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-8 flex flex-col gap-1">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-ink/10 py-3 font-display text-2xl"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <p className="eyebrow mt-8">Categories</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="rounded-lg bg-white px-3 py-2.5 text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-8">
              <Link href={user ? "/account" : "/login"} className="btn-outline">
                <UserIcon className="h-4 w-4" />
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
              </Link>
              <Link href="/cart" className="btn-primary">
                <BagIcon className="h-4 w-4" />
                Bag ({hydrated ? count : 0})
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
