from typing import Literal

from pydantic import BaseModel

from .models import (
    CaptainBriefing,
    FutureSelfOutput,
    OptimistOutput,
    RealistOutput,
    ReporterOutput,
    RiskAnalystOutput,
)


class PipelineState(BaseModel):
    current_step: Literal[
        "gathering", "specialists", "future_self", "reporter", "complete"
    ] = "gathering"
    active_agents: list[str] = []
    captain_briefing: CaptainBriefing | None = None
    optimist_output: OptimistOutput | None = None
    realist_output: RealistOutput | None = None
    risk_analyst_output: RiskAnalystOutput | None = None
    future_self_output: FutureSelfOutput | None = None
    reporter_output: ReporterOutput | None = None
