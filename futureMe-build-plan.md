# futureMe — Build Plan (AG2 Beta)

## What is futureMe?

A future-self simulator. Users enter life-decision questions ("Should I quit my job?", "Should I move abroad?"), and a team of AI agents explores possible futures, tradeoffs, risks, and emotional implications — without making the decision for them.

---

## Architecture Overview

**Backend:** Python + AG2 Beta (agent orchestration, structured output, parallel delegation)
**Frontend:** Next.js + React + CopilotKit (connected to AG2 via the AG-UI protocol)
**Model:** Gemini 2.5 via OpenRouter (using your AG2 hackathon key)
**Connection:** AG2's `AGUIStream` exposes agents over SSE → CopilotKit renders in React

### Why this stack (not custom JS orchestration)

Your original PRD had you building agent orchestration from scratch in TypeScript with `Promise.all`. AG2 Beta already solves this:

- `subagent_tool()` handles agent-to-agent delegation — no custom dispatch code
- `response_schema=` with Pydantic models gives you typed JSON output — no manual parsing
- `asyncio.gather` inside AG2 runs agents in parallel — no `Promise.all` needed
- `AGUIStream` streams events to the frontend — no custom WebSocket/SSE plumbing
- `MemoryStream` with event subscribers gives you agent status tracking for free

You write the agent prompts and define the data models. AG2 handles the wiring.

---

## The Six Agents — mapped to AG2 Beta

| Agent | AG2 Role | AG2 Pattern |
|-------|----------|-------------|
| **Captain Agent** | Lead coordinator | `Agent` with `hitl_hook` for user chat, calls 3 subagents via `subagent_tool()` |
| **Optimist Agent** | Specialist subagent | `Agent` with `response_schema=OptimistOutput` |
| **Realist Agent** | Specialist subagent | `Agent` with `response_schema=RealistOutput` |
| **Risk Analyst Agent** | Specialist subagent | `Agent` with `response_schema=RiskAnalystOutput` |
| **Future Self Agent** | Synthesis agent | `Agent` that takes 3 specialist outputs as context, `response_schema=FutureSelfOutput` |
| **Reporter Agent** | Final summarizer | `Agent` that takes everything, `response_schema=ReporterOutput` |

### Delegation flow

```
User ←→ Captain Agent (chat, clarifying questions)
              │
              ├── subagent_tool(optimist)   ─┐
              ├── subagent_tool(realist)     ─┼── parallel (same LLM turn)
              └── subagent_tool(risk_analyst)─┘
                        │
                        ▼
              Future Self Agent (sequential — needs all 3 outputs)
                        │
                        ▼
              Reporter Agent (sequential — needs everything)
```

Captain calls optimist, realist, and risk_analyst as tools **in the same turn** — AG2 dispatches them concurrently. Future Self and Reporter run sequentially after.

---

## Build Steps (in order)

### Step 1: Project setup

**What you do:**
- Create `pyproject.toml` with dependencies
- Create `.env` with your API key
- Validate AG2 installs and the key works

**AG2 skills:** `ag2-quickstart`

**Files to create:**
```
future-me/
├── pyproject.toml
├── .env
├── .env.example
└── backend/
    └── __init__.py
```

**pyproject.toml:**
```toml
[project]
name = "future-me"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "ag2[openai,ag-ui] @ git+https://github.com/ag2ai/ag2.git@main",
    "python-dotenv>=1.0.0",
    "fastapi>=0.115.0",
    "uvicorn>=0.34.0",
]
```

**.env:**
```
OPENROUTER_API_KEY=your-openrouter-api-key-here
LLM_PROVIDER=openrouter
```

**Validation script (test it works):**
```python
import asyncio
from dotenv import load_dotenv
from autogen.beta import Agent
from autogen.beta.config import OpenAIConfig

load_dotenv()

config = OpenAIConfig(
    model="google/gemini-2.5-flash",
    streaming=True,
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
    max_completion_tokens=1024,
)

async def main():
    agent = Agent("test", prompt="Say hello in one sentence.", config=config)
    reply = await agent.ask("Hi")
    print(reply.body)

asyncio.run(main())
```

