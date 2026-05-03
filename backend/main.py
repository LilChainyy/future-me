import asyncio
import logging

from autogen.beta import MemoryStream
from autogen.beta.events import TaskCompleted, TaskFailed, TaskStarted, ToolCallEvent

from .agents import captain

logging.basicConfig(level=logging.WARNING, format="%(name)s: %(message)s")


def setup_stream() -> MemoryStream:
    stream = MemoryStream()

    @stream.subscribe(TaskStarted)
    def on_start(event: TaskStarted) -> None:
        print(f"  [{event.agent_name}] started...")

    @stream.subscribe(TaskCompleted)
    def on_complete(event: TaskCompleted) -> None:
        print(f"  [{event.agent_name}] complete ✓")

    @stream.subscribe(TaskFailed)
    def on_failed(event: TaskFailed) -> None:
        print(f"  [{event.agent_name}] FAILED: {event.error}")

    @stream.subscribe(ToolCallEvent)
    def on_tool_call(event: ToolCallEvent) -> None:
        print(f"  [{event.agent_name}] calling {event.tool_name}...")

    return stream


async def main() -> None:
    print("futureMe — Simulate possible futures")
    print("=" * 40)
    print("Describe a life decision you're facing. Type 'exit' to quit.\n")

    stream = setup_stream()

    question = input("You: ").strip()
    if not question or question.lower() == "exit":
        return

    try:
        reply = await captain.ask(question, stream=stream)
    except Exception as e:
        print(f"\nError starting conversation: {e}")
        return

    print(f"\nCaptain: {reply.body}\n")

    while True:
        follow_up = input("You: ").strip()
        if not follow_up or follow_up.lower() == "exit":
            break
        try:
            reply = await reply.ask(follow_up, stream=stream)
            print(f"\nCaptain: {reply.body}\n")
        except Exception as e:
            print(f"\nError: {e}")
            print("You can try again or type 'exit' to quit.\n")


if __name__ == "__main__":
    asyncio.run(main())
