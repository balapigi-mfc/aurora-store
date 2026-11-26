import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { SignOutButton } from "@/components/sign-out-button";
import { ArrowLeftIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Aurora Admin" },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#F5F2EC]">
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col bg-ink p-5 text-paper lg:flex">
        <Link href="/" className="font-display text-lg tracking-[0.3em]">
          AURORA
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-paper/35">
          Studio admin
        </p>

        <div className="mt-8 flex-1">
          <AdminNav />
        </div>

        <div className="space-y-3 border-t border-paper/10 pt-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-paper/50 transition hover:text-paper"
          >
            <ArrowLeftIcon className="h-3.5 w-3.5" />
            View storefront
          </Link>
          <div className="rounded-lg bg-paper/5 p-3">
            <p className="text-xs font-medium">{admin.name}</p>
            <p className="mt-0.5 truncate text-[10px] text-paper/40">
              {admin.email}
            </p>
            <SignOutButton className="mt-2 text-[10px] text-paper/40 underline underline-offset-2 hover:text-paper" />
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-ink/10 bg-white px-5 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-ink px-2.5 py-1 text-[10px] uppercase tracking-[0.14em] text-paper lg:hidden">
              Admin
            </span>
            <p className="text-sm text-ink/55">
              Store operations · {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/products/new" className="btn-primary px-4 py-2 text-xs">
              + New product
            </Link>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sand text-xs font-medium">
              {admin.name.slice(0, 1)}
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
