"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Publication } from "@/lib/types";
import { focusAreas, publicationTypes } from "@/lib/site";
import { PublicationRow } from "./PublicationCard";
import { IconSearch } from "./Icons";
import { EmptyState } from "./EmptyState";

export function ResearchLibrary({
  publications,
  initial,
}: {
  publications: Publication[];
  initial: { q?: string; category?: string; type?: string; sort?: string };
}) {
  const [q, setQ] = useState(initial.q ?? "");
  const [category, setCategory] = useState(initial.category ?? "");
  const [type, setType] = useState(initial.type ?? "");
  const [sort, setSort] = useState(initial.sort === "oldest" ? "oldest" : "newest");

  // Keep the URL shareable without triggering a navigation.
  useEffect(() => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (type) params.set("type", type);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [q, category, type, sort]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = publications.filter((p) => {
      if (category && p.category !== category) return false;
      if (type && p.type !== type) return false;
      if (!terms.length) return true;
      const hay = [p.title, p.short_description, p.abstract, ...(p.tags ?? []), ...(p.authors ?? [])].join(" ").toLowerCase();
      return terms.every((t) => hay.includes(t));
    });
    return list.sort((a, b) => (sort === "oldest" ? a.published_at.localeCompare(b.published_at) : b.published_at.localeCompare(a.published_at)));
  }, [publications, q, category, type, sort]);

  const countBy = (key: "category" | "type", val: string) => publications.filter((p) => p[key] === val).length;
  const filtersActive = Boolean(q || category || type);

  if (!publications.length) {
    return (
      <EmptyState
        title="The library is open — the first papers are on their way"
        actions={
          <>
            <Link href="/gurgaon-briefs" className="btn btn-outline btn-sm">About the Gurgaon briefs</Link>
            <Link href="/get-involved/team-member" className="btn btn-sm">Contribute research</Link>
          </>
        }
      >
        This is YPL&apos;s public, open-access repository. Every policy paper, research paper, brief and report will be published here with an abstract,
        citation details and a free PDF download — no account or payment required. No publications have been released yet.
      </EmptyState>
    );
  }

  return (
    <div className="library">
      <aside className="filters" aria-label="Filter publications">
        <div className="filter-group">
          <h2 id="f-topic">Research topic</h2>
          <ul aria-labelledby="f-topic">
            <li>
              <button type="button" className="filter-btn" aria-pressed={!category} onClick={() => setCategory("")}>
                All topics <span className="c">{publications.length}</span>
              </button>
            </li>
            {focusAreas.map((f) => (
              <li key={f.slug}>
                <button type="button" className="filter-btn" aria-pressed={category === f.slug} onClick={() => setCategory(category === f.slug ? "" : f.slug)}>
                  {f.title} <span className="c">{countBy("category", f.slug)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="filter-group">
          <h2 id="f-type">Publication type</h2>
          <ul aria-labelledby="f-type">
            <li>
              <button type="button" className="filter-btn" aria-pressed={!type} onClick={() => setType("")}>
                All types <span className="c">{publications.length}</span>
              </button>
            </li>
            {publicationTypes.map((t) => (
              <li key={t.value}>
                <button type="button" className="filter-btn" aria-pressed={type === t.value} onClick={() => setType(type === t.value ? "" : t.value)}>
                  {t.plural} <span className="c">{countBy("type", t.value)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div>
        <div className="library-bar">
          <div className="search-input" role="search">
            <IconSearch />
            <label htmlFor="lib-q" className="sr-only">Search the library by title or keyword</label>
            <input id="lib-q" type="search" placeholder="Search by title, keyword or author" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <label className="select-inline">
            Sort
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>
        <p className="result-count" aria-live="polite">
          Showing {results.length} of {publications.length} publication{publications.length === 1 ? "" : "s"}
          {filtersActive && (
            <>
              {" · "}
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setCategory("");
                  setType("");
                }}
                style={{ background: "none", border: 0, color: "var(--teal)", cursor: "pointer", padding: 0, textDecoration: "underline" }}
              >
                Clear filters
              </button>
            </>
          )}
        </p>
        {results.length ? (
          <div>
            {results.map((p) => (
              <PublicationRow key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState title="No publications match these filters">Try a different keyword, or clear the filters to see the full library.</EmptyState>
          </div>
        )}
      </div>
    </div>
  );
}
