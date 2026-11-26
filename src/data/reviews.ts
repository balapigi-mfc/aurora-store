import type { Review } from "@/lib/types";

const pool: Omit<Review, "id" | "productSlug" | "date">[] = [
  {
    author: "Mariam H.",
    location: "Lisbon",
    rating: 5,
    title: "Worth the wait",
    body: "Third month in and it still feels like a small event every time I use it. The finish is matte without feeling plasticky, and the details you only notice later are the ones I love most.",
  },
  {
    author: "Daniel O.",
    location: "Copenhagen",
    rating: 4,
    title: "Beautiful, with one caveat",
    body: "Packaging was lovely and it arrived a day early. Docked a star because the manual is thin — a printed quick-start card would have helped. Support answered within an hour when I asked.",
  },
  {
    author: "Yuki T.",
    location: "Osaka",
    rating: 5,
    title: "Quietly excellent",
    body: "I bought one for myself and ended up ordering a second as a gift. Nothing about it shouts, which is exactly the point. Two months of daily use and no wear at all.",
  },
  {
    author: "Priya N.",
    location: "Toronto",
    rating: 5,
    title: "Replaced a much pricier one",
    body: "I had a well-known alternative for two years and this one is simply better made. Returned the other. Shipping took four days to Canada.",
  },
  {
    author: "Tom A.",
    location: "Melbourne",
    rating: 4,
    title: "Great day to day",
    body: "Holds up well on a commute and looks better in person than on screen. I would like one more colour option, but that is a shopping problem, not a product problem.",
  },
  {
    author: "Lena K.",
    location: "Berlin",
    rating: 5,
    title: "The kind of thing you keep",
    body: "You can tell it was designed by people who use it themselves. Ordered on Monday, arrived Thursday, and the note in the box was a nice touch.",
  },
  {
    author: "Ahmed R.",
    location: "Dubai",
    rating: 4,
    title: "Solid build",
    body: "Feels denser than the photos suggest — in a good way. Took a week to reach me and the tracking was accurate the whole way.",
  },
  {
    author: "Claire B.",
    location: "Lyon",
    rating: 5,
    title: "Bought twice",
    body: "The first one was for the studio and the second for home. Consistent quality across both, which is rare for small-batch makers.",
  },
];

function hash(value: string): number {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) % 997;
  }
  return h;
}

export function getReviews(slug: string): Review[] {
  const seed = hash(slug);
  return Array.from({ length: 3 }, (_, index) => {
    const entry = pool[(seed + index * 3) % pool.length];
    const day = ((seed + index * 7) % 27) + 1;
    const month = ((seed + index) % 9) + 1;
    return {
      ...entry,
      id: `${slug}-r${index}`,
      productSlug: slug,
      date: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
    };
  });
}
