import type { ReporterOutput, AgentStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import BulletList from "./BulletList";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">
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
    <div className="rounded-lg border-2 border-indigo-300 bg-white p-5 dark:border-indigo-700 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-indigo-700 dark:text-indigo-400">
          Final Report
        </h3>
        <StatusBadge status={status} />
      </div>

      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Report generation failed. The agent encountered an error."}
        </p>
      ) : !data ? (
        <p className="text-sm text-zinc-400 italic">
          Waiting for final synthesis...
        </p>
      ) : (
        <div className="space-y-4">
          <Section title="Executive Summary">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              {data.executive_summary}
            </p>
          </Section>

          <Section title="Context">
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              {data.context_summary}
            </p>
          </Section>

          <div className="grid grid-cols-3 gap-3">
            <Section title="Optimist">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {data.optimist_summary}
              </p>
            </Section>
            <Section title="Realist">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {data.realist_summary}
              </p>
            </Section>
            <Section title="Risk Analyst">
              <p className="text-sm text-zinc-700 dark:text-zinc-300">
                {data.risk_summary}
              </p>
            </Section>
          </div>

          <Section title="Scenario Comparison">
            <BulletList items={data.scenario_comparison} />
          </Section>

          <Section title="Common Themes">
            <BulletList items={data.common_themes} />
          </Section>

          <Section title="Major Uncertainties">
            <BulletList items={data.major_uncertainties} />
          </Section>

          <Section title="Decision Framework">
            <BulletList items={data.decision_framework} />
          </Section>

          <Section title="Recommended Next Steps">
            <BulletList items={data.recommended_next_steps} />
          </Section>

          <Section title="Questions to Reflect On">
            <ul className="space-y-1">
              {data.questions_to_reflect_on.map((q, i) => (
                <li
                  key={i}
                  className="text-sm italic text-zinc-700 dark:text-zinc-300"
                >
                  {q}
                </li>
              ))}
            </ul>
          </Section>

          <div className="mt-4 rounded-lg bg-indigo-50 p-4 dark:bg-indigo-900/20">
            <p className="text-sm text-indigo-800 dark:text-indigo-300">
              {data.final_note}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
