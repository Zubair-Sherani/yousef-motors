import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { projectRoot, publicCarsDir } from "./lib/inventory-file";

interface SampleVehicle {
  slug: string;
  title: string;
  color: string;
  accent: string;
}

const vehicles: SampleVehicle[] = [
  {
    slug: "2020-toyota-camry-se",
    title: "2020 Toyota Camry SE",
    color: "#1b1b1d",
    accent: "#8a8d92",
  },
  {
    slug: "2021-honda-cr-v-ex",
    title: "2021 Honda CR-V EX",
    color: "#ece8e1",
    accent: "#6f6254",
  },
  {
    slug: "2019-ford-f-150-xlt",
    title: "2019 Ford F-150 XLT",
    color: "#b7b8bb",
    accent: "#3f3f46",
  },
  {
    slug: "2022-subaru-outback-limited",
    title: "2022 Subaru Outback Limited",
    color: "#3d4a38",
    accent: "#c4b39a",
  },
  {
    slug: "2018-bmw-330i",
    title: "2018 BMW 330i",
    color: "#1f3a5f",
    accent: "#c5c7cc",
  },
  {
    slug: "2021-chevrolet-silverado-1500-lt",
    title: "2021 Chevrolet Silverado 1500 LT",
    color: "#7a1f1f",
    accent: "#d7c4a3",
  },
];

const angles = ["front", "rear", "side", "interior"] as const;

function escapeXml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function vehicleSvg(
  vehicle: SampleVehicle,
  angle: string,
  width: number,
  height: number,
): Buffer {
  const label = angle.charAt(0).toUpperCase() + angle.slice(1);
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2a2118"/>
      <stop offset="42%" stop-color="#5a4330"/>
      <stop offset="100%" stop-color="#15110e"/>
    </linearGradient>
    <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#2b261f"/>
      <stop offset="100%" stop-color="#0f0d0b"/>
    </linearGradient>
    <linearGradient id="body" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${vehicle.accent}"/>
      <stop offset="45%" stop-color="${vehicle.color}"/>
      <stop offset="100%" stop-color="#0c0b0a"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#sky)"/>
  <path d="M0 ${height * 0.58} L${width * 0.18} ${height * 0.44} L${width * 0.34} ${height * 0.52} L${width * 0.52} ${height * 0.38} L${width * 0.72} ${height * 0.5} L${width} ${height * 0.4} L${width} ${height} L0 ${height} Z" fill="#1a1612"/>
  <rect y="${height * 0.62}" width="${width}" height="${height * 0.38}" fill="url(#ground)"/>
  <ellipse cx="${width * 0.5}" cy="${height * 0.78}" rx="${width * 0.38}" ry="${height * 0.06}" fill="#000" opacity="0.35"/>
  <g transform="translate(${width * 0.16} ${height * 0.42})">
    <path d="M0 ${height * 0.22} C${width * 0.08} ${height * 0.08}, ${width * 0.2} ${height * 0.02}, ${width * 0.34} ${height * 0.04} C${width * 0.48} ${height * 0.06}, ${width * 0.56} ${height * 0.14}, ${width * 0.68} ${height * 0.2} L${width * 0.68} ${height * 0.3} L0 ${height * 0.3} Z" fill="url(#body)"/>
    <rect x="${width * 0.12}" y="${height * 0.1}" width="${width * 0.18}" height="${height * 0.1}" rx="8" fill="#9bb4c7" opacity="0.35"/>
    <rect x="${width * 0.34}" y="${height * 0.1}" width="${width * 0.16}" height="${height * 0.1}" rx="8" fill="#9bb4c7" opacity="0.22"/>
    <circle cx="${width * 0.14}" cy="${height * 0.3}" r="${height * 0.055}" fill="#1a1a1a"/>
    <circle cx="${width * 0.14}" cy="${height * 0.3}" r="${height * 0.028}" fill="${vehicle.accent}"/>
    <circle cx="${width * 0.52}" cy="${height * 0.3}" r="${height * 0.055}" fill="#1a1a1a"/>
    <circle cx="${width * 0.52}" cy="${height * 0.3}" r="${height * 0.028}" fill="${vehicle.accent}"/>
  </g>
  <rect x="0" y="0" width="${width}" height="${height}" fill="#14110e" opacity="0.18"/>
  <text x="${width * 0.06}" y="${height * 0.12}" fill="#f6f1e8" font-family="Georgia, serif" font-size="${Math.round(width * 0.036)}" letter-spacing="1">${escapeXml(vehicle.title)}</text>
  <text x="${width * 0.06}" y="${height * 0.175}" fill="#d7c4a3" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.018)}" letter-spacing="4">${escapeXml(label.toUpperCase())}</text>
  <text x="${width * 0.06}" y="${height * 0.93}" fill="#cfc4b4" font-family="Arial, sans-serif" font-size="${Math.round(width * 0.016)}" letter-spacing="2">YOUSEF MOTORS</text>
