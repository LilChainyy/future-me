import type { AgentStatus } from "@/types";
import Spinner from "./Spinner";

const config: Record<AgentStatus, { label: string; classes: string }> = {
  waiting: {
    label: "Waiting",
    classes: "bg-[var(--fm-paper-soft)] text-[var(--fm-muted)]",
  },
  running: {
    label: "Running",
    classes: "bg-[color-mix(in_srgb,var(--fm-clay)_16%,transparent)] text-[var(--fm-clay-deep)]",
  },
  complete: {
    label: "Complete",
    classes:
      "bg-[color-mix(in_srgb,var(--fm-sage)_18%,transparent)] text-[var(--fm-sage)]",
  },
  error: {
    label: "Error",
    classes: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function StatusBadge({ status }: { status: AgentStatus }) {
  const { label, classes } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}
    >
      {status === "running" && <Spinner className="h-3 w-3" />}
      {label}
    </span>
  );
}
