from typing import Any, Literal

from pydantic import BaseModel, Field

from .models import (
    ConsultantBriefing,
    DiscussionMessage,
    FutureSelfOutput,
    OptimistOutput,
    RealistOutput,
    ReporterOutput,
    RiskAnalystOutput,
)


class PipelineState(BaseModel):
    current_step: Literal[
        "gathering",
        "specialists",
        "discussion",
        "future_self",
        "reporter",
        "complete",
    ] = "gathering"
    active_agents: list[str] = Field(default_factory=list)
    consultant_briefing: ConsultantBriefing | None = None
    discussion_transcript: list[DiscussionMessage] = Field(default_factory=list)
    optimist_output: OptimistOutput | None = None
    realist_output: RealistOutput | None = None
    risk_analyst_output: RiskAnalystOutput | None = None
    future_self_output: FutureSelfOutput | None = None
    reporter_output: ReporterOutput | None = None


def default_pipeline_state() -> dict[str, Any]:
    """Return a fresh AG-UI pipeline state snapshot."""
    return PipelineState().model_dump()
