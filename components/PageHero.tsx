import Link from "next/link";
import type { ReactNode } from "react";

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        {items.map((it, i) => (
          <li key={i}>{it.href ? <Link href={it.href}>{it.label}</Link> : <span aria-current="page">{it.label}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  dark,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  dark?: boolean;
  children?: ReactNode;
}) {
  return (
    <header className={`page-hero ${dark ? "dark on-dark" : ""}`}>
      <div className="container">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="h1">{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}

export function SectionHead({ eyebrow, title, children, single }: { eyebrow: string; title: ReactNode; children?: ReactNode; single?: boolean }) {
  return (
    <div className={`section-head ${single ? "single" : ""}`}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="h2">{title}</h2>
      </div>
      {children && <div className="muted">{children}</div>}
    </div>
  );
}
