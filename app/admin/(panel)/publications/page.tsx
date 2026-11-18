import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { publicationTypeLabel } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import localPublications from "@/content/publications.json";

export default async function AdminPublications({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string }> }) {
  const sp = await searchParams;
  const sb = getSupabase();
  const { data, error } = sb ? await sb.from("publications").select("id, slug, title, type, status, published_at, featured, issue_number").order("published_at", { ascending: false }) : { data: [], error: null };
  return (
    <>
      <div className="flex-between">
        <div>
          <h1>Publications &amp; briefs</h1>
          <p className="muted">Papers, reports and Mini Gurgaon Policy Briefs. Drafts are never shown publicly.</p>
        </div>
        {sb && <Link href="/admin/publications/new" className="btn">+ New publication</Link>}
      </div>
      {sp.saved && <div className="form-status success mt-2">Saved. The public site will update within a few minutes.</div>}
      {sp.deleted && <div className="form-status success mt-2">Deleted.</div>}
      {error && <div className="form-status error mt-2">{error.message}</div>}
      <div className="table-wrap mt-3">
        <table className="table">
          <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {(data ?? []).length === 0 && <tr><td colSpan={5} className="muted">No publications in the database yet.</td></tr>}
            {(data ?? []).map((p) => (
              <tr key={p.id}>
                <td><Link href={`/admin/publications/${p.id}`}>{p.title}</Link>{p.featured ? " ★" : ""}</td>
                <td>{publicationTypeLabel(p.type)}{p.issue_number ? ` No. ${p.issue_number}` : ""}</td>
                <td>{formatDate(p.published_at, { day: "numeric", month: "short", year: "numeric" })}</td>
                <td><span className={`pill ${p.status === "draft" ? "draft" : "accepted"}`}>{p.status}</span></td>
                <td>{p.status === "published" && <Link href={`/${p.type === "gurgaon-brief" ? "gurgaon-briefs" : "research"}/${p.slug}`} target="_blank">View ↗</Link>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {localPublications.length > 0 && <p className="help mt-2">Plus {localPublications.length} item(s) managed in <code>content/publications.json</code> (edit those in the repository).</p>}
    </>
  );
}
