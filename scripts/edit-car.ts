import { parseBoolean, validateVehicle, validateVin } from "../lib/validation";
import { findVehicle, readInventory, suggestedSlug, uniqueSlug, writeInventory } from "./lib/inventory-file";
import { importVehicleImages } from "./lib/images";
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

    console.log(`Editing ${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`);
    console.log("Press Enter to keep the current value.\n");

    const year = Number(await prompt.ask("Year", { defaultValue: String(vehicle.year) }));
    const make = await prompt.ask("Make", { defaultValue: vehicle.make });
    const model = await prompt.ask("Model", { defaultValue: vehicle.model });
    const trim = await prompt.ask("Trim", { defaultValue: vehicle.trim });
    const price = Number(
      (await prompt.ask("Price", { defaultValue: String(vehicle.price) })).replace(/[$,]/g, ""),
    );
    const mileage = Number(
      (await prompt.ask("Mileage", { defaultValue: String(vehicle.mileage) })).replace(/,/g, ""),
    );
    const vin = (await prompt.ask("VIN", { defaultValue: vehicle.vin })).toUpperCase();
    const vinError = validateVin(vin);
    if (vinError) {
      throw new Error(vinError);
    }

    const engine = await prompt.ask("Engine", { defaultValue: vehicle.engine });
    const transmission = await prompt.ask("Transmission", { defaultValue: vehicle.transmission });
    const drivetrain = await prompt.ask("Drivetrain", { defaultValue: vehicle.drivetrain });
    const exteriorColor = await prompt.ask("Exterior Color", { defaultValue: vehicle.exteriorColor });
    const interiorColor = await prompt.ask("Interior Color", { defaultValue: vehicle.interiorColor });
    const featuredText = await prompt.ask("Featured", {
      defaultValue: vehicle.featured ? "yes" : "no",
    });
    const featured = parseBoolean(featuredText);
    if (featured === null) {
      throw new Error("Featured must be yes or no.");
    }
    const status = await prompt.ask("Status", { defaultValue: vehicle.status });
    const description = await prompt.ask("Description", { defaultValue: vehicle.description });
    const imageFolder = await prompt.ask("Image folder", { required: false, defaultValue: "" });

    const slug = uniqueSlug(suggestedSlug({ year, make, model, trim }), vehicles, vehicle.id);
    const images = imageFolder
      ? await importVehicleImages(imageFolder, slug)
      : vehicle.images.map((image) => image.replace(`/cars/${vehicle.slug}/`, `/cars/${slug}/`));

    const candidate = {
      ...vehicle,
      slug,
      year,
      make,
      model,
      trim,
      price,
      mileage,
      vin,
      engine,
      transmission,
      drivetrain,
      exteriorColor,
      interiorColor,
      featured,
      status,
      description,
      images,
    };

    const others = vehicles.filter((item) => item.id !== vehicle.id);
    const result = validateVehicle(
      candidate,
      others.map((item) => item.slug),
      others.map((item) => item.id),
    );

    if (!result.vehicle) {
      throw new Error(result.issues.map((issue) => issue.message).join(" "));
    }

    await writeInventory([...others, result.vehicle]);
    console.log(`Updated ${year} ${make} ${model} ${trim} (${result.vehicle.slug}).`);
  } finally {
    prompt.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to edit vehicle.";
  console.error(message);
  process.exitCode = 1;
});
