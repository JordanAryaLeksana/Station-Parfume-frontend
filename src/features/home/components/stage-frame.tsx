"use client";

import React from "react";
import { cn } from "cn";

import { useStageActivity, useWebgl } from "@/features/home/three/use-stage";

type StageControls = { active: boolean; onReady: () => void };

export default function StageFrame({
  eager = false,
  className,
  fallback,
  overlay,
  children,
}: {
  eager?: boolean;
  className?: string;
  fallback?: React.ReactNode;
  overlay?: React.ReactNode;
  children: (controls: StageControls) => React.ReactNode;
}) {
  const [ready, setReady] = React.useState(false);
  const frame = React.useRef<HTMLDivElement>(null);
  const webgl = useWebgl();
  const { near, active } = useStageActivity(frame, eager);
  const onReady = React.useCallback(() => setReady(true), []);

  return (
    <div ref={frame} aria-hidden className={className}>
      {webgl === false && fallback}
      {webgl && near && (
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-atelier motion-reduce:transition-none",
            ready ? "opacity-100" : "opacity-0",
          )}
        >
          {children({ active, onReady })}
        </div>
      )}
      {overlay}
    </div>
  );
}
