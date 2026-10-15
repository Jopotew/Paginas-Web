import type { MetadataRoute } from "next";
import { products, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.siteUrl;
  return [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/tienda`, changeFrequency: "daily", priority: 0.9 },
    ...site.categories.map((c) => ({ url: `${base}/tienda/${c.slug}`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/producto/${p.slug}`, lastModified: p.createdAt, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${base}/ayuda`, changeFrequency: "monthly", priority: 0.3 },
  ];
}
