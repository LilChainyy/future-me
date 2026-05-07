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
    border: "border-[color-mix(in_srgb,var(--fm-sage)_55%,var(--fm-border))]",
    accent: "text-[var(--fm-sage)]",
    tag: "bg-[color-mix(in_srgb,var(--fm-sage)_18%,transparent)] text-[var(--fm-sage)]",
  },
  "Balanced Future": {
    border: "border-[color-mix(in_srgb,var(--fm-slate)_50%,var(--fm-border))]",
    accent: "text-[var(--fm-slate)]",
    tag: "bg-[color-mix(in_srgb,var(--fm-slate)_16%,transparent)] text-[var(--fm-slate)]",
  },
  "Cautious Future": {
    border: "border-[color-mix(in_srgb,var(--fm-ochre)_50%,var(--fm-border))]",
    accent: "text-[var(--fm-ochre)]",
    tag: "bg-[color-mix(in_srgb,var(--fm-ochre)_18%,transparent)] text-[var(--fm-ochre)]",
  },
  "Unchanged Path": {
    border: "border-[var(--fm-border-strong)] border-dashed",
    accent: "text-[var(--fm-muted)]",
    tag: "bg-[var(--fm-paper-soft)] text-[var(--fm-muted)]",
  },
};

const defaultStyle = scenarioStyles["Balanced Future"];

export default function FutureScenarioPanel({ data, status, error }: Props) {
  const style = data ? (scenarioStyles[data.label] ?? defaultStyle) : defaultStyle;
  const isUnchanged = data?.label === "Unchanged Path";

  return (
    <div
      className={`rounded-lg border-2 bg-[var(--fm-paper)] p-4 shadow-[var(--fm-shadow)] ${style.border}`}
    >
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
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
        <p className="text-sm italic text-[var(--fm-muted)]">
          Waiting for future simulation...
        </p>
      ) : (
        <CollapsiblePanel>
          <div className="space-y-3">
            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
                Letter from your future self
              </h4>
              <p className="whitespace-pre-line text-sm italic text-[var(--fm-muted)]">
                {data.future_self_letter}
              </p>
            </div>

            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
                Key turning points
              </h4>
              <ul className="space-y-1">
                {data.key_turning_points.map((t, i) => (
                  <li key={i} className="text-sm text-[var(--fm-muted)]">
                    &bull; {t}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
                Advice from future self
              </h4>
              <ul className="space-y-1">
                {data.advice_from_future_self.map((a, i) => (
                  <li key={i} className="text-sm font-medium text-[var(--fm-ink)]">
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
