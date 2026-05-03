import asyncio
import json

from .agents import reporter


MOCK_CONTEXT = """\
## User's Decision
Should I quit my corporate job to start a bakery?
User is 32, has 18 months of savings, partner is supportive but worried.
10 years of baking as a hobby, small Instagram following.
Values: creative freedom, work-life balance, building something of their own.
Fears: running out of money, disappointing their partner, failing publicly.
"""

MOCK_OPTIMIST = json.dumps({
    "summary": "Strong foundations — a decade of experience, savings runway, and a supportive partner.",
    "best_case_future": "Within 2 years, the bakery becomes a beloved local spot. Instagram converts to foot traffic. Creative fulfillment daily.",
    "positive_signals": ["10 years baking experience", "existing Instagram audience", "18 months savings", "supportive partner"],
    "growth_opportunities": ["entrepreneur skills", "creative ownership", "community building"],
    "relationship_or_life_upside": ["shared vision with partner", "flexible schedule", "sense of purpose"],
    "conditions_needed_for_success": ["start low-overhead", "build business plan", "strong partner communication"],
    "encouraging_questions": ["What would it mean to wake up doing work you chose?", "What corporate skills transfer?"],
}, indent=2)

MOCK_REALIST = json.dumps({
    "summary": "Feasible but tight. 18 months of savings is slim for a food business with high startup costs.",
    "most_likely_future": "First year is harder and more expensive than expected. By month 12, clearer picture but most savings burned.",
    "practical_considerations": ["commercial kitchen costs", "permits and licensing", "ingredient and equipment costs", "marketing beyond Instagram"],
    "tradeoffs": ["creative freedom vs. financial stability", "fulfillment vs. predictable income", "flexibility vs. 4 AM bakery starts"],
    "open_questions": ["tested selling at scale?", "monthly burn rate vs. revenue?", "fallback plan?"],
    "near_term_actions": ["4-6 weekend pop-ups", "month-by-month business plan", "talk to bakery owners"],
    "decision_checkpoints": ["3 months: repeat customers?", "9 months: covering costs?", "14 months: path to sustainability?"],
}, indent=2)

MOCK_RISK = json.dumps({
    "summary": "Main risks: financial runway, relationship strain, and emotional toll of a public venture.",
    "major_risks": ["savings may not last — food businesses take 2-3 years to break even", "partner worry could become resentment", "Instagram doesn't guarantee paying customers"],
    "red_flags": ["savings below 6 months expenses", "avoiding financial conversations with partner", "80-hour weeks disguised as balance"],
    "hidden_costs": ["loss of professional identity", "loss of corporate benefits", "social friction from career change"],
    "failure_modes": ["undercapitalized", "burnout", "market mismatch on pricing"],
    "risk_mitigation_steps": ["keep 6 months emergency fund untouchable", "set clear stop date with partner", "secure health insurance before quitting"],
    "stop_signals": ["savings below emergency threshold", "partner can't continue", "no revenue growth for 3 months"],
    "professional_support_recommended": ["small business accountant", "couples counselor"],
}, indent=2)

