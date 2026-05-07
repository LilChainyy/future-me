import asyncio
import json

from .agents import reporter


MOCK_CONTEXT = """\
## User's Decision
Should I quit my corporate job to start a bakery?

The user is 32, has 18 months of savings, a supportive but worried partner,
10 years of baking experience, and a small Instagram following.
"""


def scenario(label: str, weights: dict[str, int], letter: str) -> dict:
    return {
        "label": label,
        "weights": weights,
        "future_self_letter": letter,
        "key_turning_points": [
            "The user tested demand before making a full commitment.",
            "The household revisited the plan at explicit checkpoints.",
        ],
        "advice_from_future_self": [
            "Let evidence make courage sturdier.",
            "Keep the relationship inside the planning.",
        ],
    }


MOCK_PIPELINE_OUTPUTS = {
    "optimist_output": {
        "summary": "The user has strong foundations for a careful transition.",
        "best_case_future": "The bakery grows through low-overhead testing into a loved local business.",
        "positive_signals": [
            "Long baking experience",
            "Existing small audience",
            "Supportive partner",
        ],
        "conditions_needed_for_success": [
            "Test demand before quitting",
            "Keep startup costs low",
            "Plan finances with partner",
        ],
    },
    "realist_output": {
        "summary": "The idea is feasible, but the first year will likely be hard.",
        "most_likely_future": "The user learns through pop-ups, customer feedback, and tradeoffs before deciding whether to scale.",
        "practical_considerations": [
            "Permits, equipment, insurance, and kitchen access",
            "Revenue may ramp slowly",
            "Fallback income may be needed",
        ],
        "tradeoffs": [
            "Creative ownership vs. financial predictability",
            "Personal meaning vs. public pressure",
            "Independence vs. startup workload",
        ],
        "open_questions": [
            "What demand has been proven?",
            "What burn rate is acceptable?",
            "What pivot point is agreed in advance?",
        ],
    },
    "risk_analyst_output": {
        "summary": "The biggest risks are savings depletion, partner strain, and burnout.",
        "major_risks": [
            "Startup costs exceed expectations",
            "The partner feels dragged into risk",
            "The bakery becomes exhausting instead of freeing",
        ],
        "hidden_costs": ["Lost benefits", "Identity shift", "Emotional exposure"],
        "risk_mitigation_steps": [
            "Protect an emergency fund",
            "Run paid pop-ups first",
            "Set decision checkpoints",
        ],
        "stop_signals": [
            "Savings drop below the emergency threshold",
            "Relationship stress becomes persistent",
            "Sales stay flat after repeated tests",
        ],
    },
    "future_self_output": {
        "scenarios": [
            scenario(
                "Hopeful Future",
                {"optimist": 70, "realist": 20, "risk": 10},
                "The bakery feels real because we tested first and grew carefully.",
            ),
            scenario(
                "Balanced Future",
                {"optimist": 50, "realist": 30, "risk": 20},
                "The bakery became a smaller, hybrid path that still brought honest progress.",
            ),
            scenario(
                "Cautious Future",
                {"optimist": 30, "realist": 40, "risk": 30},
                "Trying taught me a lot, but I wish I had protected runway and communication sooner.",
            ),
            scenario(
                "Unchanged Path",
                {"status_quo": 100},
                "Staying preserved stability, though I still wondered what a careful experiment might show.",
            ),
        ]
    },
}
FULL_CONTEXT = f"""\
{MOCK_CONTEXT}

## Pipeline Outputs
{json.dumps(MOCK_PIPELINE_OUTPUTS, indent=2)}
"""


async def main() -> None:
    print("Testing Reporter Agent with current pipeline schemas...")
    print("=" * 50)

    reply = await reporter.ask(FULL_CONTEXT)
    parsed = await reply.content()

    fields = [
        ("Executive summary", parsed.executive_summary),
        ("Optimist summary", parsed.optimist_summary),
        ("Realist summary", parsed.realist_summary),
        ("Risk summary", parsed.risk_summary),
        ("Final note", parsed.final_note),
    ]
    for label, value in fields:
        print(f"\n{label}:\n  {value}")

    list_fields = [
        ("Common themes", parsed.common_themes),
        ("Decision framework", parsed.decision_framework),
        ("Recommended next steps", parsed.recommended_next_steps),
    ]
    for label, items in list_fields:
        print(f"\n{label}:")
        for item in items:
            print(f"  - {item}")

    print(f"\n{'=' * 50}")
    print("ReporterOutput parsed successfully.")


if __name__ == "__main__":
    asyncio.run(main())
