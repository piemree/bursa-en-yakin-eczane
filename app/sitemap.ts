import type { MetadataRoute } from "next";
import { getAllStaticSlugs } from "@/lib/data";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bursa-en-yakin-eczane.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/en-yakin-nobetci-eczane"];
  const slugPages = getAllStaticSlugs().map((slug) => `/${slug}`);

  return [...staticPages, ...slugPages].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: path === "" ? 1 : path === "/en-yakin-nobetci-eczane" ? 0.95 : 0.8,
  }));
}
