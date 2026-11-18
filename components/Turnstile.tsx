"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string;
      reset: (id?: string) => void;
      remove: (id: string) => void;
    };
  }
}

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  let s = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
  if (!s) {
    s = document.createElement("script");
    s.src = SRC;
    s.async = true;
    document.head.appendChild(s);
  }
  return new Promise((resolve, reject) => {
    s!.addEventListener("load", () => resolve());
    s!.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
    if (window.turnstile) resolve();
  });
}

/** Renders a Cloudflare Turnstile widget and reports the token. `resetKey` changes force a fresh challenge. */
export function Turnstile({ siteKey, onToken, resetKey }: { siteKey: string; onToken: (t: string) => void; resetKey: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const cb = useRef(onToken);
  cb.current = onToken;

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then(() => {
        if (cancelled || !ref.current || !window.turnstile) return;
        widget.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          theme: "light",
          callback: (t: string) => cb.current(t),
          "expired-callback": () => cb.current(""),
          "error-callback": () => cb.current(""),
        });
      })
      .catch(() => cb.current(""));
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetKey && widget.current && window.turnstile) {
      window.turnstile.reset(widget.current);
      cb.current("");
    }
  }, [resetKey]);

  return <div ref={ref} style={{ minHeight: 65 }} />;
}
