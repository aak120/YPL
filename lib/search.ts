import "server-only";
import { getAllPublications, getInitiatives } from "./content";
import { focusAreas, focusAreaTitle, gurgaonTopics, initiativeKindLabel, publicationTypeLabel } from "./site";

export interface SearchHit {
  title: string;
  url: string;
  kind: string;
  excerpt: string;
  score: number;
}

interface Doc {
  title: string;
  url: string;
  kind: string;
  excerpt: string;
  tags: string;
  body: string;
}

const staticPages: Doc[] = [
  { title: "About Youth Policy Lab", url: "/about", kind: "Page", excerpt: "Our mission, vision, approach and principles.", tags: "mission vision approach principles about", body: "youth-led policy research initiative think tank evidence rigour" },
  { title: "Get Involved", url: "/get-involved", kind: "Page", excerpt: "Apply to join the team, the board or the advisory network.", tags: "join apply recruitment volunteer careers", body: "team member board advisor application" },
  { title: "Join the Team", url: "/get-involved/team-member", kind: "Application", excerpt: "Research, policy analysis, data, editorial, communications, outreach and events roles.", tags: "team member join apply research editorial data", body: "" },
  { title: "Board Membership", url: "/get-involved/board", kind: "Application", excerpt: "A governance and leadership role shaping YPL's development.", tags: "board governance leadership apply", body: "" },
  { title: "Advisory Network", url: "/get-involved/advisor", kind: "Application", excerpt: "Review research, mentor researchers and contribute expertise.", tags: "advisor advisory mentor review expertise apply", body: "" },
  { title: "Our Team", url: "/team", kind: "Page", excerpt: "The people behind YPL's research.", tags: "team people leadership board advisors", body: "" },
  { title: "Contact", url: "/contact", kind: "Page", excerpt: "General, research collaboration, partnership and advisor enquiries.", tags: "contact email enquiry partnership collaboration", body: "" },
  { title: "Mini Gurgaon Policy Briefs", url: "/gurgaon-briefs", kind: "Series", excerpt: "Concise, evidence-based analysis of policy issues affecting Gurugram.", tags: "gurgaon gurugram local briefs haryana", body: gurgaonTopics.map((t) => t.title).join(" ") },
  { title: "Privacy Notice", url: "/privacy", kind: "Page", excerpt: "How YPL handles application and contact data.", tags: "privacy data protection", body: "" },
];

async function buildDocs(): Promise<Doc[]> {
  const [pubs, inits] = await Promise.all([getAllPublications(), getInitiatives()]);
  const docs: Doc[] = [];
  for (const p of pubs) {
    const isBrief = p.type === "gurgaon-brief";
    docs.push({
      title: p.title,
      url: isBrief ? `/gurgaon-briefs/${p.slug}` : `/research/${p.slug}`,
      kind: isBrief && p.issue_number ? `Gurgaon Brief · No. ${p.issue_number}` : publicationTypeLabel(p.type),
      excerpt: p.short_description,
      tags: [...(p.tags ?? []), focusAreaTitle(p.category), ...(p.authors ?? [])].join(" "),
      body: [p.abstract, p.executive_summary, ...(p.key_findings ?? []), ...(p.recommendations ?? [])].filter(Boolean).join(" "),
    });
  }
  for (const i of inits) {
    docs.push({
      title: i.title,
      url: `/initiatives/${i.slug}`,
      kind: initiativeKindLabel(i.kind),
      excerpt: i.summary,
      tags: [i.kind, i.status, i.location ?? ""].join(" "),
      body: [i.description, i.outcomes].filter(Boolean).join(" "),
    });
  }
  for (const f of focusAreas) {
    docs.push({
      title: f.title,
      url: `/research?category=${f.slug}`,
      kind: "Focus Area",
      excerpt: f.description,
      tags: f.slug.replace(/-/g, " "),
      body: "",
    });
  }
  return [...docs, ...staticPages];
}

export async function searchSite(query: string, limit = 50): Promise<SearchHit[]> {
  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}-]/gu, ""))
    .filter((t) => t.length > 1)
    .slice(0, 8);
  if (!terms.length) return [];
  const docs = await buildDocs();
  const hits: SearchHit[] = [];
  for (const d of docs) {
    const title = d.title.toLowerCase();
    const tags = d.tags.toLowerCase();
    const excerpt = d.excerpt.toLowerCase();
    const body = d.body.toLowerCase();
    let score = 0;
    let allMatch = true;
    for (const t of terms) {
      let s = 0;
      if (title.includes(t)) s += 6;
      if (tags.includes(t)) s += 3;
      if (excerpt.includes(t)) s += 2;
      if (body.includes(t)) s += 1;
      if (s === 0) {
        allMatch = false;
        break;
      }
      score += s;
    }
    if (allMatch) hits.push({ title: d.title, url: d.url, kind: d.kind, excerpt: d.excerpt, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
