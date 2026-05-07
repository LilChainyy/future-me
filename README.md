# futureMe

A multi-agent future-self simulator. Ask a life-decision question and six AI agents explore what could happen — the upside, the risks, the pragmatic middle, and what life looks like if nothing changes.

Built with [AG2 Beta](https://docs.ag2.ai/latest/docs/beta/motivation/) (agent orchestration), [Gemini 2.5](https://openrouter.ai/) (via OpenRouter), [Next.js](https://nextjs.org/), and [CopilotKit](https://www.copilotkit.ai/).

## How It Works

1. **Consultant** gathers context through conversation — your situation, values, hopes, fears, constraints.
2. **Specialist Discussion** runs two rounds of live deliberation:
   - **Optimist** — what could go right
   - **Realist** — what will probably happen
   - **Risk Analyst** — what could go wrong and how to prepare
3. The specialists produce their final structured analyses **in parallel** after the discussion transcript exists.
4. **Future Self** synthesizes four scenarios: Hopeful, Balanced, Cautious, and Unchanged Path.
5. **Reporter** produces a final decision-support report with themes, uncertainties, and reflection questions.

No agent tells you what to do. They help you see clearly. The chat starts with warm example prompts for decisions like relationships, work, relocation, and whether to stay or begin again.

## Setup

### Prerequisites

- Python 3.11+
- Node.js 18+
- An [OpenRouter](https://openrouter.ai/) API key

### Backend

```bash
# Clone and enter the project
git clone <repo-url> && cd future-me

# Create virtual environment
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -e .

# Configure environment
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Run the backend
python -m uvicorn backend.server:app --reload --port 8008
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Configure environment (optional — defaults to localhost:8008)
cp .env.example .env.local
# Edit .env.local if your backend runs on a different host/port

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The left panel is the Consultant chat interface; the right panel shows the live pipeline as it arrives: Consultant briefing, specialist discussion, final specialist outputs, future scenarios, and final report.

### Verification

```bash
# Backend syntax check
python -m compileall backend

# Frontend checks
cd frontend && npm run lint
cd frontend && npm run build
```

The `backend/test_*.py` scripts are LLM-backed smoke scripts. They require a configured OpenRouter key and network access, so they are not part of the default local verification loop.

## Project Structure

```
backend/
├── config.py              # Model configs (Gemini 2.5 Pro/Flash via OpenRouter)
├── models.py              # Pydantic models for structured agent output
├── prompts_consultant.py  # Consultant agent system prompt
├── prompts_discussion.py  # Free-text specialist discussion prompts
├── prompts_specialists.py # Structured specialist + synthesis agent prompts
├── agents.py              # Consultant, Future Self, Reporter, and tool wiring
├── discussion.py          # 2-round discussion + final parallel specialist pass
├── pipeline_state.py      # Shared pipeline state shape
├── state_middleware.py    # AG-UI state snapshots for subagent tools
├── errors.py              # Retry logic for structured output parsing
├── main.py                # CLI runner with streaming events
└── server.py              # FastAPI + AG-UI SSE endpoint

frontend/src/
├── app/                   # Next.js app router (API route, layout, page)
├── components/            # UI panels and responsive pipeline wrappers
└── types.ts               # TypeScript types matching backend models
```

## Safety

- Crisis topics (self-harm, abuse, addiction) trigger professional resource referrals before any simulation.
- Agents never diagnose mental health conditions.
- The "Unchanged Path" scenario is honest, not guilt-tripping — sometimes staying put is the right call.

## License

MIT
