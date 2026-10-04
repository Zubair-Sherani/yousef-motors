import type { Vehicle, VehicleStatus } from "@/types/vehicle";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat("en-US").format(mileage)} miles`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function vehicleTitle(vehicle: Pick<Vehicle, "year" | "make" | "model" | "trim">): string {
  return [vehicle.year, vehicle.make, vehicle.model, vehicle.trim]
    .filter(Boolean)
    .join(" ");
}

export function statusLabel(status: VehicleStatus): string {
  switch (status) {
    case "available":
      return "Available";
    case "pending":
      return "Pending";
    case "sold":
      return "Sold";
    default: {
      const _exhaustive: never = status;
      return _exhaustive;
    }
  }
}

export function listingImagePath(imagePath: string): string {
  return imagePath.replace(/\.webp$/i, "-card.webp");
}
