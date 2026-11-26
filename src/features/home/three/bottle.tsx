"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshTransmissionMaterial, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import sprigImage from "@/assets/brand/sprig-light.png";
import type { Concentration } from "@/features/catalog/types";
import type { LiquidTone } from "@/features/home/hero-scents";

import { drawLabel, surface } from "./canvas-textures";
import { GOLD, LACQUER, LIQUID_COLOR } from "./materials";
import type { Tier } from "./tier";
import { RESTING, type Pour } from "./pour";

export const BOTTLE = {
  base: 0.05,
  width: 0.54,
  height: 0.78,
  depth: 0.36,
};
export const NOZZLE_Y = 1.4;

const CAP_RADIUS = 0.13;
const CAP_REST = new THREE.Vector3(0, BOTTLE.height + 0.05 + CAP_RADIUS, 0);
const INNER_HEIGHT = BOTTLE.height - 0.08;
const BASE_TURN = 0.22;

export function scaleOf(volume: number) {
  return Math.cbrt(volume / 30);
}

export type BottleLabel = {
  number: number | null;
  name: string | null;
  volume: number;
  blend: Concentration;
};

export function Turntable() {
  return (
    <group>
      <mesh position={[0, BOTTLE.base / 2, 0]}>
        <cylinderGeometry args={[0.43, 0.45, BOTTLE.base, 72]} />
        <meshPhysicalMaterial
          color={LACQUER}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <mesh position={[0, BOTTLE.base, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.43, 0.006, 10, 96]} />
        <meshStandardMaterial {...GOLD} />
      </mesh>
    </group>
  );
}

function useLabel({ number, name, volume, blend }: BottleLabel) {
  const sheet = React.useMemo(() => surface(512, 600), []);
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    let alive = true;
    const sprig = new Image();
    const draw = () => {
      if (!alive) return;
      sheet.paint((context) =>
        drawLabel(context, { number, name, volume, blend, sprig }),
      );
      invalidate();
    };
    sprig.onload = draw;
    sprig.src = sprigImage.src;
    draw();
    void document.fonts.ready.then(draw);
    return () => {
      alive = false;
    };
  }, [sheet, number, name, volume, blend, invalidate]);

  React.useEffect(() => () => sheet.texture.dispose(), [sheet]);

  return sheet.texture;
}

function Glass({ tier, kind }: { tier: Tier; kind: "lens" | "physical" }) {
  if (tier === "low") {
    return (
      <meshPhysicalMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        roughness={0.03}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.03}
        envMapIntensity={1.8}
        depthWrite={false}
      />
    );
  }
  if (kind === "physical") {
    return (
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={0.22}
        roughness={0.03}
        ior={1.5}
        metalness={0}
        clearcoat={1}
        clearcoatRoughness={0.03}
        envMapIntensity={1.6}
      />
    );
  }
  return (
    <MeshTransmissionMaterial
      samples={tier === "high" ? 8 : 4}
      resolution={tier === "high" ? 768 : 384}
      transmission={1}
      thickness={0.22}
      roughness={0.02}
      ior={1.5}
      chromaticAberration={tier === "high" ? 0.035 : 0}
      anisotropy={0.08}
      distortion={0}
      clearcoat={1}
      clearcoatRoughness={0.02}
      backside={tier === "high"}
      backsideThickness={0.12}
      color="#ffffff"
      envMapIntensity={1.6}
    />
  );
}

