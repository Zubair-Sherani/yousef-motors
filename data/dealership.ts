export interface DealershipHoursRow {
  days: string;
  hours: string;
}

export interface DealershipConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  siteUrl: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    region: string;
  };
  phone: {
    display: string;
    tel: string;
  };
  email: {
    display: string;
    href: string;
  };
  hours: DealershipHoursRow[];
  mapsUrl: string;
  social: {
    facebook: string;
    instagram: string;
    googleBusiness: string;
  };
  dealerLicense: {
    label: string;
    number: string;
  };
}

/**
 * Central dealership configuration.
 *
 * Replace placeholder values with the real business details before launch.
 * Do not invent an address, phone number, email, license number, or hours.
 */
export const dealership: DealershipConfig = {
  name: "Yousef Motors",
  legalName: "Nevada Prime Capital LLC",
  tagline: "Find Your Next Vehicle",
  description:
    "Yousef Motors is a used car dealership serving Nevada. Browse current inventory, review vehicle details, and contact the dealership with questions.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  address: {
    street: "Street address not yet provided",
    city: "City not yet provided",
    state: "NV",
    postalCode: "ZIP not yet provided",
    region: "Nevada",
  },
  phone: {
    display: "Phone number not yet provided",
    tel: "",
  },
  email: {
    display: "Email not yet provided",
    href: "",
  },
  hours: [
    {
      days: "Business hours",
      hours: "Not yet provided",
    },
  ],
  mapsUrl: "",
  social: {
    facebook: "",
    instagram: "",
    googleBusiness: "",
  },
  dealerLicense: {
    label: "Nevada Dealer License",
    number: "Dealer license number not yet provided",
  },
};

export function hasPhone(): boolean {
  return dealership.phone.tel.trim().length > 0;
}

export function hasEmail(): boolean {
  return dealership.email.href.trim().length > 0;
}

export function hasMapsUrl(): boolean {
  return dealership.mapsUrl.trim().length > 0;
}

export function phoneHref(): string | undefined {
  return hasPhone() ? `tel:${dealership.phone.tel}` : undefined;
}

export function emailHref(): string | undefined {
  return hasEmail() ? dealership.email.href : undefined;
}

export function formattedAddress(): string {
  const { street, city, state, postalCode, region } = dealership.address;
  const hasDetails =
    !street.includes("not yet provided") &&
    !city.includes("not yet provided") &&
    !postalCode.includes("not yet provided");

  if (hasDetails) {
    return `${street}, ${city}, ${state} ${postalCode}`;
  }

  return region;
}

export function siteOrigin(): string {
  return dealership.siteUrl.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalized}`;
}
