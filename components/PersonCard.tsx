/* eslint-disable @next/next/no-img-element */
import type { Person } from "@/lib/types";
import { initials } from "@/lib/utils";

export function PersonCard({ p }: { p: Person }) {
  return (
    <article className="person">
      <div className="avatar">
        {p.photo_url ? <img src={p.photo_url} alt={`Portrait of ${p.name}`} loading="lazy" /> : <span className="ini" aria-hidden>{initials(p.name)}</span>}
      </div>
      <div>
        <h3>{p.name}</h3>
        <div className="role">{p.role}{p.department ? ` · ${p.department}` : ""}</div>
      </div>
      {p.bio && <p className="bio">{p.bio}</p>}
      {p.expertise && p.expertise.length > 0 && (
        <div className="tags">
          {p.expertise.map((e) => (
            <span key={e} className="tag">{e}</span>
          ))}
        </div>
      )}
      {p.linkedin_url && (
        <div className="person-links">
          <a href={p.linkedin_url} target="_blank" rel="noopener noreferrer">LinkedIn profile ↗</a>
        </div>
      )}
    </article>
  );
}
