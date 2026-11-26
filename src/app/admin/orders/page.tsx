import type { Metadata } from "next";
import Link from "next/link";
import { readDb } from "@/lib/db";
import { formatPrice, formatShortDate, classNames } from "@/lib/format";
import { StatusSelect } from "@/components/admin/status-select";
import type { OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Orders" };

const filters: { value: string; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "packed", label: "Packed" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const db = await readDb();
  const active = searchParams.status
    ? db.orders.filter((order) => order.status === searchParams.status)
    : db.orders;

  const orders = [...active].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  const counts = filters.map((filter) => ({
    ...filter,
    count: filter.value
      ? db.orders.filter((order) => order.status === filter.value).length
      : db.orders.length,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">Orders</h1>
          <p className="mt-1 text-sm text-ink/50">
            Update fulfilment status as parcels leave the bench.
          </p>
        </div>
        <p className="text-xs text-ink/40">{orders.length} shown</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {counts.map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/orders?status=${filter.value}` : "/admin/orders"}
            className={classNames(
              "rounded-full border px-3 py-1.5 text-[11px] transition",
              (searchParams.status ?? "") === filter.value
                ? "border-ink bg-ink text-paper"
                : "border-ink/15 bg-white text-ink/60 hover:border-ink/40",
            )}
          >
            {filter.label}
            <span className="ml-1.5 opacity-50">{filter.count}</span>
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-ink/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="border-b border-ink/10 text-[10px] uppercase tracking-[0.12em] text-ink/35">
            <tr>
              <th className="px-5 py-3 font-normal">Order</th>
              <th className="px-3 py-3 font-normal">Customer</th>
              <th className="px-3 py-3 font-normal">Items</th>
              <th className="px-3 py-3 font-normal">Date</th>
              <th className="px-3 py-3 font-normal">Total</th>
              <th className="px-3 py-3 font-normal">Status</th>
              <th className="px-5 py-3 text-right font-normal">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-ink/[0.02]">
                <td className="px-5 py-3">
                  <p className="font-medium">{order.number}</p>
                  <p className="text-[10px] text-ink/35">{order.id}</p>
                </td>
                <td className="px-3 py-3">
                  <p>{order.address.fullName}</p>
                  <p className="text-[10px] text-ink/40">{order.email}</p>
                </td>
                <td className="px-3 py-3 text-ink/55">
                  {order.items.reduce((sum, item) => sum + item.qty, 0)}
                </td>
                <td className="px-3 py-3 text-ink/45">
                  {formatShortDate(order.createdAt)}
                </td>
                <td className="px-3 py-3">{formatPrice(order.totals.total)}</td>
                <td className="px-3 py-3">
                  <StatusSelect
                    orderId={order.id}
                    status={order.status as OrderStatus}
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/orders/${order.id}`}
                    className="text-ink/45 underline underline-offset-2 hover:text-ink"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center text-ink/40">
                  No orders with that status.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
