"use client";

import { useRef, useEffect, useState } from "react";
import type { AgentStatus, DiscussionMessage } from "@/types";
import { useStreamingText } from "@/hooks/useStreamingText";
import StatusBadge from "./StatusBadge";

const SPEAKER_STYLES: Record<string, { badge: string; bg: string }> = {
  optimist: {
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  realist: {
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  risk_analyst: {
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
  },
};

const SPEAKER_LABELS: Record<string, string> = {
  optimist: "Optimist",
  realist: "Realist",
  risk_analyst: "Risk Analyst",
};

interface Props {
  transcript: DiscussionMessage[];
  status: AgentStatus;
  activeAgents: string[];
}

export default function DiscussionPanel({ transcript, status, activeAgents }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);
  const [seenCount, setSeenCount] = useState(0);
  const userScrolledRef = useRef(false);

  // Track newly arrived messages
  useEffect(() => {
    if (transcript.length > prevCountRef.current) {
      setSeenCount(prevCountRef.current);
      prevCountRef.current = transcript.length;
    }
  }, [transcript.length]);

  // Detect if user scrolled up
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    userScrolledRef.current = !atBottom;
  };

  // Auto-scroll only when a new message arrives (not on every character tick)
  useEffect(() => {
    if (userScrolledRef.current) return;
    sentinelRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcript.length]);

  // Find where round 2 starts
  const round2StartIdx = transcript.findIndex((m) => m.round === 2);

  // Determine the active "thinking" agent
  const thinkingAgent = status === "running" ? activeAgents[0] ?? null : null;
  // Don't show typing if the latest message is still streaming
  const latestIsNew = transcript.length > 0 && transcript.length - 1 >= seenCount;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Specialist Discussion
        </h2>
        <StatusBadge status={status} />
      </div>

      {transcript.length === 0 && status === "waiting" && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Waiting for specialists to begin discussing...
        </p>
      )}

      {(transcript.length > 0 || status === "running") && (
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="space-y-3 max-h-[500px] overflow-y-auto"
        >
          {transcript.map((msg, i) => (
            <div key={i}>
              {/* Round divider */}
              {i === round2StartIdx && (
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                  <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                    Round 2 · Cross-Examination
                  </span>
                  <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-700" />
                </div>
              )}
              <StreamingMessageBubble
                message={msg}
                isNew={i >= seenCount}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {thinkingAgent && !latestIsNew && (
            <TypingIndicator agentName={thinkingAgent} />
          )}

          <div ref={sentinelRef} />
        </div>
      )}
    </div>
  );
}

function StreamingMessageBubble({
  message,
  isNew,
}: {
  message: DiscussionMessage;
  isNew: boolean;
}) {
  const streamedText = useStreamingText(isNew ? message.content : "", 45);
  const displayText = isNew ? streamedText : message.content;
  const isStreaming = isNew && streamedText.length < message.content.length;

  const style = SPEAKER_STYLES[message.speaker] ?? SPEAKER_STYLES.realist;
  const label = SPEAKER_LABELS[message.speaker] ?? message.speaker;

  return (
    <div className={`animate-in fade-in duration-200 flex gap-2`}>
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium h-fit mt-1 ${style.badge}`}
      >
        {label}
      </span>
      <div className={`rounded-lg px-3 py-2 ${style.bg} flex-1`}>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          {displayText}
          {isStreaming && (
            <span className="inline-block ml-0.5 animate-pulse text-zinc-400">▊</span>
          )}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator({ agentName }: { agentName: string }) {
  const style = SPEAKER_STYLES[agentName] ?? SPEAKER_STYLES.realist;
  const label = SPEAKER_LABELS[agentName] ?? agentName;

  return (
    <div className="flex items-center gap-2 animate-in fade-in duration-200">
      <span
        className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}
      >
        {label}
      </span>
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
        <span className="flex gap-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce [animation-delay:300ms]" />
        </span>
        <span>is thinking...</span>
      </div>
    </div>
  );
}
