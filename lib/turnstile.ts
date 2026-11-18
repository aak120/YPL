import "server-only";

/**
 * Cloudflare Turnstile (privacy-friendly captcha). Optional: active only when
 * both TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are set.
 */
export const turnstileSiteKey = () =>
  process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.TURNSTILE_SITE_KEY : null;

export async function verifyTurnstile(token: unknown, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.TURNSTILE_SITE_KEY) return true; // not enabled
  if (typeof token !== "string" || !token || token.length > 4096) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip && ip !== "unknown") body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (e) {
    console.error("[turnstile] verification failed:", e);
    return false;
  }
}
