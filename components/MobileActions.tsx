import Link from "next/link";

import { CarIcon, MailIcon, MapIcon, PhoneIcon } from "@/components/Icons";
import { hasMapsUrl, hasPhone, phoneHref, dealership } from "@/data/dealership";

export function MobileActions() {
  const callHref = phoneHref();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 py-2 backdrop-blur-sm md:hidden">
      <nav aria-label="Quick actions" className="grid grid-cols-4 gap-1">
        <Link href="/inventory" className="flex flex-col items-center gap-1 py-1 text-[11px] text-ink">
          <CarIcon className="h-5 w-5" />
          Inventory
        </Link>
        <Link href="/contact" className="flex flex-col items-center gap-1 py-1 text-[11px] text-ink">
          <MailIcon className="h-5 w-5" />
          Contact
        </Link>
        {hasPhone() && callHref ? (
          <a href={callHref} className="flex flex-col items-center gap-1 py-1 text-[11px] text-ink">
            <PhoneIcon className="h-5 w-5" />
            Call
          </a>
        ) : (
          <span className="flex flex-col items-center gap-1 py-1 text-[11px] text-muted">
            <PhoneIcon className="h-5 w-5" />
            Call
          </span>
        )}
        {hasMapsUrl() ? (
          <a
            href={dealership.mapsUrl}
            className="flex flex-col items-center gap-1 py-1 text-[11px] text-ink"
            target="_blank"
            rel="noreferrer"
          >
            <MapIcon className="h-5 w-5" />
            Directions
          </a>
        ) : (
          <span className="flex flex-col items-center gap-1 py-1 text-[11px] text-muted">
            <MapIcon className="h-5 w-5" />
            Directions
          </span>
        )}
      </nav>
    </div>
  );
}
