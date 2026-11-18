import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHead } from "@/components/PageHero";
import { IconArrow } from "@/components/Icons";
import { Reveal } from "@/components/Reveal";
import { pathways } from "@/lib/pathways";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Join Youth Policy Lab as a team member, board member or advisor.",
  alternates: { canonical: "/get-involved" },
};

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        eyebrow="Get Involved"
        title="Three ways to contribute"
        lede="YPL recruits through three distinct pathways, each with its own responsibilities, expectations and application. Choose the one that matches how you want to contribute."
        crumbs={[{ label: "Get Involved" }]}
      />
      <section className="section">
        <div className="container grid-3">
          {pathways.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <div className="pathway">
                <span className="num">{String(i + 1).padStart(2, "0")} — Pathway</span>
                <h2 className="h3" style={{ fontSize: "1.85rem" }}>{p.title}</h2>
                <p>{p.short}</p>
                <ul>{p.responsibilities.slice(0, 3).map((r) => <li key={r}>{r}</li>)}</ul>
                <Link href={p.href} className="btn btn-sm mt-2">
                  Read more &amp; apply <IconArrow />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow="How we recruit" title="What to expect">
            <p>Applications are reviewed on a rolling basis by YPL leadership. We aim to reply to every applicant, though timing depends on the volume of applications and current openings.</p>
          </SectionHead>
          <div className="grid-3">
            <div>
              <h3 className="h4">Fair review</h3>
              <p className="muted mt-1">Every application is read against the same criteria for its pathway. Prior credentials are not required for team roles.</p>
            </div>
            <div>
              <h3 className="h4">Your data stays private</h3>
              <p className="muted mt-1">Applications are stored securely, visible only to authorised reviewers, and never published. <Link href="/privacy">Privacy notice</Link>.</p>
            </div>
            <div>
              <h3 className="h4">Not sure which fits?</h3>
              <p className="muted mt-1">Send us a note through the <Link href="/contact">contact form</Link> or ask the assistant in the corner of this page.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
