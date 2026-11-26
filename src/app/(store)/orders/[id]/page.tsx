import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readDb } from "@/lib/db";
import { formatDate, formatPrice } from "@/lib/format";
import { CheckIcon, TruckIcon } from "@/components/icons";
import { classNames } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Order confirmation",
};

const steps: { id: OrderStatus; label: string; detail: string }[] = [
  { id: "paid", label: "Payment received", detail: "We have your order" },
  { id: "packed", label: "Packed", detail: "Wrapped in recycled board" },
  { id: "shipped", label: "Shipped", detail: "Handed to the carrier" },
  { id: "delivered", label: "Delivered", detail: "Enjoy it" },
];

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { new?: string };
}) {
  const db = await readDb();
  const order = db.orders.find((entry) => entry.id === params.id);
  if (!order) notFound();

  const activeIndex = Math.max(
    0,
    steps.findIndex((step) => step.id === order.status),
  );
  const isNew = searchParams.new === "1";

  return (
    <div className="container-page py-10 lg:py-14">
      {isNew ? (
        <div className="mb-8 flex items-start gap-4 rounded-xl border border-moss/20 bg-moss/5 p-5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-moss text-paper">
            <CheckIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-display text-xl">Thank you — your order is in.</p>
            <p className="mt-1 text-sm text-ink/60">
              We've emailed a receipt to {order.email}. Orders placed before 2pm
              leave the studio the same day.
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Order {order.number}</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">
            {isNew ? "You're all set." : "Order details"}
          </h1>
          <p className="mt-2 text-sm text-ink/50">
            Placed {formatDate(order.createdAt)} · {order.items.length}{" "}
            {order.items.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <span className="rounded-full border border-ink/15 bg-white px-4 py-1.5 text-[11px] uppercase tracking-[0.14em] capitalize">
          {order.status}
        </span>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <ol className="grid gap-4 sm:grid-cols-4">
            {steps.map((step, index) => {
              const done = index <= activeIndex;
              return (
                <li key={step.id}>
                  <div
                    className={classNames(
                      "h-1 rounded-full",
                      done ? "bg-ink" : "bg-ink/10",
                    )}
                  />
                  <p
                    className={classNames(
                      "mt-3 text-xs font-medium",
                      done ? "text-ink" : "text-ink/35",
                    )}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink/40">{step.detail}</p>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex items-center gap-3 rounded-lg bg-sand/40 px-4 py-3 text-xs text-ink/60">
            <TruckIcon className="h-4 w-4 text-clay" />
            {order.status === "delivered"
              ? "Delivered — we hope it's earning its place."
              : "Estimated delivery 2–4 days from dispatch. You'll get tracking by email."}
          </div>

          <ul className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {order.items.map((item) => (
              <li
                key={`${item.slug}-${item.color}`}
                className="flex items-center gap-4 py-4"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-sand/50"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-sm font-medium hover:text-clay"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-xs text-ink/45">
                    {item.color} · Qty {item.qty}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
              </li>
            ))}
          </ul>

          {order.note ? (
            <div className="mt-6 rounded-lg border border-ink/10 p-4">
              <p className="eyebrow">Your note</p>
              <p className="mt-2 text-sm text-ink/65">{order.note}</p>
            </div>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              Continue shopping
            </Link>
            <Link href="/contact" className="btn-outline">
              Need help with this order?
            </Link>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-lg">Summary</h2>
            <dl className="mt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd>{formatPrice(order.totals.subtotal)}</dd>
              </div>
              {order.totals.discount > 0 ? (
                <div className="flex justify-between text-clay">
                  <dt>Discount {order.coupon ? `(${order.coupon})` : ""}</dt>
                  <dd>−{formatPrice(order.totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink/55">Shipping</dt>
                <dd>
                  {order.totals.shipping === 0
                    ? "Free"
                    : formatPrice(order.totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Tax</dt>
                <dd>{formatPrice(order.totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(order.totals.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6 text-sm">
            <h2 className="font-display text-lg">Delivery to</h2>
            <address className="mt-3 not-italic leading-relaxed text-ink/65">
              {order.address.fullName}
              <br />
              {order.address.line1}
              {order.address.line2 ? (
                <>
                  <br />
                  {order.address.line2}
                </>
              ) : null}
              <br />
              {order.address.city}, {order.address.postcode}
              <br />
              {order.address.country}
              <br />
              <span className="text-ink/45">{order.address.phone}</span>
            </address>
          </div>

          <p className="px-1 text-[11px] leading-relaxed text-ink/40">
            Keep this page bookmarked — it's your receipt and tracking reference.
            Questions? Reply to your confirmation email or write to
            hello@aurora.store.
          </p>
        </aside>
      </div>
    </div>
  );
}
