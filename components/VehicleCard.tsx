import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/StatusBadge";
import { formatMileage, formatPrice, listingImagePath, vehicleTitle } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export function VehicleCard({ vehicle, priority = false }: { vehicle: Vehicle; priority?: boolean }) {
  const title = vehicleTitle(vehicle);
  const source = vehicle.images[0];
  const image = source ? listingImagePath(source) : null;

  return (
    <article className="flex h-full flex-col overflow-hidden border border-line bg-paper transition-transform duration-200 hover:-translate-y-0.5">
      <Link href={`/inventory/${vehicle.slug}`} className="relative block aspect-[3/2] bg-stone">
        {image ? (
          <Image
            src={image}
            alt={`${title} exterior`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="flex h-full items-end p-5">
            <p className="font-serif text-2xl text-ink">{title}</p>
          </div>
        )}
        <span className="absolute top-3 left-3">
          <StatusBadge status={vehicle.status} />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs tracking-[0.16em] text-muted uppercase">{vehicle.year}</p>
        <h2 className="mt-1 font-serif text-2xl leading-tight">
          <Link href={`/inventory/${vehicle.slug}`} className="hover:text-ink-soft">
            {vehicle.make} {vehicle.model}
          </Link>
        </h2>
        <p className="mt-1 text-sm text-muted">{vehicle.trim}</p>
        <p className="mt-4 text-lg font-medium">{formatPrice(vehicle.price)}</p>
        <p className="text-sm text-muted">{formatMileage(vehicle.mileage)}</p>
        <Link
          href={`/inventory/${vehicle.slug}`}
          className="mt-5 inline-flex w-fit border border-ink px-4 py-2 text-sm text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          View Details
        </Link>
      </div>
    </article>
  );
}
