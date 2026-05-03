import asyncio

from .agents import optimist


SAMPLE_TASK = (
    "Analyze the upside of quitting a corporate job to start a bakery. "
    "User is 32, has 18 months of savings, partner is supportive but worried. "
    "User has baked as a hobby for 10 years and has a small Instagram following. "
    "Values: creative freedom, work-life balance, building something of their own."
)


async def main() -> None:
    print("Testing Optimist Agent...")
    print("=" * 40)
    print(f"Task: {SAMPLE_TASK}\n")

    reply = await optimist.ask(SAMPLE_TASK)
    print(f"Raw reply:\n{reply.body}\n")
    print("=" * 40)

    parsed = await reply.content()
    print(f"Parsed OptimistOutput:\n")
    print(f"Summary: {parsed.summary}\n")
    print(f"Best-case future: {parsed.best_case_future}\n")
    print(f"Positive signals: {parsed.positive_signals}\n")
    print(f"Growth opportunities: {parsed.growth_opportunities}\n")
    print(f"Relationship/life upside: {parsed.relationship_or_life_upside}\n")
    print(f"Conditions for success: {parsed.conditions_needed_for_success}\n")
    print(f"Encouraging questions: {parsed.encouraging_questions}\n")


if __name__ == "__main__":
    asyncio.run(main())
