import "server-only";
import { categories, products as baseProducts } from "@/data/products";
import type { Product } from "@/lib/types";
import { readDb } from "@/lib/db";

function withStock(product: Product, used: number, override?: Partial<Product>) {
  const stock = Math.max(0, (override?.stock ?? product.stock) - used);
  return { ...product, ...override, stock };
}

export async function getProducts(): Promise<Product[]> {
  const db = await readDb();

  const merged = baseProducts
    .filter((product) => !db.deletedProducts.includes(product.slug))
    .map((product) =>
      withStock(product, db.stockUsed[product.slug] ?? 0, db.productOverrides[product.slug]),
    );

  const custom = db.customProducts
    .filter((product) => !db.deletedProducts.includes(product.slug))
    .map((product) => withStock(product, db.stockUsed[product.slug] ?? 0));

  return [...merged, ...custom];
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  const list = await getProducts();
  return list.find((product) => product.slug === slug);
}

export function getCategories() {
  return categories;
}
