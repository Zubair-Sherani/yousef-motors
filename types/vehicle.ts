export const VEHICLE_STATUSES = ["available", "pending", "sold"] as const;

export type VehicleStatus = (typeof VEHICLE_STATUSES)[number];

export interface Vehicle {
  id: string;
  slug: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  mileage: number;
  vin: string;
  engine: string;
  transmission: string;
  drivetrain: string;
  exteriorColor: string;
  interiorColor: string;
  description: string;
  status: VehicleStatus;
  featured: boolean;
  images: string[];
}

export const VEHICLE_SORT_OPTIONS = [
  "price-asc",
  "price-desc",
  "mileage-asc",
  "year-desc",
] as const;

export type VehicleSort = (typeof VEHICLE_SORT_OPTIONS)[number];

export interface VehicleFilterState {
  make: string;
  model: string;
  year: string;
  maxPrice: string;
  maxMileage: string;
  includeSold: boolean;
  sort: VehicleSort;
}
