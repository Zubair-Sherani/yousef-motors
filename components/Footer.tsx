import Link from "next/link";

import { dealership, formattedAddress, hasEmail, hasPhone } from "@/data/dealership";

const footerLinks = [
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
] as const;

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl">{dealership.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-sand">
            Used vehicles listed for customers in Nevada. Inventory, prices, and
            vehicle details are maintained from a single data file.
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Dealership</p>
          <p className="mt-3 text-sm leading-6 text-sand">{formattedAddress()}</p>
          <p className="mt-2 text-sm text-sand">
            {hasPhone() ? dealership.phone.display : dealership.phone.display}
          </p>
          <p className="text-sm text-sand">
            {hasEmail() ? (
              <a href={dealership.email.href} className="hover:text-paper">
                {dealership.email.display}
              </a>
            ) : (
              dealership.email.display
            )}
          </p>
          <p className="mt-4 text-sm text-sand">
            {dealership.dealerLicense.label}: {dealership.dealerLicense.number}
          </p>
        </div>

        <div>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">Hours</p>
          <ul className="mt-3 space-y-2 text-sm text-sand">
            {dealership.hours.map((row) => (
              <li key={row.days}>
                <span className="block text-paper">{row.days}</span>
                {row.hours}
              </li>
            ))}
          </ul>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-sand hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-5 py-4 text-xs text-sand/80 sm:px-8">
          © {new Date().getFullYear()} {dealership.legalName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
