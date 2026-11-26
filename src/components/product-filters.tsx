"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { categories } from "@/data/products";
import { classNames } from "@/lib/format";
import { CloseIcon, SearchIcon } from "@/components/icons";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "new", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const prices = [
  { value: "", label: "Any price" },
  { value: "0-100", label: "Under $100" },
  { value: "100-300", label: "$100 – $300" },
  { value: "300-", label: "$300+" },
];

export function ProductFilters({ total }: { total: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [query, setQuery] = useState(params.get("q") ?? "");

  const activeCategory = params.get("category") ?? "";
  const activeSort = params.get("sort") ?? "featured";
  const activePrice = params.get("price") ?? "";
  const hasFilters = Boolean(
    activeCategory || activePrice || params.get("q") || activeSort !== "featured",
  );

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/products${next.toString() ? `?${next}` : ""}`, {
      scroll: false,
    });
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    update("q", query.trim());
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSubmit}>
        <div className="flex items-center gap-2 rounded-lg border border-ink/15 bg-white px-3">
          <SearchIcon className="h-4 w-4 shrink-0 text-ink/35" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the collection"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
          />
          {query ? (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                update("q", "");
              }}
              className="text-ink/35 hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </form>

      <div>
        <p className="eyebrow">Category</p>
        <ul className="mt-3 space-y-1 text-sm">
          <li>
            <button
              type="button"
              onClick={() => update("category", "")}
              className={classNames(
                "w-full rounded-md px-2 py-1.5 text-left transition hover:bg-ink/5",
                !activeCategory ? "font-medium text-ink" : "text-ink/60",
              )}
            >
              All products
              <span className="float-right text-[11px] text-ink/35">{total}</span>
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => update("category", category.id)}
                className={classNames(
                  "w-full rounded-md px-2 py-1.5 text-left capitalize transition hover:bg-ink/5",
                  activeCategory === category.id
                    ? "font-medium text-ink"
                    : "text-ink/60",
                )}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="eyebrow">Price</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {prices.map((price) => (
            <button
              key={price.label}
              type="button"
              onClick={() => update("price", price.value)}
              className={classNames(
                "rounded-full border px-3 py-1.5 text-xs transition",
                activePrice === price.value
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 text-ink/60 hover:border-ink/40",
              )}
            >
              {price.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow">Sort by</p>
        <select
          value={activeSort}
          onChange={(event) => update("sort", event.target.value)}
          className="field mt-3 h-11 py-0"
        >
          {sorts.map((sort) => (
            <option key={sort.value} value={sort.value}>
              {sort.label}
            </option>
          ))}
        </select>
      </div>

      {hasFilters ? (
        <button
          type="button"
          onClick={() => router.push("/products")}
          className="text-xs text-ink/50 underline underline-offset-4 hover:text-ink"
        >
          Clear all filters
        </button>
      ) : null}
    </div>
  );
}
