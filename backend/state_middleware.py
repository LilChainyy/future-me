import logging
from datetime import datetime, timezone

from ag_ui.core import StateSnapshotEvent

from autogen.beta.ag_ui import AGUIEvent
from autogen.beta.annotations import Context
from autogen.beta.events import TextInput, ToolCallEvent, ToolErrorEvent
from autogen.beta.middleware.base import ToolExecution, ToolResultType

from .models import (
    FutureSelfOutput,
    ReporterOutput,
)
from .pipeline_state import default_pipeline_state

logger = logging.getLogger("futureme.state")

TOOL_CONFIG: dict[str, tuple[str, type, str]] = {
    "task_future_self": ("future_self_output", FutureSelfOutput, "future_self"),
    "task_reporter": ("reporter_output", ReporterOutput, "reporter"),
}

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


def _extract_text(result: ToolResultType) -> str:
    """Pull text content from a ToolResultEvent."""
    if isinstance(result, ToolErrorEvent):
        return ""
    chunks = []
    for part in result.result.parts:
        if isinstance(part, TextInput):
            chunks.append(part.content)
    return "\n".join(chunks)


def make_state_middleware(tool_name: str):
    """Create a ToolMiddleware for a subagent tool.

    Emits StateSnapshotEvent when the agent starts and finishes.
    """
    field_name, model_cls, step = TOOL_CONFIG[tool_name]
    agent_name = field_name.replace("_output", "")

    async def middleware(
        call_next: ToolExecution,
        event: ToolCallEvent,
        ctx: Context,
    ) -> ToolResultType:
        state = ctx.variables.setdefault("pipeline_state", default_pipeline_state())

        # Mark agent as running
        state["current_step"] = step
        if agent_name not in state["active_agents"]:
            state["active_agents"].append(agent_name)
        await _emit_snapshot(ctx)

        # Execute the subagent tool
        result = await call_next(event, ctx)

        # Remove from active list
        if agent_name in state["active_agents"]:
            state["active_agents"].remove(agent_name)

        # Parse the structured result
        if not isinstance(result, ToolErrorEvent):
            try:
                text = _extract_text(result)
                parsed = model_cls.model_validate_json(text)
                state[field_name] = parsed.model_dump()
            except Exception:
                logger.warning(
                    "Failed to parse %s result", tool_name, exc_info=True
                )

        # Update step based on completion state
        if state.get("reporter_output"):
            state["current_step"] = "complete"
            state["active_agents"] = []
        elif state.get("future_self_output"):
            state["current_step"] = "reporter"

        await _emit_snapshot(ctx)
        return result

    return middleware
