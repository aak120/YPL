import { requireAdmin, EDITORS } from "@/lib/admin-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { initiativeKinds, initiativeStatuses } from "@/lib/site";
import type { Initiative } from "@/lib/types";
import { deleteInitiative, saveInitiative } from "../../../actions";
import { F, S, Check } from "@/components/admin/Fields";
import { UploadField } from "@/components/admin/UploadField";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function EditInitiative({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin(EDITORS);
  const { id } = await params;
  const sb = getSupabase();
  if (!sb) notFound();
  let i: Partial<Initiative> = { status: "upcoming", kind: "event", published: true };
  if (id !== "new") {
    const { data } = await sb.from("initiatives").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    i = data;
  }
  return (
    <>
      <p><Link href="/admin/initiatives">← All initiatives</Link></p>
      <h1>{id === "new" ? "New initiative or event" : "Edit initiative"}</h1>
      <form action={saveInitiative} className="form mt-3" style={{ maxWidth: 820 }}>
        {i.id && <input type="hidden" name="id" value={i.id} />}
        <fieldset className="fieldset">
          <legend>Details</legend>
          <F label="Title" name="title" defaultValue={i.title} required />
          <div className="field-row">
            <F label="Slug (URL)" name="slug" defaultValue={i.slug} help="Leave blank to generate from the title." />
            <S label="Kind" name="kind" defaultValue={i.kind} options={initiativeKinds} />
          </div>
          <div className="field-row">
            <S label="Status" name="status" defaultValue={i.status} options={initiativeStatuses} />
            <F label="Location" name="location" defaultValue={i.location} />
          </div>
          <div className="field-row">
            <F label="Start date" name="start_date" type="date" defaultValue={i.start_date} />
            <F label="End date" name="end_date" type="date" defaultValue={i.end_date} />
          </div>
          <F label="Summary" name="summary" rows={2} defaultValue={i.summary} required />
          <F label="Description" name="description" rows={6} defaultValue={i.description} />
          <F label="Registration link" name="registration_url" type="url" defaultValue={i.registration_url} />
          <F label="Related publication slugs" name="related_publications" defaultValue={(i.related_publications ?? []).join(", ")} help="Comma-separated slugs from the research library." />
          <UploadField name="image_url" label="Image" kind="image" defaultValue={i.image_url} />
          <F label="Outcomes (completed only)" name="outcomes" rows={4} defaultValue={i.outcomes} help="Only record real, verifiable outcomes." />
          <Check label="Visible on the public site" name="published" defaultChecked={i.published} />
        </fieldset>
        <div className="btn-row"><button className="btn" type="submit">Save</button></div>
      </form>
      {i.id && (
        <form action={deleteInitiative} className="mt-4">
          <input type="hidden" name="id" value={i.id} />
          <ConfirmButton message="Delete this initiative?">Delete</ConfirmButton>
        </form>
      )}
    </>
  );
}
