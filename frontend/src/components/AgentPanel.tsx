import StatusBadge from "./StatusBadge";
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
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
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
        <p className="text-sm text-zinc-400 italic">Waiting for analysis...</p>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">{summary}</p>
          {sections.map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.label}>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                    {section.label}
                  </h4>
                  <ul className="space-y-1">
                    {section.items.map((item, i) => (
                      <li
                        key={i}
                        className="text-sm text-zinc-700 dark:text-zinc-300"
                      >
                        &bull; {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
