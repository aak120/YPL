import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { IconSearch } from "@/components/Icons";
import { searchSite } from "@/lib/search";

export const metadata: Metadata = { title: "Search", description: "Search Youth Policy Lab research, briefs, initiatives and topics.", robots: { index: false } };

type SP = Promise<Record<string, string | string[] | undefined>>;

function highlight(text: string, q: string) {
  const terms = q.split(/\s+/).filter((t) => t.length > 1).map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!terms.length) return text;
  const re = new RegExp(`(${terms.join("|")})`, "gi");
  return text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
}

export default async function SearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q)?.slice(0, 120).trim() ?? "";
  const results = q ? await searchSite(q) : [];
  return (
    <>
      <PageHero eyebrow="Search" title={q ? <>Results for “{q}”</> : "Search the site"} crumbs={[{ label: "Search" }]}>
        <form action="/search" method="get" role="search" className="mt-4" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", maxWidth: 720 }}>
          <div className="search-input">
            <IconSearch />
            <label htmlFor="q" className="sr-only">Search query</label>
            <input id="q" name="q" type="search" defaultValue={q} placeholder="Publications, briefs, initiatives, topics…" />
          </div>
          <button className="btn" type="submit">Search</button>
        </form>
      </PageHero>
      <section className="section tight">
        <div className="container narrow">
          {q && (
            <p className="meta" aria-live="polite">
              {results.length} result{results.length === 1 ? "" : "s"}
            </p>
          )}
          {q && results.length === 0 && (
            <p className="lede mt-2">
              Nothing matched. Try a broader term, or browse the <Link href="/research">research library</Link> and{" "}
              <Link href="/initiatives">initiatives</Link>.
            </p>
          )}
          <ul className="search-results">
            {results.map((r) => (
              <li key={r.url}>
                <Link href={r.url}>
                  <span className="meta" style={{ color: "var(--teal)" }}>{r.kind}</span>
                  <h2>{highlight(r.title, q)}</h2>
                  <p>{highlight(r.excerpt, q)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
