"use client";

import { CopilotChat } from "@copilotkit/react-ui";
import { useCopilotChatInternal } from "@copilotkit/react-core";

const STARTER_SUGGESTIONS = [
  {
    title: "Should I marry him?",
    message: "Should I marry him?",
  },
  {
    title: "Should I quit my current job?",
    message: "Should I quit my current job?",
  },
  {
    title: "Should I move to a new city?",
    message: "Should I move to a new city?",
  },
  {
    title: "Should I stay where I am or start over?",
    message: "Should I stay where I am or start over?",
  },
];

export default function ChatInterface() {
  // Note: useCopilotChat() exposes `visibleMessages` in its types but
  // the runtime returns undefined — useCopilotChatInternal returns the
  // actual `messages` array, which is what <CopilotChat> reads internally.
  const { messages } = useCopilotChatInternal();
  const hasStarted = (messages?.length ?? 0) > 0;

  return (
    <div className="flex h-full flex-col border-b border-[var(--fm-border)] bg-[var(--fm-surface)] lg:border-b-0 lg:border-r">
      <div className="border-b border-[var(--fm-border)] bg-[var(--fm-paper)] px-4 py-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--fm-muted)]">
          Consultant
        </h2>
        <p className="mt-0.5 text-sm text-[var(--fm-ink)]">
          A quiet space to unpack what matters.
        </p>
      </div>
      <CopilotChat
        className="futureme-chat flex-1"
        suggestions={hasStarted ? [] : STARTER_SUGGESTIONS}
        labels={{
          title: "futureMe",
          initial:
            "Tell me a little about a decision you’re carrying, and we’ll explore what it could mean for your future.",
          placeholder: "Share as much or as little as you want...",
        }}
      />
    </div>
  );
}
