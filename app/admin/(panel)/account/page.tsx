import { requireAdmin } from "@/lib/admin-auth";
import { changeOwnPassword } from "../../actions";

export default async function AccountPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin();
  const { msg } = await searchParams;
  return (
    <>
      <h1>My account</h1>
      <p className="muted">Signed in as {me.email ?? "the owner"} · role: {me.role}</p>
      {msg && <div className="form-status success mt-2" role="status">{msg}</div>}
      {me.uid === "owner" ? (
        <div className="callout mt-3"><p>The owner login uses the <code>ADMIN_PASSWORD</code> environment variable. Change it in your hosting settings. For day-to-day work, create a personal account under “Admin accounts”.</p></div>
      ) : (
        <form action={changeOwnPassword} className="admin-card form mt-3" style={{ maxWidth: 480, gap: "1.1rem" }}>
          <div className="field"><label className="label" htmlFor="pw">New password</label><input id="pw" name="password" type="password" className="input" minLength={12} required autoComplete="new-password" /></div>
          <div className="field"><label className="label" htmlFor="pw2">Confirm new password</label><input id="pw2" name="confirm" type="password" className="input" minLength={12} required autoComplete="new-password" /></div>
          <div><button className="btn" type="submit">Change password</button></div>
        </form>
      )}
    </>
  );
}
