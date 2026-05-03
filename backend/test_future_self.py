import asyncio
import json

from .agents import future_self


MOCK_OPTIMIST = {
    "summary": "This user has strong foundations for success — a decade of baking experience, savings runway, and a supportive partner.",
    "best_case_future": "Within 2 years, the bakery becomes a beloved local spot with a loyal customer base. The Instagram following converts into real foot traffic. The user feels creatively fulfilled and works on their own terms.",
    "positive_signals": [
        "10 years of baking experience is substantial skill development",
        "Existing Instagram following provides a marketing foundation",
        "18 months of savings gives real runway to iterate",
        "Partner is supportive, even if worried",
    ],
    "growth_opportunities": [
        "Transition from hobbyist to entrepreneur builds new skills",
        "Creative ownership over a product they love",
        "Building a community around their craft",
    ],
    "relationship_or_life_upside": [
        "Working together with partner on a shared vision could deepen the relationship",
        "Flexible schedule could improve work-life balance",
        "Sense of purpose from building something meaningful",
    ],
    "conditions_needed_for_success": [
        "Start with a low-overhead model (farmers markets, pop-ups) before a lease",
        "Build a business plan with realistic financial projections",
        "Partner stays involved and communication stays strong",
    ],
    "encouraging_questions": [
        "What would it mean to you to wake up every day doing work you chose?",
        "What skills from your corporate career transfer to running a business?",
    ],
}

MOCK_REALIST = {
    "summary": "The decision is feasible but requires careful planning. 18 months of savings is tight for a food business with high startup costs and slow initial revenue.",
    "most_likely_future": "The first year is harder and more expensive than expected. Revenue starts slow. By month 12, the user has a clearer picture of whether this is viable but has burned through most savings.",
    "practical_considerations": [
        "Commercial kitchen rental or food truck lease costs",
        "Health permits, food safety certification, business licensing",
        "Ingredient costs, packaging, and equipment investment",
        "Marketing beyond Instagram — local partnerships, word of mouth",
    ],
    "tradeoffs": [
        "Creative freedom vs. financial stability",
        "Personal fulfillment vs. predictable income",
        "Schedule flexibility vs. the reality that bakeries start at 4 AM",
    ],
    "open_questions": [
        "Has the user tested selling at scale (markets, pop-ups)?",
        "What's the monthly burn rate vs. projected revenue timeline?",
        "Is there a fallback plan if the bakery doesn't work in 18 months?",
    ],
    "near_term_actions": [
        "Do 4-6 weekend pop-ups to test demand before quitting",
        "Build a simple business plan with month-by-month financials",
        "Talk to 2-3 local bakery owners about realistic costs",
    ],
    "decision_checkpoints": [
        "After 3 months: is there repeat customer traction?",
        "After 9 months: is revenue covering operating costs?",
        "After 14 months: is there a clear path to sustainability before savings run out?",
    ],
}

MOCK_RISK = {
    "summary": "The main risks are financial runway, relationship strain from financial stress, and the emotional toll of a public venture that might not succeed.",
    "major_risks": [
        "18 months of savings may not be enough — food businesses often take 2-3 years to break even",
        "Partner's worry could become resentment if finances get tight",
        "Instagram following doesn't guarantee paying customers",
    ],
    "red_flags": [
        "Savings dropping below 6 months of living expenses",
        "Avoiding honest financial conversations with partner",
        "Working 80-hour weeks and calling it 'work-life balance'",
    ],
    "hidden_costs": [
        "Emotional cost of leaving a professional identity behind",
        "Loss of corporate benefits (health insurance, retirement)",
        "Social friction if friends and family don't take the bakery seriously",
    ],
    "failure_modes": [
        "Undercapitalized: runs out of money before the business is viable",
        "Burnout: passion turns into exhaustion without corporate boundaries",
        "Market mismatch: the product doesn't sell at the price point needed",
    ],
    "risk_mitigation_steps": [
        "Keep 6 months of living expenses untouchable as an emergency fund",
        "Set a clear 'stop date' with partner — if X hasn't happened by month Y, reassess",
        "Secure health insurance independently before leaving the corporate job",
    ],
    "stop_signals": [
        "Savings below the emergency fund threshold",
        "Partner expresses they can't continue supporting this path",
        "No revenue growth for 3 consecutive months after launch",
    ],
    "professional_support_recommended": [
        "Small business accountant for financial planning",
        "Couples counselor to maintain communication during the transition",
    ],
}


CONTEXT = f"""\
The user (age 32) is deciding whether to quit their corporate job to start a bakery.
They have 18 months of savings, a supportive but worried partner, 10 years of
baking as a hobby, and a small Instagram following.

Here are the specialist analyses:

## Optimist Analysis
{json.dumps(MOCK_OPTIMIST, indent=2)}

## Realist Analysis
{json.dumps(MOCK_REALIST, indent=2)}

## Risk Analyst Analysis
{json.dumps(MOCK_RISK, indent=2)}
"""


async def main() -> None:
    print("Testing Future Self Agent with mock specialist outputs...")
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
        print(f"\nWhat life feels like:\n{scenario.what_life_feels_like}")
        print(f"\nLikely rewards:")
        for r in scenario.likely_rewards:
            print(f"  - {r}")
        print(f"\nLikely regrets:")
        for r in scenario.likely_regrets:
            print(f"  - {r}")
        print(f"\nKey turning points:")
        for t in scenario.key_turning_points:
            print(f"  - {t}")
        print(f"\nAdvice from future self:")
        for a in scenario.advice_from_future_self:
            print(f"  - {a}")

    print(f"\n{'=' * 50}")
    print("All 4 scenarios parsed successfully.")


if __name__ == "__main__":
    asyncio.run(main())
