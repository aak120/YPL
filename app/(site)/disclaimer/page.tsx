import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Terms covering Youth Policy Lab's research, publications and AI assistant.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHero eyebrow="Disclaimer" title="Disclaimer" crumbs={[{ label: "Disclaimer" }]} />
      <section className="section">
        <div className="container narrow prose">
          <h2>Research and publications</h2>
          <p>YPL publications are produced by young researchers and reviewed internally. They represent the views of their named authors, not necessarily those of YPL as a whole, its board or its advisors. Advisors who review work do not thereby endorse its conclusions.</p>
          <p>We work to ensure accuracy, but publications may contain errors and are provided for information and public discussion, not as professional, legal or financial advice. If you find an error, please <Link href="/contact">tell us</Link> — corrections are made openly.</p>
          <h2>Open access and reuse</h2>
          <p>YPL research is free to read, download and share. Please cite the original publication and link back to its page when quoting or reusing it.</p>
          <h2>AI assistant</h2>
          <p>The website assistant generates answers automatically from content published on this site. Responses may be incomplete or wrong. Always check the linked source pages; the assistant&apos;s answers are not official YPL statements.</p>
          <h2>External links</h2>
          <p>We are not responsible for the content of external websites linked from this site.</p>
        </div>
      </section>
    </>
  );
}
