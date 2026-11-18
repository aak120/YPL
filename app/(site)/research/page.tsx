import type { Metadata } from "next";
import { PageHero, SectionHead } from "@/components/PageHero";
import { ResearchLibrary } from "@/components/ResearchLibrary";
import { getAllPublications } from "@/lib/content";
import { focusAreas } from "@/lib/site";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Research & Publications",
  description: "Youth Policy Lab's open-access research library: policy papers, research papers, briefs and reports, free to read and download.",
  alternates: { canonical: "/research" },
};

export const revalidate = 300;

type SP = Promise<Record<string, string | string[] | undefined>>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

export default async function ResearchPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const publications = await getAllPublications();
  return (
    <>
      <PageHero
        eyebrow="Research & Publications"
        title="The research library"
        lede="YPL's public repository. Every publication is free to read, cite and download — no account, no paywall."
        crumbs={[{ label: "Research" }]}
      />
      <section className="section tight">
        <div className="container">
          <ResearchLibrary
            key={JSON.stringify(sp)}
            publications={publications}
            initial={{ q: one(sp.q), category: one(sp.category), type: one(sp.type), sort: one(sp.sort) }}
          />
        </div>
      </section>
      <section className="section section-tint" id="focus-areas">
        <div className="container">
          <SectionHead eyebrow="Focus areas" title="Research themes">
            <p>The themes that shape our research agenda. Select one to filter the library.</p>
          </SectionHead>
          <div className="focus-grid">
            {focusAreas.map((f, i) => {
              const n = publications.filter((p) => p.category === f.slug).length;
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
    </>
  );
}
