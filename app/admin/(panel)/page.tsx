import Link from "next/link";
import { getSupabase } from "@/lib/supabase";

async function count(table: string, filter?: [string, string]) {
  const sb = getSupabase();
  if (!sb) return null;
  let q = sb.from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0], filter[1]);
  const { count: c, error } = await q;
  return error ? null : c ?? 0;
}

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ denied?: string }> }) {
  const { denied } = await searchParams;
  const [newApps, apps, msgs, pubs, drafts, team, inits] = await Promise.all([
    count("applications", ["status", "new"]),
    count("applications"),
    count("contact_messages", ["status", "new"]),
    count("publications", ["status", "published"]),
    count("publications", ["status", "draft"]),
    count("team_members"),
    count("initiatives"),
  ]);
  const show = (n: number | null) => (n === null ? "—" : n);
  const cards = [
    { label: "New applications", n: newApps, sub: `${show(apps)} total`, href: "/admin/applications?status=new" },
    { label: "New messages", n: msgs, sub: "Contact form", href: "/admin/messages" },
    { label: "Published works", n: pubs, sub: `${show(drafts)} drafts`, href: "/admin/publications" },
    { label: "Team profiles", n: team, sub: "Incl. advisors", href: "/admin/team" },
    { label: "Initiatives & events", n: inits, sub: "All statuses", href: "/admin/initiatives" },
  ];
  const env = {
    "Database (Supabase)": Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    "AI assistant (Anthropic)": Boolean(process.env.ANTHROPIC_API_KEY),
    "Site URL": Boolean(process.env.SITE_URL),
  };
  return (
    <>
      <h1>Overview</h1>
      <p className="muted">Review applications and manage the content published on the website.</p>
      {denied && <div className="form-status error mt-2">Your role doesn&apos;t have access to that section.</div>}
      <div className="grid-3 mt-3">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="admin-card" style={{ textDecoration: "none" }}>
            <div className="meta">{c.label}</div>
            <div className="stat-num mt-1">{show(c.n)}</div>
            <div className="help">{c.sub}</div>
          </Link>
        ))}
      </div>
      <h2 className="h4 mt-4">Configuration</h2>
      <div className="table-wrap mt-2">
        <table className="table">
          <tbody>
            {Object.entries(env).map(([k, v]) => (
              <tr key={k}>
                <td>{k}</td>
                <td><span className={`pill ${v ? "accepted" : "declined"}`}>{v ? "Configured" : "Not configured"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