---

### Step 2: Define data models (Pydantic)

**What you do:**
- Create Pydantic models for every agent's structured output
- These become your `response_schema=` for each agent

**AG2 skills:** `ag2-structured-output`

**File:** `backend/models.py`

```python
from pydantic import BaseModel, Field
from typing import Annotated

class CaptainBriefing(BaseModel):
    """Captain Agent's structured briefing after gathering context."""
    original_question: Annotated[str, Field(description="The user's original decision question")]
    decision_type: Annotated[str, Field(description="Category: career, relationship, family, financial, health, relocation, etc.")]
    context_summary: Annotated[str, Field(description="Summary of the user's situation")]
    key_people: list[str]
    known_facts: list[str]
    assumptions: list[str]
    user_values: list[str]
    hopes: list[str]
    fears: list[str]
    constraints: list[str]
    red_flags: list[str]
    missing_information: list[str]
    tasks: dict[str, str]  # keys: optimist, realist, risk_analyst

class OptimistOutput(BaseModel):
    """Optimist Agent's analysis."""
    summary: str
    best_case_future: str
    positive_signals: list[str]
    growth_opportunities: list[str]
    relationship_or_life_upside: list[str]
    conditions_needed_for_success: list[str]
    encouraging_questions: list[str]

class RealistOutput(BaseModel):
    """Realist Agent's analysis."""
    summary: str
    most_likely_future: str
    practical_considerations: list[str]
    tradeoffs: list[str]
    open_questions: list[str]
    near_term_actions: list[str]
    decision_checkpoints: list[str]

class RiskAnalystOutput(BaseModel):
    """Risk Analyst Agent's analysis."""
    summary: str
    major_risks: list[str]
    red_flags: list[str]
    hidden_costs: list[str]
    failure_modes: list[str]
    risk_mitigation_steps: list[str]
    stop_signals: list[str]
    professional_support_recommended: list[str]

class FutureScenario(BaseModel):
    """One future-self simulation."""
    label: Annotated[str, Field(description="Hopeful Future, Balanced Future, or Cautious Future")]
    weights: dict[str, int]
    future_self_letter: Annotated[str, Field(description="A reflective letter from the user's possible future self")]
    what_life_feels_like: str
    likely_rewards: list[str]
    likely_regrets: list[str]
    key_turning_points: list[str]
    advice_from_future_self: list[str]

class FutureSelfOutput(BaseModel):
    """Future Self Agent's three scenarios."""
    scenarios: list[FutureScenario]

class ReporterOutput(BaseModel):
    """Reporter Agent's final decision-support report."""
    executive_summary: str
    original_question: str
    context_summary: str
    optimist_summary: str
    realist_summary: str
    risk_summary: str
    scenario_comparison: list[str]
    common_themes: list[str]
    major_uncertainties: list[str]
    decision_framework: list[str]
    recommended_next_steps: list[str]
    questions_to_reflect_on: list[str]
    final_note: str
```

---

### Step 3: Build agent prompts

**What you do:**
- Write the system prompt for each agent
- These are plain strings passed to `Agent(prompt=...)`

**AG2 skills:** `ag2-quickstart` (prompt management section)

**File:** `backend/prompts.py`

Write each prompt as a constant string. Key rules for each:

- **Captain:** Conversational, asks clarifying questions, outputs `CaptainBriefing` when ready. Must include safety guardrails.
- **Optimist:** Explores upside. Avoids toxic positivity. Acknowledges uncertainty.
- **Realist:** Pragmatic analysis. Balances emotion and facts. Points out tradeoffs.
- **Risk Analyst:** Identifies downside, hidden risks, failure modes. Avoids fearmongering.
- **Future Self:** Writes as if from the user's future self. Three weighted scenarios. Emotionally grounded.
- **Reporter:** Synthesizes everything. Gives decision-support framework, NOT a command. Ends with reflective questions.

All prompts must include: "You are part of futureMe, a reflective simulation tool. You do not predict the future. You help the user think clearly."

---

### Step 4: Build the agents

**What you do:**
- Create each Agent with its prompt, config, and response_schema
- Wire the Captain to delegate to the 3 specialists via `subagent_tool()`
- Wire Future Self and Reporter as sequential tools

