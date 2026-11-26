"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/format";
import { BagIcon, CheckIcon, SunIcon, TruckIcon } from "@/components/icons";

const items = [
  { href: "/admin", label: "Overview", icon: SunIcon },
  { href: "/admin/orders", label: "Orders", icon: TruckIcon },
  { href: "/admin/products", label: "Products", icon: BagIcon },
  { href: "/admin/messages", label: "Messages", icon: CheckIcon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={classNames(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
              active
                ? "bg-paper/10 text-paper"
                : "text-paper/55 hover:bg-paper/5 hover:text-paper",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
