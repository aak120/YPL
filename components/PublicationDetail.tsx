/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { focusAreaTitle, publicationTypeLabel, site } from "@/lib/site";
import type { Publication } from "@/lib/types";
import { formatDate, joinAuthors, year } from "@/lib/utils";
import { Breadcrumbs } from "./PageHero";
import { IconDownload } from "./Icons";
import { CopyButton, ShareButtons } from "./ShareTools";
import { PublicationCard, publicationHref } from "./PublicationCard";

export function citationFor(p: Publication) {
  const authors = p.authors?.length ? joinAuthors(p.authors) : "Youth Policy Lab";
  const series = p.type === "gurgaon-brief" && p.issue_number ? `Mini Gurgaon Policy Brief No. ${p.issue_number}` : publicationTypeLabel(p.type);
  return `${authors} (${year(p.published_at)}). ${p.title}. ${series}. Youth Policy Lab. ${site.url}${publicationHref(p)}`;
}

export function PublicationDetail({ p, related, series }: { p: Publication; related: Publication[]; series?: boolean }) {
  const url = `${site.url}${publicationHref(p)}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: p.title,
    abstract: p.abstract,
    datePublished: p.published_at,
    author: (p.authors ?? []).map((name) => ({ "@type": "Person", name })),
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    keywords: (p.tags ?? []).join(", "),
    isAccessibleForFree: true,
    url,
    ...(p.pdf_url ? { encoding: { "@type": "MediaObject", contentUrl: p.pdf_url.startsWith("http") ? p.pdf_url : site.url + p.pdf_url, encodingFormat: "application/pdf" } } : {}),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <header className={`article-head ${series ? "gg-hero on-dark" : ""}`} style={series ? { paddingBottom: "clamp(3rem,6vw,4.5rem)" } : undefined}>
        <div className="container">
          <Breadcrumbs
            items={series ? [{ label: "Gurgaon Briefs", href: "/gurgaon-briefs" }, { label: p.issue_number ? `No. ${p.issue_number}` : p.title }] : [{ label: "Research", href: "/research" }, { label: publicationTypeLabel(p.type) }]}
          />
          {series ? (
            <span className="gg-mark">
              <span className="box">{p.issue_number ? String(p.issue_number).padStart(2, "0") : "GG"}</span>
              Mini Gurgaon Policy Brief{p.issue_number ? ` · No. ${p.issue_number}` : ""}
            </span>
          ) : (
            <p className="eyebrow">{publicationTypeLabel(p.type)} · {focusAreaTitle(p.category)}</p>
          )}
          <h1 className="h1">{p.title}</h1>
          <p className="lede" style={series ? { color: "#c8d1dc" } : undefined}>{p.short_description}</p>
          <dl className="byline" style={series ? { borderColor: "rgba(255,255,255,.15)" } : undefined}>
            <div>
              <dt style={series ? { color: "#9aa7b8" } : undefined}>Author{(p.authors?.length ?? 0) > 1 ? "s" : ""}</dt>
              <dd style={series ? { color: "#fff" } : undefined}>{p.authors?.length ? joinAuthors(p.authors) : "Youth Policy Lab"}</dd>
            </div>
            <div>
              <dt style={series ? { color: "#9aa7b8" } : undefined}>Published</dt>
              <dd style={series ? { color: "#fff" } : undefined}><time dateTime={p.published_at}>{formatDate(p.published_at)}</time></dd>
            </div>
            <div>
              <dt style={series ? { color: "#9aa7b8" } : undefined}>Topic</dt>
              <dd style={series ? { color: "#fff" } : undefined}>{series && p.tags?.[0] ? p.tags[0] : focusAreaTitle(p.category)}</dd>
            </div>
            {p.page_count ? (
              <div>
                <dt style={series ? { color: "#9aa7b8" } : undefined}>Length</dt>
                <dd style={series ? { color: "#fff" } : undefined}>{p.page_count} pages</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <div className={`container article-layout ${series ? "mt-5" : ""}`}>
        <div className="article-body">
          {p.cover_image_url && <img className="cover-img" src={p.cover_image_url} alt={`Cover of ${p.title}`} />}
          <section aria-labelledby="abstract">
            <h2 id="abstract" className="sec">Abstract</h2>
            <div className="prose">
              {p.abstract.split(/\n{2,}/).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </section>
          {p.executive_summary && (
            <section aria-labelledby="exec">
              <h2 id="exec" className="sec">Executive summary</h2>
              <div className="prose">
                {p.executive_summary.split(/\n{2,}/).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>
          )}
          {p.key_findings && p.key_findings.length > 0 && (
            <section aria-labelledby="findings">
              <h2 id="findings" className="sec">Key findings</h2>
              <ol className={`numbered ${series ? "gold" : ""}`}>
                {p.key_findings.map((f, i) => <li key={i}>{f}</li>)}
              </ol>
            </section>
          )}
          {p.recommendations && p.recommendations.length > 0 && (
            <section aria-labelledby="recs">
              <h2 id="recs" className="sec">Policy recommendations</h2>
              <ol className={`numbered ${series ? "gold" : ""}`}>
                {p.recommendations.map((f, i) => <li key={i}>{f}</li>)}
              </ol>
            </section>
          )}
          {p.references && p.references.length > 0 && (
            <section aria-labelledby="refs">
              <h2 id="refs" className="sec">References</h2>
              <ol className="references">
                {p.references.map((r, i) => <li key={i}>{r}</li>)}
              </ol>
            </section>
          )}
          {p.tags && p.tags.length > 0 && (
            <section aria-label="Keywords">
              <div className="tags">
                {p.tags.map((t) => (
                  <Link key={t} className="tag" href={`/search?q=${encodeURIComponent(t)}`}>{t}</Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="sticky-col" style={{ display: "grid", gap: "1.25rem" }}>
          <div className="aside-box">
            <h2>Full text</h2>
            {p.pdf_url ? (
              <>
                <a className="btn btn-accent" href={p.pdf_url} download target="_blank" rel="noopener">
                  <IconDownload /> Download PDF
                </a>
                <p className="help mb-0">Free and open access{p.page_count ? ` · ${p.page_count} pages` : ""}.</p>
              </>
            ) : (
              <p className="help mb-0">A downloadable PDF is not yet available for this publication.</p>
            )}
          </div>
          <div className="aside-box">
            <h2>Cite this</h2>
            <p className="cite-box mb-0">{citationFor(p)}</p>
            <CopyButton text={citationFor(p)} label="Copy citation" />
          </div>
          <div className="aside-box">
            <h2>Share</h2>
            <ShareButtons url={url} title={p.title} />
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="section section-tint" aria-labelledby="related">
          <div className="container">
            <h2 id="related" className="h2" style={{ marginBottom: "2.5rem" }}>Related publications</h2>
            <div className="grid-3">
              {related.map((r) => <PublicationCard key={r.slug} p={r} />)}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
