import { CopilotChat } from "@copilotkit/react-ui";

export default function ChatInterface() {
  return (
    <div className="flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800">
      <div className="border-b border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Captain Agent
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Gathering context about your decision
        </p>
      </div>
      <CopilotChat
        className="flex-1"
        labels={{
          title: "futureMe",
          initial: "What life decision are you thinking about?",
          placeholder: "Describe your situation...",
        }}
      />
    </div>
  );
}
