import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, SectionHead } from "@/components/PageHero";
import { BriefCard } from "@/components/PublicationCard";
import { EmptyState } from "@/components/EmptyState";
import { GurgaonMotif } from "@/components/HeroLattice";
import { IconArrow } from "@/components/Icons";
import { getGurgaonBriefs } from "@/lib/content";
import { org } from "@/lib/org";
import { gurgaonTopics } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mini Gurgaon Policy Briefs",
  description: org.gurgaonSeries.summary,
  alternates: { canonical: "/gurgaon-briefs" },
};

export const revalidate = 300;

export default async function GurgaonBriefsPage() {
  const briefs = await getGurgaonBriefs();
  const s = org.gurgaonSeries;
  return (
    <>
      <header className="gg-hero on-dark" style={{ padding: "clamp(3.5rem,8vw,6.5rem) 0" }}>
        <div className="container gg-feature">
          <div>
            <Breadcrumbs items={[{ label: "Gurgaon Briefs" }]} />
            <span className="gg-mark">
              <span className="box">GG</span> A Youth Policy Lab series
            </span>
            <h1 className="h1 mt-3" style={{ maxWidth: "14ch" }}>
              Mini Gurgaon Policy Briefs
            </h1>
            <p className="lede mt-3" style={{ color: "#c8d1dc", maxWidth: "52ch" }}>{s.summary}</p>
            <div className="btn-row mt-4">
              <a href="#archive" className="btn btn-light">Read the briefs <IconArrow /></a>
              <Link href="/get-involved/team-member" className="btn btn-ghost-light">Write for the series</Link>
            </div>
          </div>
          <div className="gg-cover" aria-hidden="true">
            <div className="gg-top"><span>Youth Policy Lab</span><span>Series</span></div>
            <div className="gg-title">Mini <em>Gurgaon</em><br />Policy Briefs</div>
            <p style={{ fontSize: "0.82rem", color: "var(--slate)", marginTop: "0.9rem" }}>Concise, local, evidence-based.</p>
            <GurgaonMotif />
            <div className="gg-foot">Gurugram · Haryana · 4–8 pp</div>
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="about-series">
        <div className="container split">
          <div>
            <p className="eyebrow">About the series</p>
            <h2 id="about-series" className="h2 mt-2">Local problems, examined carefully.</h2>
          </div>
          <div>
            <div className="prose" style={{ fontSize: "1.12rem" }}>
              {s.detail.map((d, i) => <p key={i}>{d}</p>)}
            </div>
            <dl className="def-list mt-3">
              <div>
                <dt>Format</dt>
                <dd><ul>{s.format.map((f) => <li key={f}>{f}</li>)}</ul></dd>
              </div>
              <div>
                <dt>Geography</dt>
                <dd>Gurugram (Gurgaon) and the surrounding region of Haryana and the National Capital Region.</dd>
              </div>
              <div>
                <dt>Audience</dt>
                <dd>Residents, resident welfare associations, journalists, civic organisations, researchers and public officials.</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="section section-tint" id="archive" aria-labelledby="archive-title">
        <div className="container">
          <SectionHead eyebrow="Archive" title={<span id="archive-title">All briefs</span>}>
            <p>{briefs.length ? `${briefs.length} brief${briefs.length === 1 ? "" : "s"} published, newest issue first.` : "Issues will be listed here as they are published."}</p>
          </SectionHead>
          {briefs.length ? (
            <div>{briefs.map((b) => <BriefCard key={b.slug} p={b} />)}</div>
          ) : (
            <EmptyState
              title="Issue No. 01 is in development"
              actions={<Link href="/contact" className="btn btn-outline btn-sm">Suggest a local issue</Link>}
            >
              The series has not published its first brief yet. Each issue will appear here with its summary, key findings, recommendations and a
              free PDF.
            </EmptyState>
          )}
        </div>
      </section>

      <section className="section section-dark on-dark" aria-labelledby="topics">
        <div className="container split">
          <div>
            <p className="eyebrow">Potential topics</p>
            <h2 id="topics" className="h2 mt-2">Issues the series is set up to examine</h2>
            <p className="muted mt-2">These are areas under consideration, not completed research. Have an issue we should look at? <Link href="/contact" style={{ color: "#9fd0cc" }}>Tell us.</Link></p>
          </div>
          <ul className="topic-list" style={{ alignSelf: "start" }}>
            {gurgaonTopics.map((t, i) => (
              <li key={t.slug}><span>{String(i + 1).padStart(2, "0")}</span>{t.title}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
