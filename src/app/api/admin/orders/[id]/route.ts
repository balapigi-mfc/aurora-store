import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { readDb, updateDb } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

const statuses: OrderStatus[] = [
  "pending",
  "paid",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });
  }

  let body: { status?: OrderStatus };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!body.status || !statuses.includes(body.status)) {
    return NextResponse.json({ message: "Unknown status." }, { status: 422 });
  }

  const db = await readDb();
  if (!db.orders.some((order) => order.id === params.id)) {
    return NextResponse.json({ message: "Order not found." }, { status: 404 });
  }

  await updateDb((next) => {
    next.orders = next.orders.map((order) =>
      order.id === params.id ? { ...order, status: body.status! } : order,
    );
  });

  return NextResponse.json({ ok: true });
}
