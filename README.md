# futureMe

A multi-agent future-self simulator. Ask a life-decision question and six AI agents explore what could happen — the upside, the risks, the pragmatic middle, and what life looks like if nothing changes.

Built with [AG2 Beta](https://docs.ag2.ai/latest/docs/beta/motivation/) (agent orchestration), [Gemini 2.5](https://openrouter.ai/) (via OpenRouter), [Next.js](https://nextjs.org/), and [CopilotKit](https://www.copilotkit.ai/).

## How It Works

1. **Captain** gathers context through conversation — your situation, values, hopes, fears, constraints.
2. Three specialists run **in parallel**:
   - **Optimist** — what could go right
   - **Realist** — what will probably happen
   - **Risk Analyst** — what could go wrong and how to prepare
3. **Future Self** synthesizes four scenarios: Hopeful, Balanced, Cautious, and Unchanged Path.
4. **Reporter** produces a final decision-support report with themes, uncertainties, and reflection questions.

No agent tells you what to do. They help you see clearly.

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

Open [http://localhost:3000](http://localhost:3000). The left panel is the chat interface; the right panel shows agent outputs as they arrive.

## Project Structure

```
backend/
├── config.py              # Model configs (Gemini 2.5 Pro/Flash via OpenRouter)
├── models.py              # Pydantic models for structured agent output
├── prompts_captain.py     # Captain agent system prompt
├── prompts_specialists.py # All specialist + synthesis agent prompts
├── agents.py              # Agent definitions + subagent_tool() delegation
├── errors.py              # Retry logic for structured output parsing
├── main.py                # CLI runner with streaming events
└── server.py              # FastAPI + AG-UI SSE endpoint

frontend/src/
├── app/                   # Next.js app router (API route, layout, page)
├── components/            # UI panels for each agent stage
└── types.ts               # TypeScript types matching backend models
```

## Safety

- Crisis topics (self-harm, abuse, addiction) trigger professional resource referrals before any simulation.
- Agents never diagnose mental health conditions.
- The "Unchanged Path" scenario is honest, not guilt-tripping — sometimes staying put is the right call.

## License

MIT
