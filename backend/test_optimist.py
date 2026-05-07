import asyncio

from autogen.beta import Agent

from .config import worker_config
from .models import OptimistOutput
from .prompts_specialists import OPTIMIST_PROMPT


SAMPLE_TASK = (
    "Analyze the upside of quitting a corporate job to start a bakery. "
    "User is 32, has 18 months of savings, partner is supportive but worried. "
    "User has baked as a hobby for 10 years and has a small Instagram following. "
    "Values: creative freedom, work-life balance, building something of their own."
)

optimist = Agent(
    name="optimist",
    prompt=OPTIMIST_PROMPT,
    config=worker_config,
    response_schema=OptimistOutput,
)


async def main() -> None:
    print("Testing Optimist Agent...")
    print("=" * 40)
    print(f"Task: {SAMPLE_TASK}\n")

    reply = await optimist.ask(SAMPLE_TASK)
    print(f"Raw reply:\n{reply.body}\n")
    print("=" * 40)

    parsed = await reply.content()
    print("Parsed OptimistOutput:\n")
    print(f"Summary: {parsed.summary}\n")
    print(f"Best-case future: {parsed.best_case_future}\n")
    print(f"Positive signals: {parsed.positive_signals}\n")
    print(f"Conditions for success: {parsed.conditions_needed_for_success}\n")


if __name__ == "__main__":
    asyncio.run(main())
