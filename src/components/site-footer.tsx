import Link from "next/link";
import { InstagramIcon } from "@/components/icons";
import { categories } from "@/data/products";
import { NewsletterForm } from "@/components/newsletter-form";

const shopLinks = [
  { label: "All products", href: "/products" },
  { label: "New arrivals", href: "/products?sort=new" },
  { label: "Bestsellers", href: "/products?sort=rating" },
  { label: "Gift cards", href: "/products" },
];

const helpLinks = [
  { label: "Shipping & returns", href: "/contact" },
  { label: "Track an order", href: "/orders" },
  { label: "Care guide", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-sand/40">
      <div className="container-page py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <p className="font-display text-xl tracking-[0.3em]">AURORA</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              A small design studio in Kyoto and Lisbon making objects for
              everyday rituals — built to be repaired, not replaced.
            </p>
            <div className="mt-6 flex items-center gap-3 text-ink/50">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full border border-ink/15 p-2 transition hover:border-ink hover:text-ink"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <span className="text-[11px] uppercase tracking-[0.18em]">
                @aurora.supply
              </span>
            </div>
          </div>

          <div>
            <p className="eyebrow">Shop</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products?category=${category.id}`}
                    className="link-underline"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">More</p>
            <ul className="mt-4 space-y-2.5 text-sm text-ink/65">
              {[...shopLinks.slice(0, 2), ...helpLinks].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="link-underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">The letter</p>
            <p className="mt-4 text-sm text-ink/60">
              One email a month: new pieces, studio notes, and the occasional
              repair guide.
            </p>
            <NewsletterForm />
            <p className="mt-3 text-[11px] text-ink/40">
              No spam. Unsubscribe whenever.
            </p>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-ink/10 pt-6 text-[11px] text-ink/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Aurora Supply Co. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/about" className="hover:text-ink">
              Privacy
            </Link>
            <Link href="/about" className="hover:text-ink">
              Terms
            </Link>
            <span className="text-ink/30">Visa · Mastercard · Amex · Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
