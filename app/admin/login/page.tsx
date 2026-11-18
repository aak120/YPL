import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LogoMark } from "@/components/Logo";
import { authenticate, createSession, getSession, isAdminConfigured } from "@/lib/admin-auth";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const ip = clientIp(await headers());
  if (!(await rateLimit(`login:${ip}`, 8, 15 * 60 * 1000))) redirect("/admin/login?e=rate");
  const session = await authenticate(String(formData.get("email") ?? ""), String(formData.get("password") ?? ""));
  if (!session) redirect("/admin/login?e=1");
  await createSession(session);
  redirect("/admin");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { e } = await searchParams;
  const configured = isAdminConfigured();
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", background: "var(--navy-950)" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--paper)", padding: "2.5rem", border: "1px solid var(--rule)" }}>
        <LogoMark className="brand-mark" />
        <h1 className="h3 mt-3">YPL admin</h1>
        <p className="muted" style={{ fontSize: "0.92rem" }}>For authorised reviewers and editors only.</p>
        {!configured ? (
          <div className="callout warn mt-3">
            <p>
              Admin access is not configured. Set <code>ADMIN_SESSION_SECRET</code> (at least 32 characters) and <code>ADMIN_PASSWORD</code> in
              the server environment, then restart. See README.md.
            </p>
          </div>
        ) : (
          <form action={login} className="form mt-3" style={{ gap: "1.25rem" }}>
            {e && (
              <div className="form-status error" role="alert">
                {e === "rate" ? "Too many attempts. Wait 15 minutes and try again." : "Incorrect email or password."}
              </div>
            )}
            <div className="field">
              <label htmlFor="email" className="label">Email</label>
              <input id="email" name="email" type="email" className="input" autoComplete="username" autoFocus />
              <p className="help">Leave blank to sign in with the owner password.</p>
            </div>
            <div className="field">
              <label htmlFor="password" className="label">Password</label>
              <input id="password" name="password" type="password" className="input" required autoComplete="current-password" />
            </div>
            <button type="submit" className="btn">Sign in</button>
          </form>
        )}
      </div>
    </main>
  );
}
