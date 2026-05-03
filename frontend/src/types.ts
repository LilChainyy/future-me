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
  growth_opportunities: string[];
  relationship_or_life_upside: string[];
  conditions_needed_for_success: string[];
  encouraging_questions: string[];
}

export interface RealistOutput {
  summary: string;
  most_likely_future: string;
  practical_considerations: string[];
  tradeoffs: string[];
  open_questions: string[];
  near_term_actions: string[];
  decision_checkpoints: string[];
}

export interface RiskAnalystOutput {
  summary: string;
  major_risks: string[];
  red_flags: string[];
  hidden_costs: string[];
  failure_modes: string[];
  risk_mitigation_steps: string[];
  stop_signals: string[];
  professional_support_recommended: string[];
}

export interface FutureScenario {
  label: string;
  weights: Record<string, number>;
  future_self_letter: string;
  what_life_feels_like: string;
  likely_rewards: string[];
  likely_regrets: string[];
  key_turning_points: string[];
  advice_from_future_self: string[];
}

export interface ReporterOutput {
  executive_summary: string;
  original_question: string;
  context_summary: string;
  optimist_summary: string;
  realist_summary: string;
  risk_summary: string;
  scenario_comparison: string[];
  common_themes: string[];
  major_uncertainties: string[];
  decision_framework: string[];
  recommended_next_steps: string[];
  questions_to_reflect_on: string[];
  final_note: string;
}
