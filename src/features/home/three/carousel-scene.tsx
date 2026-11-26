"use client";

import React from "react";
import { ContactShadows } from "@react-three/drei";

import { fitBox, Rig, view } from "./framing";
import { Stage } from "./stage";
import { Carousel } from "./station";
import { Atmosphere, Studio } from "./studio";
import { useReducedMotion, useTier } from "./use-stage";

const CAMERA = view([0, 0.8, 0], [0, 0.2, 1], 9);

function fit(width: number, height: number) {
  const wide = width >= 540;
  return fitBox(
    width,
    height,
    CAMERA,
    {
      left: (wide ? 0.06 : 0.1) * width,
      right: (wide ? 0.7 : 0.9) * width,
      top: 0.05 * height,
      bottom: 0.95 * height,
    },
    2.4,
    1.95,
  );
}

function Scene({ selected }: { selected: number }) {
  const reduced = useReducedMotion();
  const tier = useTier();
  const duskRef = React.useRef(1);

  return (
    <>
      <Atmosphere night reduced={reduced} duskRef={duskRef} backdrop="clear" />
      <Studio night />
      <Rig fit={fit} reduced={reduced} sway={0.35} />
      <Carousel selected={selected} reduced={reduced} />
      <ContactShadows
        key={tier}
        position={[0, 0.001, 0]}
        scale={4}
        resolution={tier === "low" ? 256 : 512}
        blur={2.2}
        far={1.6}
        opacity={0.7}
        frames={tier === "low" || reduced ? 1 : Infinity}
      />
    </>
  );
}

export default function CarouselScene({
  selected,
  active,
  onReady,
}: {
  selected: number;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Stage active={active} onReady={onReady}>
      <Scene selected={selected} />
    </Stage>
  );
}
