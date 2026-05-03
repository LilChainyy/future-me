"use client";

import { useState, useEffect } from "react";

/**
 * Types out text character by character for a streaming effect.
 * Returns the currently visible portion of the text.
 */
export function useStreamingText(fullText: string, speed: number = 15): string {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let index = 0;

    const interval = setInterval(() => {
      if (!fullText) {
        setDisplayed("");
        clearInterval(interval);
        return;
      }
      index += 1;
      if (index >= fullText.length) {
        setDisplayed(fullText);
        clearInterval(interval);
      } else {
        setDisplayed(fullText.slice(0, index));
      }
    }, speed);

    return () => clearInterval(interval);
  }, [fullText, speed]);

  return displayed;
}
