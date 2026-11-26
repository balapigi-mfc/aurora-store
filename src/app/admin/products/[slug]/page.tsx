import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/catalog";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Edit product" };

export default async function EditProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink/40">
            Editing
          </p>
          <h1 className="mt-1 text-2xl font-medium tracking-tight">
            {product.name}
          </h1>
        </div>
        <Link
          href={`/products/${product.slug}`}
          className="text-xs text-ink/45 underline underline-offset-4 hover:text-ink"
        >
          View on storefront →
        </Link>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
