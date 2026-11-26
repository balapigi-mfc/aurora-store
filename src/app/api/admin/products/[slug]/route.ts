import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { products as baseProducts } from "@/data/products";
import { readDb, updateDb } from "@/lib/db";
import type { Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  let body: Partial<Product>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const db = await readDb();
  const isCustom = db.customProducts.some((product) => product.slug === params.slug);
  const isBase = baseProducts.some((product) => product.slug === params.slug);

  if (!isCustom && !isBase) {
    return NextResponse.json({ message: "Product not found." }, { status: 404 });
  }

  const allowed: Partial<Product> = {
    ...(body.name !== undefined ? { name: String(body.name) } : {}),
    ...(body.tagline !== undefined ? { tagline: String(body.tagline) } : {}),
    ...(body.description !== undefined
      ? { description: String(body.description) }
      : {}),
    ...(body.price !== undefined ? { price: Number(body.price) } : {}),
    ...(body.compareAt !== undefined
      ? { compareAt: body.compareAt ? Number(body.compareAt) : undefined }
      : {}),
    ...(body.stock !== undefined ? { stock: Number(body.stock) } : {}),
    ...(body.badge !== undefined ? { badge: body.badge || undefined } : {}),
    ...(body.featured !== undefined ? { featured: Boolean(body.featured) } : {}),
    ...(body.category !== undefined ? { category: body.category } : {}),
    ...(Array.isArray(body.images) ? { images: body.images } : {}),
    ...(Array.isArray(body.colors) ? { colors: body.colors } : {}),
    ...(Array.isArray(body.specs) ? { specs: body.specs } : {}),
  };

  await updateDb((next) => {
    if (isCustom) {
      next.customProducts = next.customProducts.map((product) =>
        product.slug === params.slug ? { ...product, ...allowed } : product,
      );
    } else {
      next.productOverrides[params.slug] = {
        ...next.productOverrides[params.slug],
        ...allowed,
      };
    }
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  await updateDb((db) => {
    db.customProducts = db.customProducts.filter(
      (product) => product.slug !== params.slug,
    );
    if (!db.deletedProducts.includes(params.slug)) {
      db.deletedProducts.push(params.slug);
    }
  });

  return NextResponse.json({ ok: true });
}
