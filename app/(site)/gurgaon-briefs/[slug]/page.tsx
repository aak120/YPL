import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PublicationDetail } from "@/components/PublicationDetail";
import { getGurgaonBriefs, getPublication } from "@/lib/content";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getGurgaonBriefs()).map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPublication((await params).slug);
  if (!p) return { title: "Brief not found" };
  const t = p.issue_number ? `${p.title} — Gurgaon Brief No. ${p.issue_number}` : p.title;
  return {
    title: t,
    description: p.short_description,
    alternates: { canonical: `/gurgaon-briefs/${p.slug}` },
    openGraph: { type: "article", title: t, description: p.short_description, publishedTime: p.published_at, authors: p.authors },
  };
}

export default async function BriefPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getPublication(slug);
  if (!p) notFound();
  if (p.type !== "gurgaon-brief") permanentRedirect(`/research/${p.slug}`);
  const briefs = await getGurgaonBriefs();
  const related = briefs.filter((b) => b.slug !== p.slug).slice(0, 3);
  return <PublicationDetail p={p} related={related} series />;
}
