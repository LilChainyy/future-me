from typing import Annotated

from pydantic import BaseModel, Field


class CaptainBriefing(BaseModel):
    """Captain Agent's structured briefing after gathering context from the user."""

    original_question: Annotated[str, Field(description="The user's original decision question, quoted verbatim")]
    decision_type: Annotated[str, Field(description="Category: career, relationship, family, financial, health, relocation, etc.")]
    context_summary: Annotated[str, Field(description="2-3 sentence summary of the user's situation and what's at stake")]
    key_people: Annotated[list[str], Field(description="People involved in or affected by this decision")]
    known_facts: Annotated[list[str], Field(description="Concrete facts the user has shared")]
    assumptions: Annotated[list[str], Field(description="Things the user seems to assume but hasn't confirmed")]
    user_values: Annotated[list[str], Field(description="Values the user has expressed or implied (freedom, security, family, growth, etc.)")]
    hopes: Annotated[list[str], Field(description="What the user hopes will happen")]
    fears: Annotated[list[str], Field(description="What the user is afraid of")]
    constraints: Annotated[list[str], Field(description="Hard limits: financial, geographic, time, legal, health")]
    red_flags: Annotated[list[str], Field(description="Warning signs or concerns the Captain noticed")]
    missing_information: Annotated[list[str], Field(description="Important unknowns that could change the analysis")]
    tasks: Annotated[dict[str, str], Field(description="Briefing for each specialist agent, keys: optimist, realist, risk_analyst")]


class OptimistOutput(BaseModel):
    """Optimist Agent's analysis — explores upside without toxic positivity."""

    summary: Annotated[str, Field(description="One-paragraph optimistic take on the decision")]
    best_case_future: Annotated[str, Field(description="Vivid description of what life looks like if things go well")]
    positive_signals: Annotated[list[str], Field(description="Evidence from the user's situation that supports a good outcome")]
    growth_opportunities: Annotated[list[str], Field(description="Ways the user could grow personally or professionally")]
    relationship_or_life_upside: Annotated[list[str], Field(description="Potential positive effects on relationships, lifestyle, or wellbeing")]
    conditions_needed_for_success: Annotated[list[str], Field(description="What would need to be true for the best case to happen")]
    encouraging_questions: Annotated[list[str], Field(description="Reflective questions that help the user see possibility")]


class RealistOutput(BaseModel):
    """Realist Agent's analysis — pragmatic, balanced, grounded in tradeoffs."""

    summary: Annotated[str, Field(description="One-paragraph realistic assessment of the decision")]
    most_likely_future: Annotated[str, Field(description="What will probably happen based on the facts available")]
    practical_considerations: Annotated[list[str], Field(description="Logistics, costs, timelines, and real-world factors")]
    tradeoffs: Annotated[list[str], Field(description="What the user gains vs. what they give up")]
    open_questions: Annotated[list[str], Field(description="Questions the user should answer before deciding")]
    near_term_actions: Annotated[list[str], Field(description="Concrete steps the user could take in the next 1-4 weeks")]
    decision_checkpoints: Annotated[list[str], Field(description="Future moments where the user should reassess")]


class RiskAnalystOutput(BaseModel):
    """Risk Analyst Agent's analysis — identifies downside without fearmongering."""

    summary: Annotated[str, Field(description="One-paragraph risk assessment of the decision")]
    major_risks: Annotated[list[str], Field(description="The biggest things that could go wrong")]
    red_flags: Annotated[list[str], Field(description="Warning signs the user should watch for")]
    hidden_costs: Annotated[list[str], Field(description="Costs that aren't obvious: emotional, opportunity, social")]
    failure_modes: Annotated[list[str], Field(description="Specific ways this decision could fail")]
    risk_mitigation_steps: Annotated[list[str], Field(description="Actions that reduce the identified risks")]
    stop_signals: Annotated[list[str], Field(description="Signs that the user should reverse course or pause")]
    professional_support_recommended: Annotated[list[str], Field(description="Types of professional help that might be relevant (therapist, lawyer, financial advisor, etc.)")]


class FutureScenario(BaseModel):
    """One future-self simulation — a letter from a possible version of the user."""

    label: Annotated[str, Field(description="Scenario name: 'Hopeful Future', 'Balanced Future', or 'Cautious Future'")]
    weights: Annotated[dict[str, int], Field(description="How much each specialist influenced this scenario, e.g. {'optimist': 70, 'realist': 20, 'risk': 10}")]
    future_self_letter: Annotated[str, Field(description="A reflective letter written as the user's future self, 2-3 paragraphs")]
    what_life_feels_like: Annotated[str, Field(description="Sensory, emotional description of daily life in this scenario")]
    likely_rewards: Annotated[list[str], Field(description="What the user gained in this future")]
    likely_regrets: Annotated[list[str], Field(description="What the user wishes they had done differently")]
    key_turning_points: Annotated[list[str], Field(description="Moments that shaped how this future unfolded")]
    advice_from_future_self: Annotated[list[str], Field(description="What the future self would tell the present self")]


class FutureSelfOutput(BaseModel):
    """Future Self Agent's output — four scenarios."""

    scenarios: Annotated[list[FutureScenario], Field(description="Exactly four scenarios: Hopeful, Balanced, Cautious, and Unchanged Path")]


class ReporterOutput(BaseModel):
    """Reporter Agent's final decision-support report — synthesizes everything."""

    executive_summary: Annotated[str, Field(description="2-3 sentence overview of the entire analysis")]
    original_question: Annotated[str, Field(description="The user's decision question")]
    context_summary: Annotated[str, Field(description="Brief recap of the user's situation")]
    optimist_summary: Annotated[str, Field(description="Key takeaway from the Optimist Agent")]
    realist_summary: Annotated[str, Field(description="Key takeaway from the Realist Agent")]
    risk_summary: Annotated[str, Field(description="Key takeaway from the Risk Analyst Agent")]
    scenario_comparison: Annotated[list[str], Field(description="Side-by-side comparison points across all four future scenarios including the Unchanged Path")]
    common_themes: Annotated[list[str], Field(description="Themes that appeared across multiple agents")]
    major_uncertainties: Annotated[list[str], Field(description="The biggest unknowns that could change everything")]
    decision_framework: Annotated[list[str], Field(description="A structured way to think about this decision")]
    recommended_next_steps: Annotated[list[str], Field(description="Actionable steps the user can take now")]
    questions_to_reflect_on: Annotated[list[str], Field(description="Deep questions for the user to sit with")]
    final_note: Annotated[str, Field(description="Warm, grounding closing message reminding the user this is their decision")]
