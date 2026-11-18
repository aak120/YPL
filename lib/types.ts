// Central content types. Local JSON files in /content and the Supabase
// tables in supabase/schema.sql both follow these shapes.

export type PublicationType =
  | "policy-paper"
  | "research-paper"
  | "policy-brief"
  | "gurgaon-brief"
  | "report"
  | "working-paper"
  | "other";

export type PublicationStatus = "draft" | "published";

export interface Publication {
  id?: string;
  slug: string;
  title: string;
  /** One or two sentences shown on cards. */
  short_description: string;
  abstract: string;
  executive_summary?: string | null;
  key_findings?: string[];
  recommendations?: string[];
  type: PublicationType;
  /** Research topic — one of the focus-area slugs in lib/site.ts */
  category: string;
  tags?: string[];
  authors?: string[];
  /** ISO date, e.g. 2026-03-14 */
  published_at: string;
  cover_image_url?: string | null;
  /** Absolute URL or a path under /public, e.g. /files/publications/my-paper.pdf */
  pdf_url?: string | null;
  page_count?: number | null;
  references?: string[];
  featured?: boolean;
  status: PublicationStatus;
  /** Mini Gurgaon Policy Briefs only */
  issue_number?: number | null;
}

export type TeamSection = "leadership" | "board" | "research" | "department-heads" | "advisors";

export interface Person {
  id?: string;
  name: string;
  role: string;
  section: TeamSection;
  department?: string | null;
  bio?: string | null;
  expertise?: string[];
  photo_url?: string | null;
  linkedin_url?: string | null;
  sort_order?: number;
  visible?: boolean;
}

export type InitiativeKind =
  | "research-initiative"
  | "conference"
  | "symposium"
  | "roundtable"
  | "survey"
  | "workshop"
  | "partnership"
  | "special-project"
  | "event";

export type InitiativeStatus = "upcoming" | "ongoing" | "completed";

export interface Initiative {
  id?: string;
  slug: string;
  title: string;
  kind: InitiativeKind;
  summary: string;
  description?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  location?: string | null;
  status: InitiativeStatus;
  related_publications?: string[];
  image_url?: string | null;
  registration_url?: string | null;
  outcomes?: string | null;
  published?: boolean;
}

export type Pathway = "team" | "board" | "advisor";
