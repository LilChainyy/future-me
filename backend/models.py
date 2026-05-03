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

    summary: Annotated[str, Field(description="2-3 sentence optimistic take on the decision")]
    best_case_future: Annotated[str, Field(description="3-4 sentence description of what life looks like if things go well")]
    positive_signals: Annotated[list[str], Field(description="Evidence from the user's situation that supports a good outcome (3 items max)")]
    conditions_needed_for_success: Annotated[list[str], Field(description="What would need to be true for the best case to happen (3 items max)")]


class RealistOutput(BaseModel):
    """Realist Agent's analysis — pragmatic, balanced, grounded in tradeoffs."""

    summary: Annotated[str, Field(description="2-3 sentence realistic assessment of the decision")]
    most_likely_future: Annotated[str, Field(description="3-4 sentence description of what will probably happen based on the facts available")]
    practical_considerations: Annotated[list[str], Field(description="Logistics, costs, timelines, and real-world factors (3 items max)")]
    tradeoffs: Annotated[list[str], Field(description="What the user gains vs. what they give up (3 items max)")]
    open_questions: Annotated[list[str], Field(description="Questions the user should answer before deciding (3 items max)")]


class RiskAnalystOutput(BaseModel):
    """Risk Analyst Agent's analysis — identifies downside without fearmongering."""

    summary: Annotated[str, Field(description="2-3 sentence risk assessment of the decision")]
    major_risks: Annotated[list[str], Field(description="The biggest things that could go wrong (3 items max)")]
    hidden_costs: Annotated[list[str], Field(description="Costs that aren't obvious: emotional, opportunity, social (3 items max)")]
    risk_mitigation_steps: Annotated[list[str], Field(description="Actions that reduce the identified risks (3 items max)")]
    stop_signals: Annotated[list[str], Field(description="Signs that the user should reverse course or pause (3 items max)")]


class FutureScenario(BaseModel):
    """One future-self simulation — a letter from a possible version of the user."""

    label: Annotated[str, Field(description="Scenario name: 'Hopeful Future', 'Balanced Future', 'Cautious Future', or 'Unchanged Path'")]
    weights: Annotated[dict[str, int], Field(description="How much each specialist influenced this scenario, e.g. {'optimist': 70, 'realist': 20, 'risk': 10}")]
    future_self_letter: Annotated[str, Field(description="A reflective letter written as the user's future self, 4-6 sentences")]
    key_turning_points: Annotated[list[str], Field(description="Moments that shaped how this future unfolded (2-3 items max)")]
    advice_from_future_self: Annotated[list[str], Field(description="What the future self would tell the present self (2-3 items max)")]


class FutureSelfOutput(BaseModel):
    """Future Self Agent's output — four scenarios."""

    scenarios: Annotated[list[FutureScenario], Field(description="Exactly four scenarios: Hopeful, Balanced, Cautious, and Unchanged Path")]


class DiscussionMessage(BaseModel):
    """One message in the specialist discussion transcript."""

    speaker: Annotated[str, Field(description="Agent name: optimist, realist, or risk_analyst")]
    round: Annotated[int, Field(description="Discussion round: 1 or 2")]
    content: Annotated[str, Field(description="The agent's contribution")]


class ReporterOutput(BaseModel):
    """Reporter Agent's final decision-support report — synthesizes everything."""

    executive_summary: Annotated[str, Field(description="2 sentence overview of the entire analysis")]
    optimist_summary: Annotated[str, Field(description="1 sentence key takeaway from the Optimist Agent")]
    realist_summary: Annotated[str, Field(description="1 sentence key takeaway from the Realist Agent")]
    risk_summary: Annotated[str, Field(description="1 sentence key takeaway from the Risk Analyst Agent")]
    common_themes: Annotated[list[str], Field(description="Themes that appeared across multiple agents (3 items max)")]
    decision_framework: Annotated[list[str], Field(description="A structured way to think about this decision (3 items max)")]
    recommended_next_steps: Annotated[list[str], Field(description="Actionable steps the user can take now (3 items max)")]
    final_note: Annotated[str, Field(description="2 sentence warm, grounding closing message reminding the user this is their decision")]
