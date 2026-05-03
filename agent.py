import asyncio
import os

from dotenv import load_dotenv
from autogen.beta import Agent
from autogen.beta.config import OpenAIConfig
from autogen.beta.tools import tool

load_dotenv()

config = OpenAIConfig(
    model="google/gemini-2.5-flash",   # any model from the list above
    streaming=True,
    api_key=os.environ["OPENROUTER_API_KEY"],
    base_url="https://openrouter.ai/api/v1",
    max_completion_tokens=1024,
)


@tool
def add(a: int, b: int) -> int:
    """Adds two numbers together."""
    return a + b


agent = Agent(
    config=config,
    name="anas",
    tools=[add],
)


async def main() -> None:
    reply = await agent.ask("What's 1 + 1?")
    print(reply.body)


if __name__ == "__main__":
    asyncio.run(main())