import type {
  AgentStatus,
  OptimistOutput,
  RealistOutput,
  RiskAnalystOutput,
} from "@/types";
import AgentPanel from "./AgentPanel";

interface Props {
  optimistOutput: OptimistOutput | null;
  optimistStatus: AgentStatus;
  realistOutput: RealistOutput | null;
  realistStatus: AgentStatus;
  riskAnalystOutput: RiskAnalystOutput | null;
  riskAnalystStatus: AgentStatus;
}

export default function SpecialistPanels({
  optimistOutput,
  optimistStatus,
  realistOutput,
  realistStatus,
  riskAnalystOutput,
  riskAnalystStatus,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <AgentPanel
        title="Optimist"
        color="bg-[var(--fm-sage)]"
        status={optimistStatus}
        summary={optimistOutput?.summary ?? null}
        sections={
          optimistOutput
            ? [
                {
                  label: "Best Case Future",
                  items: [optimistOutput.best_case_future],
                },
                {
                  label: "Positive Signals",
                  items: optimistOutput.positive_signals,
                },
                {
                  label: "Conditions for Success",
                  items: optimistOutput.conditions_needed_for_success,
                },
              ]
            : []
        }
      />
      <AgentPanel
        title="Realist"
        color="bg-[var(--fm-slate)]"
        status={realistStatus}
        summary={realistOutput?.summary ?? null}
        sections={
          realistOutput
            ? [
                {
                  label: "Most Likely Future",
                  items: [realistOutput.most_likely_future],
                },
                {
                  label: "Practical Considerations",
                  items: realistOutput.practical_considerations,
                },
                { label: "Tradeoffs", items: realistOutput.tradeoffs },
                { label: "Open Questions", items: realistOutput.open_questions },
              ]
            : []
        }
      />
      <AgentPanel
        title="Risk Analyst"
        color="bg-[var(--fm-ochre)]"
        status={riskAnalystStatus}
        summary={riskAnalystOutput?.summary ?? null}
        sections={
          riskAnalystOutput
            ? [
                { label: "Major Risks", items: riskAnalystOutput.major_risks },
                {
                  label: "Hidden Costs",
                  items: riskAnalystOutput.hidden_costs,
                },
                {
                  label: "Risk Mitigation",
                  items: riskAnalystOutput.risk_mitigation_steps,
                },
                { label: "Stop Signals", items: riskAnalystOutput.stop_signals },
              ]
            : []
        }
      />
    </div>
  );
}
