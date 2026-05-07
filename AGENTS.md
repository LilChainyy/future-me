# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project Overview

futureMe is a multi-agent future-self simulator built on AG2 Beta. Users enter life-decision questions and a team of six AI agents explores possible futures, tradeoffs, risks, and emotional implications — without making the decision for them.

## Commands

```bash
# Backend
pip install -e .                                    # install Python dependencies
python -m uvicorn backend.server:app --reload --port 8008  # run backend
python -m compileall backend                        # backend syntax check

# Frontend
cd frontend && npm install                          # install Node dependencies
cd frontend && npm run dev                          # run Next.js dev server (port 3000)
cd frontend && npm run lint                         # lint frontend
cd frontend && npm run build                        # production build check
```

## Architecture

**Backend:** Python + AG2 Beta (`autogen.beta`) — agent orchestration, structured output, discussion orchestration, parallel structured finalization
**Frontend:** Next.js + CopilotKit + Tailwind CSS, connected via AG-UI protocol (SSE)
**Model:** Gemini 2.5 via OpenRouter using `OpenAIConfig` with `base_url="https://openrouter.ai/api/v1"`

### Agent Delegation Flow

Consultant Agent is the user-facing coordinator. It gathers context, saves a structured briefing, runs a two-round specialist discussion, then chains sequentially through synthesis and reporting. The only parallel specialist step is the final structured-output pass after the discussion transcript exists.

```
User ←→ Consultant (chat + clarifying questions)
                 │
                 ▼
          save_briefing tool
                 │
                 ▼
          run_specialist_discussion
                 │
                 ├── Round 1: Optimist → Realist → Risk Analyst
                 ├── Round 2: Optimist → Realist → Risk Analyst
                 └── Final structured outputs run in parallel
                            │
                            ▼
          Future Self Agent (4 scenarios: Hopeful, Balanced, Cautious, Unchanged Path)
                            │
                            ▼
          Reporter Agent (final synthesis)
```

### Backend File Layout

```
backend/
├── config.py              # OpenAIConfig instances (lead_config, worker_config)
├── models.py              # Pydantic BaseModel for each agent's response_schema
├── prompts_consultant.py  # Consultant system prompt
├── prompts_discussion.py  # Free-text specialist discussion prompts
├── prompts_specialists.py # Structured specialist + Future Self + Reporter prompts
├── agents.py              # Consultant, Future Self, Reporter, and tool wiring
├── discussion.py          # 2-round specialist discussion + final parallel specialist output
├── pipeline_state.py      # Shared Pydantic pipeline state + default state helper
├── state_middleware.py    # AG-UI state snapshots for Future Self and Reporter tools
├── errors.py              # parse_with_retries, safe_agent_ask
├── main.py                # CLI test runner with MemoryStream events
├── server.py              # FastAPI + AGUIStream (SSE endpoint at /chat)
└── test_*.py              # Standalone test scripts with hardcoded mock data
```

### Frontend File Layout

```
frontend/src/
├── app/
│   ├── api/copilotkit/route.ts  # CopilotKit → AG2 bridge (HttpAgent)
│   ├── layout.tsx               # CopilotKit provider
│   └── page.tsx                 # Split layout: chat left, panels right
├── components/
│   ├── ChatInterface.tsx        # CopilotChat wrapper
│   ├── ConsultantBriefingPanel.tsx # Consultant context summary
│   ├── AgentPanel.tsx           # Generic specialist output panel
│   ├── SpecialistPanels.tsx     # Responsive wrapper for the three specialist panels
│   ├── FutureScenarioPanel.tsx  # Per-scenario display (4 styles)
│   ├── ReportPanel.tsx          # Final synthesis report
│   ├── BulletList.tsx           # Shared bullet list component
│   ├── StatusBadge.tsx          # waiting/running/done/error states
│   ├── ErrorBanner.tsx          # Dismissible error banner
│   └── Spinner.tsx              # SVG loading spinner
└── types.ts                     # TypeScript interfaces matching Pydantic models
```

Two model tiers: `google/gemini-2.5-pro` for lead agents (Consultant, Future Self, Reporter), `google/gemini-2.5-flash` for specialists (Optimist, Realist, Risk Analyst).

## Conventions

- API keys in `.env`, loaded via `python-dotenv` + `os.environ`. Never in source files.
- Frontend URLs via `NEXT_PUBLIC_BACKEND_URL` env var (defaults to `http://localhost:8008`).
- Max 150 lines per file. One concern per file.
- All agent code is async (`asyncio`).
- Every agent output uses a Pydantic `BaseModel` passed as `response_schema=`.
- AG2 Beta patterns only: `Agent`, `@tool`, `subagent_tool()`, `OpenAIConfig`, `AGUIStream`.
- All agent prompts include: "You are part of futureMe, a reflective simulation tool. You do not predict the future. You help the user think clearly."
- Do NOT use `from __future__ import annotations` in files that define Pydantic models — it breaks AG2 Beta's schema extraction.
- Keep backend and frontend pipeline-state shapes synchronized. Valid `current_step` values are `gathering`, `specialists`, `discussion`, `future_self`, `reporter`, and `complete`.
- Do not run LLM-backed smoke scripts by default unless the user explicitly allows credential/network use.

## Current Optimization Plan

This warm Consultant pass must be implemented in this order:

1. Update `AGENTS.md` first so the canonical guide matches the Consultant naming and warm journal direction.
2. Integrate backend and frontend fixes:
   - Rename Captain to Consultant across backend exports, CopilotKit agent keys, prompts, models, frontend types, and visible UI copy.
   - Rename `captain_briefing` state to `consultant_briefing`.
   - Update opening chat copy to: "Tell me a little about a decision you’re carrying, and we’ll explore what it could mean for your future."
   - Add static example chips: "Should I marry him?", "Should I quit my current job?", "Should I move to a new city?", and "Should I stay where I am or start over?"
   - Restyle the app toward a calm journal feel with warm paper surfaces, clay accents, muted rose/sage support colors, and CopilotKit theme overrides.
3. Update `README.md` last, after integrations are complete and verification results are known.

Do not introduce quick/deep modes, persistence, auth, deployment changes, new model providers, new routes, or new UI libraries in this pass.

## Safety

- Consultant prompt includes crisis referrals (988, NDVH, SAMHSA) triggered by sensitive topics.
- Agents never diagnose mental health conditions or tell users what to do.
- Optimist has escape hatch for objectively bad decisions: "I'm finding it hard to identify realistic upside here."
- Unchanged Path scenario is non-punitive — sometimes staying IS the right call.

## References

- Build plan with full implementation details: `futureMe-build-plan.md`
- AG2 Beta docs: https://docs.ag2.ai/latest/docs/beta/motivation/
- AG2 skills reference: https://github.com/ag2ai/build-with-ag2/tree/main/.agents/skills
