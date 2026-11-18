import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { PublicationDetail } from "@/components/PublicationDetail";
import { getAllPublications, getPublication, relatedPublications } from "@/lib/content";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getAllPublications()).filter((p) => p.type !== "gurgaon-brief").map((p) => ({ slug: p.slug }));
}

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = await getPublication((await params).slug);
  if (!p) return { title: "Publication not found" };
  return {
    title: p.title,
    description: p.short_description,
    alternates: { canonical: `/research/${p.slug}` },
    authors: (p.authors ?? []).map((name) => ({ name })),
    keywords: p.tags,
    openGraph: { type: "article", title: p.title, description: p.short_description, publishedTime: p.published_at, authors: p.authors, images: p.cover_image_url ? [p.cover_image_url] : undefined },
  };
}

export default async function PublicationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = await getPublication(slug);
  if (!p) notFound();
  if (p.type === "gurgaon-brief") permanentRedirect(`/gurgaon-briefs/${p.slug}`);
  const related = relatedPublications(await getAllPublications(), p);
  return <PublicationDetail p={p} related={related} />;
}
