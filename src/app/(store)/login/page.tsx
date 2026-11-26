"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to sign in.");
      router.push(data.user.role === "admin" ? "/admin" : "/account");
      router.refresh();
    } catch (loginError) {
      setError(
        loginError instanceof Error ? loginError.message : "Unable to sign in.",
      );
      setLoading(false);
    }
  }

  function fillDemo(kind: "customer" | "admin") {
    setEmail(kind === "admin" ? "admin@aurora.store" : "hello@aurora.store");
    setPassword("aurora123");
    setError("");
  }

  return (
    <div className="grid min-h-[calc(100vh-104px)] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1400&q=80"
          alt="Aurora headphones"
          fill
          sizes="50vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" />
        <div className="absolute bottom-12 left-12 max-w-sm text-paper">
          <p className="text-[11px] uppercase tracking-[0.22em] text-paper/60">
            Since 2019
          </p>
          <p className="mt-3 font-display text-3xl leading-tight">
            "The things you use every day should be the things you love most."
          </p>
          <p className="mt-3 text-xs text-paper/60">Aurora studio notes, No. 12</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16 sm:px-10">
        <div className="w-full max-w-sm">
          <p className="eyebrow">Welcome back</p>
          <h1 className="mt-3 text-4xl">Sign in</h1>
          <p className="mt-2 text-sm text-ink/55">
            Your bag, saved pieces and order history are waiting.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <div>
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="field"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="field-label" htmlFor="password">
                  Password
                </label>
                <span className="mb-2 text-[11px] text-ink/35">
                  Forgot it? Contact us.
                </span>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="field"
                placeholder="••••••••"
              />
            </div>

            {error ? <p className="text-xs text-clay">{error}</p> : null}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-5 text-sm text-ink/55">
            New here?{" "}
            <Link href="/register" className="text-ink underline underline-offset-4">
              Create an account
            </Link>
          </p>

          <div className="mt-8 rounded-lg border border-ink/10 bg-sand/30 p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-ink/45">
              Demo accounts
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => fillDemo("customer")}
                className="flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-xs transition hover:border-ink/40"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin")}
                className="flex-1 rounded-md border border-ink/15 bg-white px-3 py-2 text-xs transition hover:border-ink/40"
              >
                Admin
              </button>
            </div>
            <p className="mt-2 text-[11px] text-ink/40">
              Password for both: aurora123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
