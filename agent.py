import asyncio
import os

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

agent = Agent(
    name="test-agent",
    config=config,
)


async def main() -> None:
    reply = await agent.ask("Hello")
    print(reply.body)


if __name__ == "__main__":
    asyncio.run(main())