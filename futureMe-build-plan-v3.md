# futureMe — Build Plan v3 (Steps 10-17 updated)

Changes from v2: The Future Self Agent now produces 4 scenarios (added "Unchanged Path" — what happens if the user does nothing). This doc covers only the steps affected.

---

## Bugs to fix before Step 10

### Bug 1: `from __future__ import annotations` still in models.py (line 1)
Delete it. AG2 Beta breaks with this import.

### Bug 2: ReporterOutput.scenario_comparison still says "three" (models.py line 91)
Change the Field description from "across the three future scenarios" to "across all four future scenarios including the Unchanged Path."

---

## Step 10 — Captain delegates to specialists (UPDATED)

Same as v2, but the subagent_tool description for future_self should mention 4 scenarios:

**What to tell Claude Code:**
```
Update backend/agents.py to wire delegation using AG2 Beta's subagent_tool().

from autogen.beta.tools.subagents import subagent_tool

Add these as tools on the Captain Agent:
- subagent_tool(optimist, description="Delegate optimistic analysis of the user's decision.")
- subagent_tool(realist, description="Delegate pragmatic/realistic analysis of the user's decision.")
- subagent_tool(risk_analyst, description="Delegate risk analysis of the user's decision.")
- subagent_tool(future_self, description="Generate four future-self simulations (hopeful, balanced, cautious, and unchanged path) from the specialist analyses.")
- subagent_tool(reporter, description="Generate the final decision-support report from all analyses and all four scenarios.")

Update CAPTAIN_PROMPT in prompts.py to include delegation instructions:
- After gathering enough context, call optimist, realist, and risk_analyst IN THE SAME TURN (parallel)
- After all three complete, call future_self with their combined outputs
- After future_self completes, call reporter with everything
- Present the final report to the user

AG2 skill reference: ag2-subagent-delegation
```

**Checkpoint:** Same as v2 — run full pipeline, verify Captain triggers all agents. Verify Future Self returns 4 scenarios (not 3).

```bash
git add backend/
git commit -m "step 10: captain delegates to all agents via subagent_tool"
```

---

## Step 11 — Event streaming (NO CHANGE)

No impact from the 4th scenario. Events are agent-level, not scenario-level.

---

## Step 12 — FastAPI + AG-UI backend (NO CHANGE)

No impact. The server exposes the Captain — it doesn't know about scenario count.

---

## Step 13 — Next.js + CopilotKit scaffold (NO CHANGE)

No impact at the scaffold level.

---

## Step 14 — Build the futureMe UI panels (UPDATED)

**What changed:** The Future Self section now shows 4 panels instead of 3.

**What to tell Claude Code:**
```
Build the futureMe-specific UI components. One component at a time:

1. ChatInterface — main chat area for Captain conversation
2. StatusBadge — shows Waiting / Running / Complete / Error per agent
3. CaptainBriefingPanel — displays the structured briefing after context gathering
4. AgentPanel — shows individual specialist output (optimist/realist/risk)
5. FutureScenarioPanel — shows one future-self scenario with the letter
6. ReportPanel — shows the final Reporter output

Layout: single-page app with:
- Left side: chat with Captain
- Right side: scrollable panels that appear as agents complete
  - Captain Briefing
  - Three specialist panels side by side (optimist, realist, risk analyst)
  - Four scenario panels in a 2x2 grid:
    - Row 1: Hopeful Future | Balanced Future
    - Row 2: Cautious Future | Unchanged Path
  - Final report

The "Unchanged Path" scenario should be visually distinct from the other three —
use a different accent color or a subtle border/label that communicates 
"this is what happens if you don't change anything." It's not a negative 
scenario — it's a mirror of the present trajectory.

Use Tailwind CSS, keep it clean. Each component in its own file under 
frontend/components/. Build one component, verify it renders, then next.
```

**Checkpoint:** All 4 scenario panels render. Unchanged Path is visually distinguishable from the other three.

```bash
git add frontend/
git commit -m "step 14: futureMe UI panels with 4 scenario layout"
```

---

## Step 15 — Safety and edge cases (MINOR UPDATE)

**What changed:** Add one more test case for the Unchanged Path scenario.

**What to tell Claude Code:**
```
Review all prompts in backend/prompts.py for safety. Same tests as v2, plus:
- Verify the "Unchanged Path" scenario doesn't guilt-trip or punish the user 
  for staying put. It should be honest, not manipulative. Staying can be the 
  right choice.
- Test with a question where doing nothing IS the safe option (e.g., "Should I 
  invest my savings in my friend's crypto startup?") — the Unchanged Path 
  should feel like the stable, reasonable option in this case.
```

```bash
git add backend/
git commit -m "step 15: safety guardrails verified including unchanged path"
```

---

## Steps 16-17 — Error handling + Final refactor (NO CHANGE)

No impact from the 4th scenario.

---

## Summary of what's different from v2

| Step | Change | Why |
|------|--------|-----|
| Pre-10 | Fix 2 bugs (models.py line 1 and line 91) | Existing issues to clean up |
| 10 | subagent_tool descriptions reference 4 scenarios | Captain needs to tell Future Self and Reporter to expect 4 |
| 14 | UI layout: 2x2 grid for scenarios, Unchanged Path visually distinct | 4 panels don't fit side-by-side; needs different layout |
| 15 | Extra safety test for Unchanged Path tone | Must not guilt-trip user for staying put |
| 11-13, 16-17 | No change | These steps are scenario-count-agnostic |
