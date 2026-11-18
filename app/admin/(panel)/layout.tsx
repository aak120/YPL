import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { requireAdmin } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/applications", label: "Applications" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/publications", label: "Publications & briefs" },
  { href: "/admin/initiatives", label: "Initiatives & events" },
  { href: "/admin/team", label: "Team & advisors" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="admin-shell">
      <nav className="admin-nav on-dark" aria-label="Admin">
        <Link href="/admin" className="brand">
          <LogoMark />
          <span className="brand-text">
            <span className="brand-name">YPL Admin</span>
            <span className="brand-sub">Reviewers only</span>
          </span>
        </Link>
        <ul>
          {links.map((l) => (
            <li key={l.href}><Link href={l.href}>{l.label}</Link></li>
          ))}
          <li><Link href="/" target="_blank">View site ↗</Link></li>
          <li>
            <form action={logout}><button type="submit">Sign out</button></form>
          </li>
        </ul>
      </nav>
      <div className="admin-main">
        {!isSupabaseConfigured() && (
          <div className="callout warn" style={{ marginBottom: "1.5rem" }}>
            <p>
              <strong>Database not connected.</strong> Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code> and run{" "}
              <code>supabase/schema.sql</code>. Until then, applications cannot be stored and content can only be added via the JSON files in{" "}
              <code>/content</code>.
            </p>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
