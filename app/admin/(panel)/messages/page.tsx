import { requireAdmin } from "@/lib/admin-auth";
import { getSupabase } from "@/lib/supabase";
import { formatDate } from "@/lib/utils";
import { deleteMessage, updateMessage } from "../../actions";
import { ConfirmButton } from "@/components/admin/ConfirmButton";

export default async function MessagesPage() {
  await requireAdmin();
  const sb = getSupabase();
  const { data, error } = sb ? await sb.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(300) : { data: [], error: null };
  const rows = data ?? [];
  return (
    <>
      <h1>Messages</h1>
      <p className="muted">Submissions from the contact form.</p>
      {error && <div className="form-status error">{error.message}</div>}
      <div className="stack mt-3">
        {rows.length === 0 && <div className="admin-card muted">No messages{sb ? "" : " — database not connected"}.</div>}
        {rows.map((m) => (
          <article key={m.id} className="admin-card">
            <div className="flex-between">
              <div>
                <span className={`pill ${m.status}`}>{m.status}</span> <span className="meta">{m.inquiry_type} · {formatDate(m.created_at)}</span>
                <h2 className="h4 mt-1">{m.subject}</h2>
                <p className="help">{m.name}{m.organisation ? `, ${m.organisation}` : ""} · <a href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + m.subject)}`}>{m.email}</a></p>
              </div>
              <div className="btn-row">
                <form action={updateMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <select name="status" defaultValue={m.status} className="select" style={{ minHeight: 38, width: "auto" }} aria-label="Status">
                    <option>new</option><option>replied</option><option>archived</option>
                  </select>{" "}
                  <button className="btn btn-outline btn-sm" type="submit">Update</button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <ConfirmButton message="Delete this message?">Delete</ConfirmButton>
                </form>
              </div>
            </div>
            <p style={{ whiteSpace: "pre-wrap", marginTop: "1rem", marginBottom: 0 }}>{m.message}</p>
          </article>
        ))}
      </div>
    </>
  );
}
