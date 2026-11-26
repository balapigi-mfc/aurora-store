"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Those passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to register.");
      router.push("/account");
      router.refresh();
    } catch (registerError) {
      setError(
        registerError instanceof Error
          ? registerError.message
          : "Unable to register.",
      );
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-104px)] lg:grid-cols-2">
      <div className="flex items-center justify-center order-2 px-5 py-16 sm:px-10 lg:order-1">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Join the studio</p>
          <h1 className="mt-3 text-4xl">Create an account</h1>
          <p className="mt-2 text-sm text-ink/55">
            Early access to batches of fifty, plus faster checkout.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="field-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                className="field"
                placeholder="Farhan Miraj"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="field"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                className="field"
                placeholder="At least 8 characters"
              />
            </div>
            <div>
              <label className="field-label" htmlFor="confirm">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                required
                value={form.confirm}
                onChange={(event) =>
                  setForm({ ...form, confirm: event.target.value })
                }
                className="field"
                placeholder="Repeat it"
              />
            </div>

            {error ? <p className="text-xs text-clay">{error}</p> : null}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-5 text-sm text-ink/55">
            Already have one?{" "}
            <Link href="/login" className="text-ink underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative order-1 hidden lg:order-2 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1400&q=80"
          alt="The Field Day backpack"
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-sm text-paper">
          <p className="text-[11px] uppercase tracking-[0.22em] text-paper/60">
            Batch 04
          </p>
          <p className="mt-3 font-display text-3xl leading-tight">
            Made once, made well.
          </p>
          <p className="mt-3 text-xs text-paper/60">
            Fifty pieces per run. When they're gone, we make it better.
          </p>
        </div>
      </div>
    </div>
  );
}
