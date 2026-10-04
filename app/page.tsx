import Image from "next/image";
import Link from "next/link";

import { ContactActions } from "@/components/ContactActions";
import { VehicleGrid } from "@/components/VehicleGrid";
import { dealership, formattedAddress } from "@/data/dealership";
import { getFeaturedVehicles } from "@/lib/vehicles";

const facts = [
  {
    title: "Current inventory online",
    body: "Every listed vehicle is generated from one inventory file, so pages stay in sync when a car is added, edited, or marked sold.",
  },
  {
    title: "Clear listing details",
    body: "Price, mileage, VIN, and specifications are published on each vehicle page so you can review the facts before contacting the dealership.",
  },
  {
    title: "Nevada dealership",
    body: "Yousef Motors lists used vehicles for customers in Nevada. Contact the dealership with questions about a specific car.",
  },
];

export default function HomePage() {
  const featured = getFeaturedVehicles();

  return (
    <>
      <section className="relative isolate min-h-[78vh] overflow-hidden bg-ink text-paper">
        <Image
          src="/hero.webp"
          alt="Nevada landscape at dusk"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-end px-5 py-20 sm:px-8">
          <p className="text-xs tracking-[0.24em] text-brass uppercase">
            {dealership.address.region}
          </p>
          <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] sm:text-6xl lg:text-7xl">
            {dealership.tagline}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-sand sm:text-lg">
            Browse used vehicles currently listed by {dealership.name}. Review photos,
            prices, and specifications, then send a message about the car you want to discuss.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/inventory" className="bg-paper px-5 py-3 text-sm text-ink">
              View Inventory
            </Link>
            <Link href="/contact" className="border border-paper px-5 py-3 text-sm text-paper">
              Contact the dealership
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.2em] text-copper uppercase">Featured</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Available vehicles</h2>
          </div>
          <Link href="/inventory" className="hidden text-sm text-ink underline-offset-4 hover:underline sm:inline">
            See all inventory
          </Link>
        </div>
        <div className="mt-8">
          <VehicleGrid
            vehicles={featured}
            emptyMessage="No featured vehicles are currently available. View the full inventory for every listing."
          />
        </div>
      </section>

      <section className="bg-stone">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-3">
          {facts.map((fact) => (
            <article key={fact.title}>
              <h2 className="font-serif text-2xl">{fact.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{fact.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.2em] text-copper uppercase">Dealership</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{dealership.name}</h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted">{dealership.description}</p>
          <p className="mt-4 text-sm text-ink">{formattedAddress()}</p>
          <ContactActions />
        </div>
        <div className="border border-line bg-stone p-6">
          <h3 className="font-serif text-2xl">Hours</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {dealership.hours.map((row) => (
              <li key={row.days} className="flex justify-between gap-4 border-b border-line pb-3">
                <span>{row.days}</span>
                <span className="text-muted">{row.hours}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-muted">
            {dealership.dealerLicense.label}: {dealership.dealerLicense.number}
          </p>
          <Link href="/contact" className="mt-6 inline-flex border border-ink px-4 py-2 text-sm">
            Ask a question
          </Link>
        </div>
      </section>
    </>
  );
}
