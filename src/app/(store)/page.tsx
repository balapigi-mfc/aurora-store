import Image from "next/image";
import Link from "next/link";
import { products, categories } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { StarRating } from "@/components/star-rating";
import {
  ArrowRightIcon,
  LeafIcon,
  RefreshIcon,
  ShieldIcon,
  TruckIcon,
} from "@/components/icons";
import { formatPrice } from "@/lib/format";

const press = ["Monocle", "Kinfolk", "Wallpaper*", "Dezeen", "Cereal"];

const promises = [
  {
    icon: TruckIcon,
    title: "Shipping, on us",
    body: "Complimentary delivery on orders over $120, tracked door to door.",
  },
  {
    icon: RefreshIcon,
    title: "30-day returns",
    body: "Changed your mind? Send it back unworn, unused, no questions.",
  },
  {
    icon: ShieldIcon,
    title: "Three-year warranty",
    body: "Every piece is covered, with spare parts stocked for a decade.",
  },
  {
    icon: LeafIcon,
    title: "Repair, don't replace",
    body: "We publish service manuals and sell components at cost.",
  },
];

const testimonials = [
  {
    quote:
      "The rare shop where the product is better than the photograph. My Halo headphones have replaced a pair that cost twice as much.",
    name: "Ines V.",
    detail: "Verified buyer · Audio",
  },
  {
    quote:
      "Ordered the Form keyboard on a Tuesday, typing on it by Friday. The packaging alone was worth photographing.",
    name: "Marcus L.",
    detail: "Verified buyer · Workspace",
  },
  {
    quote:
      "I asked about a replacement strap and got a reply in twenty minutes — with a video. That is the whole difference.",
    name: "Sana K.",
    detail: "Verified buyer · Accessories",
  },
];

