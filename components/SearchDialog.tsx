"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IconClose, IconSearch } from "./Icons";

interface Hit {
  title: string;
  url: string;
  kind: string;
  excerpt: string;
}

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits(null);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setHits(d.results ?? []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Search Youth Policy Lab">
        <form
          className="modal-head"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (q.trim()) {
              router.push(`/search?q=${encodeURIComponent(q.trim())}`);
              onClose();
            }
          }}
        >
          <IconSearch className="s" />
          <label htmlFor="site-search" className="sr-only">
            Search publications, briefs, initiatives and topics
          </label>
          <input
            ref={inputRef}
            id="site-search"
            type="search"
            placeholder="Search research, briefs, initiatives, topics…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close search">
            <IconClose />
          </button>
        </form>
        <div className="modal-body" aria-live="polite">
          {q.trim().length < 2 ? (
            <p className="muted mb-0" style={{ fontSize: "0.9rem" }}>
              Type at least two characters. Press <span className="kbd">Enter</span> for the full results page.
            </p>
          ) : loading && !hits ? (
            <p className="muted mb-0">Searching…</p>
          ) : hits && hits.length === 0 ? (
            <p className="muted mb-0">No matches for “{q.trim()}”. Try a broader term or browse the <Link href="/research" onClick={onClose}>research library</Link>.</p>
          ) : (
            <ul className="quick-results">
              {hits?.slice(0, 8).map((h) => (
                <li key={h.url}>
                  <Link href={h.url} onClick={onClose}>
                    <span className="meta">{h.kind}</span>
                    <span className="t">{h.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {hits && hits.length > 0 && (
            <p className="mt-2 mb-0">
              <Link className="link-arrow" href={`/search?q=${encodeURIComponent(q.trim())}`} onClick={onClose}>
                See all results →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
