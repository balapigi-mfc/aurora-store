import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getProducts } from "@/lib/catalog";
import { updateDb } from "@/lib/db";
import { slugify } from "@/lib/format";
import type { CategoryId, Product, Spec } from "@/lib/types";

export const dynamic = "force-dynamic";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }
  const products = await getProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  let body: Partial<Product> & { specsText?: string; imagesText?: string; colorsText?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const name = body.name?.trim();
  const price = Number(body.price);
  if (!name || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { message: "A name and a price above zero are required." },
      { status: 422 },
    );
  }

  const existing = await getProducts();
  const baseSlug = slugify(body.slug || name);
  let slug = baseSlug;
  let counter = 2;
  while (existing.some((product) => product.slug === slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }

  const images = Array.isArray(body.images)
    ? body.images.filter(Boolean)
    : (body.imagesText ?? "")
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean);
  const colors = Array.isArray(body.colors)
    ? body.colors.filter(Boolean)
    : (body.colorsText ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
  const specs: Spec[] = Array.isArray(body.specs)
    ? body.specs
    : (body.specsText ?? "")
        .split("\n")
        .map((line) => line.split(":"))
        .filter((parts) => parts.length >= 2)
        .map((parts) => ({
          label: parts[0].trim(),
          value: parts.slice(1).join(":").trim(),
        }));

  const product: Product = {
    id: `p_custom_${Date.now().toString(36)}`,
    slug,
    name,
    tagline: body.tagline?.trim() || "A new piece from the studio.",
    description: body.description?.trim() || "",
    category: (body.category as CategoryId) ?? "accessories",
    price,
    compareAt: body.compareAt ? Number(body.compareAt) : undefined,
    images: images.length > 0 ? images : [FALLBACK_IMAGE],
    colors: colors.length > 0 ? colors : ["Natural"],
    specs:
      specs.length > 0
        ? specs
        : [{ label: "Origin", value: "Aurora studio" }],
    rating: 5,
    reviewCount: 0,
    stock: Number(body.stock) || 0,
    badge: body.badge?.trim() || undefined,
    featured: Boolean(body.featured),
    createdAt: new Date().toISOString().slice(0, 10),
  };

  await updateDb((db) => {
    db.customProducts.push(product);
  });

  return NextResponse.json({ product }, { status: 201 });
}
