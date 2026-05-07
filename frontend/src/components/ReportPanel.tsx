import type { ReporterOutput, AgentStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import CollapsiblePanel from "./CollapsiblePanel";
import BulletList from "./BulletList";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fm-clay-deep)]">
        {title}
      </h4>
      {children}
    </div>
  );
}

interface Props {
  data: ReporterOutput | null;
  status: AgentStatus;
  error?: string | null;
}

export default function ReportPanel({ data, status, error }: Props) {
  return (
    <div className="rounded-lg border-2 border-[var(--fm-border-strong)] bg-[var(--fm-paper)] p-5 shadow-[var(--fm-shadow)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--fm-clay-deep)]">
          Final Report
        </h3>
        <StatusBadge status={status} />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Report generation failed. The agent encountered an error."}
        </p>
      ) : !data ? (
        <p className="text-sm italic text-[var(--fm-muted)]">
          Waiting for final synthesis...
        </p>
      ) : (
        <CollapsiblePanel>
          <div className="space-y-4">
            <Section title="Executive Summary">
              <p className="text-sm font-medium text-[var(--fm-ink)]">
                {data.executive_summary}
              </p>
            </Section>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <Section title="Optimist">
                <p className="text-sm text-[var(--fm-muted)]">
                  {data.optimist_summary}
                </p>
              </Section>
              <Section title="Realist">
                <p className="text-sm text-[var(--fm-muted)]">
                  {data.realist_summary}
                </p>
              </Section>
              <Section title="Risk Analyst">
                <p className="text-sm text-[var(--fm-muted)]">
                  {data.risk_summary}
                </p>
              </Section>
            </div>

            <Section title="Common Themes">
              <BulletList items={data.common_themes} />
            </Section>

            <Section title="Decision Framework">
              <BulletList items={data.decision_framework} />
            </Section>

            <Section title="Recommended Next Steps">
              <BulletList items={data.recommended_next_steps} />
            </Section>

            <div className="mt-4 rounded-lg bg-[var(--fm-paper-soft)] p-4">
              <p className="text-sm text-[var(--fm-clay-deep)]">
                {data.final_note}
              </p>
            </div>
          </div>
        </CollapsiblePanel>
      )}
    </div>
  );
}
