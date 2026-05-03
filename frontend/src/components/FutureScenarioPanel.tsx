import type { FutureScenario, AgentStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import CollapsiblePanel from "./CollapsiblePanel";

interface Props {
  data: FutureScenario | null;
  status: AgentStatus;
  error?: string | null;
}

const scenarioStyles: Record<string, { border: string; accent: string; tag: string }> = {
  "Hopeful Future": {
    border: "border-emerald-300 dark:border-emerald-700",
    accent: "text-emerald-700 dark:text-emerald-400",
    tag: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  "Balanced Future": {
    border: "border-blue-300 dark:border-blue-700",
    accent: "text-blue-700 dark:text-blue-400",
    tag: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  "Cautious Future": {
    border: "border-amber-300 dark:border-amber-700",
    accent: "text-amber-700 dark:text-amber-400",
    tag: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  "Unchanged Path": {
    border: "border-zinc-400 border-dashed dark:border-zinc-500",
    accent: "text-zinc-600 dark:text-zinc-400",
    tag: "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300",
  },
};

const defaultStyle = scenarioStyles["Balanced Future"];

export default function FutureScenarioPanel({ data, status, error }: Props) {
  const style = data ? (scenarioStyles[data.label] ?? defaultStyle) : defaultStyle;
  const isUnchanged = data?.label === "Unchanged Path";

  return (
    <div
      className={`rounded-lg border-2 bg-white p-4 dark:bg-zinc-950 ${style.border}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold ${style.accent}`}>
            {data?.label ?? "Future Scenario"}
          </h3>
          {isUnchanged && (
            <span className={`text-[10px] font-medium rounded px-1.5 py-0.5 ${style.tag}`}>
              What if nothing changes?
            </span>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Scenario generation failed. The agent encountered an error."}
        </p>
      ) : !data ? (
        <p className="text-sm text-zinc-400 italic">
          Waiting for future simulation...
        </p>
      ) : (
        <CollapsiblePanel>
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                Letter from your future self
              </h4>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 italic whitespace-pre-line">
                {data.future_self_letter}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                Key turning points
              </h4>
              <ul className="space-y-1">
                {data.key_turning_points.map((t, i) => (
                  <li key={i} className="text-sm text-zinc-700 dark:text-zinc-300">
                    &bull; {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
                Advice from future self
              </h4>
              <ul className="space-y-1">
                {data.advice_from_future_self.map((a, i) => (
                  <li key={i} className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    &ldquo;{a}&rdquo;
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CollapsiblePanel>
      )}
    </div>
  );
}
