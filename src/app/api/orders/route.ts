import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { getSessionUser } from "@/lib/auth";
import { saveReceipt } from "@/lib/receipts";
import { nextOrderNumber, updateDb } from "@/lib/db";
import { computeTotals } from "@/lib/pricing";
import type { Address, Order, OrderLine } from "@/lib/types";

export const dynamic = "force-dynamic";

interface IncomingItem {
  slug?: string;
  color?: string;
  qty?: number;
}

const required: (keyof Address)[] = [
  "fullName",
  "email",
  "phone",
  "line1",
  "city",
  "postcode",
  "country",
];

export async function POST(request: Request) {
  let body: {
    items?: IncomingItem[];
    address?: Address;
    coupon?: string | null;
    note?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request body." }, { status: 400 });
  }

  const address = body.address;
  if (!address || required.some((key) => !String(address[key] ?? "").trim())) {
    return NextResponse.json(
      { message: "Please complete every required delivery field." },
      { status: 422 },
    );
  }

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address.email)) {
    return NextResponse.json(
      { message: "That email address doesn't look right." },
      { status: 422 },
    );
  }

  const incoming = (body.items ?? []).filter(
    (item) => item.slug && Number(item.qty) > 0,
  );
  if (incoming.length === 0) {
    return NextResponse.json({ message: "Your bag is empty." }, { status: 422 });
  }

  const catalog = await getProducts();
  const lines: OrderLine[] = [];

  for (const item of incoming) {
    const product = catalog.find((entry) => entry.slug === item.slug);
    if (!product) {
      return NextResponse.json(
        { message: "One of those pieces is no longer available." },
        { status: 409 },
      );
    }
    const qty = Math.min(Math.max(Math.floor(Number(item.qty)), 1), 10);
    if (product.stock < qty) {
      return NextResponse.json(
        { message: `Only ${product.stock} left of ${product.name}.` },
        { status: 409 },
      );
    }
    lines.push({
      slug: product.slug,
      name: product.name,
      price: product.price,
      qty,
      color: item.color && product.colors.includes(item.color)
        ? item.color
        : product.colors[0],
      image: product.images[0],
    });
  }

  const totals = computeTotals(lines, body.coupon);
  const session = await getSessionUser();
  const number = await nextOrderNumber();

  const order: Order = {
    id: `ord_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    number,
    userId: session?.id ?? null,
    email: address.email.trim().toLowerCase(),
    items: lines,
    address: { ...address, email: address.email.trim().toLowerCase() },
    coupon: body.coupon?.trim().toUpperCase() || null,
    totals,
    status: "paid",
    createdAt: new Date().toISOString(),
    note: body.note?.slice(0, 500),
  };

  await updateDb((db) => {
    db.orders.unshift(order);
    for (const line of lines) {
      db.stockUsed[line.slug] = (db.stockUsed[line.slug] ?? 0) + line.qty;
    }
  });

  await saveReceipt(order);

  return NextResponse.json({ order: { id: order.id, number: order.number } }, { status: 201 });
}

export async function GET() {
  const session = await getSessionUser();
  if (!session) {
    return NextResponse.json({ message: "Not signed in." }, { status: 401 });
  }

  const { readDb } = await import("@/lib/db");
  const db = await readDb();
  const orders = db.orders
    .filter(
      (order) =>
        order.userId === session.id ||
        order.email === session.email.toLowerCase(),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return NextResponse.json({ orders });
}
