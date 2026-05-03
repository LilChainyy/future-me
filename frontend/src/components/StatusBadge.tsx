import type { AgentStatus } from "@/types";
import Spinner from "./Spinner";

const config: Record<AgentStatus, { label: string; classes: string }> = {
  waiting: {
    label: "Waiting",
    classes: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400",
  },
  running: {
    label: "Running",
    classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  complete: {
    label: "Complete",
    classes:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
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
