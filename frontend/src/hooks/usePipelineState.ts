"use client";

import { useCoAgent } from "@copilotkit/react-core";
import type {
  AgentStatus,
  DiscussionMessage,
  FutureScenario,
  PipelineState,
} from "@/types";

const INITIAL_STATE: PipelineState = {
  current_step: "gathering",
  active_agents: [],
  captain_briefing: null,
  discussion_transcript: [],
  optimist_output: null,
  realist_output: null,
  risk_analyst_output: null,
  future_self_output: null,
  reporter_output: null,
};

interface CoAgentState {
  pipeline_state?: PipelineState;
}

function deriveStatus(
  data: unknown,
  activeAgents: string[],
  agentName: string,
): AgentStatus {
  if (data) return "complete";
  if (activeAgents.includes(agentName)) return "running";
  return "waiting";
}

export function usePipelineState() {
  const { state, running } = useCoAgent<CoAgentState>({
    name: "captain",
    initialState: {},
  });

  const ps = state?.pipeline_state ?? INITIAL_STATE;

  const captainBriefingStatus: AgentStatus = ps.captain_briefing
    ? "complete"
    : running
      ? "running"
      : "waiting";

  const discussionTranscript: DiscussionMessage[] = ps.discussion_transcript ?? [];
  const discussionStatus: AgentStatus =
    ps.current_step === "discussion"
      ? "running"
      : discussionTranscript.length > 0
        ? "complete"
        : "waiting";

  const optimistStatus = deriveStatus(ps.optimist_output, ps.active_agents, "optimist");
  const realistStatus = deriveStatus(ps.realist_output, ps.active_agents, "realist");
  const riskAnalystStatus = deriveStatus(
    ps.risk_analyst_output,
    ps.active_agents,
    "risk_analyst",
  );

  const scenarioStatus: AgentStatus = ps.future_self_output
    ? "complete"
    : ps.active_agents.includes("future_self")
      ? "running"
      : "waiting";

  const reportStatus: AgentStatus = ps.reporter_output
    ? "complete"
    : ps.active_agents.includes("reporter")
      ? "running"
      : "waiting";

  const scenarios: (FutureScenario | null)[] = ps.future_self_output?.scenarios
    ? [
        ps.future_self_output.scenarios[0] ?? null,
        ps.future_self_output.scenarios[1] ?? null,
        ps.future_self_output.scenarios[2] ?? null,
        ps.future_self_output.scenarios[3] ?? null,
      ]
    : [null, null, null, null];

  return {
    pipelineState: ps,
    running,
    activeAgents: ps.active_agents,
    captainBriefing: ps.captain_briefing,
    captainBriefingStatus,
    discussionTranscript,
    discussionStatus,
    optimistOutput: ps.optimist_output,
    optimistStatus,
    realistOutput: ps.realist_output,
    realistStatus,
    riskAnalystOutput: ps.risk_analyst_output,
    riskAnalystStatus,
    scenarios,
    scenarioStatus,
    reporterOutput: ps.reporter_output,
    reportStatus,
  };
}
