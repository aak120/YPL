"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroySession, requireAdmin } from "@/lib/admin-auth";
import { getSupabase, storageBucket } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

const lines = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const csv = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
const str = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").trim();
  return s ? s : null;
};
const num = (v: FormDataEntryValue | null) => {
  const n = parseInt(String(v ?? ""), 10);
  return Number.isFinite(n) ? n : null;
};

function db() {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  return sb;
}

function refreshSite() {
  revalidatePath("/", "layout");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

/* ---------------- Uploads ---------------- */

/**
 * Returns a one-time signed URL so the browser can upload a PDF or image
 * straight to Supabase Storage (avoids server body-size limits).
 */
export async function createUploadUrl(filename: string, kind: "pdf" | "image") {
  await requireAdmin();
  const ext = (filename.split(".").pop() || "").toLowerCase();
  if (kind === "pdf" && ext !== "pdf") throw new Error("Only PDF files are allowed.");
  if (kind === "image" && !["jpg", "jpeg", "png", "webp"].includes(ext)) throw new Error("Use a JPG, PNG or WebP image.");
  const base = slugify(filename.replace(/\.[^.]+$/, "")) || "file";
  const path = `${kind === "pdf" ? "pdfs" : "images"}/${Date.now()}-${base}.${ext}`;
  const sb = db();
  const { data, error } = await sb.storage.from(storageBucket()).createSignedUploadUrl(path);
  if (error || !data) throw new Error(error?.message || "Could not create upload URL.");
  const publicUrl = sb.storage.from(storageBucket()).getPublicUrl(path).data.publicUrl;
  return { signedUrl: data.signedUrl, publicUrl };
}

/* ---------------- Publications ---------------- */

export async function savePublication(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required.");
  const type = String(formData.get("type") ?? "policy-paper");
  const record = {
    title,
    slug: slugify(String(formData.get("slug") || title)),
    short_description: String(formData.get("short_description") ?? "").trim(),
    abstract: String(formData.get("abstract") ?? "").trim(),
    executive_summary: str(formData.get("executive_summary")),
    key_findings: lines(formData.get("key_findings")),
    recommendations: lines(formData.get("recommendations")),
    references: lines(formData.get("references")),
    type,
    category: String(formData.get("category") ?? ""),
    tags: csv(formData.get("tags")),
    authors: lines(formData.get("authors")),
    published_at: String(formData.get("published_at") || new Date().toISOString().slice(0, 10)),
    cover_image_url: str(formData.get("cover_image_url")),
    pdf_url: str(formData.get("pdf_url")),
    page_count: num(formData.get("page_count")),
    issue_number: type === "gurgaon-brief" ? num(formData.get("issue_number")) : null,
    featured: formData.get("featured") === "on",
    status: formData.get("status") === "published" ? "published" : "draft",
    updated_at: new Date().toISOString(),
  };
  const sb = db();
  const { error } = id ? await sb.from("publications").update(record).eq("id", id) : await sb.from("publications").insert(record);
  if (error) throw new Error(error.code === "23505" ? "Another publication already uses that slug." : error.message);
  refreshSite();
  redirect("/admin/publications?saved=1");
}

export async function deletePublication(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const { error } = await db().from("publications").delete().eq("id", id);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect("/admin/publications?deleted=1");
}

/* ---------------- Team ---------------- */

export async function savePerson(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Name is required.");
  const record = {
    name,
    role: String(formData.get("role") ?? "").trim(),
    section: String(formData.get("section") ?? "research"),
    department: str(formData.get("department")),
    bio: str(formData.get("bio")),
    expertise: csv(formData.get("expertise")),
    photo_url: str(formData.get("photo_url")),
    linkedin_url: str(formData.get("linkedin_url")),
    sort_order: num(formData.get("sort_order")) ?? 100,
    visible: formData.get("visible") === "on",
  };
  const sb = db();
  const { error } = id ? await sb.from("team_members").update(record).eq("id", id) : await sb.from("team_members").insert(record);
  if (error) throw new Error(error.message);
  refreshSite();
  redirect("/admin/team?saved=1");
}

export async function deletePerson(formData: FormData) {
  await requireAdmin();
  const { error } = await db().from("team_members").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  refreshSite();
  redirect("/admin/team?deleted=1");
}

/* ---------------- Initiatives & events ---------------- */

export async function saveInitiative(formData: FormData) {
  await requireAdmin();
  const id = str(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!title) throw new Error("Title is required.");
  const record = {
    title,
    slug: slugify(String(formData.get("slug") || title)),
    kind: String(formData.get("kind") ?? "event"),
    summary: String(formData.get("summary") ?? "").trim(),
    description: str(formData.get("description")),
    start_date: str(formData.get("start_date")),
    end_date: str(formData.get("end_date")),
    location: str(formData.get("location")),
    status: String(formData.get("status") ?? "upcoming"),
    related_publications: csv(formData.get("related_publications")),
    image_url: str(formData.get("image_url")),
    registration_url: str(formData.get("registration_url")),
    outcomes: str(formData.get("outcomes")),
    published: formData.get("published") === "on",
  };
  const sb = db();
  const { error } = id ? await sb.from("initiatives").update(record).eq("id", id) : await sb.from("initiatives").insert(record);
  if (error) throw new Error(error.code === "23505" ? "Another initiative already uses that slug." : error.message);
  refreshSite();
  redirect("/admin/initiatives?saved=1");
}

export async function deleteInitiative(formData: FormData) {
  await requireAdmin();
  const { error } = await db().from("initiatives").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  refreshSite();
  redirect("/admin/initiatives?deleted=1");
}

/* ---------------- Applications & messages ---------------- */

const APP_STATUSES = ["new", "reviewing", "shortlisted", "accepted", "declined", "archived"];

export async function updateApplication(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!APP_STATUSES.includes(status)) throw new Error("Invalid status.");
  const { error } = await db()
    .from("applications")
    .update({ status, reviewer_notes: str(formData.get("reviewer_notes")), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/applications");
  redirect(`/admin/applications/${id}?saved=1`);
}

export async function deleteApplication(formData: FormData) {
  await requireAdmin();
  const { error } = await db().from("applications").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  redirect("/admin/applications?deleted=1");
}

export async function updateMessage(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  if (!["new", "replied", "archived"].includes(status)) throw new Error("Invalid status.");
  const { error } = await db().from("contact_messages").update({ status }).eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await requireAdmin();
  const { error } = await db().from("contact_messages").delete().eq("id", String(formData.get("id")));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
