import { ADMINS, ROLES, requireAdmin } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { createAdminUser, deleteAdminUser, updateAdminUser } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ msg?: string }> }) {
  const me = await requireAdmin(ADMINS);
  const { msg } = await searchParams;
  const sb = getSupabase();
  const { data, error } = sb
    ? await sb.from("admin_users").select("id, email, name, role, active, created_at, last_login_at").order("created_at")
    : { data: [], error: null };
  return (
    <>
      <h1>Admin accounts</h1>
      <p className="muted">Give each reviewer and editor their own login. Deactivating an account signs it out immediately.</p>
      {msg && <div className="form-status success mt-2" role="status">{msg}</div>}
      {error && <div className="form-status error mt-2">{error.message}{error.message.includes("admin_users") ? " — run the latest supabase/schema.sql." : ""}</div>}
      {!sb ? (
        <div className="callout warn mt-3"><p>Individual accounts need the database. Until it is connected, only the owner password works.</p></div>
      ) : (
        <>
          <div className="table-wrap mt-3">
            <table className="table">
              <thead><tr><th>Person</th><th>Role</th><th>Status</th><th>Last sign-in</th><th>Change</th></tr></thead>
              <tbody>
                {(data ?? []).length === 0 && <tr><td colSpan={5} className="muted">No individual accounts yet. You are signed in with the owner password.</td></tr>}
                {(data ?? []).map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name || "—"}</strong><br /><span className="help">{u.email}</span></td>
                    <td>{u.role}</td>
                    <td><span className={`pill ${u.active ? "accepted" : "declined"}`}>{u.active ? "active" : "deactivated"}</span></td>
                    <td>{u.last_login_at ? formatDate(u.last_login_at, { day: "numeric", month: "short", year: "numeric" }) : "Never"}</td>
                    <td>
                      <details>
                        <summary style={{ cursor: "pointer", color: "var(--teal)" }}>Edit</summary>
                        <form action={updateAdminUser} className="stack mt-1" style={{ minWidth: 240 }}>
                          <input type="hidden" name="id" value={u.id} />
                          <select name="role" className="select" defaultValue={u.role} aria-label="Role">
                            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                          </select>
                          <label className="consent"><input type="checkbox" name="active" defaultChecked={u.active} /> <span>Active</span></label>
                          <input name="password" type="password" className="input" placeholder="New password (optional)" autoComplete="new-password" aria-label="New password" />
                          <button className="btn btn-sm" type="submit">Save</button>
                        </form>
                        {u.id !== me.uid && (
                          <form action={deleteAdminUser} className="mt-1">
                            <input type="hidden" name="id" value={u.id} />
                            <ConfirmButton message={`Delete the account for ${u.email}?`}>Delete account</ConfirmButton>
                          </form>
                        )}
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="h4 mt-4">Add an account</h2>
          <form action={createAdminUser} className="admin-card form mt-2" style={{ maxWidth: 720, gap: "1.1rem" }}>
            <div className="field-row">
              <div className="field"><label className="label" htmlFor="nu-name">Name</label><input id="nu-name" name="name" className="input" required /></div>
              <div className="field"><label className="label" htmlFor="nu-email">Email</label><input id="nu-email" name="email" type="email" className="input" required /></div>
            </div>
            <div className="field-row">
              <div className="field">
                <label className="label" htmlFor="nu-role">Role</label>
                <select id="nu-role" name="role" className="select" defaultValue="reviewer">
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}: {r.description}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="nu-pw">Temporary password</label>
                <input id="nu-pw" name="password" type="text" className="input" minLength={12} required autoComplete="off" />
                <p className="help">At least 12 characters. Share it privately; they can change it under “My account”.</p>
              </div>
            </div>
            <div><button className="btn" type="submit">Create account</button></div>
          </form>
        </>
      )}
    </>
  );
}
