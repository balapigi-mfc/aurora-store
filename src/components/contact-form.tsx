"use client";

import { useState } from "react";
import { CheckIcon } from "@/components/icons";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Order question",
    body: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("loading");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Something went wrong.");
      setState("done");
    } catch (submitError) {
      setState("error");
      setError(
        submitError instanceof Error ? submitError.message : "Something went wrong.",
      );
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-moss/20 bg-moss/5 p-8 text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-moss text-paper">
          <CheckIcon className="h-5 w-5" />
        </span>
        <p className="mt-4 font-display text-xl">Message received</p>
        <p className="mt-1 text-sm text-ink/55">
          We reply within one working day, usually much sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="cname">
            Name
          </label>
          <input
            id="cname"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="field"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="cemail">
            Email
          </label>
          <input
            id="cemail"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            className="field"
          />
        </div>
      </div>

      <div>
        <label className="field-label" htmlFor="subject">
          What's it about?
        </label>
        <select
          id="subject"
          value={form.subject}
          onChange={(event) => setForm({ ...form, subject: event.target.value })}
          className="field"
        >
          {[
            "Order question",
            "Returns",
            "Repair or spare part",
            "Wholesale",
            "Something else",
          ].map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="field-label" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={form.body}
          onChange={(event) => setForm({ ...form, body: event.target.value })}
          className="field resize-none"
          placeholder="Order number helps if you have one."
        />
      </div>

      {error ? <p className="text-xs text-clay">{error}</p> : null}

      <button type="submit" disabled={state === "loading"} className="btn-primary">
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
