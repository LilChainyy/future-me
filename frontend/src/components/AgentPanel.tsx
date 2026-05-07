import StatusBadge from "./StatusBadge";
import CollapsiblePanel from "./CollapsiblePanel";
import type { AgentStatus } from "@/types";

interface Props {
  title: string;
  color: string;
  status: AgentStatus;
  summary: string | null;
  sections: { label: string; items: string[] }[];
  error?: string | null;
}

export default function AgentPanel({
  title,
  color,
  status,
  summary,
  sections,
  error,
}: Props) {
  return (
    <div className="rounded-lg border border-[var(--fm-border)] bg-[var(--fm-paper)] p-4 shadow-[var(--fm-shadow)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--fm-ink)]">
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${color}`} />
          {title}
        </h3>
        <StatusBadge status={status} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Analysis failed. The agent encountered an error."}
        </p>
      ) : !summary ? (
        <p className="text-sm italic text-[var(--fm-muted)]">Waiting for analysis...</p>
      ) : (
        <CollapsiblePanel>
          <div className="space-y-3">
            <p className="text-sm text-[var(--fm-muted)]">{summary}</p>
            {sections.map(
              (section) =>
                section.items.length > 0 && (
                  <div key={section.label}>
                    <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
                      {section.label}
                    </h4>
                    <ul className="space-y-1">
                      {section.items.map((item, i) => (
                        <li
                          key={i}
                          className="text-sm text-[var(--fm-muted)]"
                        >
                          &bull; {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </CollapsiblePanel>
      )}
    </div>
  );
}
