import "server-only";
import { createHash } from "node:crypto";
import { getSupabase } from "./supabase";

/**
 * Rate limiting. When Supabase is configured, hits are counted in the
 * database (shared across all server instances, so it works on serverless
 * hosts). Otherwise an in-memory window is used as a fallback.
 * Keys are hashed, so raw IP addresses are never stored.
 */
const buckets = new Map<string, number[]>();

function memoryLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return false;
  }
  hits.push(now);
  buckets.set(key, hits);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return true;
}

const hashKey = (key: string) =>
  createHash("sha256")
    .update(`${process.env.ADMIN_SESSION_SECRET ?? "ypl"}:${key}`)
    .digest("base64url")
    .slice(0, 32);

export async function rateLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb.rpc("hit_rate_limit", {
        p_key: hashKey(key),
        p_limit: limit,
        p_window_seconds: Math.ceil(windowMs / 1000),
      });
      if (!error && typeof data === "boolean") return data;
      if (error) console.warn("[rate-limit] falling back to memory:", error.message);
    } catch (e) {
      console.warn("[rate-limit] falling back to memory:", e);
    }
  }
  return memoryLimit(key, limit, windowMs);
}

export function clientIp(req: Request | Headers) {
  const h = req instanceof Headers ? req : req.headers;
  const fwd = h.get("x-forwarded-for");
  return (fwd?.split(",")[0] || h.get("x-real-ip") || "unknown").trim();
}
