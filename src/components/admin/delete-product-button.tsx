"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteProductButton({
  slug,
  name,
}: {
  slug: string;
  name: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function remove() {
    if (!window.confirm(`Remove "${name}" from the storefront?`)) return;
    setLoading(true);
    try {
      await fetch(`/api/admin/products/${slug}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={remove}
      disabled={loading}
      className="text-[11px] text-ink/35 transition hover:text-clay disabled:opacity-40"
    >
      {loading ? "Removing…" : "Delete"}
    </button>
  );
}
