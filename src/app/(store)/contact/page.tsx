import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Questions about an order, a repair or a spare part — a human answers within a working day.",
};

const faqs = [
  {
    q: "How long does delivery take?",
    a: "Orders leave the studio within 24 hours on weekdays. Standard delivery is 2–4 days in Japan and Europe, 4–7 days elsewhere. Free over $120.",
  },
  {
    q: "Can I return something?",
    a: "Yes — 30 days from delivery, in original condition. Email us with your order number and we'll send a prepaid label.",
  },
  {
    q: "Do you sell spare parts?",
    a: "We do, at cost. Every product page links to its parts diagram. Tell us the piece and the part and we'll quote shipping.",
  },
  {
    q: "Is my payment secure?",
    a: "Payments run through an encrypted processor; we never store card details. This site is a portfolio demo — no real charges are made.",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <div className="max-w-xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Talk to a human.</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink/60">
          No ticket numbers, no chatbot. Two people run this studio and one of
          them will answer you — usually within a working day.
        </p>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
        <div>
          <ContactForm />
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <p className="eyebrow">Direct</p>
            <p className="mt-3 text-sm">
              <a
                href="mailto:hello@aurora.store"
                className="underline underline-offset-4"
              >
                hello@aurora.store
              </a>
            </p>
            <p className="mt-1 text-sm text-ink/55">Mon–Fri, 09:00–18:00 JST</p>
            <div className="mt-4 flex items-center gap-2 text-xs text-ink/45">
              <InstagramIcon className="h-4 w-4" />
              @aurora.supply
            </div>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-6">
            <p className="eyebrow">Studios</p>
            <div className="mt-3 space-y-4 text-sm">
              <div>
                <p className="font-medium">Kyoto</p>
                <p className="mt-1 text-ink/55">
                  3-14 Mibu, Nakagyo-ku
                  <br />
                  Kyoto 604-8821, Japan
                </p>
              </div>
              <div>
                <p className="font-medium">Lisbon</p>
                <p className="mt-1 text-ink/55">
                  Rua da Boavista 112
                  <br />
                  1200-068 Lisboa, Portugal
                </p>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-ink/40">
              Visits by appointment — we're usually at the bench.
            </p>
          </div>
        </aside>
      </div>

      <section className="mt-16 border-t border-ink/10 pt-10">
        <p className="eyebrow">Quick answers</p>
        <h2 className="mt-2 text-2xl">Before you write</h2>
        <div className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium">
                {faq.q}
                <span className="text-ink/30 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-ink/60">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
