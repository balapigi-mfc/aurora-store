import type { Metadata } from "next";
import { readDb } from "@/lib/db";
import { formatShortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminMessagesPage() {
  const db = await readDb();
  const messages = db.messages;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium tracking-tight">Messages</h1>
        <p className="mt-1 text-sm text-ink/50">
          Enquiries from the contact form.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 bg-white py-20 text-center">
          <p className="text-sm text-ink/45">
            No messages yet — the contact form lands here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {messages.map((message) => (
            <li
              key={message.id}
              className="rounded-xl border border-ink/10 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{message.subject}</p>
                  <p className="mt-0.5 text-[11px] text-ink/45">
                    {message.name} · {message.email}
                  </p>
                </div>
                <p className="shrink-0 text-[10px] text-ink/35">
                  {formatShortDate(message.createdAt)}
                </p>
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ink/65">
                {message.body}
              </p>
              <a
                href={`mailto:${message.email}`}
                className="mt-4 inline-block text-[11px] underline underline-offset-4 hover:text-clay"
              >
                Reply by email →
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
