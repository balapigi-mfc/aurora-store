"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/components/store-provider";
import { computeTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { CheckIcon, ShieldIcon, TruckIcon } from "@/components/icons";
import { classNames } from "@/lib/format";

const countries = [
  "Japan",
  "Bangladesh",
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Singapore",
  "India",
];

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  postcode: "",
  country: "Japan",
  note: "",
  card: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, hydrated, clearCart, subtotal } = useStore();
  const [form, setForm] = useState(initialForm);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setCoupon(window.localStorage.getItem("aurora.coupon.v1"));
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setForm((current) => ({
            ...current,
            fullName: current.fullName || data.user.name,
            email: current.email || data.user.email,
          }));
        }
      })
      .catch(() => undefined);
  }, []);

  const totals = computeTotals(cart, coupon);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function formatCard(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    const digits = form.card.replace(/\s/g, "");
    if (digits.length < 15) {
      setError("Enter a test card number — 4242 4242 4242 4242 works.");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      setError("Use the expiry format MM/YY.");
      return;
    }
    if (form.cvc.length < 3) {
      setError("Your security code needs at least 3 digits.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            slug: item.slug,
            color: item.color,
            qty: item.qty,
          })),
          address: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            postcode: form.postcode,
            country: form.country,
          },
          coupon,
          note: form.note,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message ?? "We couldn't place that order.");
      }

      clearCart();
      window.localStorage.removeItem("aurora.coupon.v1");
      router.push(`/orders/${data.order.id}?new=1`);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We couldn't place that order.",
      );
      setLoading(false);
    }
  }

  if (hydrated && cart.length === 0) {
    return (
      <div className="container-page flex flex-col items-center py-24 text-center">
        <h1 className="text-3xl">Nothing to check out</h1>
        <p className="mt-2 text-sm text-ink/55">
          Your bag is empty — add something first.
        </p>
        <Link href="/products" className="btn-primary mt-6">
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-4xl">Checkout</h1>
        <Link href="/cart" className="text-xs text-ink/50 hover:text-ink">
          ← Back to bag
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16"
      >
        <div className="space-y-10">
          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
                1
              </span>
              <h2 className="font-display text-xl">Contact</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="email">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) => set("email", event.target.value)}
                  className="field"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="fullName">
                  Full name
                </label>
                <input
                  id="fullName"
                  required
                  value={form.fullName}
                  onChange={(event) => set("fullName", event.target.value)}
                  className="field"
                  placeholder="Farhan Miraj"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  id="phone"
                  required
                  value={form.phone}
                  onChange={(event) => set("phone", event.target.value)}
                  className="field"
                  placeholder="+81 90 1234 5678"
                />
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
                2
              </span>
              <h2 className="font-display text-xl">Delivery</h2>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="line1">
                  Address
                </label>
                <input
                  id="line1"
                  required
                  value={form.line1}
                  onChange={(event) => set("line1", event.target.value)}
                  className="field"
                  placeholder="Street and number"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="line2">
                  Apartment, suite (optional)
                </label>
                <input
                  id="line2"
                  value={form.line2}
                  onChange={(event) => set("line2", event.target.value)}
                  className="field"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={(event) => set("city", event.target.value)}
                  className="field"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="postcode">
                  Postcode
                </label>
                <input
                  id="postcode"
                  required
                  value={form.postcode}
                  onChange={(event) => set("postcode", event.target.value)}
                  className="field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="country">
                  Country
                </label>
                <select
                  id="country"
                  value={form.country}
                  onChange={(event) => set("country", event.target.value)}
                  className="field"
                >
                  {countries.map((country) => (
                    <option key={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="note">
                  Order note (optional)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={form.note}
                  onChange={(event) => set("note", event.target.value)}
                  className="field resize-none"
                  placeholder="Gift message, delivery instructions…"
                />
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-lg border border-ink/15 bg-white p-4">
              <TruckIcon className="mt-0.5 h-5 w-5 text-clay" />
              <div>
                <p className="text-sm font-medium">Standard delivery — 2–4 days</p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {totals.shipping === 0
                    ? "Free on this order"
                    : `${formatPrice(totals.shipping)} — free over $120`}
                </p>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center gap-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] text-paper">
                3
              </span>
              <h2 className="font-display text-xl">Payment</h2>
              <span className="rounded-full bg-sand px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-ink/50">
                Demo
              </span>
            </div>
            <p className="mt-2 text-xs text-ink/45">
              This is a portfolio project — no real charge is made. Use
              4242 4242 4242 4242 with any future date.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="card">
                  Card number
                </label>
                <input
                  id="card"
                  required
                  inputMode="numeric"
                  value={form.card}
                  onChange={(event) => set("card", formatCard(event.target.value))}
                  className="field font-mono tracking-wider"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="expiry">
                  Expiry
                </label>
                <input
                  id="expiry"
                  required
                  value={form.expiry}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                    const formatted =
                      digits.length > 2
                        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                        : digits;
                    set("expiry", formatted);
                  }}
                  className="field font-mono"
                  placeholder="04/29"
                />
              </div>
              <div>
                <label className="field-label" htmlFor="cvc">
                  Security code
                </label>
                <input
                  id="cvc"
                  required
                  inputMode="numeric"
                  value={form.cvc}
                  onChange={(event) =>
                    set("cvc", event.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className="field font-mono"
                  placeholder="123"
                />
              </div>
            </div>
          </section>

          {error ? (
            <p className="rounded-lg border border-clay/30 bg-clay/5 px-4 py-3 text-sm text-clay">
              {error}
            </p>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <h2 className="font-display text-xl">Your order</h2>

            <ul className="mt-4 divide-y divide-ink/5">
              {cart.map((item) => (
                <li
                  key={`${item.slug}-${item.color}`}
                  className="flex items-center gap-3 py-3"
                >
                  <div className="relative h-14 w-12 shrink-0 overflow-hidden rounded-md bg-sand/50">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[9px] text-paper">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{item.name}</p>
                    <p className="text-[11px] text-ink/45">{item.color}</p>
                  </div>
                  <p className="text-xs">{formatPrice(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>

            <dl className="mt-4 space-y-2.5 border-t border-ink/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/55">Subtotal</dt>
                <dd>{formatPrice(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 ? (
                <div className="flex justify-between text-clay">
                  <dt>Discount ({coupon})</dt>
                  <dd>−{formatPrice(totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-ink/55">Shipping</dt>
                <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">Tax</dt>
                <dd>{formatPrice(totals.tax)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-3 text-base font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(totals.total)}</dd>
              </div>
            </dl>

            <button
              type="submit"
              disabled={loading}
              className={classNames("btn-primary mt-6 w-full", loading && "opacity-70")}
            >
              {loading ? "Placing order…" : `Place order — ${formatPrice(totals.total)}`}
            </button>

            <div className="mt-4 space-y-1.5 text-[11px] text-ink/45">
              <p className="flex items-center gap-2">
                <ShieldIcon className="h-3.5 w-3.5" />
                Encrypted checkout · your details stay private
              </p>
              <p className="flex items-center gap-2">
                <CheckIcon className="h-3.5 w-3.5" />
                Free returns within 30 days
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-sand/40 p-4 text-[11px] leading-relaxed text-ink/55">
            You're ordering {cart.reduce((sum, item) => sum + item.qty, 0)} items
            for {formatPrice(subtotal)} before discount. Everything is packed in
            recycled board, no plastic.
          </div>
        </aside>
      </form>
    </div>
  );
}
