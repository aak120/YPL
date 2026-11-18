import "server-only";
import { site } from "./site";

/**
 * Email notifications via Resend (https://resend.com), called over its REST
 * API. Optional: active only when RESEND_API_KEY, NOTIFY_FROM and NOTIFY_EMAIL
 * are set. Failures are logged and never block a submission.
 *
 * To protect applicants (many are minors), notification emails contain only
 * the pathway, name and a link to the admin dashboard — never the answers.
 */
const enabled = () => Boolean(process.env.RESEND_API_KEY && process.env.NOTIFY_FROM);

async function send(to: string[], subject: string, text: string, replyTo?: string) {
  if (!enabled() || to.length === 0) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM, to, subject, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) console.error("[notify] Resend error", res.status, await res.text().catch(() => ""));
  } catch (e) {
    console.error("[notify] send failed:", e);
  }
}

const teamInbox = () =>
  (process.env.NOTIFY_EMAIL ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const pathwayLabel: Record<string, string> = { team: "Team member", board: "Board", advisor: "Advisor" };

export async function notifyNewApplication(a: { id?: string; pathway: string; name: string; email: string }) {
  const label = pathwayLabel[a.pathway] ?? a.pathway;
  const link = `${site.url}/admin/applications${a.id ? `/${a.id}` : ""}`;
  const tasks = [
    send(teamInbox(), `New ${label.toLowerCase()} application — ${a.name}`, `A new ${label.toLowerCase()} application was submitted by ${a.name}.\n\nReview it in the admin dashboard:\n${link}\n\n(Applicant answers are not included in this email for privacy.)`),
  ];
  if (process.env.NOTIFY_SEND_CONFIRMATION === "true") {
    tasks.push(
      send(
        [a.email],
        `We received your ${label.toLowerCase()} application — Youth Policy Lab`,
        `Hello ${a.name},\n\nThank you for applying to Youth Policy Lab (${label.toLowerCase()} pathway). Your application has been received and will be reviewed by our team. If you are shortlisted, we will contact you at this address.\n\nIf you did not submit this application, you can ignore this email or reply to let us know.\n\nYouth Policy Lab\n${site.url}`,
        teamInbox()[0],
      ),
    );
  }
  await Promise.all(tasks);
}

export async function notifyNewMessage(m: { name: string; email: string; inquiry_type: string; subject: string; message: string }) {
  await send(
    teamInbox(),
    `[${m.inquiry_type}] ${m.subject}`,
    `New message from ${m.name} <${m.email}> via the YPL contact form.\n\n${m.message}\n\n—\nManage messages: ${site.url}/admin/messages`,
    m.email,
  );
}
