import type { AgentStatus, ConsultantBriefing } from "@/types";
import StatusBadge from "./StatusBadge";
import CollapsiblePanel from "./CollapsiblePanel";
import BulletList from "./BulletList";

interface Props {
  data: ConsultantBriefing | null;
  status: AgentStatus;
  error?: string | null;
}

export default function ConsultantBriefingPanel({ data, status, error }: Props) {
  return (
    <div className="rounded-lg border border-[var(--fm-border)] bg-[var(--fm-paper)] p-4 shadow-[var(--fm-shadow)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-[var(--fm-ink)]">
          What I&apos;m hearing
        </h3>
        <StatusBadge status={status} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Context gathering failed. The agent encountered an error."}
        </p>
      ) : !data ? (
        <p className="text-sm italic text-[var(--fm-muted)]">
          Share what&apos;s been on your mind to begin.
        </p>
      ) : (
        <CollapsiblePanel>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-[var(--fm-ink)]">
                &ldquo;{data.original_question}&rdquo;
              </p>
              <p className="mt-1 text-xs text-[var(--fm-muted)]">
                Type: {data.decision_type}
              </p>
            </div>
            <p className="text-sm text-[var(--fm-muted)]">
              {data.context_summary}
            </p>
            <BulletList title="Values" items={data.user_values} />
            <BulletList title="Hopes" items={data.hopes} />
            <BulletList title="Fears" items={data.fears} />
            <BulletList title="Constraints" items={data.constraints} />
            <BulletList title="Red Flags" items={data.red_flags} />
            <BulletList title="Missing Info" items={data.missing_information} />
          </div>
        </CollapsiblePanel>
      )}
    </div>
  );
}
