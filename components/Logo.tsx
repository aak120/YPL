import Link from "next/link";

/** YPL wordmark: a ruled square "lab" mark with a rising line. */
export function LogoMark({ className = "brand-mark" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="0.75" y="0.75" width="38.5" height="38.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M0.75 27.5h38.5" stroke="currentColor" strokeWidth="1" opacity=".35" />
      <path d="M7 31L15.5 21.5L21.5 25.5L33 9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
      <circle cx="33" cy="9" r="2.6" fill="#2a6b6e" />
    </svg>
  );
}

export function Logo({ sub = "Policy Research Initiative" }: { sub?: string }) {
  return (
    <Link href="/" className="brand" aria-label="Youth Policy Lab — home">
      <LogoMark />
      <span className="brand-text">
        <span className="brand-name">Youth Policy Lab</span>
        <span className="brand-sub">{sub}</span>
      </span>
    </Link>
  );
}
