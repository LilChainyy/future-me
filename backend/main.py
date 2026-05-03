import asyncio

from .agents import captain


async def main() -> None:
    print("futureMe — Simulate possible futures")
    print("=" * 40)
    print("Describe a life decision you're facing. Type 'exit' to quit.\n")

    question = input("You: ").strip()
    if not question or question.lower() == "exit":
        return

    reply = await captain.ask(question)
    print(f"\nCaptain: {reply.body}\n")

    while True:
        follow_up = input("You: ").strip()
        if not follow_up or follow_up.lower() == "exit":
            break
        reply = await reply.ask(follow_up)
        print(f"\nCaptain: {reply.body}\n")


if __name__ == "__main__":
    asyncio.run(main())
