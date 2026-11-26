import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "New product" };

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">New product</h1>
        <p className="mt-1 text-sm text-ink/50">
          Publish straight to the storefront — batches of fifty, as always.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
