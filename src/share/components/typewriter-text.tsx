"use client";

import * as React from "react";
import { cn } from "@/share/lib/utils";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  cursorClassName?: string;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  speed = 30,
  className,
  cursorClassName,
  onComplete,
}: TypewriterTextProps) {
  const [displayedLength, setDisplayedLength] = React.useState(0);
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    completedRef.current = false;
    setDisplayedLength(0);
  }, [text]);

  React.useEffect(() => {
    if (displayedLength >= text.length) {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete?.();
      }
      return;
    }
    const timer = setTimeout(() => {
      setDisplayedLength((n) => Math.min(n + 1, text.length));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayedLength, text, speed, onComplete]);

  return (
    <span className={cn("inline", className)}>
      {text.slice(0, displayedLength)}
      {displayedLength < text.length && (
        <span
          className={cn(
            "animate-pulse border-r-2 border-stone-400",
            cursorClassName,
          )}
          aria-hidden
        />
      )}
    </span>
  );
}
