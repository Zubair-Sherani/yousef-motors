import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { dealership } from "@/data/dealership";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Privacy",
  description: `Privacy information for the ${dealership.name} website.`,
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ])}
      />
      <PageHeader
        eyebrow="Legal"
        title="Privacy"
        description="This page describes the information this website is designed to collect."
      />
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-14 text-base leading-8 text-ink-soft sm:px-8">
        <p>
          {dealership.name} operates this website to display vehicle inventory and to
          receive customer inquiries. The site is statically generated and does not use
          a customer account system.
        </p>
        <h2 className="font-serif text-2xl text-ink">Information you submit</h2>
        <p>
          If you use a contact or vehicle inquiry form, the information you enter, such
          as name, email address, phone number, message, and the vehicle you were viewing,
          is sent to the configured form provider so the dealership can respond.
        </p>
        <h2 className="font-serif text-2xl text-ink">Hosting and logs</h2>
        <p>
          The website is intended to be hosted on Cloudflare Pages. The hosting provider
          may collect standard technical data such as IP addresses and request logs as
          part of delivering the site.
        </p>
        <h2 className="font-serif text-2xl text-ink">Cookies and analytics</h2>
        <p>
          This codebase does not include a marketing pixel, advertising cookie, or
          analytics package. If those tools are added later, this page should be updated
          to describe them.
        </p>
        <h2 className="font-serif text-2xl text-ink">Questions</h2>
        <p>
          For privacy questions, contact the dealership using the details in{" "}
          <code>data/dealership.ts</code> once those details have been provided.
        </p>
      </div>
    </>
  );
}
