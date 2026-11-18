import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description: "How Youth Policy Lab collects, uses and protects personal information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy notice" lede="A plain-language explanation of what we collect, why, and how we protect it." crumbs={[{ label: "Privacy" }]} />
      <section className="section">
        <div className="container narrow prose">
          <h2>Reading our research</h2>
          <p>You do not need an account to read or download YPL publications. We do not use advertising or third-party tracking cookies. Our hosting provider may keep standard server logs (such as IP addresses) for security and reliability.</p>

          <h2>Applications and contact messages</h2>
          <p>When you apply to join YPL or send us a message, we collect only the information in the form — for example your name, email, age range, interests and written answers. We use it solely to review your application or respond to your message.</p>
          <ul>
            <li><strong>We do not publish applications.</strong> Names, emails and answers are never shown on the public website.</li>
            <li><strong>Access is restricted</strong> to authorised YPL reviewers through a password-protected admin area.</li>
            <li><strong>We don&apos;t ask for sensitive information</strong> such as home addresses, identity numbers, health or financial details. Please don&apos;t include them.</li>
            <li><strong>Storage:</strong> submissions are stored in a secured database operated by our infrastructure provider (Supabase).</li>
            <li><strong>Retention:</strong> unsuccessful applications are deleted within 12 months; contact messages once the enquiry is resolved, unless an ongoing relationship requires otherwise.</li>
          </ul>

          <h2>Applicants under 18</h2>
          <p>Many YPL applicants are students. We collect an age range only so we can apply appropriate safeguards, and we ask applicants under 18 to confirm that a parent or guardian is aware they are applying. Parents or guardians may contact us to review or delete a young person&apos;s information.</p>

          <h2>The AI assistant</h2>
          <p>Questions you type into the website assistant are sent to our AI provider (Anthropic) to generate a response, and are not stored by YPL. The conversation is kept in your browser only for the current session. Please don&apos;t enter personal information into the assistant.</p>

          <h2>Your rights</h2>
          <p>You can ask us to show, correct or delete information you have submitted. Use the <Link href="/contact">contact form</Link>{site.contact.email ? <> or email <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></> : null} and we will respond promptly.</p>

          <p className="muted">This notice will be updated if our practices change.</p>
        </div>
      </section>
    </>
  );
}