**AG2 skills:** `ag2-quickstart`, `ag2-subagent-delegation`, `ag2-structured-output`

**File:** `backend/agents.py`

**Key pattern:**
```python
from autogen.beta import Agent
from autogen.beta.config import OpenAIConfig
from autogen.beta.tools.subagents import subagent_tool

# Model configs
lead_config = OpenAIConfig(
    model="google/gemini-2.5-pro",       # stronger model for captain
    streaming=True,
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

worker_config = OpenAIConfig(
    model="google/gemini-2.5-flash",     # faster/cheaper for specialists
    streaming=True,
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
)

# Specialist agents
optimist = Agent(
    "optimist",
    prompt=OPTIMIST_PROMPT,
    config=worker_config,
    response_schema=OptimistOutput,
)

realist = Agent(
    "realist",
    prompt=REALIST_PROMPT,
    config=worker_config,
    response_schema=RealistOutput,
)

risk_analyst = Agent(
    "risk_analyst",
    prompt=RISK_ANALYST_PROMPT,
    config=worker_config,
    response_schema=RiskAnalystOutput,
)

future_self = Agent(
    "future_self",
    prompt=FUTURE_SELF_PROMPT,
    config=lead_config,
    response_schema=FutureSelfOutput,
)

reporter = Agent(
    "reporter",
    prompt=REPORTER_PROMPT,
    config=lead_config,
    response_schema=ReporterOutput,
)

# Captain — delegates to specialists
captain = Agent(
    "captain",
    prompt=CAPTAIN_PROMPT,
    config=lead_config,
    tools=[
        subagent_tool(optimist, description="Delegate optimistic analysis of the user's decision."),
        subagent_tool(realist, description="Delegate pragmatic/realistic analysis of the user's decision."),
        subagent_tool(risk_analyst, description="Delegate risk analysis of the user's decision."),
        subagent_tool(future_self, description="Generate three future-self simulations from the specialist analyses."),
        subagent_tool(reporter, description="Generate the final decision-support report from all analyses."),
    ],
)
```

**How parallel execution works:** The Captain's prompt instructs it to call optimist, realist, and risk_analyst **in the same tool-call turn**. AG2 dispatches them concurrently. Then Captain calls future_self with the combined outputs, then reporter.

---

### Step 5: Build the orchestration script (CLI version first)

**What you do:**
- Create a runnable script that lets you test the full pipeline in your terminal
- Validate all agents work end-to-end before adding a UI

**File:** `backend/main.py`

```python
import asyncio
from dotenv import load_dotenv
from autogen.beta import MemoryStream
from .agents import captain

load_dotenv()

async def main():
    stream = MemoryStream()

    print("futureMe — Simulate possible futures")
    print("=" * 50)

    question = input("Enter your life decision question: ")
    reply = await captain.ask(question, stream=stream)
    print(f"\nCaptain: {reply.body}")

    # Multi-turn: Captain may ask follow-up questions
    while True:
        follow_up = input("\nYou: ").strip()
        if not follow_up or follow_up.lower() in ("exit", "quit"):
            break
        reply = await reply.ask(follow_up, stream=stream)
        print(f"\nCaptain: {reply.body}")

if __name__ == "__main__":
    asyncio.run(main())
```

---

### Step 6: Expose via AG-UI (web backend)

**What you do:**
- Wrap the Captain agent in `AGUIStream`
- Mount on FastAPI
- This gives the frontend a standard SSE endpoint

**AG2 skills:** `ag2-ag-ui`

**File:** `backend/server.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from autogen.beta.ag_ui import AGUIStream
from .agents import captain

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

stream = AGUIStream(captain)
app.mount("/chat", stream.build_asgi())
```

```bash
uvicorn backend.server:app --reload --port 8008
```

---

### Step 7: Build the Next.js frontend

**What you do:**
- Set up a Next.js app with CopilotKit
- CopilotKit connects to your AG2 backend at `localhost:8008/chat`
- Build the UI panels: chat, captain briefing, agent status, scenarios, report

