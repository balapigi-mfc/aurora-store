import Link from "next/link";
import { readDb } from "@/lib/db";
import { getProducts } from "@/lib/catalog";
import { formatPrice, formatShortDate } from "@/lib/format";
import { ArrowRightIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

function statusTone(status: string) {
  switch (status) {
    case "delivered":
      return "bg-moss/10 text-moss";
    case "shipped":
      return "bg-blue-50 text-blue-700";
    case "packed":
      return "bg-amber-50 text-amber-700";
    case "pending":
      return "bg-clay/10 text-clay";
    case "cancelled":
      return "bg-ink/5 text-ink/40";
    default:
      return "bg-ink/5 text-ink/60";
  }
}

export default async function AdminOverviewPage() {
  const db = await readDb();
  const products = await getProducts();

  const active = db.orders.filter((order) => order.status !== "cancelled");
  const revenue = active.reduce((sum, order) => sum + order.totals.total, 0);
  const aov = active.length ? revenue / active.length : 0;
  const pending = db.orders.filter((order) =>
    ["pending", "paid"].includes(order.status),
  ).length;
  const lowStock = products.filter((product) => product.stock <= 10);

  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (13 - index));
    const key = date.toISOString().slice(0, 10);
    const total = active
      .filter((order) => order.createdAt.slice(0, 10) === key)
      .reduce((sum, order) => sum + order.totals.total, 0);
    return {
      key,
      label: date.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
      total,
    };
  });
  const peak = Math.max(...days.map((day) => day.total), 1);

  const sold = new Map<string, { name: string; units: number; revenue: number }>();
  for (const order of active) {
    for (const line of order.items) {
      const entry = sold.get(line.slug) ?? {
        name: line.name,
        units: 0,
        revenue: 0,
      };
      entry.units += line.qty;
      entry.revenue += line.price * line.qty;
      sold.set(line.slug, entry);
    }
  }
  const topProducts = [...sold.values()]
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const recent = [...db.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const stats = [
    {
      label: "Revenue",
      value: formatPrice(revenue),
      detail: `${active.length} paid orders`,
    },
    {
      label: "Average order",
      value: formatPrice(Math.round(aov)),
      detail: "Across all time",
    },
    {
      label: "Awaiting dispatch",
      value: String(pending),
      detail: `${db.orders.length} orders total`,
    },
    {
      label: "Live products",
      value: String(products.length),
      detail: `${lowStock.length} low on stock`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Overview</h1>
        <p className="mt-1 text-sm text-ink/50">
          Everything moving through the studio right now.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-ink/10 bg-white p-5">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink/40">
              {stat.label}
            </p>
            <p className="mt-2 font-display text-[28px] leading-none">
              {stat.value}
            </p>
            <p className="mt-2 text-[11px] text-ink/40">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-medium">Revenue · last 14 days</h2>
              <p className="mt-1 text-xs text-ink/40">
                {formatPrice(days.reduce((sum, day) => sum + day.total, 0))} in
                period
              </p>
            </div>
            <span className="rounded-full bg-moss/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-moss">
              Live
            </span>
          </div>

          <div className="mt-6 flex h-48 items-end gap-1.5">
            {days.map((day) => (
              <div key={day.key} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t bg-ink/80 transition-colors group-hover:bg-clay"
                    style={{
                      height: `${Math.max(4, (day.total / peak) * 100)}%`,
                    }}
                    title={`${day.label}: ${formatPrice(day.total)}`}
                  />
                </div>
                <span className="text-[9px] text-ink/35">{day.label.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Best sellers</h2>
            <Link
              href="/admin/products"
              className="text-[11px] text-ink/40 hover:text-ink"
            >
              Manage
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {topProducts.map((product, index) => (
              <li key={product.name} className="flex items-center gap-3">
                <span className="w-4 text-[11px] text-ink/30">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{product.name}</p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-ink/5">
                    <div
                      className="h-full rounded-full bg-clay"
                      style={{
                        width: `${(product.units / topProducts[0].units) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs">{product.units} units</p>
                  <p className="text-[10px] text-ink/35">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-xl border border-ink/10 bg-white">
          <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
            <h2 className="text-sm font-medium">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="group inline-flex items-center gap-1.5 text-[11px] text-ink/45 hover:text-ink"
            >
              View all
              <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="text-[10px] uppercase tracking-[0.12em] text-ink/35">
                <tr>
                  <th className="px-6 py-3 font-normal">Order</th>
                  <th className="px-3 py-3 font-normal">Customer</th>
                  <th className="px-3 py-3 font-normal">Date</th>
                  <th className="px-3 py-3 font-normal">Status</th>
                  <th className="px-6 py-3 text-right font-normal">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/5">
                {recent.map((order) => (
                  <tr key={order.id} className="hover:bg-ink/[0.02]">
                    <td className="px-6 py-3 font-medium">{order.number}</td>
                    <td className="px-3 py-3 text-ink/60">
                      {order.address.fullName}
                    </td>
                    <td className="px-3 py-3 text-ink/45">
                      {formatShortDate(order.createdAt)}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] capitalize ${statusTone(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {formatPrice(order.totals.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-6">
          <h2 className="text-sm font-medium">Needs attention</h2>
          <p className="mt-1 text-xs text-ink/40">Stock at or below ten units</p>
          <ul className="mt-4 space-y-3">
            {lowStock.slice(0, 5).map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between gap-3 border-b border-ink/5 pb-3 text-xs last:border-0"
              >
                <span className="truncate">{product.name}</span>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                    product.stock === 0
                      ? "bg-clay/10 text-clay"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {product.stock} left
                </span>
              </li>
            ))}
            {lowStock.length === 0 ? (
              <li className="text-xs text-ink/40">Everything is well stocked.</li>
            ) : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
