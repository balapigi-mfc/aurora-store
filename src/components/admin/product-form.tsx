"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CategoryId, Product } from "@/lib/types";
import { categories } from "@/data/products";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: product?.name ?? "",
    tagline: product?.tagline ?? "",
    description: product?.description ?? "",
    category: (product?.category ?? "accessories") as CategoryId,
    price: product ? String(product.price) : "",
    compareAt: product?.compareAt ? String(product.compareAt) : "",
    stock: product ? String(product.stock) : "10",
    badge: product?.badge ?? "",
    featured: product?.featured ?? false,
    imagesText: product?.images.join("\n") ?? "",
    colorsText: product?.colors.join(", ") ?? "Natural",
    specsText:
      product?.specs.map((spec) => `${spec.label}: ${spec.value}`).join("\n") ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const images = form.imagesText
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      tagline: form.tagline.trim(),
      description: form.description.trim(),
      category: form.category,
      price: Number(form.price),
      compareAt: form.compareAt ? Number(form.compareAt) : undefined,
      stock: Number(form.stock),
      badge: form.badge.trim(),
      featured: form.featured,
      images,
      colors: form.colorsText
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
      specs: form.specsText
        .split("\n")
        .map((line) => line.split(":"))
        .filter((parts) => parts.length >= 2)
        .map((parts) => ({
          label: parts[0].trim(),
          value: parts.slice(1).join(":").trim(),
        })),
    };

    try {
      const response = await fetch(
        product
          ? `/api/admin/products/${product.slug}`
          : "/api/admin/products",
        {
          method: product ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Could not save.");
      router.push("/admin/products");
      router.refresh();
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : "Could not save.",
      );
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
      <div className="space-y-5 rounded-xl border border-ink/10 bg-white p-6">
        <div>
          <label className="field-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(event) => set("name", event.target.value)}
            className="field"
            placeholder="Halo Wireless Headphones"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="tagline">
            Tagline
          </label>
          <input
            id="tagline"
            value={form.tagline}
            onChange={(event) => set("tagline", event.target.value)}
            className="field"
            placeholder="One line that sells it"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={6}
            value={form.description}
            onChange={(event) => set("description", event.target.value)}
            className="field resize-none"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="imagesText">
            Image URLs — one per line
          </label>
          <textarea
            id="imagesText"
            rows={3}
            value={form.imagesText}
            onChange={(event) => set("imagesText", event.target.value)}
            className="field resize-none font-mono text-[11px]"
            placeholder="https://images.unsplash.com/photo-...?w=1200"
          />
        </div>

        <div>
          <label className="field-label" htmlFor="specsText">
            Specs — one per line, "Label: value"
          </label>
          <textarea
            id="specsText"
            rows={5}
            value={form.specsText}
            onChange={(event) => set("specsText", event.target.value)}
            className="field resize-none font-mono text-[11px]"
            placeholder="Weight: 248 g"
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-4 rounded-xl border border-ink/10 bg-white p-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="field-label" htmlFor="price">
                Price (USD)
              </label>
              <input
                id="price"
                required
                type="number"
                min="1"
                step="0.01"
                value={form.price}
                onChange={(event) => set("price", event.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="compareAt">
                Compare at
              </label>
              <input
                id="compareAt"
                type="number"
                min="0"
                step="0.01"
                value={form.compareAt}
                onChange={(event) => set("compareAt", event.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="stock">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => set("stock", event.target.value)}
                className="field"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(event) =>
                  set("category", event.target.value as CategoryId)
                }
                className="field"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="field-label" htmlFor="colors">
              Colours — comma separated
            </label>
            <input
              id="colors"
              value={form.colorsText}
              onChange={(event) => set("colorsText", event.target.value)}
              className="field"
            />
          </div>

          <div>
            <label className="field-label" htmlFor="badge">
              Badge (optional)
            </label>
            <input
              id="badge"
              value={form.badge}
              onChange={(event) => set("badge", event.target.value)}
              className="field"
              placeholder="New, Bestseller…"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-ink/60">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => set("featured", event.target.checked)}
              className="h-4 w-4 rounded border-ink/30"
            />
            Show on the home page
          </label>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink/40">
            Preview
          </p>
          <div className="mt-3 flex gap-3">
            <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand/50">
              {images[0] ? (
                <Image
                  src={images[0]}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium">{form.name || "Product name"}</p>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-ink/45">
                {form.tagline || "Tagline appears here"}
              </p>
              <p className="mt-1.5 text-sm">
                ${form.price ? Number(form.price).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </div>

        {error ? <p className="text-xs text-clay">{error}</p> : null}

        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="btn-primary flex-1 py-2.5 text-xs">
            {saving ? "Saving…" : product ? "Save changes" : "Create product"}
          </button>
          <Link
            href="/admin/products"
            className="btn-outline py-2.5 text-xs"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
