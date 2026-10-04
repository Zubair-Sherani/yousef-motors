"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/Icons";
import { dealership, hasPhone, phoneHref } from "@/data/dealership";

const links = [
  { href: "/", label: "Home" },
  { href: "/inventory", label: "Inventory" },
  { href: "/financing", label: "Financing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const callHref = phoneHref();

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="min-w-0" onClick={() => setOpen(false)}>
          <span className="block font-serif text-xl leading-none text-ink sm:text-2xl">
            {dealership.name}
          </span>
          <span className="mt-1 block text-[0.7rem] tracking-[0.18em] text-muted uppercase">
            Used vehicles · Nevada
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide ${
                  active ? "text-ink" : "text-muted hover:text-ink"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {hasPhone() && callHref ? (
            <a
              href={callHref}
              className="hidden items-center gap-2 text-sm text-ink sm:inline-flex"
            >
              <PhoneIcon className="h-4 w-4" />
              {dealership.phone.display}
            </a>
          ) : null}

          <Link
            href="/inventory"
            className="hidden bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-ink-soft sm:inline-flex"
          >
            View Inventory
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-line bg-paper px-5 py-4 lg:hidden"
        >
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1 text-base text-ink"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