export default function HomePage() {
  const featured = products.filter((product) => product.featured);
  const newest = [...products]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 3);
  const hero = products[0];

  return (
    <>
      <section className="container-page grid items-center gap-10 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-24 lg:pt-16">
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-3">
            <span className="h-px w-10 bg-ink/30" />
            Small-batch design · Kyoto & Lisbon
          </p>
          <h1 className="mt-6 text-[clamp(2.6rem,6vw,4.6rem)] font-normal leading-[0.95] tracking-[-0.02em]">
            Objects for
            <br />
            <span className="italic text-clay">everyday</span> rituals.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/65">
            Audio, wearables and workspace pieces made in batches of fifty,
            finished by hand and built to be repaired. Nothing disposable —
            nothing shouting for attention.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/products" className="btn-primary group">
              Shop the collection
              <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className="btn-outline">
              Our story
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <StarRating rating={4.8} />
              <p className="mt-1 text-xs text-ink/50">
                4.8 average from 1,200+ reviews
              </p>
            </div>
            <div className="h-8 w-px bg-ink/10" />
            <div>
              <p className="text-sm font-medium">Free shipping over $120</p>
              <p className="mt-1 text-xs text-ink/50">Dispatched in 24 hours</p>
            </div>
          </div>
        </div>

        <div className="relative animate-fade">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] bg-sand/60">
            <Image
              src={hero.images[0]}
              alt={hero.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />
          </div>

          <Link
            href={`/products/${hero.slug}`}
            className="absolute -bottom-6 left-4 w-[78%] max-w-xs rounded-xl border border-ink/10 bg-paper/95 p-4 shadow-soft backdrop-blur transition hover:-translate-y-1 sm:left-6"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-ink/45">
                  {hero.badge}
                </p>
                <p className="mt-1 text-sm font-medium">{hero.name}</p>
                <p className="mt-0.5 text-xs text-ink/55">
                  {formatPrice(hero.price)}{" "}
                  <span className="text-ink/30 line-through">
                    {formatPrice(hero.compareAt ?? 0)}
                  </span>
                </p>
              </div>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-paper">
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </div>
          </Link>

          <div className="absolute -right-3 top-6 hidden rotate-6 rounded-full bg-paper px-4 py-2 text-[10px] uppercase tracking-[0.18em] shadow-soft sm:block">
            Batch 04 · 50 units
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-sand/30">
        <div className="container-page flex flex-col items-center gap-5 py-6 sm:flex-row sm:justify-between">
          <p className="eyebrow shrink-0">As seen in</p>
          <div className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-3 sm:justify-end">
            {press.map((name) => (
              <span
                key={name}
                className="font-display text-lg text-ink/45 transition hover:text-ink"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Browse by room</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Find your ritual</h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 text-sm text-ink/60 hover:text-ink"
          >
            All products
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 4).map((category, index) => (
            <Link
              key={category.id}
              href={`/products?category=${category.id}`}
              className={`group relative overflow-hidden rounded-xl bg-sand/60 ${
                index === 0 ? "lg:row-span-2 lg:aspect-auto" : ""
              }`}
            >
              <div
                className={`relative w-full ${
                  index === 0 ? "aspect-[4/5] lg:h-full" : "aspect-[4/3]"
                }`}
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-paper">
                  <p className="font-display text-xl">{category.name}</p>
                  <p className="mt-1 text-[11px] text-paper/70">{category.blurb}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The short list</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">Most loved this month</h2>
          </div>
          <Link href="/products?sort=rating" className="btn-outline">
            See bestsellers
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
          {featured.slice(0, 4).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 2}
            />
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="container-page grid gap-0 lg:grid-cols-2">
          <div className="relative min-h-[320px] lg:min-h-[520px]">
            <Image
              src={products[6].images[0]}
              alt="A repairable workspace"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-2 py-14 sm:px-10 lg:py-20 lg:pl-16">
            <p className="text-[11px] uppercase tracking-[0.22em] text-paper/45">
              The long view
            </p>
            <h2 className="mt-4 text-3xl leading-tight sm:text-[2.6rem]">
              Made to be repaired,
              <br />
              not replaced.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-paper/65">
              Every Aurora piece ships with a parts diagram and a screwdriver
              that fits. Batteries, pads, straps and switches are stocked at
              cost for ten years — because the most sustainable object is the
              one you already own.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-paper/75">
              {[
                "Service manuals published for every product",
                "Spare parts sold at cost, shipped worldwide",
                "Three-year warranty as standard",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-clay" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-9 inline-flex w-fit items-center gap-2 border-b border-paper/30 pb-1 text-sm transition hover:border-paper"
            >
              Read the full story
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Just landed</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">New this season</h2>
          </div>
          <Link href="/products?sort=new" className="text-sm text-ink/60 hover:text-ink">
            View all new →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {newest.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group grid grid-cols-[92px_1fr] items-center gap-4 rounded-xl border border-ink/10 bg-white p-3 transition hover:border-ink/25"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-sand/50">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="92px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-ink/40">
                  {product.badge ?? "New arrival"}
                </p>
                <p className="mt-1 text-sm font-medium">{product.name}</p>
                <p className="mt-1 text-xs text-ink/50">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/60">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise) => (
            <div key={promise.title} className="flex gap-3">
              <promise.icon className="mt-0.5 h-5 w-5 shrink-0 text-clay" />
              <div>
                <p className="text-sm font-medium">{promise.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">
                  {promise.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2fr]">
          <div>
            <p className="eyebrow">In their words</p>
            <h2 className="mt-3 text-3xl sm:text-4xl">
              1,200 reviews,
              <br />
              4.8 average.
            </h2>
            <Link href="/products" className="btn-outline mt-6">
              Shop what they love
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="flex flex-col rounded-xl border border-ink/10 bg-white p-5"
              >
                <StarRating rating={5} />
                <blockquote className="mt-3 flex-1 text-[13px] leading-relaxed text-ink/70">
                  “{testimonial.quote}”
                </blockquote>
                <figcaption className="mt-4 border-t border-ink/10 pt-3">
                  <p className="text-xs font-medium">{testimonial.name}</p>
                  <p className="text-[11px] text-ink/40">{testimonial.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page">
        <div className="relative overflow-hidden rounded-2xl bg-clay px-6 py-14 text-paper sm:px-14">
          <div className="max-w-xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-paper/60">
              The Aurora letter
            </p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">
              New pieces first, plus studio notes.
            </h2>
            <p className="mt-3 text-sm text-paper/75">
              One short email a month. Early access to batches of fifty, which
              tend to sell out in a week.
            </p>
          </div>
          <div className="mt-8 max-w-md [&_input]:text-paper [&_input::placeholder]:text-paper/50 [&>form>div]:border-paper/40 [&>form>div]:focus-within:border-paper">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </>
  );
}
