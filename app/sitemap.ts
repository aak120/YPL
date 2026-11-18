import type { MetadataRoute } from "next";
import { getAllPublications, getInitiatives } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = ["", "/about", "/research", "/gurgaon-briefs", "/initiatives", "/team", "/get-involved", "/get-involved/team-member", "/get-involved/board", "/get-involved/advisor", "/contact", "/privacy", "/disclaimer"];
  const [pubs, inits] = await Promise.all([getAllPublications(), getInitiatives()]);
  return [
    ...statics.map((p) => ({ url: `${site.url}${p}` })),
    ...pubs.map((p) => ({ url: `${site.url}${p.type === "gurgaon-brief" ? "/gurgaon-briefs/" : "/research/"}${p.slug}`, lastModified: p.published_at })),
    ...inits.map((i) => ({ url: `${site.url}/initiatives/${i.slug}` })),
  ];
}
