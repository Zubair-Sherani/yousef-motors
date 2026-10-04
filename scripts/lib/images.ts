import { copyFile, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { ensureImageFolder } from "./inventory-file";

const GALLERY_WIDTH = 1800;
const CARD_WIDTH = 800;
const WEBP_QUALITY = 86;
const CARD_QUALITY = 82;

const IMAGE_EXTENSIONS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

export async function importVehicleImages(
  sourceFolder: string | undefined,
  slug: string,
): Promise<string[]> {
  const destination = await ensureImageFolder(slug);

  if (!sourceFolder) {
    return [];
  }

  const resolvedSource = path.resolve(sourceFolder);
  const { readdir } = await import("node:fs/promises");
  const entries = await readdir(resolvedSource, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  const imported: string[] = [];

  for (const filename of files) {
    const sourcePath = path.join(resolvedSource, filename);
    const baseName = path.parse(filename).name.replace(/-card$/i, "");
    if (baseName.endsWith("-card")) {
      continue;
    }

    const galleryName = `${baseName}.webp`;
    const cardName = `${baseName}-card.webp`;
    const galleryPath = path.join(destination, galleryName);
    const cardPath = path.join(destination, cardName);

    await sharp(sourcePath)
      .rotate()
      .resize({ width: GALLERY_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(galleryPath);

    await sharp(sourcePath)
      .rotate()
      .resize({ width: CARD_WIDTH, withoutEnlargement: true })
      .webp({ quality: CARD_QUALITY })
      .toFile(cardPath);

    imported.push(`/cars/${slug}/${galleryName}`);
  }

  if (imported.length === 0) {
    await copyFile(sourceFolder, destination).catch(() => undefined);
  }

  return imported;
}

export async function writePlaceholderSet(
  slug: string,
  labels: string[],
  render: (label: string, width: number, height: number) => Promise<Buffer>,
): Promise<string[]> {
  const destination = await ensureImageFolder(slug);
  await mkdir(destination, { recursive: true });
  const paths: string[] = [];

  for (const label of labels) {
    const gallery = await render(label, 1800, 1200);
    const card = await render(label, 800, 533);
    const galleryName = `${label}.webp`;
    await sharp(gallery).webp({ quality: WEBP_QUALITY }).toFile(path.join(destination, galleryName));
    await sharp(card).webp({ quality: CARD_QUALITY }).toFile(path.join(destination, `${label}-card.webp`));
    paths.push(`/cars/${slug}/${galleryName}`);
  }

  return paths;
}
