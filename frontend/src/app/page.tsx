"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import CaptainBriefingPanel from "@/components/CaptainBriefingPanel";
import AgentPanel from "@/components/AgentPanel";
import FutureScenarioPanel from "@/components/FutureScenarioPanel";
import ReportPanel from "@/components/ReportPanel";
import ErrorBanner from "@/components/ErrorBanner";

// TODO: Replace with real state from CopilotKit agent events.
// For now, all panels render in their empty/waiting state so we can
// verify the layout and component rendering.

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8008";

export default function Home() {
  const [backendError, setBackendError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/copilotkit", { method: "HEAD" }).catch(() => {
      // HEAD will 405 if the route is up but backend is down — try healthz
      fetch(`${BACKEND_URL}/healthz`)
        .then((r) => {
          if (!r.ok) throw new Error();
        })
        .catch(() => {
          setBackendError(
            "Cannot reach the backend server. Make sure it's running: python -m uvicorn backend.server:app --port 8008"
          );
        });
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          futureMe
        </h1>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Simulate possible futures for your life decisions
        </p>
      </header>

      {/* Connection error banner */}
      {backendError && (
        <div className="px-6 pt-3">
          <ErrorBanner
            message={backendError}
            onRetry={() => {
              setBackendError(null);
              fetch(`${BACKEND_URL}/healthz`)
                .then((r) => {
                  if (!r.ok) throw new Error();
                })
                .catch(() =>
                  setBackendError(
                    "Still cannot reach the backend. Is it running on port 8008?"
                  )
                );
            }}
          />
        </div>
      )}

      {/* Main split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Chat */}
        <div className="w-[420px] min-w-[360px] flex-shrink-0">
          <ChatInterface />
        </div>

        {/* Right: Scrollable panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50 dark:bg-zinc-900">
          {/* Captain Briefing */}
          <CaptainBriefingPanel data={null} status="waiting" />

          {/* Three specialists side by side */}
          <div className="grid grid-cols-3 gap-4">
            <AgentPanel
              title="Optimist"
              color="bg-emerald-500"
              status="waiting"
              summary={null}
              sections={[]}
            />
            <AgentPanel
              title="Realist"
              color="bg-blue-500"
              status="waiting"
              summary={null}
              sections={[]}
            />
            <AgentPanel
              title="Risk Analyst"
              color="bg-amber-500"
              status="waiting"
              summary={null}
              sections={[]}
            />
          </div>

          {/* Four scenarios in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            <FutureScenarioPanel data={null} status="waiting" />
            <FutureScenarioPanel data={null} status="waiting" />
            <FutureScenarioPanel data={null} status="waiting" />
            <FutureScenarioPanel data={null} status="waiting" />
          </div>

          {/* Final report */}
          <ReportPanel data={null} status="waiting" />
        </div>
      </div>
    </div>
  );
}
