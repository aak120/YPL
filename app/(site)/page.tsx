import Link from "next/link";
import { HeroLattice, GurgaonMotif } from "@/components/HeroLattice";
import { IconArrow } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { SectionHead } from "@/components/PageHero";
import { EmptyState } from "@/components/EmptyState";
import { BriefCard, PublicationCard } from "@/components/PublicationCard";
import { EventCard } from "@/components/EventCard";
import { getAllPublications, getFeaturedPublications, getGurgaonBriefs, getInitiatives } from "@/lib/content";
import { org } from "@/lib/org";
import { pathways } from "@/lib/pathways";
import { focusAreas, gurgaonTopics } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [featured, all, briefs, initiatives] = await Promise.all([
    getFeaturedPublications(3),
    getAllPublications(),
    getGurgaonBriefs(),
    getInitiatives(),
  ]);
  const activeInitiatives = initiatives.filter((i) => i.status !== "completed").slice(0, 3);
  const shownInitiatives = activeInitiatives.length ? activeInitiatives : initiatives.slice(0, 3);
  const countFor = (slug: string) => all.filter((p) => p.category === slug).length;

  return (
    <>
      {/* A — Hero */}
      <section className="home-hero" aria-labelledby="hero-title">
        <div className="container">
          <div className="home-hero-grid">
            <div>
              <p className="eyebrow">Youth Policy Lab · Policy Research Initiative</p>
              <h1 id="hero-title" className="display">
                Ideas into Policy.
                <br />
                <em>Research into Impact.</em>
              </h1>
              <p className="lede">
                Youth Policy Lab is a youth-led research initiative exploring complex policy challenges and developing evidence-based solutions for
                a changing world.
              </p>
              <div className="btn-row">
                <Link href="/research" className="btn">
                  Explore Our Research <IconArrow />
                </Link>
                <Link href="/about" className="btn btn-outline">
                  About YPL
                </Link>
              </div>
            </div>
            <HeroLattice />
          </div>
          <div className="hero-strip">
            <div>
              <span className="num">01 — Research</span>
              <h2>Rigorous, sourced analysis</h2>
              <p>Policy papers, research papers and briefs built on evidence we can show.</p>
            </div>
            <div>
              <span className="num">02 — Recommend</span>
              <h2>Practical options</h2>
              <p>Every piece ends in specific, actionable recommendations.</p>
            </div>
            <div>
              <span className="num">03 — Open access</span>
              <h2>Free to everyone</h2>
              <p>No paywall, no login. All publications can be read and downloaded.</p>
            </div>
          </div>
        </div>
      </section>

      {/* B — Mission preview */}
      <section className="section" aria-labelledby="mission-title">
        <div className="container split">
          <Reveal>
            <p className="eyebrow">Who we are</p>
            <h2 id="mission-title" className="h2 mt-2">
              A research institution, run by young people.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="lede" style={{ marginTop: 0 }}>{org.oneLiner}</p>
            <div className="grid-2 mt-4">
              <div>
                <h3 className="h4">Why it exists</h3>
                <p className="muted mt-1">{org.why[1]}</p>
              </div>
              <div>
                <h3 className="h4">What it aims to do</h3>
                <p className="muted mt-1">{org.mission}</p>
              </div>
            </div>
            <Link href="/about" className="link-arrow mt-2">
              Read about our mission and approach <IconArrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* C — Featured research */}
      <section className="section section-tint" aria-labelledby="featured-title">
        <div className="container">
          <SectionHead eyebrow="Research & Publications" title={<span id="featured-title">Featured research</span>}>
            <p>
              Policy papers, research papers and briefs from the YPL library — free to read and download.{" "}
              <Link href="/research" className="link-arrow">
                Browse the library <IconArrow />
              </Link>
            </p>
          </SectionHead>
          {featured.length ? (
            <div className="grid-3">
              {featured.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <PublicationCard p={p} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Our first publications are in preparation"
              actions={
                <>
                  <Link href="/research" className="btn btn-outline btn-sm">Visit the research library</Link>
                  <Link href="/get-involved/team-member" className="btn btn-sm">Join the research team</Link>
                </>
              }
            >
              YPL&apos;s research library is live and open-access. Papers and briefs will appear here as soon as they complete internal review and are
              published — we won&apos;t fill this space with placeholders.
            </EmptyState>
          )}
        </div>
      </section>

      {/* D — Focus areas */}
      <section className="section section-dark on-dark" aria-labelledby="focus-title">
        <div className="container">
          <SectionHead eyebrow="Research focus areas" title={<span id="focus-title">The questions we work on</span>}>
            <p>Six themes guide what we study. They describe our areas of interest; the library shows what has actually been published in each.</p>
          </SectionHead>
          <div className="focus-grid">
            {focusAreas.map((f, i) => {
              const n = countFor(f.slug);
              return (
                <Link key={f.slug} href={`/research?category=${f.slug}`} className="focus-item">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{f.title}</h3>
                  <p>{f.description}</p>
                  <div className="count">{n ? `${n} publication${n === 1 ? "" : "s"}` : "No publications yet"}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* E — Gurgaon briefs */}
      <section className="section" aria-labelledby="gg-title">
        <div className="container gg-feature">
          <Reveal>
            <span className="gg-mark" style={{ color: "var(--gold)" }}>
              <span className="box" style={{ borderColor: "var(--gold)" }}>GG</span> A YPL publication series
            </span>
            <h2 id="gg-title" className="h2 mt-3">
              Mini Gurgaon Policy Briefs
            </h2>
            <p className="lede mt-2">{org.gurgaonSeries.summary}</p>
            <p className="muted">{org.gurgaonSeries.detail[1]}</p>
            {briefs.length > 0 ? (
              <div className="mt-3">
                {briefs.slice(0, 2).map((b) => (
                  <BriefCard key={b.slug} p={b} />
                ))}
              </div>
            ) : (
              <div className="light mt-3">
                <p className="meta">Topics the series is set up to examine</p>
                <ul className="topic-list mt-1">
                  {gurgaonTopics.slice(0, 6).map((t, i) => (
                    <li key={t.slug}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {t.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="btn-row mt-4">
              <Link href="/gurgaon-briefs" className="btn">
                Explore the briefs <IconArrow />
              </Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="gg-cover" aria-hidden="true">
              <div className="gg-top">
                <span>Youth Policy Lab</span>
                <span>{briefs[0]?.issue_number ? `No. ${String(briefs[0].issue_number).padStart(2, "0")}` : "Series"}</span>
              </div>
              <div className="gg-title">
                Mini <em>Gurgaon</em>
                <br />
                Policy Briefs
              </div>
              <p style={{ fontSize: "0.82rem", color: "var(--slate)", marginTop: "0.9rem" }}>Concise, local, evidence-based.</p>
              <GurgaonMotif />
              <div className="gg-foot">Gurugram · Haryana · 4–8 pp</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* F — Initiatives */}
      <section className="section section-tint" aria-labelledby="init-title">
        <div className="container">
          <SectionHead eyebrow="Initiatives & Events" title={<span id="init-title">What we&apos;re working on</span>}>
            <p>
              Research initiatives, roundtables, workshops and conferences.{" "}
              <Link href="/initiatives" className="link-arrow">
                All initiatives <IconArrow />
              </Link>
            </p>
          </SectionHead>
          {shownInitiatives.length ? (
            <div className="grid-3">
              {shownInitiatives.map((i, idx) => (
                <Reveal key={i.slug} delay={idx * 80}>
                  <EventCard i={i} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Initiatives and events will be announced here"
              actions={<Link href="/contact" className="btn btn-outline btn-sm">Propose a collaboration</Link>}
            >
              Upcoming roundtables, workshops and research projects will be listed with dates and registration details once confirmed.
            </EmptyState>
          )}
        </div>
      </section>

      {/* G — Get involved */}
      <section className="section section-dark on-dark" aria-labelledby="involve-title">
        <div className="container">
          <SectionHead eyebrow="Get Involved" title={<span id="involve-title">Do the research. Shape the institution.</span>}>
            <p>YPL is built by the people who join it. We recruit researchers and team members, board members, and advisors — each through its own pathway.</p>
          </SectionHead>
          <div className="grid-3">
            {pathways.map((p, i) => (
              <Reveal key={p.id} delay={i * 80}>
                <div className="pathway">
                  <span className="num">{String(i + 1).padStart(2, "0")} — Pathway</span>
                  <h3>{p.title}</h3>
                  <p>{p.short}</p>
                  <Link href={p.href} className="btn btn-ghost-light btn-sm mt-2">
                    Learn more &amp; apply <IconArrow />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
