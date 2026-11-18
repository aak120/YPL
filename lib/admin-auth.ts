import "server-only";
import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabase } from "./supabase";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const COOKIE = "ypl_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

/**
 * Roles:
 *  - admin:    everything, including managing admin accounts
 *  - editor:   publications, briefs, initiatives, team profiles, messages
 *  - reviewer: applications and messages only
 * The ADMIN_PASSWORD "owner" login always has the admin role; it is the
 * bootstrap/break-glass account used to create individual accounts.
 */
export type Role = "admin" | "editor" | "reviewer";
export const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "reviewer", label: "Reviewer", description: "Applications and contact messages" },
  { value: "editor", label: "Editor", description: "Publications, briefs, initiatives, team profiles and messages" },
  { value: "admin", label: "Admin", description: "Everything, including managing admin accounts" },
];

export interface AdminSession {
  uid: string; // "owner" or an admin_users.id
  role: Role;
  name: string;
  email: string | null;
}

const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";
export const isAdminConfigured = () => secret().length >= 32 && Boolean(process.env.ADMIN_PASSWORD || getSupabase());

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    timingSafeEqual(ab, ab);
    return false;
  }
  return timingSafeEqual(ab, bb);
}

/* ---------- password hashing (scrypt) ---------- */

export async function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const hash = await scrypt(pw, salt, 64);
  return `scrypt$${salt.toString("base64url")}$${hash.toString("base64url")}`;
}

async function verifyPassword(pw: string, stored: string) {
  const [alg, saltB64, hashB64] = stored.split("$");
  if (alg !== "scrypt" || !saltB64 || !hashB64) return false;
  const expected = Buffer.from(hashB64, "base64url");
  const actual = await scrypt(pw, Buffer.from(saltB64, "base64url"), expected.length);
  return timingSafeEqual(actual, expected);
}

// A fixed dummy hash so unknown emails take as long as known ones.
let dummyHash: string | null = null;

/* ---------- login ---------- */

/** Returns the session for valid credentials, or null. */
export async function authenticate(emailRaw: string, password: string): Promise<AdminSession | null> {
  if (!isAdminConfigured() || !password) return null;
  const email = emailRaw.trim().toLowerCase();

  // Owner login: no email (or "owner"), password = ADMIN_PASSWORD.
  if ((!email || email === "owner") && process.env.ADMIN_PASSWORD) {
    const ok = safeEqual(sign(`pw:${password}`), sign(`pw:${process.env.ADMIN_PASSWORD}`));
    return ok ? { uid: "owner", role: "admin", name: "Owner", email: null } : null;
  }

  const sb = getSupabase();
  if (!sb || !email) return null;
  const { data: user } = await sb.from("admin_users").select("id, email, name, role, password_hash, active").eq("email", email).maybeSingle();
  if (!user) {
    dummyHash ??= await hashPassword("dummy-password");
    await verifyPassword(password, dummyHash);
    return null;
  }
  if (!user.active || !(await verifyPassword(password, user.password_hash))) return null;
  await sb.from("admin_users").update({ last_login_at: new Date().toISOString() }).eq("id", user.id);
  return { uid: user.id, role: user.role as Role, name: user.name || user.email, email: user.email };
}

export async function createSession(s: AdminSession) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `v2.${s.uid}.${exp}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

/**
 * Reads and verifies the session cookie. For individual accounts the user is
 * re-loaded from the database on every request, so deactivating an account or
 * changing its role takes effect immediately.
 */
export async function getSession(): Promise<AdminSession | null> {
  if (!isAdminConfigured()) return null;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;
  const i = raw.lastIndexOf(".");
  if (i < 0) return null;
  const payload = raw.slice(0, i);
  if (!safeEqual(raw.slice(i + 1), sign(payload))) return null;
  const [v, uid, expStr] = payload.split(".");
  if (v !== "v2" || !uid || !(Number(expStr) > Date.now() / 1000)) return null;

  if (uid === "owner") {
    return process.env.ADMIN_PASSWORD ? { uid, role: "admin", name: "Owner", email: null } : null;
  }
  const sb = getSupabase();
  if (!sb) return null;
  const { data: user } = await sb.from("admin_users").select("id, email, name, role, active").eq("id", uid).maybeSingle();
  if (!user || !user.active) return null;
  return { uid: user.id, role: user.role as Role, name: user.name || user.email, email: user.email };
}

export const can = (s: AdminSession | null, roles: Role[]) => Boolean(s && roles.includes(s.role));

/** Call at the top of every admin page and server action. */
export async function requireAdmin(roles: Role[] = ["admin", "editor", "reviewer"]): Promise<AdminSession> {
  const s = await getSession();
  if (!s) redirect("/admin/login");
  if (!roles.includes(s.role)) redirect("/admin?denied=1");
  return s;
}

export const EDITORS: Role[] = ["admin", "editor"];
export const REVIEWERS: Role[] = ["admin", "reviewer"];
export const ADMINS: Role[] = ["admin"];
