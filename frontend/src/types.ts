export type AgentStatus = "waiting" | "running" | "complete" | "error";

export interface CaptainBriefing {
  original_question: string;
  decision_type: string;
  context_summary: string;
  key_people: string[];
  known_facts: string[];
  assumptions: string[];
  user_values: string[];
  hopes: string[];
  fears: string[];
  constraints: string[];
  red_flags: string[];
  missing_information: string[];
  tasks: Record<string, string>;
}

export interface OptimistOutput {
  summary: string;
  best_case_future: string;
  positive_signals: string[];
  conditions_needed_for_success: string[];
}

export interface RealistOutput {
  summary: string;
  most_likely_future: string;
  practical_considerations: string[];
  tradeoffs: string[];
  open_questions: string[];
}

export interface RiskAnalystOutput {
  summary: string;
  major_risks: string[];
  hidden_costs: string[];
  risk_mitigation_steps: string[];
  stop_signals: string[];
}

export interface FutureScenario {
  label: string;
  weights: Record<string, number>;
  future_self_letter: string;
  key_turning_points: string[];
  advice_from_future_self: string[];
}

export interface FutureSelfOutput {
  scenarios: FutureScenario[];
}

export interface ReporterOutput {
  executive_summary: string;
  optimist_summary: string;
  realist_summary: string;
  risk_summary: string;
  common_themes: string[];
  decision_framework: string[];
  recommended_next_steps: string[];
  final_note: string;
}

export interface DiscussionMessage {
  speaker: string;
  round: number;
  content: string;
}

export interface PipelineState {
  current_step:
    | "gathering"
    | "specialists"
    | "discussion"
    | "future_self"
    | "reporter"
    | "complete";
  active_agents: string[];
  captain_briefing: CaptainBriefing | null;
  discussion_transcript: DiscussionMessage[];
  optimist_output: OptimistOutput | null;
  realist_output: RealistOutput | null;
  risk_analyst_output: RiskAnalystOutput | null;
  future_self_output: FutureSelfOutput | null;
  reporter_output: ReporterOutput | null;
}
