"use client";

import React from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import type { LiquidTone } from "@/features/home/hero-scents";

import { Bottle, BOTTLE } from "./bottle";
import { BRASS, LACQUER } from "./materials";
import { EMPTY_LEVEL, type Pour } from "./pour";
import type { Tier } from "./tier";

export const SIZES = [20, 30, 50];
const RACK = { x: 1.4, z: 0.95, turn: -0.32, top: 0.09 };
const AWAY = 4;
const SPACING = [-0.62, 0, 0.64];

const EMPTY: React.RefObject<Pour> = {
  current: { level: EMPTY_LEVEL, cap: 0, stream: 0, progress: 0 },
};

export function slotOf(volume: number) {
  const index = Math.max(0, SIZES.indexOf(volume));
  const local = new THREE.Vector3(SPACING[index] ?? 0, 0, 0);
  local.applyAxisAngle(new THREE.Vector3(0, 1, 0), RACK.turn);
  return new THREE.Vector3(
    RACK.x + local.x,
    RACK.top - BOTTLE.base,
    RACK.z + local.z,
  );
}

export function SizeRack({
  tone,
  tier,
  outRef,
  presenceRef,
}: {
  tone: LiquidTone;
  tier: Tier;
  outRef: React.RefObject<number>;
  presenceRef: React.RefObject<number>;
}) {
  const slots = React.useRef<(THREE.Group | null)[]>([]);
  const group = React.useRef<THREE.Group>(null);

  useFrame(() => {
    const presence = presenceRef.current;
    if (group.current) {
      group.current.visible = presence > 0.002;
      group.current.position.x = RACK.x + (1 - presence) * AWAY;
    }
    SIZES.forEach((ml, index) => {
      const slot = slots.current[index];
      if (slot) slot.visible = ml !== outRef.current;
    });
  });

  return (
    <group
      ref={group}
      position={[RACK.x + AWAY, 0, RACK.z]}
      rotation={[0, RACK.turn, 0]}
      visible={false}
    >
      <RoundedBox
        args={[1.95, RACK.top, 0.56]}
        radius={0.02}
        smoothness={3}
        position={[0, RACK.top / 2, 0]}
      >
        <meshPhysicalMaterial
          color={LACQUER}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>
      <mesh position={[0, RACK.top - 0.004, 0.285]}>
        <boxGeometry args={[1.95, 0.012, 0.012]} />
        <meshStandardMaterial {...BRASS} roughness={0.25} />
      </mesh>
      {SIZES.map((ml, index) => (
        <group
          key={ml}
          ref={(slot) => {
            slots.current[index] = slot;
          }}
          position={[SPACING[index] ?? 0, RACK.top - BOTTLE.base, 0]}
          rotation={[0, -RACK.turn, 0]}
        >
          <Bottle
            tone={tone}
            label={{
              number: null,
              name: `${ml} ml`,
              volume: ml,
              blend: "campur",
            }}
            tier={tier}
            reduced
            pourRef={EMPTY}
            glass="physical"
          />
        </group>
      ))}
    </group>
  );
}
