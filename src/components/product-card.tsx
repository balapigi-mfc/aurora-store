"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useStore } from "@/components/store-provider";
import { HeartIcon } from "@/components/icons";
import { StarRating } from "@/components/star-rating";
import { getCategory } from "@/data/products";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { addItem, toggleWishlist, isWishlisted, hydrated } = useStore();
  const saved = hydrated && isWishlisted(product.slug);
  const category = getCategory(product.category);

  return (
    <article className="group relative flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative block overflow-hidden rounded-xl bg-sand/50"
      >
        <div className="relative aspect-[4/5] w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        </div>

        {product.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
            {product.badge}
          </span>
        ) : null}

        {product.compareAt ? (
          <span className="absolute bottom-3 left-3 rounded-full bg-clay px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-paper">
            Save {Math.round((1 - product.price / product.compareAt) * 100)}%
          </span>
        ) : null}
      </Link>

      <button
        type="button"
        aria-label={saved ? "Remove from saved" : "Save for later"}
        onClick={() =>
          toggleWishlist({
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0],
            color: product.colors[0],
            qty: 1,
          })
        }
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-ink/60 backdrop-blur transition hover:text-clay"
      >
        <HeartIcon
          className={`h-[18px] w-[18px] ${saved ? "fill-clay text-clay" : ""}`}
        />
      </button>

      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-ink/40">
              {category?.name}
            </p>
            <h3 className="mt-1 text-[15px] font-medium leading-snug">
              <Link href={`/products/${product.slug}`} className="hover:text-clay">
                {product.name}
              </Link>
            </h3>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{formatPrice(product.price)}</p>
            {product.compareAt ? (
              <p className="text-[11px] text-ink/35 line-through">
                {formatPrice(product.compareAt)}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-2 flex items-center justify-between">
          <StarRating rating={product.rating} />
          <span className="text-[11px] text-ink/40">
            {product.colors.length} colours
          </span>
        </div>

        <div className="mt-3 grid grid-rows-[0fr] overflow-hidden transition-all duration-300 group-hover:grid-rows-[1fr]">
          <button
            type="button"
            onClick={() =>
              addItem({
                slug: product.slug,
                name: product.name,
                price: product.price,
                image: product.images[0],
                color: product.colors[0],
                qty: 1,
              })
            }
            disabled={product.stock === 0}
            className="w-full translate-y-2 rounded-full border border-ink/20 py-2.5 text-xs font-medium uppercase tracking-[0.12em] opacity-0 transition-all duration-300 hover:border-ink hover:bg-ink hover:text-paper group-hover:translate-y-0 group-hover:opacity-100 disabled:cursor-not-allowed"
          >
            {product.stock === 0 ? "Sold out" : "Quick add"}
          </button>
        </div>
      </div>
    </article>
  );
}
