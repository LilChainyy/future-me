import type { CaptainBriefing, AgentStatus } from "@/types";
import StatusBadge from "./StatusBadge";
import BulletList from "./BulletList";

interface Props {
  data: CaptainBriefing | null;
  status: AgentStatus;
  error?: string | null;
}

export default function CaptainBriefingPanel({ data, status, error }: Props) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Captain Briefing
        </h3>
        <StatusBadge status={status} />
      </div>
      {status === "error" ? (
        <p className="text-sm text-red-600 dark:text-red-400">
          {error ?? "Context gathering failed. The agent encountered an error."}
        </p>
      ) : !data ? (
        <p className="text-sm text-zinc-400 italic">
          Waiting for context gathering...
        </p>
      ) : (
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
              &ldquo;{data.original_question}&rdquo;
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              Type: {data.decision_type}
            </p>
          </div>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {data.context_summary}
          </p>
          <BulletList title="Values" items={data.user_values} />
          <BulletList title="Hopes" items={data.hopes} />
          <BulletList title="Fears" items={data.fears} />
          <BulletList title="Constraints" items={data.constraints} />
          <BulletList title="Red Flags" items={data.red_flags} />
          <BulletList title="Missing Info" items={data.missing_information} />
        </div>
      )}
    </div>
  );
}
