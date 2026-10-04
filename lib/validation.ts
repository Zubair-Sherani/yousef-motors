import {
  VEHICLE_STATUSES,
  type Vehicle,
  type VehicleStatus,
} from "@/types/vehicle";

export interface ValidationIssue {
  field: string;
  message: string;
}

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]{17}$/i;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IMAGE_PATH_PATTERN = /^\/cars\/[a-z0-9-]+\/[A-Za-z0-9._-]+\.(webp|jpg|jpeg|png)$/;

export function currentModelYear(now = new Date()): number {
  return now.getFullYear() + 1;
}

export function slugify(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function createVehicleSlug(
  year: number,
  make: string,
  model: string,
  trim: string,
): string {
  return [year, make, model, trim]
    .map((part) => slugify(String(part)))
    .filter(Boolean)
    .join("-");
}

export function parseBoolean(value: string): boolean | null {
  const normalized = value.trim().toLowerCase();
  if (["y", "yes", "true", "1"].includes(normalized)) return true;
  if (["n", "no", "false", "0"].includes(normalized)) return false;
  return null;
}

export function isVehicleStatus(value: string): value is VehicleStatus {
  return (VEHICLE_STATUSES as readonly string[]).includes(value);
}

export function validateVin(vin: string): string | null {
  const cleaned = vin.trim().toUpperCase();
  if (cleaned.length !== 17) {
    return "VIN must be exactly 17 characters.";
  }
  if (!VIN_PATTERN.test(cleaned)) {
    return "VIN may only include letters and numbers, excluding I, O, and Q.";
  }
  return null;
}

export function validateVehicle(
  input: unknown,
  existingSlugs: string[] = [],
  existingIds: string[] = [],
): { vehicle?: Vehicle; issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];

  if (!input || typeof input !== "object") {
    return { issues: [{ field: "vehicle", message: "Vehicle data must be an object." }] };
  }

  const value = input as Record<string, unknown>;
  const year = Number(value.year);
  const price = Number(value.price);
  const mileage = Number(value.mileage);
  const maxYear = currentModelYear();

  if (typeof value.id !== "string" || value.id.trim().length === 0) {
    issues.push({ field: "id", message: "ID is required." });
  } else if (existingIds.includes(value.id)) {
    issues.push({ field: "id", message: `ID "${value.id}" is already in use.` });
  }

  if (typeof value.slug !== "string" || !SLUG_PATTERN.test(value.slug)) {
    issues.push({
      field: "slug",
      message: "Slug must be lowercase letters, numbers, and hyphens.",
    });
  } else if (existingSlugs.includes(value.slug)) {
    issues.push({ field: "slug", message: `Slug "${value.slug}" is already in use.` });
  }

  if (!Number.isInteger(year) || year < 1980 || year > maxYear) {
    issues.push({
      field: "year",
      message: `Year must be an integer between 1980 and ${maxYear}.`,
    });
  }

  for (const field of [
    "make",
    "model",
    "trim",
    "vin",
    "engine",
    "transmission",
    "drivetrain",
    "exteriorColor",
    "interiorColor",
    "description",
  ] as const) {
    if (typeof value[field] !== "string" || value[field].trim().length === 0) {
      issues.push({ field, message: `${field} is required.` });
    }
  }

  if (!Number.isFinite(price) || price < 0) {
    issues.push({ field: "price", message: "Price must be a number of 0 or greater." });
  }

  if (!Number.isInteger(mileage) || mileage < 0) {
    issues.push({
      field: "mileage",
      message: "Mileage must be a whole number of 0 or greater.",
    });
  }

  if (typeof value.vin === "string") {
    const vinIssue = validateVin(value.vin);
    if (vinIssue) {
      issues.push({ field: "vin", message: vinIssue });
    }
  }

  if (typeof value.status !== "string" || !isVehicleStatus(value.status)) {
    issues.push({
      field: "status",
      message: `Status must be one of: ${VEHICLE_STATUSES.join(", ")}.`,
    });
  }

  if (typeof value.featured !== "boolean") {
    issues.push({ field: "featured", message: "Featured must be true or false." });
  }

  if (!Array.isArray(value.images)) {
    issues.push({ field: "images", message: "Images must be an array of paths." });
  } else {
    value.images.forEach((image, index) => {
      if (typeof image !== "string" || !IMAGE_PATH_PATTERN.test(image)) {
        issues.push({
          field: `images[${index}]`,
          message: "Each image must be a /cars/{slug}/{file}.webp path.",
        });
      }
    });
  }

  if (issues.length > 0) {
    return { issues };
  }

  const vehicle: Vehicle = {
    id: String(value.id).trim(),
    slug: String(value.slug).trim(),
    year,
    make: String(value.make).trim(),
    model: String(value.model).trim(),
    trim: String(value.trim).trim(),
    price,
    mileage,
    vin: String(value.vin).trim().toUpperCase(),
    engine: String(value.engine).trim(),
    transmission: String(value.transmission).trim(),
    drivetrain: String(value.drivetrain).trim(),
    exteriorColor: String(value.exteriorColor).trim(),
    interiorColor: String(value.interiorColor).trim(),
    description: String(value.description).trim(),
    status: value.status as VehicleStatus,
    featured: Boolean(value.featured),
    images: (value.images as string[]).map((image) => image.trim()),
  };

  return { vehicle, issues };
}

export function assertVehicles(input: unknown): Vehicle[] {
  if (!Array.isArray(input)) {
    throw new Error("Inventory data must be an array.");
  }

  const vehicles: Vehicle[] = [];
  const issues: string[] = [];

  input.forEach((item, index) => {
    const existingSlugs = vehicles.map((vehicle) => vehicle.slug);
    const existingIds = vehicles.map((vehicle) => vehicle.id);
    const result = validateVehicle(item, existingSlugs, existingIds);

    if (!result.vehicle) {
      const details = result.issues
        .map((issue) => `${issue.field}: ${issue.message}`)
        .join("; ");
      issues.push(`Vehicle at index ${index}: ${details}`);
      return;
    }

    vehicles.push(result.vehicle);
  });

  if (issues.length > 0) {
    throw new Error(`Invalid inventory data.\n${issues.join("\n")}`);
  }

  return vehicles;
}
