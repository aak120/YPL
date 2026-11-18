import { requireAdmin, REVIEWERS } from "@/lib/admin-auth";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";

const pathways = { team: "Team member", board: "Board", advisor: "Advisor" } as Record<string, string>;
const statuses = ["new", "reviewing", "shortlisted", "accepted", "declined", "archived"];

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ pathway?: string; status?: string; deleted?: string }> }) {
  await requireAdmin(REVIEWERS);
  const sp = await searchParams;
  const sb = getSupabase();
  let rows: { id: string; created_at: string; pathway: string; name: string; email: string; status: string }[] = [];
  let error: string | null = null;
  if (sb) {
    let q = sb.from("applications").select("id, created_at, pathway, name, email, status").order("created_at", { ascending: false }).limit(500);
    if (sp.pathway && pathways[sp.pathway]) q = q.eq("pathway", sp.pathway);
    if (sp.status && statuses.includes(sp.status)) q = q.eq("status", sp.status);
    const res = await q;
    rows = res.data ?? [];
    error = res.error?.message ?? null;
  }
  const qs = (patch: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { pathway: sp.pathway, status: sp.status, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `?${s}` : "";
  };
  return (
    <>
      <h1>Applications</h1>
      <p className="muted">Confidential. Do not share applicant information outside the review team.</p>
      {sp.deleted && <div className="form-status success mt-2">Application deleted.</div>}
      <div className="admin-toolbar">
        <div className="btn-row">
          <Link className={`btn btn-sm ${sp.pathway ? "btn-outline" : ""}`} href={`/admin/applications${qs({ pathway: undefined })}`}>All pathways</Link>
          {Object.entries(pathways).map(([k, v]) => (
            <Link key={k} className={`btn btn-sm ${sp.pathway === k ? "" : "btn-outline"}`} href={`/admin/applications${qs({ pathway: k })}`}>{v}</Link>
          ))}
        </div>
        <div className="btn-row">
          <Link className={`btn btn-sm ${sp.status ? "btn-outline" : ""}`} href={`/admin/applications${qs({ status: undefined })}`}>Any status</Link>
          {statuses.map((s) => (
            <Link key={s} className={`btn btn-sm ${sp.status === s ? "" : "btn-outline"}`} href={`/admin/applications${qs({ status: s })}`}>{s}</Link>
          ))}
        </div>
      </div>
      {error && <div className="form-status error">{error}</div>}
      <div className="table-wrap">
        <table className="table">
          <thead><tr><th>Received</th><th>Name</th><th>Pathway</th><th>Email</th><th>Status</th></tr></thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={5} className="muted">No applications{sb ? "" : " — database not connected"}.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id}>
                  <td>{formatDate(r.created_at, { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td><Link href={`/admin/applications/${r.id}`}>{r.name}</Link></td>
                  <td>{pathways[r.pathway] ?? r.pathway}</td>
                  <td>{r.email}</td>
                  <td><span className={`pill ${r.status}`}>{r.status}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
