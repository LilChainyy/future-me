# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

futureMe is a multi-agent future-self simulator built on AG2 Beta. Users enter life-decision questions and a team of six AI agents explores possible futures, tradeoffs, risks, and emotional implications — without making the decision for them.

## Commands

```bash
pip install -e .                              # install dependencies
python agent.py                               # smoke test — one agent, one call
uvicorn backend.server:app --reload --port 8008  # run backend (planned)
```

## Architecture

**Backend:** Python + AG2 Beta (`autogen.beta`) — agent orchestration, structured output, parallel delegation
**Frontend:** Next.js + CopilotKit connected via AG-UI protocol (planned)
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
              Future Self Agent (needs all 3 outputs)
                        │
                        ▼
              Reporter Agent (final synthesis)
```

### Planned Backend File Layout

```
backend/
├── config.py      # OpenAIConfig instances (lead_config, worker_config)
├── models.py      # Pydantic BaseModel for each agent's response_schema
├── prompts.py     # System prompt constants, one per agent
├── agents.py      # Agent definitions + subagent_tool() wiring
├── main.py        # CLI test runner
└── server.py      # FastAPI + AGUIStream (SSE endpoint at /chat)
```

Two model tiers: `google/gemini-2.5-pro` for lead agents (Captain, Future Self, Reporter), `google/gemini-2.5-flash` for specialists (Optimist, Realist, Risk Analyst).

## Conventions

- API keys in `.env`, loaded via `python-dotenv` + `os.environ`. Never in source files.
- Max 150 lines per file. One concern per file.
- All agent code is async (`asyncio`).
- Every agent output uses a Pydantic `BaseModel` passed as `response_schema=`.
- AG2 Beta patterns only: `Agent`, `@tool`, `subagent_tool()`, `OpenAIConfig`, `AGUIStream`.
- All agent prompts must include: "You are part of futureMe, a reflective simulation tool. You do not predict the future. You help the user think clearly."

## References

- Build plan with full implementation details: `futureMe-build-plan.md`
- AG2 Beta docs: https://docs.ag2.ai/latest/docs/beta/motivation/
- AG2 skills reference: https://github.com/ag2ai/build-with-ag2/tree/main/.agents/skills
