import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Glyph, IconArrow } from "@/components/Icons";
import { org } from "@/lib/org";
import { focusAreas } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: "Youth Policy Lab's mission, vision, research approach and principles.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About YPL"
        title="Serious research, led by young people."
        lede={org.oneLiner}
        crumbs={[{ label: "About" }]}
      />

      <section className="section" aria-labelledby="mission">
        <div className="container">
          <div className="grid-2" style={{ gap: "clamp(2.5rem, 6vw, 6rem)" }}>
            <Reveal>
              <p className="eyebrow">Our Mission</p>
              <h2 id="mission" className="h3 mt-2" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", lineHeight: 1.25 }}>
                {org.mission}
              </h2>
            </Reveal>
            <Reveal delay={100}>
              <p className="eyebrow">Our Vision</p>
              <h2 className="h3 mt-2" style={{ fontSize: "clamp(1.6rem, 2.6vw, 2.2rem)", lineHeight: 1.25 }}>
                {org.vision}
              </h2>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section section-tint" aria-labelledby="why">
        <div className="container split">
          <div className="sticky-col">
            <p className="eyebrow">Why YPL</p>
            <h2 id="why" className="h2 mt-2">The gap between young people and policy research.</h2>
          </div>
          <div className="prose" style={{ fontSize: "1.15rem" }}>
            {org.why.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              Our work currently spans six focus areas —{" "}
              {focusAreas.map((f, i) => (
                <span key={f.slug}>
                  {i > 0 && (i === focusAreas.length - 1 ? " and " : ", ")}
                  {f.title.toLowerCase()}
                </span>
              ))}{" "}
              — alongside a local series, the <Link href="/gurgaon-briefs">Mini Gurgaon Policy Briefs</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="approach">
        <div className="container">
          <SectionHead eyebrow="Our Approach" title={<span id="approach">From question to recommendation</span>}>
            <p>Every YPL project follows the same seven-stage process. Not every project needs primary data — but every project shows its evidence.</p>
          </SectionHead>
          <ol className="process">
            {org.approach.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-dark on-dark" aria-labelledby="principles">
        <div className="container">
          <SectionHead eyebrow="Our Principles" title={<span id="principles">What we hold ourselves to</span>} />
          <div className="principles">
            {org.principles.map((p, i) => (
              <div className="principle" key={p.title}>
                <Glyph kind={i} />
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
            <div className="principle" style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <p style={{ color: "#cdd5e0" }}>Read the work these principles produce.</p>
              <Link href="/research" className="link-arrow mt-2">
                Research library <IconArrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section tight">
        <div className="container flex-between">
          <h2 className="h3" style={{ maxWidth: "28ch" }}>Want to help build YPL&apos;s research?</h2>
          <div className="btn-row">
            <Link href="/get-involved" className="btn">Get involved <IconArrow /></Link>
            <Link href="/team" className="btn btn-outline">Meet the team</Link>
          </div>
        </div>
      </section>
    </>
  );
}
