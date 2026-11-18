import Link from "next/link";
import { initiativeKindLabel } from "@/lib/site";
import type { Initiative } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export function dateRange(i: Initiative) {
  if (!i.start_date) return "";
  const s = formatDate(i.start_date);
  if (!i.end_date || i.end_date === i.start_date) return s;
  return `${s} – ${formatDate(i.end_date)}`;
}

export function EventCard({ i }: { i: Initiative }) {
  return (
    <article className="event-card">
      <div className="flex-between">
        <span className="meta">{initiativeKindLabel(i.kind)}</span>
        <span className={`status ${i.status}`}>{i.status}</span>
      </div>
      <h3>
        <Link href={`/initiatives/${i.slug}`}>{i.title}</Link>
      </h3>
      <p>{i.summary}</p>
      <div className="event-foot">
        <span className="meta">{dateRange(i) || "Dates to be announced"}</span>
        {i.location && <span className="meta">{i.location}</span>}
      </div>
    </article>
  );
}
