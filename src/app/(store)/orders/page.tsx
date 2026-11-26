import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { mergeOrders, readReceipts } from "@/lib/receipts";
import { formatShortDate, formatPrice } from "@/lib/format";
import { ArrowRightIcon, BagIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your orders",
};

export default async function OrdersPage() {
  const session = await getSessionUser();

  if (!session) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <BagIcon className="h-8 w-8 text-ink/25" />
        <h1 className="mt-4 text-3xl">Sign in to see your orders</h1>
        <p className="mt-2 max-w-sm text-sm text-ink/55">
          Your order history, tracking and receipts live in your account.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login" className="btn-primary">
            Sign in
          </Link>
          <Link href="/register" className="btn-outline">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  const db = await readDb();
  const matches = (order: {
    userId: string | null;
    email: string;
  }) =>
    order.userId === session.id ||
    order.email === session.email.toLowerCase();

  const orders = mergeOrders(
    db.orders.filter(matches),
    await readReceipts(),
    matches,
  );

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-2 text-4xl">Orders</h1>
        </div>
        <p className="text-sm text-ink/45">
          {orders.length} {orders.length === 1 ? "order" : "orders"} on record
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed border-ink/15 py-20 text-center">
          <p className="font-display text-2xl">No orders yet</p>
          <p className="mt-2 text-sm text-ink/55">
            When you place one, it will appear here with tracking.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Start shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-8 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-xl border border-ink/10 bg-white p-5 transition hover:border-ink/25"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{order.number}</p>
                  <p className="mt-1 text-xs text-ink/45">
                    {formatShortDate(order.createdAt)} · {order.items.length}{" "}
                    {order.items.length === 1 ? "piece" : "pieces"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-sand/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] capitalize">
                    {order.status}
                  </span>
                  <p className="text-sm font-medium">
                    {formatPrice(order.totals.total)}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 4).map((item) => (
                    <div
                      key={`${order.id}-${item.slug}-${item.color}`}
                      className="relative h-11 w-11 overflow-hidden rounded-lg border-2 border-white bg-sand/50"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 4 ? (
                    <span className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-white bg-ink text-[10px] text-paper">
                      +{order.items.length - 4}
                    </span>
                  ) : null}
                </div>
                <Link
                  href={`/orders/${order.id}`}
                  className="group inline-flex items-center gap-2 text-xs text-ink/60 hover:text-ink"
                >
                  View order
                  <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