export function Bottle({
  tone,
  label,
  tier,
  reduced,
  pourRef,
  glass = "lens",
}: {
  tone: LiquidTone;
  label: BottleLabel;
  tier: Tier;
  reduced: boolean;
  pourRef?: React.RefObject<Pour>;
  glass?: "lens" | "physical";
}) {
  const body = React.useRef<THREE.Group>(null);
  const turn = React.useRef<THREE.Group>(null);
  const liquid = React.useRef<THREE.Group>(null);
  const liquidMaterial = React.useRef<THREE.MeshStandardMaterial>(null);
  const streamMaterial = React.useRef<THREE.MeshStandardMaterial>(null);
  const cap = React.useRef<THREE.Group>(null);
  const stream = React.useRef<THREE.Mesh>(null);
  const aside = React.useRef<THREE.Vector3 | null>(null);
  const sway = React.useRef(0);
  const texture = useLabel(label);
  const streamGeometry = React.useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.011, 0.009, 1, 16, 1, true);
    geometry.translate(0, -0.5, 0);
    return geometry;
  }, []);

  React.useEffect(() => () => streamGeometry.dispose(), [streamGeometry]);

  useFrame((_, delta) => {
    sway.current += Math.min(delta, 0.1);
    const now = pourRef?.current ?? RESTING;
    const target = LIQUID_COLOR[tone][label.blend];
    const goal = scaleOf(label.volume);

    let scale = goal;
    if (body.current) {
      scale = reduced
        ? goal
        : THREE.MathUtils.lerp(
            body.current.scale.x,
            goal,
            1 - Math.exp(-delta * 6),
          );
      body.current.scale.setScalar(scale);
    }

    if (liquid.current) liquid.current.scale.y = Math.max(0.001, now.level);
    for (const material of [liquidMaterial.current, streamMaterial.current]) {
      if (!material) continue;
      if (reduced) material.color.copy(target);
      else material.color.lerp(target, 0.08);
      material.emissive.copy(material.color);
    }

    if (cap.current) {
      const k = now.cap;
      aside.current ??= new THREE.Vector3();
      aside.current.set(0.56, CAP_RADIUS - BOTTLE.base / scale, 0.16);
      cap.current.position.lerpVectors(CAP_REST, aside.current, k);
      cap.current.position.y += Math.sin(Math.PI * k) * 0.34;
      cap.current.rotation.z = -k * 0.5;
    }

    if (stream.current) {
      const nozzle = (NOZZLE_Y - BOTTLE.base) / scale;
      const surface = 0.04 + Math.max(0.001, now.level) * INNER_HEIGHT;
      stream.current.visible = now.stream > 0.01;
      stream.current.position.y = nozzle;
      stream.current.scale.set(
        1,
        Math.max(0.0001, (nozzle - surface) * now.stream),
        1,
      );
    }

    if (turn.current) {
      const calm = 1 - Math.min(1, now.cap * 3);
      turn.current.rotation.y = reduced
        ? BASE_TURN
        : BASE_TURN + Math.sin(sway.current * 0.3) * 0.2 * calm;
    }
  });

  return (
    <group position={[0, BOTTLE.base, 0]}>
      <group ref={body}>
        <group ref={turn}>
          <RoundedBox
            args={[BOTTLE.width, BOTTLE.height, BOTTLE.depth]}
            radius={0.04}
            smoothness={6}
            position={[0, BOTTLE.height / 2, 0]}
          >
            <Glass tier={tier} kind={glass} />
          </RoundedBox>

          <group ref={liquid} position={[0, 0.04, 0]}>
            <RoundedBox
              args={[BOTTLE.width - 0.07, INNER_HEIGHT, BOTTLE.depth - 0.07]}
              radius={0.025}
              smoothness={4}
              position={[0, INNER_HEIGHT / 2, 0]}
            >
              <meshStandardMaterial
                ref={liquidMaterial}
                roughness={0.12}
                metalness={0}
                emissiveIntensity={0.08}
              />
            </RoundedBox>
          </group>

          <mesh position={[0, BOTTLE.height * 0.47, BOTTLE.depth / 2 + 0.003]}>
            <planeGeometry
              args={[BOTTLE.width * 0.66, BOTTLE.width * 0.66 * (600 / 512)]}
            />
            <meshStandardMaterial
              map={texture}
              roughness={0.82}
              metalness={0}
            />
          </mesh>

          <mesh position={[0, BOTTLE.height + 0.025, 0]}>
            <cylinderGeometry args={[0.05, 0.056, 0.05, 32]} />
            <meshStandardMaterial {...GOLD} roughness={0.2} />
          </mesh>
        </group>

        <group ref={cap} position={CAP_REST}>
          <mesh>
            <sphereGeometry args={[CAP_RADIUS, 64, 48]} />
            <meshStandardMaterial {...GOLD} roughness={0.24} />
          </mesh>
        </group>

        <mesh ref={stream} geometry={streamGeometry} visible={false}>
          <meshStandardMaterial
            ref={streamMaterial}
            roughness={0.05}
            metalness={0}
            emissiveIntensity={0.25}
          />
        </mesh>
      </group>
    </group>
  );
}
