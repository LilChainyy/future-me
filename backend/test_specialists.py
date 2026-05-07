import asyncio

from autogen.beta import Agent

from .config import worker_config
from .models import OptimistOutput, RealistOutput, RiskAnalystOutput
from .prompts_specialists import (
    OPTIMIST_PROMPT,
    REALIST_PROMPT,
    RISK_ANALYST_PROMPT,
)


SAMPLE_TASK = (
    "Analyze the decision to quit a corporate job to start a bakery. "
    "User is 32, has 18 months of savings, partner is supportive but worried. "
    "User has baked as a hobby for 10 years and has a small Instagram following. "
    "Values: creative freedom, work-life balance, building something of their own. "
    "Fears: running out of money, disappointing their partner, failing publicly."
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


async def run_specialist(name: str, agent, task: str) -> None:
    print(f"\n{'=' * 50}")
    print(f"{name.upper()} AGENT")
    print(f"{'=' * 50}")

    reply = await agent.ask(task)
    parsed = await reply.content()

    for field_name, value in parsed.model_dump().items():
        print(f"\n{field_name}:")
        if isinstance(value, list):
            for item in value:
                print(f"  - {item}")
        else:
            print(f"  {value}")


async def main() -> None:
    print("Testing all 3 specialists in parallel via asyncio.gather...")
    print(f"Task: {SAMPLE_TASK}")

    await asyncio.gather(
        run_specialist("optimist", optimist, SAMPLE_TASK),
        run_specialist("realist", realist, SAMPLE_TASK),
        run_specialist("risk_analyst", risk_analyst, SAMPLE_TASK),
    )

    print(f"\n{'=' * 50}")
    print("All 3 specialists completed.")


if __name__ == "__main__":
    asyncio.run(main())
