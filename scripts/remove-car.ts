import { rm } from "node:fs/promises";
import path from "node:path";

import { findVehicle, publicCarsDir, readInventory, writeInventory } from "./lib/inventory-file";
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

    const confirmation = args.yes
      ? "yes"
      : await prompt.ask(`Remove ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}?`, {
          defaultValue: "no",
        });

    if (!["y", "yes"].includes(confirmation.toLowerCase())) {
      console.log("Cancelled.");
      return;
    }

    const remaining = vehicles.filter((item) => item.id !== vehicle.id);
    await writeInventory(remaining);
    await rm(path.join(publicCarsDir, vehicle.slug), { recursive: true, force: true });

    console.log(`Removed ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim} (${vehicle.slug}).`);
  } finally {
    prompt.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to remove vehicle.";
  console.error(message);
  process.exitCode = 1;
});
