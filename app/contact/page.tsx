import type { Metadata } from "next";

import { ContactActions } from "@/components/ContactActions";
import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { dealership, formattedAddress } from "@/data/dealership";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${dealership.name} about a listed vehicle or a general dealership question.`,
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        description="Ask about a vehicle, request more information, or send a general question to the dealership."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-3xl">Dealership details</h2>
          <dl className="mt-6 space-y-5 text-sm">
            <div>
              <dt className="text-muted">Address</dt>
              <dd className="mt-1 text-base">{formattedAddress()}</dd>
            </div>
            <div>
              <dt className="text-muted">Phone</dt>
              <dd className="mt-1 text-base">{dealership.phone.display}</dd>
            </div>
            <div>
              <dt className="text-muted">Email</dt>
              <dd className="mt-1 text-base">{dealership.email.display}</dd>
            </div>
            <div>
              <dt className="text-muted">Hours</dt>
              <dd className="mt-1 space-y-1">
                {dealership.hours.map((row) => (
                  <p key={row.days}>
                    {row.days}: {row.hours}
                  </p>
                ))}
              </dd>
            </div>
          </dl>
          <ContactActions />
        </div>
        <ContactForm heading="Contact form" />
      </div>
    </>
  );
}
