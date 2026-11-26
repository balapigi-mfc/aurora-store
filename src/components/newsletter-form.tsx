"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const [message, setMessage] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Something went wrong");
      setState("done");
      setMessage("You're on the list.");
      setEmail("");
    } catch (error) {
      setState("error");
      setMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  }

  if (state === "done") {
    return (
      <p className="mt-4 flex items-center gap-2 text-sm text-moss">
        <CheckIcon className="h-4 w-4" />
        {message}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex items-center gap-2 border-b border-ink/25 pb-2 focus-within:border-ink">
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@email.com"
          className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          aria-label="Subscribe"
          className="rounded-full p-1.5 text-ink/60 transition hover:text-ink disabled:opacity-40"
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
      {state === "error" ? (
        <p className="mt-2 text-xs text-clay">{message}</p>
      ) : null}
    </form>
  );
}
