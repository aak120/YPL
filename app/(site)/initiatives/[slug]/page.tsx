/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/PageHero";
import { dateRange } from "@/components/EventCard";
import { PublicationCard } from "@/components/PublicationCard";
import { IconExternal } from "@/components/Icons";
import { getAllPublications, getInitiative, getInitiatives } from "@/lib/content";
import { initiativeKindLabel } from "@/lib/site";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getInitiatives()).map((i) => ({ slug: i.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const i = await getInitiative((await params).slug);
  if (!i) return { title: "Not found" };
  return { title: i.title, description: i.summary, alternates: { canonical: `/initiatives/${i.slug}` } };
}

export default async function InitiativePage({ params }: { params: Params }) {
  const i = await getInitiative((await params).slug);
  if (!i) notFound();
  const pubs = await getAllPublications();
  const related = pubs.filter((p) => i.related_publications?.includes(p.slug));
  return (
    <article>
      <header className="article-head">
        <div className="container">
          <Breadcrumbs items={[{ label: "Initiatives & Events", href: "/initiatives" }, { label: i.title }]} />
          <div className="flex-between" style={{ justifyContent: "flex-start" }}>
            <p className="eyebrow">{initiativeKindLabel(i.kind)}</p>
            <span className={`status ${i.status}`}>{i.status}</span>
          </div>
          <h1 className="h1">{i.title}</h1>
          <p className="lede">{i.summary}</p>
          <dl className="byline">
            <div><dt>Date</dt><dd>{dateRange(i) || "To be announced"}</dd></div>
            {i.location && <div><dt>Location</dt><dd>{i.location}</dd></div>}
          </dl>
        </div>
      </header>
      <div className="container article-layout">
        <div className="article-body">
          {i.image_url && <img className="cover-img" src={i.image_url} alt="" />}
          {i.description && (
            <section aria-labelledby="desc">
              <h2 id="desc" className="sec">About</h2>
              <div className="prose">{i.description.split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)}</div>
            </section>
          )}
          {i.status === "completed" && i.outcomes && (
            <section aria-labelledby="out">
              <h2 id="out" className="sec">Outcomes</h2>
              <div className="prose">{i.outcomes.split(/\n{2,}/).map((p, k) => <p key={k}>{p}</p>)}</div>
            </section>
          )}
        </div>
        <aside className="sticky-col">
          <div className="aside-box">
            <h2>Take part</h2>
            {i.registration_url && i.status !== "completed" ? (
              <a href={i.registration_url} className="btn btn-accent" target="_blank" rel="noopener noreferrer">
                Register <IconExternal />
              </a>
            ) : (
              <p className="help mb-0">{i.status === "completed" ? "This initiative has concluded." : "Registration details will be shared here when available."}</p>
            )}
            <Link href="/contact" className="link-arrow">Questions? Contact us →</Link>
          </div>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section section-tint">
          <div className="container">
            <h2 className="h2" style={{ marginBottom: "2.5rem" }}>Related research</h2>
            <div className="grid-3">{related.map((p) => <PublicationCard key={p.slug} p={p} />)}</div>
          </div>
        </section>
      )}
    </article>
  );
}
