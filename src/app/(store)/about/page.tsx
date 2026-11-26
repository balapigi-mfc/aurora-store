import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, LeafIcon, RefreshIcon, ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About the studio",
  description:
    "Aurora is a two-city design studio making small-batch objects built to be repaired, not replaced.",
};

const values = [
  {
    icon: LeafIcon,
    title: "Small batches",
    body: "Fifty pieces per run, made by people we know by name. No annual collections, no clearance sales.",
  },
  {
    icon: RefreshIcon,
    title: "Repair first",
    body: "Every product ships with a parts diagram. Batteries, pads, straps and switches stay in stock for ten years.",
  },
  {
    icon: ShieldIcon,
    title: "Honest materials",
    body: "Vegetable-tanned leather, recycled knit, solid brass. Nothing plated, nothing pretending to be something else.",
  },
];

const timeline = [
  { year: "2019", text: "Two friends, one lathe, a rented workshop in Kyoto." },
  { year: "2021", text: "First batch of Halo headphones — 50 pieces, sold in nine days." },
  { year: "2023", text: "Lisbon studio opens; repair programme goes worldwide." },
  { year: "2026", text: "Ten products, 1,200 reviews, zero plastic in packaging." },
];

export default function AboutPage() {
  return (
    <div>
      <section className="container-page grid gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:py-20">
        <div>
          <p className="eyebrow">The studio</p>
          <h1 className="mt-4 text-[clamp(2.4rem,5vw,4rem)] leading-[1.02]">
            We make fewer things,
            <br />
            <span className="italic text-clay">better.</span>
          </h1>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink/65">
            Aurora began in 2019 in a rented workshop in Kyoto with a lathe, two
            people and a stubborn idea: that everyday objects should be worth
            repairing. Seven years later we still work in batches of fifty, still
            answer our own emails, and still publish a service manual for
            everything we make.
          </p>
          <div className="mt-8 grid max-w-md grid-cols-3 gap-4 border-t border-ink/10 pt-6">
            {[
              { value: "50", label: "pieces per batch" },
              { value: "10 yr", label: "parts guarantee" },
              { value: "2", label: "studios" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-3xl">{stat.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/45">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand/60">
          <Image
            src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1200&q=80"
            alt="The Aurora studio desk"
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-4 rounded-full bg-paper/90 px-3 py-1 text-[10px] uppercase tracking-[0.16em]">
            Kyoto studio, 2026
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/60">
        <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title}>
              <value.icon className="h-5 w-5 text-clay" />
              <p className="mt-3 text-sm font-medium">{value.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
                {value.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div>
          <p className="eyebrow">How we got here</p>
          <h2 className="mt-3 text-3xl sm:text-4xl">A short history</h2>
          <ol className="mt-8 space-y-6">
            {timeline.map((entry) => (
              <li key={entry.year} className="grid grid-cols-[64px_1fr] gap-4">
                <span className="font-display text-lg text-clay">{entry.year}</span>
                <span className="border-b border-ink/10 pb-4 text-sm leading-relaxed text-ink/65">
                  {entry.text}
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-6">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand/60">
            <Image
              src="https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80"
              alt="Assembling a keyboard"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <blockquote className="rounded-xl bg-ink p-6 text-paper">
            <p className="font-display text-xl leading-snug">
              “If we can't tell you how to fix it, we shouldn't be selling it.”
            </p>
            <footer className="mt-3 text-[11px] uppercase tracking-[0.16em] text-paper/50">
              — Studio rule, framed by the door
            </footer>
          </blockquote>
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-sand/50 p-8 sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="text-2xl sm:text-3xl">Come see the collection.</h2>
            <p className="mt-2 text-sm text-ink/55">
              Ten objects, made in batches of fifty.
            </p>
          </div>
          <Link href="/products" className="btn-primary group">
            Shop all
            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </div>
  );
}
