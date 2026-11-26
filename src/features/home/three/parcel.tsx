"use client";

import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import sprigDark from "@/assets/brand/sprig-dark.png";

import { BOTTLE } from "./bottle";
import { drawEmblem } from "./canvas-textures";
import { BRASS, GOLD, LACQUER } from "./materials";
import { usePainted } from "./painted";

export const PARCEL = {
  width: BOTTLE.width + 0.12,
  depth: BOTTLE.depth + 0.12,
  tray: 0.24,
  height: BOTTLE.height + 0.4,
  wall: 0.025,
};

const COVER_LIFT = 2.2;

const SPRIG = [sprigDark.src];

export function segment(value: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (value - from) / (to - from)));
}

export function easeInOut(k: number) {
  return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
}

function easeOutBack(k: number) {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2);
}

function Lacquer() {
  return (
    <meshPhysicalMaterial
      color={LACQUER}
      roughness={0.32}
      clearcoat={1}
      clearcoatRoughness={0.14}
    />
  );
}

function Shell({
  width,
  depth,
  height,
  wall,
  top,
}: {
  width: number;
  depth: number;
  height: number;
  wall: number;
  top: boolean;
}) {
  return (
    <group>
      <mesh position={[0, top ? height - wall / 2 : wall / 2, 0]}>
        <boxGeometry args={[width, wall, depth]} />
        <Lacquer />
      </mesh>
      {[1, -1].map((side) => (
        <mesh
          key={`z${side}`}
          position={[0, height / 2, side * (depth / 2 - wall / 2)]}
        >
          <boxGeometry args={[width, height, wall]} />
          <Lacquer />
        </mesh>
      ))}
      {[1, -1].map((side) => (
        <mesh
          key={`x${side}`}
          position={[side * (width / 2 - wall / 2), height / 2, 0]}
        >
          <boxGeometry args={[wall, height, depth - 2 * wall]} />
          <Lacquer />
        </mesh>
      ))}
    </group>
  );
}

function Rim({ width, depth, y }: { width: number; depth: number; y: number }) {
  return (
    <group position={[0, y, 0]}>
      {[1, -1].map((side) => (
        <mesh key={`z${side}`} position={[0, 0, side * (depth / 2)]}>
          <boxGeometry args={[width + 0.01, 0.012, 0.012]} />
          <meshStandardMaterial {...BRASS} roughness={0.25} />
        </mesh>
      ))}
      {[1, -1].map((side) => (
        <mesh key={`x${side}`} position={[side * (width / 2), 0, 0]}>
          <boxGeometry args={[0.012, 0.012, depth + 0.01]} />
          <meshStandardMaterial {...BRASS} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

export function Parcel({ packRef }: { packRef?: React.RefObject<number> }) {
  const cover = React.useRef<THREE.Group>(null);
  const seal = React.useRef<THREE.Group>(null);
  const emblem = usePainted(256, 512, SPRIG, drawEmblem);
  const { width, depth, tray, height, wall } = PARCEL;
  const coverWidth = width + 0.03;
  const coverDepth = depth + 0.03;
  const coverHeight = height - 0.02;

  useFrame(() => {
    const progress = packRef ? packRef.current : 1;
    const close = easeInOut(segment(progress, 0.62, 0.86));
    if (cover.current) {
      cover.current.position.y = 0.02 + COVER_LIFT * (1 - close);
      cover.current.visible = close > 0.001;
    }
    const pop = segment(progress, 0.86, 1);
    if (seal.current) {
      seal.current.scale.setScalar(Math.max(0.0001, easeOutBack(pop)));
    }
  });

  return (
    <group>
      <Shell
        width={width}
        depth={depth}
        height={tray}
        wall={wall}
        top={false}
      />
      <Rim width={width} depth={depth} y={tray} />

      <group ref={cover}>
        <Shell
          width={coverWidth}
          depth={coverDepth}
          height={coverHeight}
          wall={wall}
          top
        />
        <Rim width={coverWidth} depth={coverDepth} y={coverHeight} />
        <Rim width={coverWidth} depth={coverDepth} y={0.006} />
        <mesh position={[0, coverHeight * 0.48, coverDepth / 2 + 0.002]}>
          <planeGeometry args={[width * 0.34, width * 0.68]} />
          <meshStandardMaterial
            map={emblem}
            transparent
            roughness={0.5}
            metalness={0}
          />
        </mesh>
        <group
          ref={seal}
          position={[0, coverHeight * 0.86, coverDepth / 2 + 0.012]}
        >
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.085, 0.085, 0.012, 40]} />
            <meshStandardMaterial
              {...GOLD}
              roughness={0.22}
              emissive="#c8a15a"
              emissiveIntensity={0.35}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
