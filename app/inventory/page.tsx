import type { Metadata } from "next";

import { InventoryBrowser } from "@/components/InventoryBrowser";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { dealership } from "@/data/dealership";
import { breadcrumbSchema } from "@/lib/schema";
import { getMakes, getVehicles, getYears } from "@/lib/vehicles";

export const metadata: Metadata = {
  title: "Inventory",
  description: `Used vehicles currently listed by ${dealership.name}. Filter by make, model, year, price, and mileage.`,
  alternates: {
    canonical: "/inventory",
  },
  openGraph: {
    title: `Inventory | ${dealership.name}`,
    description: `Used vehicles currently listed by ${dealership.name}.`,
    url: "/inventory",
  },
};

export default function InventoryPage() {
  const vehicles = getVehicles();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Inventory", path: "/inventory" },
        ])}
      />
      <PageHeader
        eyebrow="Inventory"
        title="Used vehicles"
        description="Filter the current list by make, model, year, price, or mileage. Individual vehicle pages are created automatically from the inventory file."
      />
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <InventoryBrowser vehicles={vehicles} makes={getMakes()} years={getYears()} />
      </div>
    </>
  );
}
