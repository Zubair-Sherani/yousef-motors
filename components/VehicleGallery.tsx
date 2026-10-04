"use client";

import Image from "next/image";
import { useState } from "react";

import { vehicleTitle } from "@/lib/format";
import type { Vehicle } from "@/types/vehicle";

export function VehicleGallery({ vehicle }: { vehicle: Vehicle }) {
  const [current, setCurrent] = useState(0);
  const title = vehicleTitle(vehicle);
  const active = vehicle.images[current] ?? vehicle.images[0];

  if (!active) {
    return (
      <div className="flex aspect-[3/2] items-end bg-stone p-6">
        <p className="font-serif text-3xl">{title}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[3/2] overflow-hidden bg-stone">
        <Image
          src={active}
          alt={`${title} photo ${current + 1} of ${vehicle.images.length}`}
          fill
          sizes="(max-width: 1024px) 100vw, 64vw"
          className="object-cover"
          priority
        />
      </div>

      {vehicle.images.length > 1 ? (
        <ul className="mt-3 grid grid-cols-4 gap-2" aria-label="Vehicle photos">
          {vehicle.images.map((image, index) => (
            <li key={image}>
              <button
                type="button"
                onClick={() => setCurrent(index)}
                aria-current={index === current}
                className={`relative aspect-[3/2] w-full overflow-hidden border ${
                  index === current ? "border-ink" : "border-transparent"
                }`}
              >
                <Image
                  src={image}
                  alt={`${title} thumbnail ${index + 1}`}
                  fill
                  sizes="160px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
