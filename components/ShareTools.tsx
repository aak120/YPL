"use client";
import { useState } from "react";

export function CopyButton({ text, label = "Copy", className = "btn btn-outline btn-sm" }: { text: string; label?: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          setTimeout(() => setDone(false), 2000);
        } catch {}
      }}
    >
      <span aria-live="polite">{done ? "Copied ✓" : label}</span>
    </button>
  );
}

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [canShare] = useState(() => typeof navigator !== "undefined" && "share" in navigator);
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title);
  return (
    <div className="share-row">
      {canShare && (
        <button type="button" className="btn btn-outline btn-sm" onClick={() => navigator.share({ title, url }).catch(() => {})}>
          Share…
        </button>
      )}
      <a className="btn btn-outline btn-sm" href={`https://www.linkedin.com/sharing/share-offsite/?url=${u}`} target="_blank" rel="noopener noreferrer">
        LinkedIn
      </a>
      <a className="btn btn-outline btn-sm" href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} target="_blank" rel="noopener noreferrer">
        X
      </a>
      <a className="btn btn-outline btn-sm" href={`mailto:?subject=${t}&body=${u}`}>
        Email
      </a>
      <CopyButton text={url} label="Copy link" />
    </div>
  );
}
