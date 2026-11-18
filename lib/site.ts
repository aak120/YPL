import type { InitiativeKind, InitiativeStatus, PublicationType, TeamSection } from "./types";

/**
 * Site-wide settings. Edit this file to change contact details, social links,
 * research focus areas and navigation. Leave a value empty ("") to hide it.
 */
export const site = {
  name: "Youth Policy Lab",
  shortName: "YPL",
  tagline: "Ideas into Policy. Research into Impact.",
  description:
    "Youth Policy Lab is a youth-led research initiative exploring complex policy challenges and developing evidence-based solutions for a changing world.",
  url: (process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  contact: {
    // TODO: add the organisation's public inbox, e.g. "contact@youthpolicylab.org"
    email: "",
    location: "Gurugram, Haryana, India",
  },
  // Add full profile URLs to show icons in the footer and contact page.
  social: {
    linkedin: "",
    instagram: "",
    x: "",
    substack: "",
  } as Record<string, string>,
};

export interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Research",
    href: "/research",
    children: [
      { label: "Research Library", href: "/research", description: "Every YPL paper, brief and report, free to read." },
      { label: "Mini Gurgaon Policy Briefs", href: "/gurgaon-briefs", description: "Concise local analysis on Gurugram." },
      { label: "Focus Areas", href: "/research#focus-areas", description: "The policy themes we work on." },
    ],
  },
  { label: "Gurgaon Briefs", href: "/gurgaon-briefs" },
  { label: "Initiatives & Events", href: "/initiatives" },
  { label: "Our Team", href: "/team" },
  {
    label: "Get Involved",
    href: "/get-involved",
    children: [
      { label: "Join the Team", href: "/get-involved/team-member", description: "Research, editorial, data and outreach roles." },
      { label: "Board Membership", href: "/get-involved/board", description: "Governance and organisational leadership." },
      { label: "Advisory Network", href: "/get-involved/advisor", description: "Review, mentor and lend expertise." },
      { label: "Contact", href: "/contact", description: "General, research and partnership enquiries." },
    ],
  },
];

export interface FocusArea {
  slug: string;
  title: string;
  description: string;
}

/**
 * Research themes. These describe areas of interest — they do not claim
 * that YPL has published work in each one. The library shows real counts.
 */
export const focusAreas: FocusArea[] = [
  {
    slug: "economics-development",
    title: "Economics & Development",
    description: "Growth, employment, public finance and the distributional effects of economic policy.",
  },
  {
    slug: "governance-public-policy",
    title: "Governance & Public Policy",
    description: "Institutions, accountability, regulation and how public decisions are made and delivered.",
  },
  {
    slug: "technology-society",
    title: "Technology & Society",
    description: "Digital public infrastructure, AI, data governance and the social effects of technology.",
  },
  {
    slug: "urban-affairs",
    title: "Urban Affairs",
    description: "Mobility, housing, land use and services in fast-growing cities.",
  },
  {
    slug: "climate-sustainability",
    title: "Climate & Sustainability",
    description: "Adaptation, resilience, energy transition and environmental regulation.",
  },
  {
    slug: "international-relations",
    title: "International Relations",
    description: "Foreign policy, trade, multilateral institutions and global public goods.",
  },
];

export const focusAreaTitle = (slug: string) =>
  focusAreas.find((f) => f.slug === slug)?.title ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export const publicationTypes: { value: PublicationType; label: string; plural: string }[] = [
  { value: "policy-paper", label: "Policy Paper", plural: "Policy Papers" },
  { value: "research-paper", label: "Research Paper", plural: "Research Papers" },
  { value: "policy-brief", label: "Policy Brief", plural: "Policy Briefs" },
  { value: "gurgaon-brief", label: "Mini Gurgaon Policy Brief", plural: "Mini Gurgaon Policy Briefs" },
  { value: "report", label: "Report", plural: "Reports" },
  { value: "working-paper", label: "Working Paper", plural: "Working Papers" },
  { value: "other", label: "Publication", plural: "Other Publications" },
];

export const publicationTypeLabel = (t: string) => publicationTypes.find((p) => p.value === t)?.label ?? "Publication";

/** Topics for the Mini Gurgaon Policy Briefs series (potential topics, not completed work). */
export const gurgaonTopics = [
  { slug: "mobility", title: "Urban mobility & congestion" },
  { slug: "water", title: "Water security" },
  { slug: "heat", title: "Urban heat & climate resilience" },
  { slug: "infrastructure", title: "Public infrastructure" },
  { slug: "inequality", title: "Urban inequality" },
  { slug: "services", title: "Public service delivery" },
  { slug: "environment", title: "Environmental challenges" },
];

export const teamSections: { value: TeamSection; label: string; description: string }[] = [
  { value: "leadership", label: "Leadership", description: "Responsible for YPL's direction, research agenda and operations." },
  { value: "board", label: "Board", description: "Governance, oversight and long-term organisational development." },
  { value: "department-heads", label: "Department Heads", description: "Leads for research, editorial, data, communications and outreach." },
  { value: "research", label: "Research Team", description: "Researchers and analysts producing YPL's papers and briefs." },
  { value: "advisors", label: "Advisors", description: "Practitioners and scholars who review work and mentor the team." },
];

export const initiativeKinds: { value: InitiativeKind; label: string }[] = [
  { value: "research-initiative", label: "Research Initiative" },
  { value: "conference", label: "Conference" },
  { value: "symposium", label: "Symposium" },
  { value: "roundtable", label: "Roundtable" },
  { value: "survey", label: "Survey" },
  { value: "workshop", label: "Workshop" },
  { value: "partnership", label: "Partnership" },
  { value: "special-project", label: "Special Project" },
  { value: "event", label: "Event" },
];
export const initiativeKindLabel = (k: string) => initiativeKinds.find((i) => i.value === k)?.label ?? "Initiative";

export const initiativeStatuses: { value: InitiativeStatus; label: string }[] = [
  { value: "upcoming", label: "Upcoming" },
  { value: "ongoing", label: "Ongoing" },
  { value: "completed", label: "Completed" },
];
