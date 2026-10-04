import { formatMileage, formatPrice, vehicleTitle } from "../lib/format";
import { readInventory } from "./lib/inventory-file";

async function main() {
  const vehicles = await readInventory();

  if (vehicles.length === 0) {
    console.log("Inventory is empty.");
    return;
  }

  const rows = vehicles.map((vehicle) => ({
    id: vehicle.id,
    status: vehicle.status,
    featured: vehicle.featured ? "yes" : "no",
    vehicle: vehicleTitle(vehicle),
    price: formatPrice(vehicle.price),
    mileage: formatMileage(vehicle.mileage),
    slug: vehicle.slug,
  }));

  console.table(rows);
  console.log(`${vehicles.length} vehicle(s) in data/cars.json`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to list vehicles.";
  console.error(message);
  process.exitCode = 1;
});
