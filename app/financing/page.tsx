import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { dealership } from "@/data/dealership";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Financing",
  description: `Ask ${dealership.name} about financing options for a listed vehicle. Specific rates and terms are not published on this website.`,
  alternates: {
    canonical: "/financing",
  },
};

export default function FinancingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Financing", path: "/financing" },
        ])}
      />
      <PageHeader
        eyebrow="Financing"
        title="Ask about financing"
        description="This page does not list interest rates, payment examples, or lender names because those terms have not been provided for publication."
      />
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2">
        <div className="space-y-5 text-base leading-8 text-ink-soft">
          <p>
            If you want to discuss financing for a vehicle in the current inventory,
            contact {dealership.name} and identify the listing you are asking about.
          </p>
          <p>
            The dealership can follow up with available information after reviewing your
            question. No credit claims, approval promises, or payment estimates are made
            on this website.
          </p>
          <p>
            To review a specific car first, visit the{" "}
            <Link href="/inventory" className="underline underline-offset-2">
              inventory
            </Link>{" "}
            and open that vehicle&apos;s page. Each listing includes an inquiry form that
            names the vehicle automatically.
          </p>
        </div>
        <ContactForm
          heading="Financing question"
          submitLabel="Send financing question"
        />
      </div>
    </>
  );
}
