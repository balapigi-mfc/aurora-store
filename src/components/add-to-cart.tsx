"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useStore } from "@/components/store-provider";
import { formatPrice } from "@/lib/format";
import {
  CheckIcon,
  HeartIcon,
  MinusIcon,
  PlusIcon,
  TruckIcon,
} from "@/components/icons";
import { classNames } from "@/lib/format";

export function AddToCart({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const saved = hydrated && isWishlisted(product.slug);
  const soldOut = product.stock === 0;

  const item = {
    slug: product.slug,
    name: product.name,
    price: product.price,
    image: product.images[0],
    color,
    qty,
  };

  return (
    <div className="mt-8">
      <div>
        <div className="flex items-center justify-between">
          <p className="eyebrow">Colour</p>
          <p className="text-xs text-ink/55">{color}</p>
        </div>
        <div className="mt-3 flex gap-2">
          {product.colors.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              className={classNames(
                "rounded-full border px-4 py-2 text-xs transition",
                color === option
                  ? "border-ink bg-ink text-paper"
                  : "border-ink/15 text-ink/65 hover:border-ink/40",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-stretch gap-3">
        <div className="flex items-center rounded-full border border-ink/20">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQty((value) => Math.max(1, value - 1))}
            className="p-3 text-ink/60 transition hover:text-ink"
          >
            <MinusIcon className="h-3.5 w-3.5" />
          </button>
          <span className="w-8 text-center text-sm">{qty}</span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQty((value) => Math.min(10, value + 1))}
            className="p-3 text-ink/60 transition hover:text-ink"
          >
            <PlusIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          disabled={soldOut}
          onClick={() => addItem(item)}
          className="btn-primary flex-1"
        >
          {soldOut ? "Sold out" : `Add to bag — ${formatPrice(product.price * qty)}`}
        </button>

        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save for later"}
          onClick={() => toggleWishlist({ ...item, qty: 1 })}
          className={classNames(
            "flex w-12 items-center justify-center rounded-full border transition",
            saved
              ? "border-clay text-clay"
              : "border-ink/20 text-ink/50 hover:border-ink/50 hover:text-ink",
          )}
        >
          <HeartIcon className={classNames("h-5 w-5", saved && "fill-clay")} />
        </button>
      </div>

      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          addItem(item);
          router.push("/checkout");
        }}
        className="btn-outline mt-3 w-full"
      >
        Buy it now
      </button>

      <div className="mt-6 space-y-2 rounded-xl bg-sand/40 p-4 text-xs text-ink/60">
        <p className="flex items-center gap-2">
          <TruckIcon className="h-4 w-4 text-clay" />
          Free delivery on orders over $120 · arrives in 2–4 days
        </p>
        <p className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 text-clay" />
          {product.stock > 0
            ? `In stock — ${product.stock} left in this batch`
            : "Restocking soon — join the waitlist"}
        </p>
      </div>
    </div>
  );
}
