import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactActions } from "@/components/ContactActions";
import { VehicleInquiryForm } from "@/components/VehicleInquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { StatusBadge } from "@/components/StatusBadge";
import { VehicleGallery } from "@/components/VehicleGallery";
import { dealership } from "@/data/dealership";
import { formatMileage, formatPrice, statusLabel, vehicleTitle } from "@/lib/format";
import { breadcrumbSchema, vehicleSchema } from "@/lib/schema";
import { getVehicleBySlug, getVehicleSlugs } from "@/lib/vehicles";

type VehicleRouteProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getVehicleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: VehicleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    return {
      title: "Vehicle not found",
    };
  }

  const title = vehicleTitle(vehicle);
  const description = `${title} for ${formatPrice(vehicle.price)} with ${formatMileage(vehicle.mileage)}. Listed by ${dealership.name}.`;
  const image = vehicle.images[0];

  return {
    title,
    description,
    alternates: {
      canonical: `/inventory/${vehicle.slug}`,
    },
    openGraph: {
      title: `${title} | ${dealership.name}`,
      description,
      url: `/inventory/${vehicle.slug}`,
      images: image ? [{ url: image, alt: title }] : undefined,
    },
  };
}

export default async function VehiclePage({
  params,
}: VehicleRouteProps) {
  const { slug } = await params;
  const vehicle = getVehicleBySlug(slug);

  if (!vehicle) {
    notFound();
  }

  const title = vehicleTitle(vehicle);
  const specs = [
    ["Year", String(vehicle.year)],
    ["Make", vehicle.make],
    ["Model", vehicle.model],
    ["Trim", vehicle.trim],
    ["Price", formatPrice(vehicle.price)],
    ["Mileage", formatMileage(vehicle.mileage)],
    ["VIN", vehicle.vin],
    ["Engine", vehicle.engine],
    ["Transmission", vehicle.transmission],
    ["Drivetrain", vehicle.drivetrain],
    ["Exterior color", vehicle.exteriorColor],
    ["Interior color", vehicle.interiorColor],
    ["Availability", statusLabel(vehicle.status)],
  ];

  return (
    <article>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Inventory", path: "/inventory" },
          { name: title, path: `/inventory/${vehicle.slug}` },
        ])}
      />
      <JsonLd data={vehicleSchema(vehicle)} />

      <div className="border-b border-line bg-stone">
        <div className="mx-auto max-w-6xl px-5 py-6 text-sm text-muted sm:px-8">
          <Link href="/inventory" className="hover:text-ink">
            Inventory
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-ink">{title}</span>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <VehicleGallery vehicle={vehicle} />

        <div>
          <StatusBadge status={vehicle.status} />
          <h1 className="mt-4 font-serif text-4xl leading-tight">{title}</h1>
          <p className="mt-2 text-muted">{vehicle.trim}</p>
          <p className="mt-5 text-3xl font-medium">{formatPrice(vehicle.price)}</p>
          <p className="mt-1 text-muted">{formatMileage(vehicle.mileage)}</p>
          <p className="mt-6 text-sm leading-7 text-muted">{vehicle.description}</p>
          <div className="mt-6">
            <ContactActions />
          </div>
          <Link
            href="/contact"
            className="mt-4 inline-flex border border-ink px-4 py-2.5 text-sm"
          >
            Contact about this vehicle
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section>
          <h2 className="font-serif text-3xl">Specifications</h2>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {specs.map(([label, value]) => (
              <div key={label} className="grid grid-cols-2 gap-4 py-3 text-sm">
                <dt className="text-muted">{label}</dt>
                <dd className="text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <VehicleInquiryForm vehicle={vehicle} />
      </div>
    </article>
  );
}
