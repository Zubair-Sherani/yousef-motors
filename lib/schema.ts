import { dealership, siteOrigin } from "@/data/dealership";
import { formatPrice, vehicleTitle } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: dealership.name,
    legalName: dealership.legalName,
    url: siteOrigin(),
    description: dealership.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: dealership.address.street,
      addressLocality: dealership.address.city,
      addressRegion: dealership.address.state,
      postalCode: dealership.address.postalCode,
      addressCountry: "US",
    },
    areaServed: dealership.address.region,
    telephone: dealership.phone.tel || undefined,
    email: dealership.email.display.includes("not yet provided")
      ? undefined
      : dealership.email.display,
  };
}

export function vehicleSchema(vehicle: Vehicle) {
  const availability =
    vehicle.status === "available"
      ? "https://schema.org/InStock"
      : vehicle.status === "pending"
        ? "https://schema.org/PreOrder"
        : "https://schema.org/SoldOut";

  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: vehicleTitle(vehicle),
    brand: vehicle.make,
    model: vehicle.model,
    vehicleModelDate: String(vehicle.year),
    vehicleIdentificationNumber: vehicle.vin,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.mileage,
      unitCode: "SMI",
    },
    vehicleEngine: vehicle.engine,
    vehicleTransmission: vehicle.transmission,
    driveWheelConfiguration: vehicle.drivetrain,
    color: vehicle.exteriorColor,
    vehicleInteriorColor: vehicle.interiorColor,
    description: vehicle.description,
    image: vehicle.images.map((image) => `${siteOrigin()}${image}`),
    offers: {
      "@type": "Offer",
      url: `${siteOrigin()}/inventory/${vehicle.slug}`,
      priceCurrency: "USD",
      price: vehicle.price,
      availability,
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "AutoDealer",
        name: dealership.name,
      },
    },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteOrigin()}${item.path}`,
    })),
  };
}

export function vehicleOfferDescription(vehicle: Vehicle): string {
  return `${vehicleTitle(vehicle)} for ${formatPrice(vehicle.price)} at ${dealership.name}.`;
}
