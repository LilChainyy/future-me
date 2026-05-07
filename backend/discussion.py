import asyncio
import json
from datetime import datetime, timezone

from ag_ui.core import StateSnapshotEvent

from autogen.beta import Agent
from autogen.beta.ag_ui import AGUIEvent
from autogen.beta.annotations import Context
from autogen.beta.tools.final import tool

from .config import worker_config
from .models import (
    DiscussionMessage,
    OptimistOutput,
    RealistOutput,
    RiskAnalystOutput,
)
from .pipeline_state import default_pipeline_state
from .prompts_discussion import (
    OPTIMIST_DISCUSSION_PROMPT,
    REALIST_DISCUSSION_PROMPT,
    RISK_DISCUSSION_PROMPT,
)
from .prompts_specialists import (
    OPTIMIST_PROMPT,
    REALIST_PROMPT,
    RISK_ANALYST_PROMPT,
)


def _timestamp() -> int:
    return int(datetime.now(timezone.utc).timestamp() * 1000)


async def _emit_snapshot(ctx: Context) -> None:
    state = ctx.variables.get("pipeline_state")
    if state is None:
        return
    await ctx.send(
        AGUIEvent(
            StateSnapshotEvent(
                snapshot={"pipeline_state": state},
                timestamp=_timestamp(),
            )
        )
    )


@tool(
    name="run_specialist_discussion",
    description=(
        "Run a 2-round discussion between the Optimist, Realist, and Risk Analyst "
        "specialists, then collect their final structured analyses. Returns JSON with "
        "the discussion transcript and three structured outputs."
    ),
)
async def run_specialist_discussion(ctx: Context, briefing_text: str) -> str:
    """Orchestrate specialist discussion and produce structured outputs."""
    state = ctx.variables.setdefault("pipeline_state", default_pipeline_state())

    state["current_step"] = "discussion"
    state["active_agents"] = ["optimist", "realist", "risk_analyst"]
    state["discussion_transcript"] = []
    await _emit_snapshot(ctx)

    # Discussion agents (free-text, no response_schema)
    disc_optimist = Agent(
        name="optimist",
        prompt=OPTIMIST_DISCUSSION_PROMPT,
        config=worker_config,
    )
    disc_realist = Agent(
        name="realist",
        prompt=REALIST_DISCUSSION_PROMPT,
        config=worker_config,
    )
    disc_risk = Agent(
        name="risk_analyst",
        prompt=RISK_DISCUSSION_PROMPT,
        config=worker_config,
    )

    transcript: list[dict] = []

    # Round 1: Opening positions (sequential for live-chat feel)
    agents_r1 = [
        ("optimist", disc_optimist),
        ("realist", disc_realist),
        ("risk_analyst", disc_risk),
    ]
    for name, agent in agents_r1:
        state["active_agents"] = [name]
        await _emit_snapshot(ctx)

        reply = await agent.ask(briefing_text)
        msg = DiscussionMessage(speaker=name, round=1, content=reply.body)
        transcript.append(msg.model_dump())

        state["discussion_transcript"] = list(transcript)
        await _emit_snapshot(ctx)

    # Build round 1 summary for round 2 input
    r1_summary = "## Round 1 — Opening Positions\n\n"
    for msg in transcript:
        r1_summary += f"**{msg['speaker']}**: {msg['content']}\n\n"

    round2_prompt = (
        f"Here is the original briefing:\n\n{briefing_text}\n\n"
        f"Here is what each specialist said in Round 1:\n\n{r1_summary}\n"
        "Now respond to the other agents' points. Build on, challenge, or "
        "refine their perspectives. 3-5 sentences."
    )

    # Round 2: Cross-examination (sequential for live-chat feel)
    agents_r2 = [
        ("optimist", disc_optimist),
        ("realist", disc_realist),
        ("risk_analyst", disc_risk),
    ]
    for name, agent in agents_r2:
        state["active_agents"] = [name]
        await _emit_snapshot(ctx)

        reply = await agent.ask(round2_prompt)
        msg = DiscussionMessage(speaker=name, round=2, content=reply.body)
        transcript.append(msg.model_dump())

        state["discussion_transcript"] = list(transcript)
        await _emit_snapshot(ctx)

    # Build full transcript for final structured pass
    full_transcript = "## Discussion Transcript\n\n"
    for msg in transcript:
        full_transcript += (
            f"**{msg['speaker']}** (Round {msg['round']}): {msg['content']}\n\n"
        )

    final_prompt = (
        f"Here is the original briefing:\n\n{briefing_text}\n\n"
        f"{full_transcript}\n"
        "Based on the briefing and the discussion above, produce your final "
        "structured analysis."
    )

    # Final pass: structured output (parallel)
    final_optimist = Agent(
        name="optimist",
        prompt=OPTIMIST_PROMPT,
        config=worker_config,
        response_schema=OptimistOutput,
    )
    final_realist = Agent(
        name="realist",
        prompt=REALIST_PROMPT,
        config=worker_config,
        response_schema=RealistOutput,
    )
    final_risk = Agent(
        name="risk_analyst",
        prompt=RISK_ANALYST_PROMPT,
        config=worker_config,
        response_schema=RiskAnalystOutput,
    )

    final_results = await asyncio.gather(
        final_optimist.ask(final_prompt),
        final_realist.ask(final_prompt),
        final_risk.ask(final_prompt),
    )

    optimist_output = await final_results[0].content()
    realist_output = await final_results[1].content()
    risk_output = await final_results[2].content()

    # Store in pipeline state
    state["optimist_output"] = optimist_output.model_dump()
    state["realist_output"] = realist_output.model_dump()
    state["risk_analyst_output"] = risk_output.model_dump()
    state["current_step"] = "future_self"
    state["active_agents"] = []
    await _emit_snapshot(ctx)

    # Return JSON for the Consultant to pass downstream
    result = {
        "discussion_transcript": transcript,
        "optimist_output": optimist_output.model_dump(),
        "realist_output": realist_output.model_dump(),
        "risk_analyst_output": risk_output.model_dump(),
    }
    return json.dumps(result)
