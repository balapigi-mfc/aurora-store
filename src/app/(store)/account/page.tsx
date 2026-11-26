import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { readDb } from "@/lib/db";
import { mergeOrders, readReceipts } from "@/lib/receipts";
import { formatDate, formatPrice } from "@/lib/format";
import { SignOutButton } from "@/components/sign-out-button";
import {
  ArrowRightIcon,
  BagIcon,
  HeartIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your account",
};

const links = [
  { label: "Orders", href: "/orders", icon: BagIcon },
  { label: "Saved items", href: "/wishlist", icon: HeartIcon },
  { label: "Shipping & returns", href: "/contact", icon: TruckIcon },
];

export default async function AccountPage() {
  const session = await getSessionUser();
  if (!session) redirect("/login");

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

  const spend = orders.reduce((sum, order) => sum + order.totals.total, 0);
  const latest = orders[0];

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-2 text-4xl">
            Hello, {session.name.split(" ")[0]}.
          </h1>
          <p className="mt-2 text-sm text-ink/50">
            Member since {formatDate(orders.at(-1)?.createdAt ?? "2026-02-18")}
          </p>
        </div>
        <div className="flex items-center gap-4">
          {session.role === "admin" ? (
            <Link href="/admin" className="btn-outline">
              Admin dashboard
            </Link>
          ) : null}
          <SignOutButton />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm transition hover:border-ink/30"
            >
              <span className="flex items-center gap-3">
                <link.icon className="h-4 w-4 text-clay" />
                {link.label}
              </span>
              <ArrowRightIcon className="h-4 w-4 text-ink/30" />
            </Link>
          ))}
          {session.role === "admin" ? (
            <Link
              href="/admin"
              className="flex items-center justify-between rounded-lg border border-ink/10 bg-ink px-4 py-3 text-sm text-paper transition hover:bg-clay"
            >
              <span className="flex items-center gap-3">
                <ShieldIcon className="h-4 w-4" />
                Admin
              </span>
              <ArrowRightIcon className="h-4 w-4 text-paper/50" />
            </Link>
          ) : null}

          <div className="mt-6 rounded-lg bg-sand/40 p-4 text-xs leading-relaxed text-ink/55">
            Questions about an order? Reply to your confirmation email and a
            human answers within a working day.
          </div>
        </aside>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Orders", value: String(orders.length) },
              { label: "Lifetime spend", value: formatPrice(spend) },
              {
                label: "Status",
                value: session.role === "admin" ? "Studio admin" : "Member",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-ink/10 bg-white p-5"
              >
                <p className="eyebrow">{stat.label}</p>
                <p className="mt-2 font-display text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Profile</h2>
              <span className="text-[11px] text-ink/40">
                {session.role === "admin" ? "Admin access" : "Customer"}
              </span>
            </div>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-ink/40">
                  Name
                </dt>
                <dd className="mt-1">{session.name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.1em] text-ink/40">
                  Email
                </dt>
                <dd className="mt-1">{session.email}</dd>
              </div>
            </dl>
            <SignOutButton className="mt-6 text-xs text-ink/50 underline underline-offset-4 hover:text-clay" />
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Recent order</h2>
              <Link
                href="/orders"
                className="group inline-flex items-center gap-1.5 text-xs text-ink/50 hover:text-ink"
              >
                All orders
                <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {latest ? (
              <div className="mt-4">
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-sand/30 p-4">
                  <div>
                    <p className="text-sm font-medium">{latest.number}</p>
                    <p className="mt-0.5 text-xs text-ink/45">
                      {formatDate(latest.createdAt)} · {latest.items.length} items
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] uppercase tracking-[0.12em] capitalize">
                      {latest.status}
                    </span>
                    <p className="text-sm">{formatPrice(latest.totals.total)}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  {latest.items.slice(0, 3).map((item) => (
                    <div
                      key={`${item.slug}-${item.color}`}
                      className="relative h-14 w-14 overflow-hidden rounded-md bg-sand/50"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                  <Link
                    href={`/orders/${latest.id}`}
                    className="ml-auto text-xs text-ink/50 underline underline-offset-4 hover:text-ink"
                  >
                    Track order
                  </Link>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/55">
                No orders yet.{" "}
                <Link href="/products" className="underline underline-offset-4">
                  Start with the collection
                </Link>
                .
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