</svg>`;

  return Buffer.from(svg);
}

function heroSvg(width: number, height: number): Buffer {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3c2a1d"/>
      <stop offset="38%" stop-color="#8a5a32"/>
      <stop offset="62%" stop-color="#c9844a"/>
      <stop offset="100%" stop-color="#1b1612"/>
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#dusk)"/>
  <circle cx="${width * 0.78}" cy="${height * 0.38}" r="${height * 0.12}" fill="#f0d2a8" opacity="0.85"/>
  <path d="M0 ${height * 0.62} L${width * 0.16} ${height * 0.46} L${width * 0.3} ${height * 0.58} L${width * 0.48} ${height * 0.4} L${width * 0.67} ${height * 0.56} L${width * 0.84} ${height * 0.42} L${width} ${height * 0.52} L${width} ${height} L0 ${height} Z" fill="#231c16"/>
  <path d="M0 ${height * 0.74} L${width} ${height * 0.66} L${width} ${height} L0 ${height} Z" fill="#14110e"/>
</svg>`;
  return Buffer.from(svg);
}

function ogSvg(): Buffer {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#14110e"/>
  <path d="M0 430 L220 340 L420 410 L700 280 L980 380 L1200 300 L1200 630 L0 630 Z" fill="#2a2118"/>
  <text x="72" y="250" fill="#f6f1e8" font-family="Georgia, serif" font-size="64">Yousef Motors</text>
  <text x="72" y="320" fill="#d7c4a3" font-family="Arial, sans-serif" font-size="28" letter-spacing="3">USED VEHICLES IN NEVADA</text>
</svg>`;
  return Buffer.from(svg);
}

async function writeWebp(target: string, svg: Buffer, quality: number) {
  await mkdir(path.dirname(target), { recursive: true });
  await sharp(svg, { density: 160 }).webp({ quality }).toFile(target);
}

async function main() {
  for (const vehicle of vehicles) {
    for (const angle of angles) {
      const gallerySvg = vehicleSvg(vehicle, angle, 1800, 1200);
      const cardSvg = vehicleSvg(vehicle, angle, 800, 533);
      const folder = path.join(publicCarsDir, vehicle.slug);
      await writeWebp(path.join(folder, `${angle}.webp`), gallerySvg, 86);
      await writeWebp(path.join(folder, `${angle}-card.webp`), cardSvg, 82);
    }
  }

  const publicDir = path.join(projectRoot, "public");
  await writeWebp(path.join(publicDir, "hero.webp"), heroSvg(2400, 1500), 86);
  await writeWebp(path.join(publicDir, "og.webp"), ogSvg(), 86);

  const favicon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <rect width="64" height="64" rx="8" fill="#14110e"/>
  <text x="32" y="42" text-anchor="middle" fill="#f6f1e8" font-family="Georgia, serif" font-size="30">N</text>
</svg>`;
  await writeFile(path.join(publicDir, "favicon.svg"), favicon, "utf8");

  console.log("Generated sample vehicle images, hero, Open Graph image, and favicon.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Image generation failed.";
  console.error(message);
  process.exitCode = 1;
});
