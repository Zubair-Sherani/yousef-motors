import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { assertVehicles, createVehicleSlug, slugify } from "../../lib/validation";
import type { Vehicle } from "../../types/vehicle";

export const projectRoot = process.cwd();
export const inventoryPath = path.join(projectRoot, "data", "cars.json");
export const publicCarsDir = path.join(projectRoot, "public", "cars");

export async function readInventory(): Promise<Vehicle[]> {
  const raw = await readFile(inventoryPath, "utf8");
  return assertVehicles(JSON.parse(raw));
}

export async function writeInventory(vehicles: Vehicle[]): Promise<void> {
  const sorted = [...vehicles].sort((a, b) => a.id.localeCompare(b.id, "en"));
  const json = `${JSON.stringify(sorted, null, 2)}\n`;
  await writeFile(inventoryPath, json, "utf8");
}

export function nextVehicleId(vehicles: Vehicle[]): string {
  const maxId = vehicles.reduce((max, vehicle) => {
    const numeric = Number.parseInt(vehicle.id, 10);
    return Number.isFinite(numeric) ? Math.max(max, numeric) : max;
  }, 0);

  return String(maxId + 1).padStart(3, "0");
}

export function uniqueSlug(base: string, vehicles: Vehicle[], ignoreId?: string): string {
  const taken = new Set(
    vehicles.filter((vehicle) => vehicle.id !== ignoreId).map((vehicle) => vehicle.slug),
  );

  if (!taken.has(base)) {
    return base;
  }

  let index = 2;
  while (taken.has(`${base}-${index}`)) {
    index += 1;
  }
  return `${base}-${index}`;
}

export function findVehicle(vehicles: Vehicle[], query: string): Vehicle | undefined {
  const normalized = query.trim().toLowerCase();
  return vehicles.find(
    (vehicle) =>
      vehicle.id.toLowerCase() === normalized ||
      vehicle.slug.toLowerCase() === normalized ||
      `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`
        .toLowerCase()
        .includes(normalized),
  );
}

export async function ensureImageFolder(slug: string): Promise<string> {
  const folder = path.join(publicCarsDir, slug);
  await mkdir(folder, { recursive: true });
  return folder;
}

export function vehicleImagePaths(slug: string, filenames: string[]): string[] {
  return filenames.map((filename) => `/cars/${slug}/${filename}`);
}

export function suggestedSlug(input: {
  year: number;
  make: string;
  model: string;
  trim: string;
}): string {
  return createVehicleSlug(input.year, input.make, input.model, input.trim);
}

export function imageFolderName(value: string): string {
  return slugify(value);
}

export async function listImageFiles(folder: string): Promise<string[]> {
  try {
    const entries = await readdir(folder, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((name) => /\.(webp|jpg|jpeg|png)$/i.test(name) && !name.includes("-card."))
      .sort((a, b) => a.localeCompare(b));
  } catch {
    return [];
  }
}
