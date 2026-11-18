import type { ReactNode } from "react";
import { IconDocument } from "./Icons";

export function EmptyState({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="empty">
      <IconDocument className="empty-icon" />
      <div>
        <h3>{title}</h3>
        <p>{children}</p>
        {actions && <div className="btn-row">{actions}</div>}
      </div>
    </div>
  );
}
