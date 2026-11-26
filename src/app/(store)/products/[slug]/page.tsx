import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory } from "@/data/products";
import { getProduct, getProducts } from "@/lib/catalog";
import { getReviews } from "@/data/reviews";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCart } from "@/components/add-to-cart";
import { StarRating } from "@/components/star-rating";
import { ProductCard } from "@/components/product-card";
import { formatDate, formatPrice } from "@/lib/format";
import {
  ArrowLeftIcon,
  LeafIcon,
  RefreshIcon,
  ShieldIcon,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.tagline,
    openGraph: {
      title: product.name,
      description: product.tagline,
      images: [{ url: product.images[0] }],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const all = await getProducts();
  const category = getCategory(product.category);
  const reviews = getReviews(product.slug);
  const related = all
    .filter((item) => item.slug !== product.slug)
    .sort((a, b) => {
      const sameA = a.category === product.category ? 1 : 0;
      const sameB = b.category === product.category ? 1 : 0;
      return sameB - sameA;
    })
    .slice(0, 3);

  const details = [
    {
      icon: ShieldIcon,
      title: "Warranty",
      body: "Three years, covering manufacturing defects. Spare parts are stocked for ten years and sold at cost.",
    },
    {
      icon: RefreshIcon,
      title: "Shipping & returns",
      body: "Dispatched within 24 hours on weekdays. Free over $120. Return within 30 days in original condition for a full refund.",
    },
    {
      icon: LeafIcon,
      title: "Materials",
      body: "Chosen for repairability and recycled content. Packaged in uncoated board with no plastic film or foam.",
    },
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <div className="flex items-center justify-between gap-4">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink/40">
          <Link href="/" className="hover:text-ink">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-ink"
          >
            {category?.name}
          </Link>
          <span>/</span>
          <span className="text-ink/70">{product.name}</span>
        </nav>
        <Link
          href="/products"
          className="hidden items-center gap-2 text-xs text-ink/50 hover:text-ink sm:flex"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to shop
        </Link>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <ProductGallery
            images={product.images}
            name={product.name}
            badge={product.badge}
          />
        </div>

        <div>
          <p className="eyebrow">{category?.name}</p>
          <h1 className="mt-3 text-3xl leading-tight sm:text-[2.75rem]">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-ink/55">{product.tagline}</p>

          <div className="mt-4 flex items-center gap-4">
            <StarRating rating={product.rating} showValue count={product.reviewCount} size="md" />
            <a href="#reviews" className="text-xs text-ink/45 underline underline-offset-4">
              Read reviews
            </a>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <p className="text-2xl">{formatPrice(product.price)}</p>
            {product.compareAt ? (
              <>
                <p className="text-sm text-ink/35 line-through">
                  {formatPrice(product.compareAt)}
                </p>
                <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[11px] font-medium text-clay">
                  Save {formatPrice(product.compareAt - product.price)}
                </span>
              </>
            ) : null}
          </div>

          <p className="mt-6 max-w-prose text-[14px] leading-relaxed text-ink/70">
            {product.description}
          </p>

          <AddToCart product={product} />

          <dl className="mt-10 grid grid-cols-1 gap-x-8 border-t border-ink/10 pt-6 sm:grid-cols-2">
            {product.specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-start justify-between gap-4 border-b border-ink/5 py-2.5 text-sm"
              >
                <dt className="text-ink/45">{spec.label}</dt>
                <dd className="text-right text-ink/80">{spec.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {details.map((detail) => (
              <div key={detail.title} className="rounded-lg bg-sand/40 p-4">
                <detail.icon className="h-5 w-5 text-clay" />
                <p className="mt-2 text-xs font-medium uppercase tracking-[0.1em]">
                  {detail.title}
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-ink/55">
                  {detail.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="reviews" className="mt-20 border-t border-ink/10 pt-10">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <div>
            <p className="eyebrow">Reviews</p>
            <p className="mt-3 font-display text-6xl leading-none">
              {product.rating.toFixed(1)}
            </p>
            <StarRating rating={product.rating} size="md" className="mt-3" />
            <p className="mt-2 text-xs text-ink/45">
              Based on {product.reviewCount} verified purchases
            </p>
            <div className="mt-5 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const width =
                  star === 5 ? 74 : star === 4 ? 19 : star === 3 ? 5 : 1;
                return (
                  <div key={star} className="flex items-center gap-2 text-[11px] text-ink/45">
                    <span className="w-3">{star}</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
                      <div
                        className="h-full rounded-full bg-clay"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <span className="w-8 text-right">{width}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border border-ink/10 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <StarRating rating={review.rating} />
                    <h3 className="mt-2 text-sm font-medium">{review.title}</h3>
                  </div>
                  <p className="text-[11px] text-ink/35">
                    {formatDate(review.date)}
                  </p>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/65">
                  {review.body}
                </p>
                <p className="mt-3 text-[11px] text-ink/40">
                  {review.author} · {review.location}
                  <span className="ml-2 rounded-full bg-moss/10 px-2 py-0.5 text-moss">
                    Verified
                  </span>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-20 border-t border-ink/10 pt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Pairs well with</p>
            <h2 className="mt-2 text-2xl sm:text-3xl">You may also like</h2>
          </div>
          <Link href="/products" className="text-xs text-ink/50 hover:text-ink">
            View all →
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-3">
          {related.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </section>

      <div className="mt-16 hidden md:block">
        <div className="relative aspect-[21/9] overflow-hidden rounded-2xl bg-sand">
          <Image
            src={product.images[0]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 flex items-center bg-gradient-to-r from-ink/70 to-transparent p-10">
            <div className="max-w-sm text-paper">
              <p className="text-[11px] uppercase tracking-[0.2em] text-paper/60">
                Batch {product.id.slice(-2).toUpperCase()} · Limited
              </p>
              <p className="mt-3 font-display text-3xl">Made once, made well.</p>
              <p className="mt-2 text-sm text-paper/70">
                Each run is limited to fifty pieces. When it's gone, we make it
                better — never mass-produce it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
