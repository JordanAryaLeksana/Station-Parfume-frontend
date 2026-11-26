"use client";

import dynamic from "next/dynamic";
import { cn } from "cn";

import StageFrame from "@/features/home/components/stage-frame";
import { useWebgl } from "@/features/home/three/use-stage";

const CarouselScene = dynamic(
  () => import("@/features/home/three/carousel-scene"),
  { ssr: false },
);

export default function AromaCarousel({
  selected,
  className,
}: {
  selected: number;
  className?: string;
}) {
  const webgl = useWebgl();
  if (webgl === false) return null;

  return (
    <StageFrame eager className={cn("relative", className)}>
      {({ active, onReady }) => (
        <CarouselScene selected={selected} active={active} onReady={onReady} />
      )}
    </StageFrame>
  );
}
