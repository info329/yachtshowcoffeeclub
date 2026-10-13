import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about", "/events", "/coffee", "/partners", "/invitation", "/membership", "/privacy"].map((p) => ({
    url: `${site.url}${p || "/"}`,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.7,
  }));
}