MOCK_SCENARIOS = json.dumps({
    "scenarios": [
        {
            "label": "Hopeful Future",
            "weights": {"optimist": 70, "realist": 20, "risk": 10},
            "future_self_letter": "I'm writing this from the back of the bakery on a quiet Sunday. We made it. It wasn't easy — that first winter was brutal — but the regulars kept coming. My partner and I are closer than ever because we built this together.",
            "what_life_feels_like": "Tuesday mornings start at 4:30 AM. Flour on my hands, radio on, croissants proofing. By 7 AM the first customers arrive. It's tiring but it's mine.",
            "likely_rewards": ["creative ownership", "community", "pride"],
            "likely_regrets": ["wish I'd started sooner", "should have saved more first"],
            "key_turning_points": ["first catering gig", "local press feature", "partner joining part-time"],
            "advice_from_future_self": ["start with pop-ups", "don't skip the business plan"],
        },
        {
            "label": "Balanced Future",
            "weights": {"optimist": 50, "realist": 30, "risk": 20},
            "future_self_letter": "The bakery is real but it's smaller than I imagined. I do farmers markets and online orders. I went back to part-time consulting to keep the lights on. It's a compromise, but I'm baking every day.",
            "what_life_feels_like": "Tuesdays are split: baking in the morning, client calls in the afternoon. It's a juggle but both halves feel like mine.",
            "likely_rewards": ["creative outlet", "some independence", "new skills"],
            "likely_regrets": ["wish I could do bakery full-time", "the hybrid life is exhausting"],
            "key_turning_points": ["savings running low at month 10", "landing a consulting client", "finding the farmers market rhythm"],
            "advice_from_future_self": ["have a plan B ready early", "the hybrid path isn't failure"],
        },
        {
            "label": "Cautious Future",
            "weights": {"optimist": 30, "realist": 40, "risk": 30},
            "future_self_letter": "I tried. The bakery didn't take off the way I hoped. By month 14, I was back in corporate but with less seniority. My partner and I had some hard months. But I don't regret trying — I regret not preparing better.",
            "what_life_feels_like": "Tuesdays are back in an office. I still bake on weekends. There's a sadness but also relief. The financial stress is over.",
            "likely_rewards": ["knowing I tried", "new respect for planning", "stronger relationship after the hard conversations"],
            "likely_regrets": ["should have tested more before quitting", "should have kept a bigger safety net"],
            "key_turning_points": ["month 8 cash crunch", "the hard conversation with partner", "the call to the old boss"],
            "advice_from_future_self": ["test at scale before you leap", "protect the relationship above all"],
        },
        {
            "label": "Unchanged Path",
            "weights": {"status_quo": 100},
            "future_self_letter": "It's been two years and not much has changed. The corporate job is fine — steady, predictable. I still bake on weekends. Sometimes I wonder what would have happened if I'd tried. My partner is comfortable. I'm comfortable. But comfortable isn't the same as fulfilled.",
            "what_life_feels_like": "Tuesdays are meetings and spreadsheets. Evenings I bake for friends. The Instagram is still there, growing slowly. There's a low hum of 'what if' that never quite goes away.",
            "likely_rewards": ["financial stability", "relationship on even keel", "no public failure"],
            "likely_regrets": ["never knowing if the bakery could have worked", "feeling like I chose safety over meaning"],
            "key_turning_points": ["the moment I decided not to quit", "a colleague's retirement speech that hit too close to home"],
            "advice_from_future_self": ["stability is not the same as happiness", "if you don't try, at least make peace with that choice"],
        },
    ]
}, indent=2)

FULL_CONTEXT = f"""\
{MOCK_CONTEXT}

## Optimist Analysis
{MOCK_OPTIMIST}

## Realist Analysis
{MOCK_REALIST}

## Risk Analyst Analysis
{MOCK_RISK}

## Future-Self Scenarios
{MOCK_SCENARIOS}
"""


async def main() -> None:
    print("Testing Reporter Agent with mock pipeline outputs...")
    print("=" * 50)

    reply = await reporter.ask(FULL_CONTEXT)
    parsed = await reply.content()

    fields = [
        ("Executive summary", parsed.executive_summary),
        ("Original question", parsed.original_question),
        ("Context summary", parsed.context_summary),
        ("Optimist summary", parsed.optimist_summary),
        ("Realist summary", parsed.realist_summary),
        ("Risk summary", parsed.risk_summary),
        ("Final note", parsed.final_note),
    ]
    for label, value in fields:
        print(f"\n{label}:\n  {value}")

    list_fields = [
        ("Scenario comparison", parsed.scenario_comparison),
        ("Common themes", parsed.common_themes),
        ("Major uncertainties", parsed.major_uncertainties),
        ("Decision framework", parsed.decision_framework),
        ("Recommended next steps", parsed.recommended_next_steps),
        ("Questions to reflect on", parsed.questions_to_reflect_on),
    ]
    for label, items in list_fields:
        print(f"\n{label}:")
        for item in items:
            print(f"  - {item}")

    print(f"\n{'=' * 50}")
    print("ReporterOutput parsed successfully.")


if __name__ == "__main__":
    asyncio.run(main())
