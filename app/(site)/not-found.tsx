import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container narrow">
        <p className="eyebrow">Error 404</p>
        <h1 className="h1 mt-2">This page could not be found.</h1>
        <p className="lede mt-3">The link may be out of date, or the publication may have moved.</p>
        <div className="btn-row mt-4">
          <Link href="/" className="btn">Return home</Link>
          <Link href="/research" className="btn btn-outline">Research library</Link>
          <Link href="/search" className="btn btn-outline">Search</Link>
        </div>
      </div>
    </section>
  );
}
