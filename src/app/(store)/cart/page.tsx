"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";
import { computeTotals, FREE_SHIPPING_THRESHOLD, validateCoupon } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  RefreshIcon,
  ShieldIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";

export default function CartPage() {
  const { cart, hydrated, setQty, removeItem, subtotal } = useStore();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setCoupon(window.localStorage.getItem("aurora.coupon.v1"));
  }, []);

  const totals = computeTotals(cart, coupon);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totals.subtotal);

  function applyCode(event: React.FormEvent) {
    event.preventDefault();
    const result = validateCoupon(code, subtotal);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    setCoupon(result.coupon.code);
    window.localStorage.setItem("aurora.coupon.v1", result.coupon.code);
    setCode("");
  }

  function clearCode() {
    setCoupon(null);
    window.localStorage.removeItem("aurora.coupon.v1");
  }

  if (!hydrated) {
    return (
      <div className="container-page py-24">
        <div className="h-6 w-40 animate-pulse rounded bg-ink/10" />
        <div className="mt-6 h-40 animate-pulse rounded-xl bg-ink/5" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container-page flex flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">Your bag</p>
        <h1 className="mt-3 text-4xl">It's empty in here</h1>
        <p className="mt-3 max-w-sm text-sm text-ink/55">
          Good things take a minute. Start with the pieces everyone comes back
          for.
        </p>
        <Link href="/products" className="btn-primary mt-7 group">
          Browse the collection
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="mt-12 grid w-full max-w-lg grid-cols-3 gap-4 text-[11px] text-ink/45">
          <div className="flex flex-col items-center gap-2">
            <TruckIcon className="h-5 w-5 text-clay" />
            Free shipping over $120
          </div>
          <div className="flex flex-col items-center gap-2">
            <RefreshIcon className="h-5 w-5 text-clay" />
            30-day returns
          </div>
          <div className="flex flex-col items-center gap-2">
            <ShieldIcon className="h-5 w-5 text-clay" />
            3-year warranty
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Your bag</h1>
        <p className="text-sm text-ink/45">
          {cart.reduce((sum, item) => sum + item.qty, 0)} items
        </p>
      </div>

      <div className="mt-8 grid gap-12 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        <div>
          {remaining > 0 ? (
            <div className="mb-6 rounded-lg bg-sand/50 px-4 py-3 text-xs text-ink/60">
              You're {formatPrice(remaining)} away from free shipping.
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink/10">
                <div
                  className="h-full rounded-full bg-clay transition-all"
                  style={{
                    width: `${Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="mb-6 rounded-lg bg-moss/10 px-4 py-3 text-xs text-moss">
              Free shipping unlocked — nice one.
            </div>
          )}

          <ul className="divide-y divide-ink/10 border-y border-ink/10">
            {cart.map((item) => (
              <li
                key={`${item.slug}-${item.color}`}
                className="flex gap-4 py-5 sm:gap-6"
              >
                <Link
                  href={`/products/${item.slug}`}
                  className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-sand/50 sm:h-28 sm:w-24"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="text-sm font-medium hover:text-clay sm:text-[15px]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-ink/45">{item.color}</p>
                    </div>
                    <p className="text-sm">{formatPrice(item.price * item.qty)}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-4">
                    <div className="flex items-center rounded-full border border-ink/15">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQty(item.slug, item.color, item.qty - 1)
                        }
                        className="p-2.5 text-ink/50 transition hover:text-ink"
                      >
                        <MinusIcon className="h-3 w-3" />
                      </button>
                      <span className="w-7 text-center text-xs">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          setQty(item.slug, item.color, item.qty + 1)
                        }
                        className="p-2.5 text-ink/50 transition hover:text-ink"
                      >
                        <PlusIcon className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.slug, item.color)}
                      className="flex items-center gap-1.5 text-[11px] text-ink/40 transition hover:text-clay"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link
            href="/products"
            className="mt-6 inline-flex items-center gap-2 text-xs text-ink/50 hover:text-ink"
          >
            ← Continue shopping
          </Link>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-xl">Order summary</h2>

            <form onSubmit={applyCode} className="mt-5">
              <label className="field-label" htmlFor="coupon">
                Discount code
              </label>
              <div className="flex gap-2">
                <input
                  id="coupon"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="SAVE10"
                  className="field h-11 py-0 uppercase placeholder:normal-case"
                />
                <button type="submit" className="btn-outline shrink-0 px-4 py-0">
                  Apply
                </button>
              </div>
              {error ? <p className="mt-2 text-xs text-clay">{error}</p> : null}
              {coupon ? (
                <div className="mt-3 flex items-center justify-between rounded-lg bg-moss/10 px-3 py-2 text-xs text-moss">
                  <span>{coupon} applied</span>
                  <button
                    type="button"
                    onClick={clearCode}
                    className="text-moss/70 underline underline-offset-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <p className="mt-2 text-[11px] text-ink/40">
                  Try SAVE10 or FREESHIP at checkout.
                </p>
              )}
            </form>

            <dl className="mt-6 space-y-3 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between text-clay">
                  <dt>Discount</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink/55">Shipping</dt>
                <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Estimated tax</dt>
                <dd>{formatPrice(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <Link href="/checkout" className="btn-primary mt-6 w-full">
              Checkout
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink/40">
              <ShieldIcon className="h-3.5 w-3.5" />
              Secure checkout · encrypted payment
            </p>
          </div>

          <div className="mt-4 rounded-xl bg-sand/40 p-4 text-[11px] leading-relaxed text-ink/55">
            Orders placed before 2pm ship the same day. Need it gift wrapped? Add
            a note at checkout and we'll include a card, no charge.
          </div>
        </aside>
      </div>
    </div>
  );
}
