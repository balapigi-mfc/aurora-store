"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import { BagIcon, HeartIcon, TrashIcon } from "@/components/icons";

export default function WishlistPage() {
  const { wishlist, hydrated, toggleWishlist, addItem } = useStore();

  return (
    <div className="container-page py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/10 pb-6">
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="mt-2 text-4xl">Saved items</h1>
        </div>
        <p className="text-sm text-ink/45">
          {hydrated ? wishlist.length : 0} saved
        </p>
      </div>

      {!hydrated ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 animate-pulse rounded-xl bg-ink/5" />
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <HeartIcon className="h-8 w-8 text-ink/20" />
          <h2 className="mt-4 font-display text-2xl">Nothing saved yet</h2>
          <p className="mt-2 max-w-sm text-sm text-ink/55">
            Tap the heart on any piece to keep it here while you decide.
          </p>
          <Link href="/products" className="btn-primary mt-6">
            Browse the collection
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <article
              key={item.slug}
              className="group overflow-hidden rounded-xl border border-ink/10 bg-white"
            >
              <Link
                href={`/products/${item.slug}`}
                className="relative block aspect-[4/3] overflow-hidden bg-sand/50"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-sm font-medium hover:text-clay"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-ink/45">{item.color}</p>
                  </div>
                  <p className="text-sm">{formatPrice(item.price)}</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => addItem({ ...item, qty: 1 })}
                    className="btn-primary flex-1 py-2.5 text-xs"
                  >
                    <BagIcon className="h-4 w-4" />
                    Add to bag
                  </button>
                  <button
                    type="button"
                    aria-label="Remove from saved"
                    onClick={() => toggleWishlist(item)}
                    className="flex w-10 items-center justify-center rounded-full border border-ink/15 text-ink/40 transition hover:border-clay hover:text-clay"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
