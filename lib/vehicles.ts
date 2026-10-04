import inventory from "@/data/cars.json";
import { assertVehicles } from "@/lib/validation";
import type { Vehicle, VehicleFilterState, VehicleSort } from "@/types/vehicle";

const vehicles = assertVehicles(inventory);

export function getVehicles(): Vehicle[] {
  return vehicles;
}

export function getVehicleBySlug(slug: string): Vehicle | undefined {
  return vehicles.find((vehicle) => vehicle.slug === slug);
}

export function getAvailableVehicles(): Vehicle[] {
  return vehicles.filter((vehicle) => vehicle.status === "available");
}

export function getFeaturedVehicles(): Vehicle[] {
  return vehicles.filter(
    (vehicle) => vehicle.featured && vehicle.status === "available",
  );
}

export function getVehicleSlugs(): string[] {
  return vehicles.map((vehicle) => vehicle.slug);
}

export function getMakes(): string[] {
  return uniqueSorted(vehicles.map((vehicle) => vehicle.make));
}

export function getModels(make?: string): string[] {
  return uniqueSorted(
    vehicles
      .filter((vehicle) => !make || vehicle.make === make)
      .map((vehicle) => vehicle.model),
  );
}

export function getYears(): number[] {
  return uniqueSorted(vehicles.map((vehicle) => vehicle.year)).reverse();
}

export function filterVehicles(
  list: Vehicle[],
  filters: VehicleFilterState,
): Vehicle[] {
  const maxPrice = parseOptionalNumber(filters.maxPrice);
  const maxMileage = parseOptionalNumber(filters.maxMileage);
  const year = parseOptionalNumber(filters.year);

  const filtered = list.filter((vehicle) => {
    if (!filters.includeSold && vehicle.status === "sold") {
      return false;
    }
    if (filters.make && vehicle.make !== filters.make) {
      return false;
    }
    if (filters.model && vehicle.model !== filters.model) {
      return false;
    }
    if (year !== null && vehicle.year !== year) {
      return false;
    }
    if (maxPrice !== null && vehicle.price > maxPrice) {
      return false;
    }
    if (maxMileage !== null && vehicle.mileage > maxMileage) {
      return false;
    }
    return true;
  });

  return sortVehicles(filtered, filters.sort);
}

export function sortVehicles(list: Vehicle[], sort: VehicleSort): Vehicle[] {
  const sorted = [...list];

  sorted.sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "mileage-asc":
        return a.mileage - b.mileage;
      case "year-desc":
        return b.year - a.year || a.mileage - b.mileage;
      default: {
        const _exhaustive: never = sort;
        return _exhaustive;
      }
    }
  });

  return sorted;
}

function uniqueSorted<T extends string | number>(values: T[]): T[] {
  return [...new Set(values)].sort((a, b) => {
    if (typeof a === "number" && typeof b === "number") {
      return a - b;
    }
    return String(a).localeCompare(String(b));
  });
}

function parseOptionalNumber(value: string): number | null {
  if (!value.trim()) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
