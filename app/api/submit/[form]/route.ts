import { cleanValues, formDefs, validateForm, type FormValues } from "@/lib/forms";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { getSupabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = Promise<{ form: string }>;

export async function POST(req: Request, { params }: { params: Params }) {
  const { form } = await params;
  if (!(form in formDefs)) return Response.json({ error: "Unknown form." }, { status: 404 });
  const def = formDefs[form as keyof typeof formDefs];

  // Same-origin check (blocks cross-site form posting)
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host && new URL(origin).host !== host) {
    return Response.json({ error: "Invalid request origin." }, { status: 403 });
  }

  if (!rateLimit(`submit:${form}:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return Response.json({ error: "Too many submissions from this connection. Please try again later." }, { status: 429 });
  }

  let body: { values?: FormValues; hp?: string; started?: number };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Spam protection: honeypot + minimum fill time.
  if (body.hp || typeof body.started !== "number" || Date.now() - body.started < 4000) {
    return Response.json({ error: "Your submission could not be accepted. Please wait a moment and try again." }, { status: 400 });
  }

  const raw = body.values ?? {};
  const errors = validateForm(def, raw);
  if (Object.keys(errors).length) {
    return Response.json({ error: "Please correct the highlighted fields.", errors }, { status: 422 });
  }
  const values = cleanValues(def, raw);

  const sb = getSupabase();
  if (!sb) {
    console.error(`[submit:${form}] Supabase is not configured — submission NOT stored.`);
    return Response.json(
      {
        error:
          "Online submissions are temporarily unavailable because the site's database has not been connected yet. Your answers have not been sent — please try again later or use the contact details on our Contact page.",
        notConfigured: true,
      },
      { status: 503 },
    );
  }

  const name = String(values.full_name ?? "");
  const email = String(values.email ?? "").toLowerCase();
  const result =
    form === "contact"
      ? await sb.from("contact_messages").insert({
          name,
          email,
          inquiry_type: String(values.inquiry_type ?? ""),
          organisation: values.organisation ? String(values.organisation) : null,
          subject: String(values.subject ?? ""),
          message: String(values.message ?? ""),
        })
      : await sb.from("applications").insert({ pathway: form, name, email, answers: values });

  if (result.error) {
    console.error(`[submit:${form}]`, result.error.message);
    return Response.json({ error: "We couldn't save your submission due to a server error. Please try again in a few minutes." }, { status: 500 });
  }
  return Response.json({ ok: true });
}
