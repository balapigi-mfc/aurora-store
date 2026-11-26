"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignOutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={loading}
      className={className ?? "text-xs text-ink/50 underline underline-offset-4 hover:text-clay"}
    >
      {loading ? "Signing out…" : "Sign out"}
    </button>
  );
}
