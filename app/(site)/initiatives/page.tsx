import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { EventCard } from "@/components/EventCard";
import { EmptyState } from "@/components/EmptyState";
import { getInitiatives } from "@/lib/content";
import { initiativeKinds, initiativeStatuses } from "@/lib/site";

export const metadata: Metadata = {
  title: "Initiatives & Events",
  description: "Youth Policy Lab's research initiatives, roundtables, workshops, conferences and special projects.",
  alternates: { canonical: "/initiatives" },
};

export const revalidate = 300;

export default async function InitiativesPage() {
  const all = await getInitiatives();
  return (
    <>
      <PageHero
        eyebrow="Initiatives & Events"
        title="Research in motion"
        lede="Research initiatives, roundtables, symposiums, workshops, surveys and special projects — current, upcoming and past."
        crumbs={[{ label: "Initiatives & Events" }]}
      />
      {all.length === 0 ? (
        <section className="section">
          <div className="container">
            <EmptyState
              title="No initiatives or events are listed yet"
              actions={
                <>
                  <Link href="/contact" className="btn btn-sm">Propose a collaboration</Link>
                  <Link href="/get-involved" className="btn btn-outline btn-sm">Get involved</Link>
                </>
              }
            >
              YPL will list its research initiatives and events here — {initiativeKinds.slice(0, 6).map((k) => k.label.toLowerCase()).join(", ")} and more —
              with dates, registration links and, once completed, outcomes. Interested in co-hosting or taking part? Get in touch.
            </EmptyState>
          </div>
        </section>
      ) : (
        initiativeStatuses.map((s, idx) => {
          const items = all.filter((i) => i.status === s.value);
          if (!items.length) return null;
          return (
            <section key={s.value} className={`section tight ${idx % 2 ? "section-tint" : ""}`} aria-labelledby={`st-${s.value}`}>
              <div className="container">
                <div className="flex-between" style={{ marginBottom: "2rem" }}>
                  <h2 id={`st-${s.value}`} className="h2">{s.label}</h2>
                  <span className="meta">{items.length} item{items.length === 1 ? "" : "s"}</span>
                </div>
                <div className="grid-3">{items.map((i) => <EventCard key={i.slug} i={i} />)}</div>
              </div>
            </section>
          );
        })
      )}
    </>
  );
}
