import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { categories } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await getProducts();
  const byCategory = categories.map((category) => ({
    ...category,
    count: products.filter((product) => product.category === category.id).length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-ink/50">
            {products.length} pieces live · prices in USD
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-primary px-4 py-2 text-xs">
          + Add product
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {byCategory.map((category) => (
          <span
            key={category.id}
            className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-[11px] text-ink/55"
          >
            {category.name}
            <span className="ml-1.5 text-ink/30">{category.count}</span>
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full min-w-[820px] text-left text-xs">
          <thead className="border-b border-ink/10 text-[10px] uppercase tracking-[0.12em] text-ink/35">
            <tr>
              <th className="px-5 py-3 font-normal">Product</th>
              <th className="px-3 py-3 font-normal">Category</th>
              <th className="px-3 py-3 font-normal">Price</th>
              <th className="px-3 py-3 font-normal">Stock</th>
              <th className="px-3 py-3 font-normal">Rating</th>
              <th className="px-5 py-3 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {products.map((product) => {
              const category = categories.find(
                (item) => item.id === product.category,
              );
              return (
                <tr key={product.id} className="hover:bg-ink/[0.02]">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-sand/50">
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.name}</p>
                        <p className="truncate text-[10px] text-ink/35">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-ink/55">{category?.name}</td>
                  <td className="px-3 py-3">
                    <p>{formatPrice(product.price)}</p>
                    {product.compareAt ? (
                      <p className="text-[10px] text-ink/30 line-through">
                        {formatPrice(product.compareAt)}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={
                        product.stock === 0
                          ? "text-clay"
                          : product.stock <= 10
                            ? "text-amber-700"
                            : "text-ink/60"
                      }
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-ink/55">
                    {product.rating.toFixed(1)} · {product.reviewCount}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-4">
                      <Link
                        href={`/admin/products/${product.slug}`}
                        className="text-[11px] underline underline-offset-2 hover:text-clay"
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-[11px] text-ink/35 hover:text-ink"
                      >
                        View
                      </Link>
                      <DeleteProductButton
                        slug={product.slug}
                        name={product.name}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
