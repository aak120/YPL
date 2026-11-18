import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { PersonCard } from "@/components/PersonCard";
import { EmptyState } from "@/components/EmptyState";
import { getTeam } from "@/lib/content";
import { teamSections } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our Team",
  description: "The researchers, leadership, board and advisors behind Youth Policy Lab.",
  alternates: { canonical: "/team" },
};

export const revalidate = 300;

export default async function TeamPage() {
  const team = await getTeam();
  return (
    <>
      <PageHero
        eyebrow="Our Team"
        title="The people behind the research"
        lede="YPL is run by young researchers, supported by a board and an advisory network."
        crumbs={[{ label: "Our Team" }]}
      />
      {team.length === 0 ? (
        <section className="section">
          <div className="container">
            <EmptyState
              title="Team profiles are being prepared"
              actions={
                <>
                  <Link href="/get-involved/team-member" className="btn btn-sm">Join the team</Link>
                  <Link href="/get-involved/advisor" className="btn btn-outline btn-sm">Become an advisor</Link>
                </>
              }
            >
              Profiles of YPL&apos;s leadership, board, department heads, researchers and advisors will be published here — only with each
              person&apos;s consent.
            </EmptyState>
          </div>
        </section>
      ) : (
        teamSections.map((s, idx) => {
          const members = team.filter((m) => m.section === s.value);
          if (!members.length) return null;
          return (
            <section key={s.value} className={`section tight ${idx % 2 ? "section-tint" : ""}`} aria-labelledby={`team-${s.value}`}>
              <div className="container">
                <div className="section-head">
                  <div>
                    <p className="eyebrow">{String(idx + 1).padStart(2, "0")}</p>
                    <h2 id={`team-${s.value}`} className="h2">{s.label}</h2>
                  </div>
                  <p className="muted">{s.description}</p>
                </div>
                <div className="grid-4">{members.map((m) => <PersonCard key={m.id ?? m.name} p={m} />)}</div>
              </div>
            </section>
          );
        })
      )}
      <section className="section tight section-dark on-dark">
        <div className="container flex-between">
          <h2 className="h3" style={{ maxWidth: "30ch" }}>We&apos;re building the team. Researchers, editors, analysts and advisors welcome.</h2>
          <Link href="/get-involved" className="btn btn-light">Get involved</Link>
        </div>
      </section>
    </>
  );
}
