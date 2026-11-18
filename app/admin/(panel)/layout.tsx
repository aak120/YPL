import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { requireAdmin, type Role } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase";
import { logout } from "../actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const ALL: Role[] = ["admin", "editor", "reviewer"];
const links: { href: string; label: string; roles: Role[] }[] = [
  { href: "/admin", label: "Overview", roles: ALL },
  { href: "/admin/applications", label: "Applications", roles: ["admin", "reviewer"] },
  { href: "/admin/messages", label: "Messages", roles: ALL },
  { href: "/admin/publications", label: "Publications & briefs", roles: ["admin", "editor"] },
  { href: "/admin/initiatives", label: "Initiatives & events", roles: ["admin", "editor"] },
  { href: "/admin/team", label: "Team & advisors", roles: ["admin", "editor"] },
  { href: "/admin/users", label: "Admin accounts", roles: ["admin"] },
  { href: "/admin/account", label: "My account", roles: ALL },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  return (
    <div className="admin-shell">
      <nav className="admin-nav on-dark" aria-label="Admin">
        <Link href="/admin" className="brand">
          <LogoMark />
          <span className="brand-text">
            <span className="brand-name">YPL Admin</span>
            <span className="brand-sub">{me.name} · {me.role}</span>
          </span>
        </Link>
        <ul>
          {links.filter((l) => l.roles.includes(me.role)).map((l) => (
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
