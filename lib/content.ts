import "server-only";
import { cache } from "react";
import localPublications from "@/content/publications.json";
import localTeam from "@/content/team.json";
import localInitiatives from "@/content/initiatives.json";
import { getSupabase } from "./supabase";
import type { Initiative, Person, Publication } from "./types";

/**
 * Content comes from two places, merged together:
 *   1. Local JSON files in /content (edit + redeploy workflow)
 *   2. Supabase tables managed through the /admin dashboard
 * If an entry with the same slug exists in both, the Supabase version wins.
 */

const byDateDesc = (a: Publication, b: Publication) => (b.published_at || "").localeCompare(a.published_at || "");

async function fromSupabase<T>(table: string, filter?: (q: any) => any): Promise<T[]> {
  const sb = getSupabase();
  if (!sb) return [];
  try {
    let q = sb.from(table).select("*");
    if (filter) q = filter(q);
    const { data, error } = await q;
    if (error) {
      console.error(`[content] ${table}:`, error.message);
      return [];
    }
    return (data ?? []) as T[];
  } catch (e) {
    console.error(`[content] ${table}:`, e);
    return [];
  }
}

function normalisePublication(p: Publication): Publication {
  return {
    ...p,
    tags: p.tags ?? [],
    authors: p.authors ?? [],
    key_findings: p.key_findings ?? [],
    recommendations: p.recommendations ?? [],
    references: p.references ?? [],
    featured: Boolean(p.featured),
  };
}

function mergeBySlug<T extends { slug: string }>(local: T[], remote: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of local) map.set(item.slug, item);
  for (const item of remote) map.set(item.slug, item);
  return [...map.values()];
}

export const getAllPublications = cache(async (): Promise<Publication[]> => {
  const remote = await fromSupabase<Publication>("publications", (q) => q.eq("status", "published"));
  const local = (localPublications as Publication[]).filter((p) => p.status === "published");
  return mergeBySlug(local, remote).map(normalisePublication).sort(byDateDesc);
});

/** Everything except the Mini Gurgaon series. */
export const getLibraryPublications = cache(async () =>
  (await getAllPublications()).filter((p) => p.type !== "gurgaon-brief"),
);

export const getGurgaonBriefs = cache(async () =>
  (await getAllPublications())
    .filter((p) => p.type === "gurgaon-brief")
    .sort((a, b) => (b.issue_number ?? 0) - (a.issue_number ?? 0) || byDateDesc(a, b)),
);

export const getPublication = cache(async (slug: string) =>
  (await getAllPublications()).find((p) => p.slug === slug) ?? null,
);

export const getFeaturedPublications = cache(async (limit = 3) => {
  const all = await getAllPublications();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
});

export function relatedPublications(all: Publication[], current: Publication, limit = 3) {
  const tags = new Set(current.tags ?? []);
  return all
    .filter((p) => p.slug !== current.slug)
    .map((p) => ({
      p,
      score:
        (p.category === current.category ? 3 : 0) +
        (p.type === current.type ? 1 : 0) +
        (p.tags ?? []).filter((t) => tags.has(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.p, b.p))
    .slice(0, limit)
    .map((x) => x.p);
}

export const getTeam = cache(async (): Promise<Person[]> => {
  const remote = await fromSupabase<Person>("team_members", (q) => q.eq("visible", true));
  const local = (localTeam as Person[]).filter((p) => p.visible !== false);
  return [...local, ...remote].sort(
    (a, b) => (a.sort_order ?? 100) - (b.sort_order ?? 100) || a.name.localeCompare(b.name),
  );
});

const statusOrder = { ongoing: 0, upcoming: 1, completed: 2 } as const;

export const getInitiatives = cache(async (): Promise<Initiative[]> => {
  const remote = await fromSupabase<Initiative>("initiatives", (q) => q.eq("published", true));
  const local = (localInitiatives as Initiative[]).filter((i) => i.published !== false);
  return mergeBySlug(local, remote)
    .map((i) => ({ ...i, related_publications: i.related_publications ?? [] }))
    .sort((a, b) => {
      const s = statusOrder[a.status] - statusOrder[b.status];
      if (s !== 0) return s;
      // upcoming: soonest first; others: most recent first
      const da = a.start_date ?? "";
      const db = b.start_date ?? "";
      return a.status === "upcoming" ? da.localeCompare(db) : db.localeCompare(da);
    });
});

export const getInitiative = cache(async (slug: string) =>
  (await getInitiatives()).find((i) => i.slug === slug) ?? null,
);
