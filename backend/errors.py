import asyncio
import logging
from typing import TypeVar
from pydantic import BaseModel

logger = logging.getLogger("futureme")

T = TypeVar("T", bound=BaseModel)


async def parse_with_retries(reply, retries: int = 2) -> T | None:
    """Parse structured output from an agent reply with retry logic.

    Returns the parsed Pydantic model, or None if all attempts fail.
    """
    last_error: Exception | None = None
    for attempt in range(1 + retries):
        try:
            return await reply.content()
        except Exception as e:
            last_error = e
            if attempt < retries:
                logger.warning(
                    "Structured output parse failed (attempt %d/%d): %s",
                    attempt + 1,
                    1 + retries,
                    e,
                )
                await asyncio.sleep(0.5)
            else:
                logger.error(
                    "Structured output parse failed after %d attempts: %s",
                    1 + retries,
                    e,
                )
    return None


async def safe_agent_ask(agent, message: str, *, stream=None, retries: int = 2):
    """Call agent.ask() with error handling. Returns (reply, parsed) or (None, None)."""
    try:
        kwargs = {}
        if stream is not None:
            kwargs["stream"] = stream
        reply = await agent.ask(message, **kwargs)
        if agent.response_schema is not None:
            parsed = await parse_with_retries(reply, retries=retries)
            return reply, parsed
        return reply, None
    except Exception as e:
        logger.error("[%s] agent.ask() failed: %s", agent.name, e)
        return None, None
