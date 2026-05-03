# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

futureMe is a multi-agent future-self simulator built on AG2 Beta. Users enter life-decision questions and a team of six AI agents explores possible futures, tradeoffs, risks, and emotional implications — without making the decision for them.

## Commands

```bash
# Backend
pip install -e .                                    # install Python dependencies
python -m uvicorn backend.server:app --reload --port 8008  # run backend

# Frontend
cd frontend && npm install                          # install Node dependencies
cd frontend && npm run dev                          # run Next.js dev server (port 3000)
cd frontend && npm run lint                         # lint frontend
```

## Architecture

**Backend:** Python + AG2 Beta (`autogen.beta`) — agent orchestration, structured output, parallel delegation
**Frontend:** Next.js + CopilotKit + Tailwind CSS, connected via AG-UI protocol (SSE)
**Model:** Gemini 2.5 via OpenRouter using `OpenAIConfig` with `base_url="https://openrouter.ai/api/v1"`

### Agent Delegation Flow

Captain Agent is the user-facing coordinator. It delegates to three specialist agents in parallel (same LLM tool-call turn), then chains sequentially through synthesis and reporting:

```
User ←→ Captain (chat + clarifying questions)
              │
              ├── subagent_tool(optimist)    ─┐
              ├── subagent_tool(realist)      ─┼── parallel
              └── subagent_tool(risk_analyst) ─┘
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
├── prompts_captain.py     # Captain system prompt
├── prompts_specialists.py # Specialist + Future Self + Reporter prompts
├── agents.py              # Agent definitions + subagent_tool() wiring
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
│   ├── CaptainBriefingPanel.tsx # Captain context summary
│   ├── AgentPanel.tsx           # Generic specialist output panel
│   ├── FutureScenarioPanel.tsx  # Per-scenario display (4 styles)
│   ├── ReportPanel.tsx          # Final synthesis report
│   ├── BulletList.tsx           # Shared bullet list component
│   ├── StatusBadge.tsx          # waiting/running/done/error states
│   ├── ErrorBanner.tsx          # Dismissible error banner
│   └── Spinner.tsx              # SVG loading spinner
└── types.ts                     # TypeScript interfaces matching Pydantic models
```

Two model tiers: `google/gemini-2.5-pro` for lead agents (Captain, Future Self, Reporter), `google/gemini-2.5-flash` for specialists (Optimist, Realist, Risk Analyst).

## Conventions

- API keys in `.env`, loaded via `python-dotenv` + `os.environ`. Never in source files.
- Frontend URLs via `NEXT_PUBLIC_BACKEND_URL` env var (defaults to `http://localhost:8008`).
- Max 150 lines per file. One concern per file.
- All agent code is async (`asyncio`).
- Every agent output uses a Pydantic `BaseModel` passed as `response_schema=`.
- AG2 Beta patterns only: `Agent`, `@tool`, `subagent_tool()`, `OpenAIConfig`, `AGUIStream`.
- All agent prompts include: "You are part of futureMe, a reflective simulation tool. You do not predict the future. You help the user think clearly."
- Do NOT use `from __future__ import annotations` in files that define Pydantic models — it breaks AG2 Beta's schema extraction.

## Safety

- Captain prompt includes crisis referrals (988, NDVH, SAMHSA) triggered by sensitive topics.
- Agents never diagnose mental health conditions or tell users what to do.
- Optimist has escape hatch for objectively bad decisions: "I'm finding it hard to identify realistic upside here."
- Unchanged Path scenario is non-punitive — sometimes staying IS the right call.

## References

- Build plan with full implementation details: `futureMe-build-plan.md`
- AG2 Beta docs: https://docs.ag2.ai/latest/docs/beta/motivation/
- AG2 skills reference: https://github.com/ag2ai/build-with-ag2/tree/main/.agents/skills
