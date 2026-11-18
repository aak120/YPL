import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { DynamicForm } from "@/components/DynamicForm";
import { SocialLinks } from "@/components/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Youth Policy Lab about research collaboration, partnerships, advisory roles or general questions.",
  alternates: { canonical: "/contact" },
};

const topics = [
  { t: "General enquiries", d: "Questions about YPL, our work or our publications." },
  { t: "Research collaboration", d: "Co-authoring, data sharing, or joint research with schools, universities and institutes." },
  { t: "Partnerships", d: "Events, programmes and initiatives with civic, academic or public organisations." },
  { t: "Advisor enquiries", d: <>Interested in advising? You can also <Link href="/get-involved/advisor">apply directly</Link>.</> },
];

export default function ContactPage() {
  const hasSocial = Object.values(site.social).some(Boolean);
  return (
    <>
      <PageHero eyebrow="Contact" title="Get in touch" lede="We read every message. Choose the type of enquiry so it reaches the right people." crumbs={[{ label: "Contact" }]} />
      <section className="section">
        <div className="container split">
          <div className="sticky-col">
            <dl className="def-list">
              {topics.map((x) => (
                <div key={x.t} style={{ gridTemplateColumns: "1fr" }}>
                  <dt>{x.t}</dt>
                  <dd>{x.d}</dd>
                </div>
              ))}
              <div style={{ gridTemplateColumns: "1fr" }}>
                <dt>Email</dt>
                <dd>{site.contact.email ? <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <span className="muted">Please use the form — a public email address will be added here.</span>}</dd>
              </div>
              <div style={{ gridTemplateColumns: "1fr" }}>
                <dt>Based in</dt>
                <dd>{site.contact.location}</dd>
              </div>
            </dl>
            {hasSocial && (
              <div className="mt-3" style={{ color: "var(--ink)" }}>
                <p className="meta">Follow</p>
                <div className="contact-socials"><SocialLinks /></div>
              </div>
            )}
          </div>
          <div>
            <DynamicForm
              formId="contact"
              submitLabel="Send message"
              success={{ title: "Message sent", body: <p>Thank you — your message has been saved and the YPL team will reply by email.</p> }}
            />
          </div>
        </div>
      </section>
    </>
  );
}
