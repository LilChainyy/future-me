"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import CaptainBriefingPanel from "@/components/CaptainBriefingPanel";
import DiscussionPanel from "@/components/DiscussionPanel";
import AgentPanel from "@/components/AgentPanel";
import FutureScenarioPanel from "@/components/FutureScenarioPanel";
import ReportPanel from "@/components/ReportPanel";
import ErrorBanner from "@/components/ErrorBanner";
import { usePipelineState } from "@/hooks/usePipelineState";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8008";

export default function Home() {
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    captainBriefing,
    captainBriefingStatus,
    activeAgents,
    discussionTranscript,
    discussionStatus,
    optimistOutput,
    optimistStatus,
    realistOutput,
    realistStatus,
    riskAnalystOutput,
    riskAnalystStatus,
    scenarios,
    scenarioStatus,
    reporterOutput,
    reportStatus,
  } = usePipelineState();

  useEffect(() => {
    fetch("/api/copilotkit", { method: "HEAD" }).catch(() => {
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
        <div className="w-[420px] min-w-[360px] flex-shrink-0 overflow-y-auto">
          <ChatInterface />
        </div>

        {/* Right: Scrollable panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-zinc-50 dark:bg-zinc-900">
          {/* Captain Briefing */}
          <CaptainBriefingPanel
            data={captainBriefing}
            status={captainBriefingStatus}
          />

          {/* Specialist Discussion */}
          <DiscussionPanel
            transcript={discussionTranscript}
            status={discussionStatus}
            activeAgents={activeAgents}
          />

          {/* Three specialists side by side (final structured outputs) */}
          <div className="grid grid-cols-3 gap-4">
            <AgentPanel
              title="Optimist"
              color="bg-emerald-500"
              status={optimistStatus}
              summary={optimistOutput?.summary ?? null}
              sections={
                optimistOutput
                  ? [
                      { label: "Best Case Future", items: [optimistOutput.best_case_future] },
                      { label: "Positive Signals", items: optimistOutput.positive_signals },
                      { label: "Conditions for Success", items: optimistOutput.conditions_needed_for_success },
                    ]
                  : []
              }
            />
            <AgentPanel
              title="Realist"
              color="bg-blue-500"
              status={realistStatus}
              summary={realistOutput?.summary ?? null}
              sections={
                realistOutput
                  ? [
                      { label: "Most Likely Future", items: [realistOutput.most_likely_future] },
                      { label: "Practical Considerations", items: realistOutput.practical_considerations },
                      { label: "Tradeoffs", items: realistOutput.tradeoffs },
                      { label: "Open Questions", items: realistOutput.open_questions },
                    ]
                  : []
              }
            />
            <AgentPanel
              title="Risk Analyst"
              color="bg-amber-500"
              status={riskAnalystStatus}
              summary={riskAnalystOutput?.summary ?? null}
              sections={
                riskAnalystOutput
                  ? [
                      { label: "Major Risks", items: riskAnalystOutput.major_risks },
                      { label: "Hidden Costs", items: riskAnalystOutput.hidden_costs },
                      { label: "Risk Mitigation", items: riskAnalystOutput.risk_mitigation_steps },
                      { label: "Stop Signals", items: riskAnalystOutput.stop_signals },
                    ]
                  : []
              }
            />
          </div>

          {/* Four scenarios in 2x2 grid */}
          <div className="grid grid-cols-2 gap-4">
            {scenarios.map((scenario, i) => (
              <FutureScenarioPanel
                key={i}
                data={scenario}
                status={scenario ? "complete" : scenarioStatus}
              />
            ))}
          </div>

          {/* Final report */}
          <ReportPanel data={reporterOutput} status={reportStatus} />
        </div>
      </div>
    </div>
  );
}
