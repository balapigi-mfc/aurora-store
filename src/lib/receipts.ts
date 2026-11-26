import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { getProducts } from "@/lib/catalog";
import type { Address, Order, OrderLine, OrderStatus } from "@/lib/types";

// A receipt is small enough to travel with the shopper. Keeping the last few
// orders in a signed cookie means a confirmation page still resolves after a
// serverless instance is recycled, without a database round trip.
export const RECEIPTS_COOKIE = "aurora_receipts";
const MAX_AGE = 60 * 60 * 24 * 30;
const LIMIT = 3;
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

interface CompactLine {
  s: string;
  n: string;
  p: number;
  q: number;
  c: string;
}

interface CompactOrder {
  i: string;
  no: string;
  at: string;
  u: string | null;
  e: string;
  st: OrderStatus;
  t: Order["totals"];
  l: CompactLine[];
  a: Address;
  cp: string | null;
  nt?: string;
}

function secret(): string {
  return process.env.AUTH_SECRET ?? "aurora-local-development-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function compact(order: Order): CompactOrder {
  return {
    i: order.id,
    no: order.number,
    at: order.createdAt,
    u: order.userId,
    e: order.email,
    st: order.status,
    t: order.totals,
    l: order.items.map((item) => ({
      s: item.slug,
      n: item.name,
      p: item.price,
      q: item.qty,
      c: item.color,
    })),
    a: order.address,
    cp: order.coupon,
    nt: order.note,
  };
}

async function expand(entry: CompactOrder): Promise<Order> {
  const catalog = await getProducts();
  const items: OrderLine[] = entry.l.map((line) => ({
    slug: line.s,
    name: line.n,
    price: line.p,
    qty: line.q,
    color: line.c,
    image: catalog.find((product) => product.slug === line.s)?.images[0] ?? FALLBACK_IMAGE,
  }));

  return {
    id: entry.i,
    number: entry.no,
    userId: entry.u,
    email: entry.e,
    items,
    address: entry.a,
    coupon: entry.cp,
    totals: entry.t,
    status: entry.st,
    createdAt: entry.at,
    note: entry.nt,
  };
}

function decode(raw: string | undefined): CompactOrder[] {
  if (!raw) return [];
  const [payload, signature] = raw.split(".");
  if (!payload || !signature) return [];

  const expected = Buffer.from(sign(payload));
  const received = Buffer.from(signature);
  if (
    expected.length !== received.length ||
    !timingSafeEqual(expected, received)
  ) {
    return [];
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString());
    return Array.isArray(parsed?.orders) ? (parsed.orders as CompactOrder[]) : [];
  } catch {
    return [];
  }
}

export async function readReceipts(): Promise<Order[]> {
  const raw = cookies().get(RECEIPTS_COOKIE)?.value;
  const entries = decode(raw);
  if (entries.length === 0) return [];
  return Promise.all(entries.map(expand));
}

export async function saveReceipt(order: Order): Promise<void> {
  const existing = decode(cookies().get(RECEIPTS_COOKIE)?.value).filter(
    (entry) => entry.i !== order.id,
  );

  const next = [compact(order), ...existing].slice(0, LIMIT);
  const payload = Buffer.from(JSON.stringify({ orders: next })).toString(
    "base64url",
  );

  cookies().set(RECEIPTS_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Orders the shopper can see: the stored ones plus this browser's receipts. */
export function mergeOrders(
  stored: Order[],
  receipts: Order[],
  match: (order: Order) => boolean,
): Order[] {
  const seen = new Set(stored.map((order) => order.id));
  const extra = receipts.filter((order) => !seen.has(order.id) && match(order));
  return [...stored, ...extra].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );
}
