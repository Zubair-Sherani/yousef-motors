import { findVehicle, readInventory, writeInventory } from "./lib/inventory-file";
import { createPrompter, parseArgs } from "./lib/prompt";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompt = await createPrompter(args);
  const vehicles = await readInventory();

  try {
    const query = await prompt.ask("Vehicle ID or slug");
    const vehicle = findVehicle(vehicles, query);

    if (!vehicle) {
      throw new Error(`No vehicle matched "${query}".`);
    }

    if (vehicle.status === "sold") {
      console.log(`${vehicle.year} ${vehicle.make} ${vehicle.model} is already marked sold.`);
      return;
    }

    vehicle.status = "sold";
    vehicle.featured = false;
    await writeInventory(vehicles);

    console.log(`Marked sold: ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`);
    console.log("The listing remains on the site and can still be opened by its URL.");
  } finally {
    prompt.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to mark vehicle sold.";
  console.error(message);
  process.exitCode = 1;
});
