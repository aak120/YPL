import Link from "next/link";
import { site } from "@/lib/site";
import { Logo } from "./Logo";
import { IconInstagram, IconLinkedIn, IconRss, IconX } from "./Icons";

const socialIcons: Record<string, { label: string; Icon: typeof IconX }> = {
  linkedin: { label: "LinkedIn", Icon: IconLinkedIn },
  instagram: { label: "Instagram", Icon: IconInstagram },
  x: { label: "X (Twitter)", Icon: IconX },
  substack: { label: "Newsletter", Icon: IconRss },
};

export function SocialLinks() {
  const entries = Object.entries(site.social).filter(([, url]) => url);
  if (!entries.length) return null;
  return (
    <div className="socials">
      {entries.map(([key, url]) => {
        const s = socialIcons[key];
        if (!s) return null;
        return (
          <a key={key} href={url} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <s.Icon />
          </a>
        );
      })}
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer on-dark">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>
              A youth-led policy research initiative producing evidence-based analysis and practical recommendations on
              public policy challenges. All research is free to read.
            </p>
            <SocialLinks />
          </div>
          <div className="footer-col">
            <h2>Organisation</h2>
            <ul>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/team">Our Team</Link></li>
              <li><Link href="/initiatives">Initiatives &amp; Events</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Research</h2>
            <ul>
              <li><Link href="/research">Research Library</Link></li>
              <li><Link href="/gurgaon-briefs">Mini Gurgaon Policy Briefs</Link></li>
              <li><Link href="/research#focus-areas">Focus Areas</Link></li>
              <li><Link href="/search">Search</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h2>Get Involved</h2>
            <ul>
              <li><Link href="/get-involved/team-member">Join the Team</Link></li>
              <li><Link href="/get-involved/board">Board Membership</Link></li>
              <li><Link href="/get-involved/advisor">Advisory Network</Link></li>
              <li>
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
                ) : (
                  <Link href="/contact">Send us a message</Link>
                )}
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} Youth Policy Lab. Research published under open access.</span>
          <ul>
            <li><Link href="/privacy">Privacy</Link></li>
            <li><Link href="/disclaimer">Disclaimer</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
