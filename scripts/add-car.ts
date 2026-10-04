import { currentModelYear, parseBoolean, validateVehicle, validateVin } from "../lib/validation";
import {
  nextVehicleId,
  readInventory,
  suggestedSlug,
  uniqueSlug,
  writeInventory,
} from "./lib/inventory-file";
import { importVehicleImages } from "./lib/images";
import { createPrompter, parseArgs } from "./lib/prompt";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const prompt = await createPrompter(args);
  const vehicles = await readInventory();
  const maxYear = currentModelYear();

  try {
    const yearText = await prompt.ask("Year");
    const year = Number(yearText);
    if (!Number.isInteger(year) || year < 1980 || year > maxYear) {
      throw new Error(`Year must be an integer between 1980 and ${maxYear}.`);
    }

    const make = await prompt.ask("Make");
    const model = await prompt.ask("Model");
    const trim = await prompt.ask("Trim");
    const price = Number((await prompt.ask("Price")).replace(/[$,]/g, ""));
    const mileage = Number((await prompt.ask("Mileage")).replace(/,/g, ""));
    const vin = (await prompt.ask("VIN")).toUpperCase();
    const vinError = validateVin(vin);
    if (vinError) {
      throw new Error(vinError);
    }

    const engine = await prompt.ask("Engine");
    const transmission = await prompt.ask("Transmission", { defaultValue: "Automatic" });
    const drivetrain = await prompt.ask("Drivetrain");
    const exteriorColor = await prompt.ask("Exterior Color");
    const interiorColor = await prompt.ask("Interior Color");
    const featuredText = await prompt.ask("Featured", { defaultValue: "no" });
    const featured = parseBoolean(featuredText);
    if (featured === null) {
      throw new Error("Featured must be yes or no.");
    }

    const description = await prompt.ask("Description", {
      defaultValue: `${year} ${make} ${model} ${trim} listed by Yousef Motors.`,
    });
    const imageFolder = await prompt.ask("Image folder", { required: false, defaultValue: "" });

    const baseSlug = suggestedSlug({ year, make, model, trim });
    const slug = uniqueSlug(baseSlug, vehicles);
    const images = await importVehicleImages(imageFolder || undefined, slug);

    const candidate = {
      id: nextVehicleId(vehicles),
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
      description,
      status: "available",
      featured,
      images,
    };

    const result = validateVehicle(
      candidate,
      vehicles.map((vehicle) => vehicle.slug),
      vehicles.map((vehicle) => vehicle.id),
    );

    if (!result.vehicle) {
      throw new Error(result.issues.map((issue) => issue.message).join(" "));
    }

    vehicles.push(result.vehicle);
    await writeInventory(vehicles);

    console.log(`\nAdded ${year} ${make} ${model} ${trim}`);
    console.log(`ID:    ${result.vehicle.id}`);
    console.log(`Slug:  ${result.vehicle.slug}`);
    console.log(`URL:   /inventory/${result.vehicle.slug}`);
    console.log(`Images: ${images.length} file(s) stored in public/cars/${slug}/`);
  } finally {
    prompt.close();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unable to add vehicle.";
  console.error(message);
  process.exitCode = 1;
});
