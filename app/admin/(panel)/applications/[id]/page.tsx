import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { fieldLabel } from "@/lib/forms";
import { formatDate } from "@/lib/utils";
import { deleteApplication, updateApplication } from "../../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function ApplicationDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> }) {
  const { id } = await params;
  const { saved } = await searchParams;
  const sb = getSupabase();
  if (!sb) notFound();
  const { data: a } = await sb.from("applications").select("*").eq("id", id).maybeSingle();
  if (!a) notFound();
  const pathway = a.pathway as "team" | "board" | "advisor";
  const answers = (a.answers ?? {}) as Record<string, unknown>;
  const render = (v: unknown) => (Array.isArray(v) ? v.join(", ") : typeof v === "boolean" ? (v ? "Yes" : "No") : String(v ?? ""));
  return (
    <>
      <p><Link href="/admin/applications">← All applications</Link></p>
      <h1>{a.name}</h1>
      <p className="muted">
        {pathway === "team" ? "Team member" : pathway === "board" ? "Board" : "Advisor"} application · received {formatDate(a.created_at)} ·{" "}
        <a href={`mailto:${a.email}`}>{a.email}</a>
      </p>
      {saved && <div className="form-status success mt-2">Saved.</div>}
      <div className="split rev mt-3">
        <div className="admin-card">
          <dl className="answers">
            {Object.entries(answers).map(([k, v]) => (
              <div key={k}><dt>{fieldLabel(pathway, k)}</dt><dd>{v && /^https?:\/\//.test(String(v)) ? <a href={String(v)} target="_blank" rel="noopener noreferrer nofollow">{String(v)}</a> : render(v)}</dd></div>
            ))}
          </dl>
        </div>
        <div className="stack" style={{ alignSelf: "start" }}>
          <form action={updateApplication} className="admin-card form" style={{ gap: "1rem" }}>
            <input type="hidden" name="id" value={a.id} />
            <div className="field">
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" className="select" defaultValue={a.status}>
                {["new", "reviewing", "shortlisted", "accepted", "declined", "archived"].map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="notes">Reviewer notes <span className="opt">Internal</span></label>
              <textarea id="notes" name="reviewer_notes" className="textarea" defaultValue={a.reviewer_notes ?? ""} />
            </div>
            <button className="btn btn-sm" type="submit">Save</button>
          </form>
          <form action={deleteApplication} className="admin-card">
            <input type="hidden" name="id" value={a.id} />
            <p className="help">Permanently delete this application (e.g. on the applicant&apos;s request).</p>
            <ConfirmButton message="Permanently delete this application?">Delete application</ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
