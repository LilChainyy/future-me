from autogen.beta import Agent
from autogen.beta.tools.subagents import subagent_tool

from .config import lead_config, worker_config
from .models import (
    FutureSelfOutput,
    OptimistOutput,
    RealistOutput,
    ReporterOutput,
    RiskAnalystOutput,
)
from .prompts import (
    CAPTAIN_PROMPT,
    FUTURE_SELF_PROMPT,
    OPTIMIST_PROMPT,
    REALIST_PROMPT,
    REPORTER_PROMPT,
    RISK_ANALYST_PROMPT,
)

optimist = Agent(
    name="optimist",
    prompt=OPTIMIST_PROMPT,
    config=worker_config,
    response_schema=OptimistOutput,
)

realist = Agent(
    name="realist",
    prompt=REALIST_PROMPT,
    config=worker_config,
    response_schema=RealistOutput,
)

risk_analyst = Agent(
    name="risk_analyst",
    prompt=RISK_ANALYST_PROMPT,
    config=worker_config,
    response_schema=RiskAnalystOutput,
)

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
        subagent_tool(optimist, description="Delegate optimistic analysis of the user's decision."),
        subagent_tool(realist, description="Delegate pragmatic/realistic analysis of the user's decision."),
        subagent_tool(risk_analyst, description="Delegate risk analysis of the user's decision."),
        subagent_tool(future_self, description="Generate four future-self simulations (hopeful, balanced, cautious, and unchanged path) from the specialist analyses."),
        subagent_tool(reporter, description="Generate the final decision-support report from all analyses and all four scenarios."),
    ],
)
