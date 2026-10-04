import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { MobileActions } from "@/components/MobileActions";
import { dealership, siteOrigin } from "@/data/dealership";
import { localBusinessSchema } from "@/lib/schema";

import "./globals.css";

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin()),
  title: {
    default: `${dealership.name} | Used Cars in Nevada`,
    template: `%s | ${dealership.name}`,
  },
  description: dealership.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: dealership.name,
    title: `${dealership.name} | Used Cars in Nevada`,
    description: dealership.description,
    url: siteOrigin(),
    images: [{ url: "/og.webp", width: 1200, height: 630, alt: dealership.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${dealership.name} | Used Cars in Nevada`,
    description: dealership.description,
    images: ["/og.webp"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sourceSans.variable} ${sourceSerif.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper font-sans text-ink">
        <JsonLd data={localBusinessSchema()} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1 pb-20 md:pb-0">
          {children}
        </main>
        <Footer />
        <MobileActions />
      </body>
    </html>
  );
}
