import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { teamSections } from "@/lib/site";

export default async function AdminTeam({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const sb = getSupabase();
  const { data, error } = sb ? await sb.from("team_members").select("id, name, role, section, visible, sort_order").order("sort_order") : { data: [], error: null };
  return (
    <>
      <div className="flex-between">
        <div>
          <h1>Team &amp; advisors</h1>
          <p className="muted">Only publish a profile with the person&apos;s consent.</p>
        </div>
        {sb && <Link href="/admin/team/new" className="btn">+ Add person</Link>}
      </div>
      {sp.saved && <div className="form-status success mt-2">Saved.</div>}
      {sp.deleted && <div className="form-status success mt-2">Removed.</div>}
      {error && <div className="form-status error mt-2">{error.message}</div>}
      <div className="table-wrap mt-3">
        <table className="table">
          <thead><tr><th>Name</th><th>Role</th><th>Section</th><th>Order</th><th>Visible</th></tr></thead>
          <tbody>
            {(data ?? []).length === 0 && <tr><td colSpan={5} className="muted">No profiles yet.</td></tr>}
            {(data ?? []).map((m) => (
              <tr key={m.id}>
                <td><Link href={`/admin/team/${m.id}`}>{m.name}</Link></td>
                <td>{m.role}</td>
                <td>{teamSections.find((s) => s.value === m.section)?.label}</td>
                <td>{m.sort_order}</td>
                <td>{m.visible ? "Yes" : "Hidden"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
