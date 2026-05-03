"use client";

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  maxCollapsedHeight?: number;
  className?: string;
}

export default function CollapsiblePanel({
  children,
  maxCollapsedHeight = 200,
  className = "",
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const [contentHeight, setContentHeight] = useState<number>(0);

  const measure = useCallback(() => {
    if (!contentRef.current) return;
    const h = contentRef.current.scrollHeight;
    setContentHeight(h);
    setNeedsTruncation(h > maxCollapsedHeight);
  }, [maxCollapsedHeight]);

  useEffect(() => {
    measure();

    const el = contentRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      measure();
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, [measure, children]);

  const collapsed = needsTruncation && !isExpanded;

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{
          maxHeight: collapsed ? `${maxCollapsedHeight}px` : `${contentHeight}px`,
        }}
      >
        <div ref={contentRef}>{children}</div>

        {collapsed && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent pointer-events-none" />
        )}
      </div>

      {needsTruncation && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
