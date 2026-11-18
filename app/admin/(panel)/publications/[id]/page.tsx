import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { focusAreas, publicationTypes } from "@/lib/site";
import type { Publication } from "@/lib/types";
import { deletePublication, savePublication } from "../../../actions";
import { F, S, Check } from "@/components/admin/Fields";
import { UploadField } from "@/components/admin/UploadField";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function EditPublication({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getSupabase();
  if (!sb) notFound();
  let p: Partial<Publication> = { status: "draft", type: "policy-paper", published_at: new Date().toISOString().slice(0, 10) };
  if (id !== "new") {
    const { data } = await sb.from("publications").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data;
  }
  return (
    <>
      <p><Link href="/admin/publications">← All publications</Link></p>
      <h1>{id === "new" ? "New publication" : "Edit publication"}</h1>
      <form action={savePublication} className="form mt-3" style={{ maxWidth: 860 }}>
        {p.id && <input type="hidden" name="id" value={p.id} />}
        <fieldset className="fieldset">
          <legend>Basics</legend>
          <F label="Title" name="title" defaultValue={p.title} required />
          <div className="field-row">
            <F label="Slug (URL)" name="slug" defaultValue={p.slug} help="Leave blank to generate from the title." />
            <F label="Publication date" name="published_at" type="date" defaultValue={p.published_at} required />
          </div>
          <div className="field-row">
            <S label="Publication type" name="type" defaultValue={p.type} options={publicationTypes.map((t) => ({ value: t.value, label: t.label }))} />
            <S label="Research topic" name="category" defaultValue={p.category} options={focusAreas.map((f) => ({ value: f.slug, label: f.title }))} />
          </div>
          <div className="field-row">
            <F label="Issue number (Gurgaon briefs only)" name="issue_number" type="number" defaultValue={p.issue_number} />
            <F label="Page count" name="page_count" type="number" defaultValue={p.page_count} />
          </div>
          <F label="Authors" name="authors" rows={3} defaultValue={(p.authors ?? []).join("\n")} help="One per line." />
          <F label="Tags / keywords" name="tags" defaultValue={(p.tags ?? []).join(", ")} help="Comma-separated. For Gurgaon briefs, put the brief's topic first (e.g. Water security)." />
        </fieldset>
        <fieldset className="fieldset">
          <legend>Content</legend>
          <F label="Short description" name="short_description" rows={2} defaultValue={p.short_description} required help="One or two sentences for cards and search results." />
          <F label="Abstract" name="abstract" rows={7} defaultValue={p.abstract} required help="Separate paragraphs with a blank line." />
          <F label="Executive summary" name="executive_summary" rows={6} defaultValue={p.executive_summary} />
          <F label="Key findings" name="key_findings" rows={5} defaultValue={(p.key_findings ?? []).join("\n")} help="One finding per line." />
          <F label="Policy recommendations" name="recommendations" rows={5} defaultValue={(p.recommendations ?? []).join("\n")} help="One recommendation per line." />
          <F label="References" name="references" rows={5} defaultValue={(p.references ?? []).join("\n")} help="One reference per line." />
        </fieldset>
        <fieldset className="fieldset">
          <legend>Files</legend>
          <UploadField name="pdf_url" label="PDF" kind="pdf" defaultValue={p.pdf_url} help="Upload the final PDF (max 50 MB). It will be freely downloadable." />
          <UploadField name="cover_image_url" label="Cover image" kind="image" defaultValue={p.cover_image_url} />
        </fieldset>
        <fieldset className="fieldset">
          <legend>Publishing</legend>
          <S label="Visibility" name="status" defaultValue={p.status} options={[{ value: "draft", label: "Draft — hidden from the public" }, { value: "published", label: "Published — visible on the site" }]} />
          <Check label="Feature on the homepage" name="featured" defaultChecked={p.featured} />
        </fieldset>
        <div className="btn-row"><button className="btn" type="submit">Save publication</button></div>
      </form>
      {p.id && (
        <form action={deletePublication} className="mt-4">
          <input type="hidden" name="id" value={p.id} />
          <ConfirmButton message="Delete this publication permanently?">Delete publication</ConfirmButton>
        </form>
      )}
    </>
  );
}
