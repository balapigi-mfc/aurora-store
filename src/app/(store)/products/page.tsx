import type { Metadata } from "next";
import Link from "next/link";
import { categories, getCategory } from "@/data/products";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";

export const metadata: Metadata = {
  title: "Shop all",
  description:
    "Browse the full Aurora collection of audio, wearables, workspace and home objects.",
};

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  price?: string;
}

function applyFilters(list: Product[], params: SearchParams): Product[] {
  let result = [...list];

  if (params.q) {
    const needle = params.q.toLowerCase();
    result = result.filter((product) =>
      [product.name, product.tagline, product.description, product.category]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }

  if (params.category) {
    result = result.filter((product) => product.category === params.category);
  }

  if (params.price) {
    const [min, max] = params.price.split("-");
    result = result.filter((product) => {
      const aboveMin = min ? product.price >= Number(min) : true;
      const belowMax = max ? product.price <= Number(max) : true;
      return aboveMin && belowMax;
    });
  }

  switch (params.sort) {
    case "new":
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      break;
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      result.sort((a, b) => b.rating - a.rating);
      break;
    default:
      result.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      );
  }

  return result;
}

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const catalog = await getProducts();
  const results = applyFilters(catalog, searchParams);
  const category = searchParams.category
    ? getCategory(searchParams.category)
    : undefined;

  return (
    <div className="container-page py-10 lg:py-14">
      <nav className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink/40">
        <Link href="/" className="hover:text-ink">
          Home
        </Link>
        <span>/</span>
        <span className="text-ink/70">{category?.name ?? "Shop all"}</span>
      </nav>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-6 border-b border-ink/10 pb-8">
        <div>
          <h1 className="text-4xl sm:text-5xl">
            {category ? category.name : "The collection"}
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink/60">
            {category
              ? category.blurb
              : "Twelve objects we make in small batches, chosen because we use them ourselves. Every piece ships with a repair guide."}
          </p>
        </div>
        <p className="text-sm text-ink/45">
          {results.length} {results.length === 1 ? "piece" : "pieces"}
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr] lg:gap-14">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <ProductFilters total={catalog.length} />
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/15 py-24 text-center">
              <p className="font-display text-2xl">Nothing matches that yet</p>
              <p className="mt-2 max-w-sm text-sm text-ink/55">
                Try a broader search, or browse the full collection. We add new
                pieces every six weeks.
              </p>
              <Link href="/products" className="btn-primary mt-6">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 xl:grid-cols-3">
              {results.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 3}
                />
              ))}
            </div>
          )}

          {results.length > 0 ? (
            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink/10 pt-6 text-xs text-ink/45">
              <p>Showing all {results.length} pieces</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products?category=${item.id}`}
                    className="rounded-full border border-ink/15 px-3 py-1 transition hover:border-ink/40 hover:text-ink"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
