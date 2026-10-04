import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/data/dealership";
import { getVehicles } from "@/lib/vehicles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/inventory"), lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/financing"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/privacy"), lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const vehicleRoutes: MetadataRoute.Sitemap = getVehicles().map((vehicle) => ({
    url: absoluteUrl(`/inventory/${vehicle.slug}`),
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: vehicle.status === "available" ? 0.8 : 0.3,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
