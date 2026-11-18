import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { teamSections } from "@/lib/site";
import type { Person } from "@/lib/types";
import { deletePerson, savePerson } from "../../../actions";
import { F, S, Check } from "@/components/admin/Fields";
import { UploadField } from "@/components/admin/UploadField";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function EditPerson({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = getSupabase();
  if (!sb) notFound();
  let p: Partial<Person> = { section: "research", visible: true, sort_order: 100 };
  if (id !== "new") {
    const { data } = await sb.from("team_members").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = data;
  }
  return (
    <>
      <p><Link href="/admin/team">← All people</Link></p>
      <h1>{id === "new" ? "Add person" : `Edit ${p.name}`}</h1>
      <form action={savePerson} className="form mt-3" style={{ maxWidth: 760 }}>
        {p.id && <input type="hidden" name="id" value={p.id} />}
        <fieldset className="fieldset">
          <legend>Profile</legend>
          <div className="field-row">
            <F label="Name" name="name" defaultValue={p.name} required />
            <F label="Role / title" name="role" defaultValue={p.role} required />
          </div>
          <div className="field-row">
            <S label="Section" name="section" defaultValue={p.section} options={teamSections.map((s) => ({ value: s.value, label: s.label }))} />
            <F label="Department" name="department" defaultValue={p.department} />
          </div>
          <F label="Biography" name="bio" rows={4} defaultValue={p.bio} />
          <F label="Areas of expertise" name="expertise" defaultValue={(p.expertise ?? []).join(", ")} help="Comma-separated." />
          <UploadField name="photo_url" label="Profile photo" kind="image" defaultValue={p.photo_url} />
          <F label="LinkedIn URL" name="linkedin_url" type="url" defaultValue={p.linkedin_url} />
          <F label="Sort order" name="sort_order" type="number" defaultValue={p.sort_order} help="Lower numbers appear first." />
          <Check label="Show on the public team page (the person has consented)" name="visible" defaultChecked={p.visible} />
        </fieldset>
        <div className="btn-row"><button className="btn" type="submit">Save</button></div>
      </form>
      {p.id && (
        <form action={deletePerson} className="mt-4">
          <input type="hidden" name="id" value={p.id} />
          <ConfirmButton message="Remove this person?">Remove person</ConfirmButton>
        </form>
      )}
    </>
  );
}
