import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-display text-[11px] uppercase tracking-[0.3em] text-ink/40">
        Error 404
      </p>
      <h1 className="mt-4 font-display text-5xl">This page moved on.</h1>
      <p className="mt-3 max-w-sm text-sm text-ink/55">
        The piece you're looking for may have sold out or been renamed. The
        collection is still here.
      </p>
      <div className="mt-7 flex gap-3">
        <Link href="/products" className="btn-primary">
          Shop the collection
        </Link>
        <Link href="/" className="btn-outline">
          Back home
        </Link>
      </div>
    </div>
  );
}
