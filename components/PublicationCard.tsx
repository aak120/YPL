import Link from "next/link";
import { focusAreaTitle, publicationTypeLabel } from "@/lib/site";
import type { Publication } from "@/lib/types";
import { formatDate, joinAuthors } from "@/lib/utils";

export const publicationHref = (p: Publication) =>
  p.type === "gurgaon-brief" ? `/gurgaon-briefs/${p.slug}` : `/research/${p.slug}`;

export function PublicationCard({ p }: { p: Publication }) {
  return (
    <article className="pub-card">
      <div className="pub-meta">
        <span className="meta type-tag">{publicationTypeLabel(p.type)}</span>
        <span className="meta">{focusAreaTitle(p.category)}</span>
      </div>
      <h3>
        <Link href={publicationHref(p)}>{p.title}</Link>
      </h3>
      <p>{p.short_description}</p>
      {p.authors && p.authors.length > 0 && <div className="authors">{joinAuthors(p.authors)}</div>}
      <div className="card-actions">
        <time className="meta" dateTime={p.published_at}>{formatDate(p.published_at)}</time>
        {p.pdf_url && (
          <a href={p.pdf_url} download target="_blank" rel="noopener">
            PDF ↓
          </a>
        )}
      </div>
    </article>
  );
}

export function PublicationRow({ p }: { p: Publication }) {
  return (
    <article className="pub-row">
      <div>
        <div className="meta" style={{ color: "var(--teal)" }}>{publicationTypeLabel(p.type)}</div>
        <time className="meta" dateTime={p.published_at} style={{ display: "block", marginTop: 6 }}>
          {formatDate(p.published_at, { month: "short", year: "numeric", day: "numeric" })}
        </time>
      </div>
      <div>
        <h3>
          <Link href={publicationHref(p)}>{p.title}</Link>
        </h3>
        <p>{p.short_description}</p>
        <div className="tags mt-2">
          <span className="tag teal">{focusAreaTitle(p.category)}</span>
          {(p.tags ?? []).slice(0, 4).map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        {p.authors && p.authors.length > 0 && (
          <div style={{ fontSize: "0.86rem", marginTop: "0.9rem", color: "var(--ink-2)" }}>{joinAuthors(p.authors)}</div>
        )}
      </div>
      <div className="row-actions">
        <Link href={publicationHref(p)}>Read abstract →</Link>
        {p.pdf_url && (
          <a href={p.pdf_url} download target="_blank" rel="noopener">
            Download PDF{p.page_count ? ` · ${p.page_count} pp` : ""}
          </a>
        )}
      </div>
    </article>
  );
}

export function BriefCard({ p }: { p: Publication }) {
  return (
    <article className="brief-card">
      <div className="issue">
        <small>No.</small>
        {p.issue_number ? String(p.issue_number).padStart(2, "0") : "—"}
      </div>
      <div>
        <div className="meta">
          <time dateTime={p.published_at}>{formatDate(p.published_at, { month: "long", year: "numeric" })}</time>
          {p.tags && p.tags[0] ? ` · ${p.tags[0]}` : ""}
        </div>
        <h3>
          <Link href={`/gurgaon-briefs/${p.slug}`}>{p.title}</Link>
        </h3>
        <p>{p.short_description}</p>
      </div>
    </article>
  );
}
