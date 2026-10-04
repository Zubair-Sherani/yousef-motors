import type { Metadata } from "next";

import { ContactActions } from "@/components/ContactActions";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { dealership, formattedAddress } from "@/data/dealership";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About",
  description: `Learn about ${dealership.name}, a used car dealership serving Nevada.`,
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <PageHeader
        eyebrow="About"
        title={dealership.name}
        description={dealership.description}
      />
      <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
        <div className="space-y-6 text-base leading-8 text-ink-soft">
          <p>
            {dealership.name} is a used car dealership serving customers in Nevada.
            This website lists vehicles that are currently in inventory, along with
            the price, mileage, VIN, and other specifications provided for each listing.
          </p>
          <p>
            Vehicle pages are generated from a single inventory file. When a vehicle is
            added, updated, marked sold, or removed, the corresponding page is created or
            updated at build time. No extra page files need to be written by hand.
          </p>
          <p>
            Business details such as the street address, phone number, email, hours, and
            dealer license number are stored in the dealership configuration file. Those
            values appear as placeholders until the real information is added.
          </p>
        </div>

        <section className="mt-12 border-t border-line pt-8">
          <h2 className="font-serif text-3xl">Dealership information</h2>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-muted">Location</dt>
              <dd className="mt-1">{formattedAddress()}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-1">{dealership.phone.display}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1">{dealership.email.display}</dd>
            </div>
            <div>
              <dt className="text-muted">{dealership.dealerLicense.label}</dt>
              <dd className="mt-1">{dealership.dealerLicense.number}</dd>
            </div>
          </dl>
          <ContactActions />
        </section>
      </div>
    </>
  );
}
