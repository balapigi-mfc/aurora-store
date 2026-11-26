"use client";

import Image from "next/image";
import { useState } from "react";
import { classNames } from "@/lib/format";

export function ProductGallery({
  images,
  name,
  badge,
}: {
  images: string[];
  name: string;
  badge?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 ? (
        <div className="flex gap-3 sm:flex-col">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              className={classNames(
                "relative h-16 w-16 overflow-hidden rounded-lg border transition sm:h-20 sm:w-20",
                active === index
                  ? "border-ink"
                  : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative flex-1 overflow-hidden rounded-xl bg-sand/50">
        <div className="relative aspect-[4/5] w-full">
          <Image
            key={images[active]}
            src={images[active]}
            alt={name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="animate-fade object-cover"
          />
        </div>
        {badge ? (
          <span className="absolute left-4 top-4 rounded-full bg-paper/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.14em]">
            {badge}
          </span>
        ) : null}
        <span className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-paper backdrop-blur">
          {active + 1} / {images.length}
        </span>
      </div>
    </div>
  );
}
