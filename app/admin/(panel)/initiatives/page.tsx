import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { initiativeKindLabel } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export default async function AdminInitiatives({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const sb = getSupabase();
  const { data, error } = sb ? await sb.from("initiatives").select("id, slug, title, kind, status, start_date, published").order("start_date", { ascending: false, nullsFirst: true }) : { data: [], error: null };
  return (
    <>
      <div className="flex-between">
        <div>
          <h1>Initiatives &amp; events</h1>
          <p className="muted">List only confirmed events. Add outcomes once an event is completed.</p>
        </div>
        {sb && <Link href="/admin/initiatives/new" className="btn">+ New initiative / event</Link>}
      </div>
      {sp.saved && <div className="form-status success mt-2">Saved.</div>}
      {sp.deleted && <div className="form-status success mt-2">Deleted.</div>}
      {error && <div className="form-status error mt-2">{error.message}</div>}
      <div className="table-wrap mt-3">
        <table className="table">
          <thead><tr><th>Title</th><th>Kind</th><th>Date</th><th>Status</th><th>Public</th></tr></thead>
          <tbody>
            {(data ?? []).length === 0 && <tr><td colSpan={5} className="muted">Nothing listed yet.</td></tr>}
            {(data ?? []).map((i) => (
              <tr key={i.id}>
                <td><Link href={`/admin/initiatives/${i.id}`}>{i.title}</Link></td>
                <td>{initiativeKindLabel(i.kind)}</td>
                <td>{i.start_date ? formatDate(i.start_date, { day: "numeric", month: "short", year: "numeric" }) : "—"}</td>
                <td><span className="pill">{i.status}</span></td>
                <td>{i.published ? "Yes" : "Hidden"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
