"use client";

import { useState, useEffect } from "react";
import ChatInterface from "@/components/ChatInterface";
import Logo from "@/components/Logo";
import ConsultantBriefingPanel from "@/components/ConsultantBriefingPanel";
import DiscussionPanel from "@/components/DiscussionPanel";
import SpecialistPanels from "@/components/SpecialistPanels";
import FutureScenarioPanel from "@/components/FutureScenarioPanel";
import ReportPanel from "@/components/ReportPanel";
import ErrorBanner from "@/components/ErrorBanner";
import { usePipelineState } from "@/hooks/usePipelineState";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8008";

export default function Home() {
  const [backendError, setBackendError] = useState<string | null>(null);

  const {
    consultantBriefing,
    consultantBriefingStatus,
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
    let cancelled = false;

    fetch(`${BACKEND_URL}/healthz`)
      .then((r) => {
        if (!r.ok) throw new Error();
        if (!cancelled) setBackendError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setBackendError(
            "Cannot reach the backend server. Make sure it's running: python -m uvicorn backend.server:app --port 8008"
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--fm-page)] lg:h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-[var(--fm-border)] bg-[var(--fm-paper)] px-6 py-3">
        <Logo size={32} className="flex-shrink-0" />
        <div className="flex flex-col leading-tight">
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--fm-ink)]">
            futureMe
          </h1>
          <p className="text-xs text-[var(--fm-muted)]">
            A reflective space for decisions that may shape your future
          </p>
        </div>
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
      <div className="flex flex-1 flex-col overflow-visible lg:flex-row lg:overflow-hidden">
        {/* Left: Chat */}
        <div className="h-[45vh] min-h-[380px] w-full flex-shrink-0 overflow-y-auto lg:h-auto lg:w-[420px] lg:min-w-[360px]">
          <ChatInterface />
        </div>

        {/* Right: Scrollable panels */}
        <div className="flex-1 space-y-6 overflow-y-auto bg-[var(--fm-page)] p-4 sm:p-6">
          {/* Consultant Briefing */}
          <ConsultantBriefingPanel
            data={consultantBriefing}
            status={consultantBriefingStatus}
          />

          {/* Specialist Discussion */}
          <DiscussionPanel
            transcript={discussionTranscript}
            status={discussionStatus}
            activeAgents={activeAgents}
          />

          {/* Three specialists side by side (final structured outputs) */}
          <SpecialistPanels
            optimistOutput={optimistOutput}
            optimistStatus={optimistStatus}
            realistOutput={realistOutput}
            realistStatus={realistStatus}
            riskAnalystOutput={riskAnalystOutput}
            riskAnalystStatus={riskAnalystStatus}
          />

          {/* Four scenarios in 2x2 grid */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
