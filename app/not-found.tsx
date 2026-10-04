import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
      <p className="text-xs tracking-[0.2em] text-copper uppercase">404</p>
      <h1 className="mt-3 font-serif text-4xl">Page not found</h1>
      <p className="mt-4 max-w-xl text-muted">
        That address does not match a page or vehicle currently published on this
        website. The inventory list is the best place to see every available listing.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/inventory" className="bg-ink px-4 py-2.5 text-sm text-paper">
          View Inventory
        </Link>
        <Link href="/" className="border border-ink px-4 py-2.5 text-sm">
          Back home
        </Link>
      </div>
    </div>
  );
}