**Stack:** Next.js + TypeScript + Tailwind + shadcn/ui + CopilotKit

**Quickstart:**
```bash
npx copilotkit@latest create -f ag2
# OR clone: https://github.com/ag2ai/ag2-copilotkit-starter
```

**Key files to create:**
```
frontend/
├── app/
│   ├── layout.tsx          # CopilotKit provider wrapping the app
│   ├── page.tsx            # Main futureMe page
│   └── api/copilotkit/
│       └── route.ts        # Bridges CopilotKit → AG2 backend
├── components/
│   ├── ChatInterface.tsx
│   ├── CaptainBriefingPanel.tsx
│   ├── AgentPanel.tsx       # Shows status: waiting/running/complete
│   ├── FutureScenarioPanel.tsx
│   ├── ReportPanel.tsx
│   └── StatusBadge.tsx
```

**Route bridge (`app/api/copilotkit/route.ts`):**
```tsx
import { HttpAgent } from "@ag-ui/client";
import {
    CopilotRuntime,
    ExperimentalEmptyAdapter,
    copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime";
import { NextRequest } from "next/server";

const agent = new HttpAgent({ url: "http://localhost:8008/chat" });
const runtime = new CopilotRuntime({ agents: { captain: agent } });

export async function POST(req: NextRequest) {
    const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
        runtime,
        serviceAdapter: new ExperimentalEmptyAdapter(),
        endpoint: "/api/copilotkit",
    });
    return handleRequest(req);
}
```

---

### Step 8: Polish and safety

**What you do:**
- Add safety guardrails to all prompts (crisis detection, professional referral)
- Add error handling and loading states
- Test with edge cases (self-harm mentions, abuse scenarios, medical decisions)
- Add mock mode for UI development without API calls

---

## Final folder structure

```
future-me/
├── pyproject.toml
├── .env
├── .env.example
├── backend/
│   ├── __init__.py
│   ├── config.py          # Model configs (lead_config, worker_config)
│   ├── models.py           # Pydantic models for all agent outputs
│   ├── prompts.py          # System prompts for all 6 agents
│   ├── agents.py           # Agent definitions + delegation wiring
│   ├── main.py             # CLI test script
│   └── server.py           # FastAPI + AGUIStream
├── frontend/
│   ├── package.json
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── api/copilotkit/route.ts
│   └── components/
│       ├── ChatInterface.tsx
│       ├── CaptainBriefingPanel.tsx
│       ├── AgentPanel.tsx
│       ├── FutureScenarioPanel.tsx
│       ├── ReportPanel.tsx
│       └── StatusBadge.tsx
└── README.md
```

---

## What AG2 handles vs. what you build

| Concern | Who handles it |
|---------|---------------|
| Agent-to-agent communication | AG2 (`subagent_tool`) |
| Parallel agent execution | AG2 (`asyncio` under the hood) |
| Structured JSON output + validation | AG2 (`response_schema=` + Pydantic) |
| Conversation history / multi-turn | AG2 (`reply.ask()` chaining) |
| Streaming to frontend | AG2 (`AGUIStream` + AG-UI protocol) |
| Agent prompts and behavior design | **You** |
| Pydantic data models | **You** |
| Frontend UI / panels / layout | **You** (Next.js + CopilotKit) |
| Safety guardrails in prompts | **You** |
| Deployment | **You** |

---

## AG2 resource reference

| When you need to... | Read this skill |
|---------------------|----------------|
| Set up an Agent, pick config | `ag2-quickstart` |
| Write @tool functions | `ag2-add-custom-tool` |
| Get typed Pydantic output | `ag2-structured-output` |
| Wire Captain → specialist delegation | `ag2-subagent-delegation` |
| Connect to a React frontend | `ag2-ag-ui` |
| Add human-in-the-loop checkpoints | `ag2-hitl` |
| Add retry/logging middleware | `ag2-middleware` |
| Observe agent events and status | `ag2-observers-and-alerts` |

All skills are at: https://github.com/ag2ai/build-with-ag2/tree/main/.agents/skills
AG2 Beta docs: https://docs.ag2.ai/latest/docs/beta/motivation/
