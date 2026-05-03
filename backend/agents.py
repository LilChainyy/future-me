from datetime import datetime, timezone

from ag_ui.core import StateSnapshotEvent

from autogen.beta import Agent
from autogen.beta.ag_ui import AGUIEvent
from autogen.beta.annotations import Context
from autogen.beta.tools.final import tool
from autogen.beta.tools.subagents import subagent_tool

from .config import lead_config
from .models import (
    CaptainBriefing,
    FutureSelfOutput,
    ReporterOutput,
)
from .discussion import run_specialist_discussion
from .prompts_captain import CAPTAIN_PROMPT
from .prompts_specialists import (
    FUTURE_SELF_PROMPT,
    REPORTER_PROMPT,
)
from .state_middleware import make_state_middleware


def _timestamp() -> int:
    return int(datetime.now(timezone.utc).timestamp() * 1000)


@tool(
    name="save_briefing",
    description=(
        "Save the structured context briefing after gathering enough information "
        "from the user. Call this BEFORE delegating to specialist agents."
    ),
)
async def save_briefing(
    ctx: Context,
    original_question: str,
    decision_type: str,
    context_summary: str,
    key_people: list[str],
    known_facts: list[str],
    assumptions: list[str],
    user_values: list[str],
    hopes: list[str],
    fears: list[str],
    constraints: list[str],
    red_flags: list[str],
    missing_information: list[str],
) -> str:
    briefing = CaptainBriefing(
        original_question=original_question,
        decision_type=decision_type,
        context_summary=context_summary,
        key_people=key_people,
        known_facts=known_facts,
        assumptions=assumptions,
        user_values=user_values,
        hopes=hopes,
        fears=fears,
        constraints=constraints,
        red_flags=red_flags,
        missing_information=missing_information,
        tasks={},
    )
    state = ctx.variables.setdefault("pipeline_state", {
        "current_step": "gathering",
        "active_agents": [],
        "captain_briefing": None,
        "discussion_transcript": [],
        "optimist_output": None,
        "realist_output": None,
        "risk_analyst_output": None,
        "future_self_output": None,
        "reporter_output": None,
    })
    state["captain_briefing"] = briefing.model_dump()
    state["current_step"] = "specialists"
    await ctx.send(
        AGUIEvent(
            StateSnapshotEvent(
                snapshot={"pipeline_state": state},
                timestamp=_timestamp(),
            )
        )
    )
    return "Briefing saved. Now call run_specialist_discussion with the full briefing text."


future_self = Agent(
    name="future_self",
    prompt=FUTURE_SELF_PROMPT,
    config=lead_config,
    response_schema=FutureSelfOutput,
)

reporter = Agent(
    name="reporter",
    prompt=REPORTER_PROMPT,
    config=lead_config,
    response_schema=ReporterOutput,
)

captain = Agent(
    name="captain",
    prompt=CAPTAIN_PROMPT,
    config=lead_config,
    tools=[
        save_briefing,
        run_specialist_discussion,
        subagent_tool(
            future_self,
            description="Generate four future-self simulations from the specialist analyses.",
            middleware=[make_state_middleware("task_future_self")],
        ),
        subagent_tool(
            reporter,
            description="Generate the final decision-support report from all analyses and scenarios.",
            middleware=[make_state_middleware("task_reporter")],
        ),
    ],
)
