import { MailIcon, MapIcon, PhoneIcon } from "@/components/Icons";
import { dealership, hasEmail, hasMapsUrl, hasPhone, phoneHref } from "@/data/dealership";

export function ContactActions({
  compact = false,
}: {
  compact?: boolean;
}) {
  const callHref = phoneHref();

  return (
    <div className={`flex flex-wrap gap-3 ${compact ? "" : "mt-6"}`}>
      {hasPhone() && callHref ? (
        <a
          href={callHref}
          className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-sm text-paper"
        >
          <PhoneIcon className="h-4 w-4" />
          Call
        </a>
      ) : null}

      {hasEmail() ? (
        <a
          href={dealership.email.href}
          className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-sm text-ink"
        >
          <MailIcon className="h-4 w-4" />
          Email
        </a>
      ) : null}

      {hasMapsUrl() ? (
        <a
          href={dealership.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 border border-ink px-4 py-2.5 text-sm text-ink"
        >
          <MapIcon className="h-4 w-4" />
          Directions
        </a>
      ) : null}

      {!hasPhone() && !hasEmail() && !hasMapsUrl() ? (
        <p className="text-sm text-muted">
          Phone, email, and map links will appear here after they are added to
          {" "}
          <code>data/dealership.ts</code>.
        </p>
      ) : null}
    </div>
  );
}
