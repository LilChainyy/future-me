import asyncio
import json

from .agents import future_self


MOCK_SPECIALISTS = {
    "optimist_output": {
        "summary": "The user has a real foundation: experience, savings runway, and a supportive partner.",
        "best_case_future": "Within two years, the bakery has become a small but loved local business. The user feels creatively alive and has learned how to turn craft into sustainable work. Their partner feels included because the transition was planned together.",
        "positive_signals": [
            "Ten years of baking experience gives them a strong skill base.",
            "A small Instagram following provides an initial audience.",
            "Eighteen months of savings creates room to test carefully.",
        ],
        "conditions_needed_for_success": [
            "Start with low-overhead pop-ups before signing a lease.",
            "Build realistic month-by-month financial projections.",
            "Keep partner communication explicit and frequent.",
        ],
    },
    "realist_output": {
        "summary": "The move is feasible but financially tight for a food business.",
        "most_likely_future": "The first year is harder and more expensive than expected. The user learns quickly through pop-ups, permits, and customer feedback. By month twelve, they know whether to keep scaling or shift to a hybrid plan.",
        "practical_considerations": [
            "Commercial kitchen access, permits, equipment, and insurance need pricing.",
            "Instagram interest may not convert into reliable revenue.",
            "A fallback income plan would reduce pressure.",
        ],
        "tradeoffs": [
            "Creative ownership comes with financial uncertainty.",
            "Flexible self-employment may still mean very early mornings.",
            "Public pursuit of the dream increases emotional exposure.",
        ],
        "open_questions": [
            "Has demand been tested with paying customers at scale?",
            "What monthly burn rate can the household tolerate?",
            "What conditions would trigger a pause or pivot?",
        ],
    },
    "risk_analyst_output": {
        "summary": "The main risks are runway, relationship strain, and burnout.",
        "major_risks": [
            "Savings may fall too quickly if startup costs are underestimated.",
            "Partner support could weaken if stress replaces shared planning.",
            "Passion may become exhaustion under full-time business pressure.",
        ],
        "hidden_costs": [
            "Loss of corporate benefits and professional identity.",
            "Emotional strain of visible failure or slow traction.",
            "Less personal freedom during the early business phase.",
        ],
        "risk_mitigation_steps": [
            "Keep an untouched emergency fund outside the business budget.",
            "Set check-in milestones before quitting.",
            "Test sales through pop-ups and preorders first.",
        ],
        "stop_signals": [
            "Savings drop below the agreed emergency threshold.",
            "The partner says the plan no longer feels workable.",
            "Revenue stays flat after several tested sales cycles.",
        ],
    },
}


CONTEXT = f"""\
The user is deciding whether to quit a corporate job to start a bakery.
They have 18 months of savings, a supportive but worried partner, 10 years of
baking experience, and a small Instagram following.

Here are the specialist analyses:
{json.dumps(MOCK_SPECIALISTS, indent=2)}
"""


async def main() -> None:
    print("Testing Future Self Agent with current specialist schemas...")
    print("=" * 50)

    reply = await future_self.ask(CONTEXT)
    parsed = await reply.content()

    assert len(parsed.scenarios) == 4, f"Expected 4 scenarios, got {len(parsed.scenarios)}"

    for scenario in parsed.scenarios:
        print(f"\n{'=' * 50}")
        print(f"SCENARIO: {scenario.label}")
        print(f"Weights: {scenario.weights}")
        print(f"{'=' * 50}")
        print(f"\nFuture-self letter:\n{scenario.future_self_letter}")
        print("\nKey turning points:")
        for turning_point in scenario.key_turning_points:
            print(f"  - {turning_point}")
        print("\nAdvice from future self:")
        for advice in scenario.advice_from_future_self:
            print(f"  - {advice}")

    print(f"\n{'=' * 50}")
    print("All 4 scenarios parsed successfully.")


if __name__ == "__main__":
    asyncio.run(main())
