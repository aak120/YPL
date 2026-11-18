import "server-only";
import { getAllPublications, getInitiatives, getTeam } from "./content";
import { org } from "./org";
import { pathways } from "./pathways";
import { focusAreas, focusAreaTitle, gurgaonTopics, initiativeKindLabel, publicationTypeLabel, site, teamSections } from "./site";
import { formatDate, joinAuthors } from "./utils";

/**
 * Builds the plain-text knowledge base the AI assistant is grounded in.
 * Everything here comes from the site's own content — nothing else.
 */
export async function buildKnowledgeBase() {
  const [pubs, initiatives, team] = await Promise.all([getAllPublications(), getInitiatives(), getTeam()]);
  const L: string[] = [];

  L.push("# ABOUT YOUTH POLICY LAB", org.oneLiner, "", `Mission: ${org.mission}`, `Vision: ${org.vision}`, "", "Why YPL exists:", ...org.why.map((w) => `- ${w}`));
  L.push("", "Research approach:", ...org.approach.map((a, i) => `${i + 1}. ${a.title}: ${a.text}`));
  L.push("", "Principles:", ...org.principles.map((p) => `- ${p.title}: ${p.text}`));
  L.push("", `Contact: use the contact form at ${site.url}/contact${site.contact.email ? ` or email ${site.contact.email}` : ""}. Based in ${site.contact.location}.`);

  L.push("", "# RESEARCH FOCUS AREAS (themes of interest; not a claim of published work in each)", ...focusAreas.map((f) => `- ${f.title}: ${f.description}`));

  L.push("", `# ${org.gurgaonSeries.name.toUpperCase()}`, org.gurgaonSeries.summary, ...org.gurgaonSeries.detail, "Format:", ...org.gurgaonSeries.format.map((f) => `- ${f}`));
  L.push("Potential topics the series may cover (not completed work): " + gurgaonTopics.map((t) => t.title).join("; ") + ".");
  L.push(`Series page: ${site.url}/gurgaon-briefs`);

  L.push("", `# PUBLISHED RESEARCH (${pubs.length} item${pubs.length === 1 ? "" : "s"})`);
  if (!pubs.length) {
    L.push("YPL has not yet published any research on this website. The research library is ready and publications will be added as they are completed.");
  }
  for (const p of pubs) {
    const url = `${site.url}${p.type === "gurgaon-brief" ? "/gurgaon-briefs/" : "/research/"}${p.slug}`;
    L.push(
      "",
      `## ${p.title}`,
      `Type: ${publicationTypeLabel(p.type)}${p.issue_number ? ` (No. ${p.issue_number})` : ""} | Topic: ${focusAreaTitle(p.category)} | Published: ${formatDate(p.published_at)}`,
      p.authors?.length ? `Authors: ${joinAuthors(p.authors)}` : "Authors: not listed",
      `URL: ${url}`,
      p.pdf_url ? `PDF: ${p.pdf_url.startsWith("http") ? p.pdf_url : site.url + p.pdf_url}` : "PDF: not available",
      `Summary: ${p.short_description}`,
      `Abstract: ${p.abstract}`,
    );
    if (p.executive_summary) L.push(`Executive summary: ${p.executive_summary}`);
    if (p.key_findings?.length) L.push("Key findings:", ...p.key_findings.map((k) => `- ${k}`));
    if (p.recommendations?.length) L.push("Recommendations:", ...p.recommendations.map((k) => `- ${k}`));
    if (p.tags?.length) L.push(`Tags: ${p.tags.join(", ")}`);
  }

  L.push("", `# INITIATIVES & EVENTS (${initiatives.length})`);
  if (!initiatives.length) L.push("No initiatives or events have been listed on the website yet.");
  for (const i of initiatives) {
    L.push(
      "",
      `## ${i.title}`,
      `Kind: ${initiativeKindLabel(i.kind)} | Status: ${i.status}${i.start_date ? ` | Date: ${formatDate(i.start_date)}${i.end_date ? ` to ${formatDate(i.end_date)}` : ""}` : ""}${i.location ? ` | Location: ${i.location}` : ""}`,
      `URL: ${site.url}/initiatives/${i.slug}`,
      i.summary,
    );
    if (i.description) L.push(i.description);
    if (i.registration_url) L.push(`Registration: ${i.registration_url}`);
    if (i.outcomes) L.push(`Outcomes: ${i.outcomes}`);
  }

  L.push("", `# TEAM (${team.length} public profiles)`);
  if (!team.length) L.push("No team profiles have been published on the website yet. Do not name any team members, founders, board members or advisors.");
  for (const s of teamSections) {
    const members = team.filter((m) => m.section === s.value);
    if (!members.length) continue;
    L.push(`${s.label}:`, ...members.map((m) => `- ${m.name}, ${m.role}${m.department ? ` (${m.department})` : ""}${m.bio ? `: ${m.bio}` : ""}`));
  }

  L.push("", "# GET INVOLVED", `Overview: ${site.url}/get-involved`);
  for (const p of pathways) {
    L.push(
      "",
      `## ${p.title} application — ${site.url}${p.href}`,
      p.intro,
      "Responsibilities:",
      ...p.responsibilities.map((r) => `- ${r}`),
      "Expectations:",
      ...p.expectations.map((r) => `- ${r}`),
      "Process:",
      ...p.process.map((r, i) => `${i + 1}. ${r}`),
    );
    if (p.note) L.push(p.note);
  }

  L.push("", "# OTHER PAGES", `Research library: ${site.url}/research`, `Team: ${site.url}/team`, `Initiatives: ${site.url}/initiatives`, `Contact: ${site.url}/contact`, `Privacy: ${site.url}/privacy`);
  return L.join("\n");
}
