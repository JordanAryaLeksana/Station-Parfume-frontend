"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

import { drawMeter, surface } from "./canvas-textures";
import { BRASS, LACQUER } from "./materials";
import type { Pour } from "./pour";

export type Reading = {
  ml: number;
  rupiah: number;
  volume: number;
  paid: boolean;
};

export function Meter({
  volume = 30,
  price = 0,
  pourRef,
  packRef,
  readingRef,
}: {
  volume?: number;
  price?: number;
  pourRef?: React.RefObject<Pour>;
  packRef?: React.RefObject<number>;
  readingRef?: React.RefObject<Reading>;
}) {
  const screen = React.useMemo(() => surface(640, 320), []);
  const drawn = React.useRef("");
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    let alive = true;
    void document.fonts.ready.then(() => {
      if (!alive) return;
      drawn.current = "";
      invalidate();
    });
    return () => {
      alive = false;
    };
  }, [invalidate]);

  React.useEffect(() => () => screen.texture.dispose(), [screen]);

  useFrame(() => {
    let reading = readingRef?.current;
    if (!reading) {
      const progress = pourRef?.current.progress ?? 1;
      reading = {
        ml: progress >= 1 ? volume : volume * progress,
        rupiah:
          progress >= 1 ? price : Math.floor((price * progress) / 500) * 500,
        volume,
        paid: (packRef?.current ?? 0) > 0.03,
      };
    }
    const { ml, rupiah, paid } = reading;
    const size = reading.volume;
    const key = `${Math.floor(ml)}:${rupiah}:${size}:${paid}`;
    if (key === drawn.current) return;
    drawn.current = key;
    screen.paint((context) =>
      drawMeter(context, { ml, rupiah, volume: size, paid }),
    );
  });

  return (
    <group position={[-1.02, 0, 0.72]} rotation={[0, 0.32, 0]} scale={0.9}>
      <RoundedBox
        args={[1.02, 0.74, 0.38]}
        radius={0.035}
        smoothness={4}
        position={[0, 0.37 + 0.04, 0]}
      >
        <meshPhysicalMaterial
          color={LACQUER}
          roughness={0.35}
          clearcoat={0.8}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>
      <RoundedBox
        args={[0.94, 0.52, 0.04]}
        radius={0.015}
        smoothness={3}
        position={[0, 0.43, 0.19]}
      >
        <meshStandardMaterial {...BRASS} roughness={0.24} />
      </RoundedBox>
      <mesh position={[0, 0.43, 0.2105]}>
        <planeGeometry args={[0.84, 0.42]} />
        <meshBasicMaterial map={screen.texture} toneMapped={false} />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.02, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.3]} />
          <meshStandardMaterial {...BRASS} />
        </mesh>
      ))}
    </group>
  );
}
