import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "ypl_admin";
const MAX_AGE = 60 * 60 * 8; // 8 hours

export const isAdminConfigured = () =>
  Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET && process.env.ADMIN_SESSION_SECRET.length >= 32);

function sign(value: string) {
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET!).update(value).digest("base64url");
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

export function checkPassword(input: string) {
  if (!isAdminConfigured()) return false;
  // Compare HMACs so lengths always match.
  return safeEqual(sign(`pw:${input}`), sign(`pw:${process.env.ADMIN_PASSWORD}`));
}

export async function createSession() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `v1.${exp}`;
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

export async function isAdmin() {
  if (!isAdminConfigured()) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const i = raw.lastIndexOf(".");
  if (i < 0) return false;
  const payload = raw.slice(0, i);
  const sig = raw.slice(i + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload.split(".")[1]);
  return Number.isFinite(exp) && exp > Date.now() / 1000;
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
