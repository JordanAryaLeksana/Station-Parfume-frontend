"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { AROMAS, type AromaNote } from "@/features/catalog/aroma";
import { LIQUID_OF } from "@/features/home/hero-scents";

import { NOZZLE_Y } from "./bottle";
import { drawGlow, drawPlate, surface } from "./canvas-textures";
import { BRASS, LACQUER, LIQUID } from "./materials";
import type { Pour } from "./pour";

const RADIUS = 1.35;
const SPREAD = THREE.MathUtils.degToRad(78);
const PLINTH_SPREAD = SPREAD + 0.13;
const PLINTH_TOP = 0.34;
const PLINTH_INNER = RADIUS - 0.2;
const PLINTH_OUTER = RADIUS + 0.27;
const BEVEL = 0.014;
const TUBE_RADIUS = 0.075;
const TUBE_HEIGHT = 0.84;
const TUBE_TOP = PLINTH_TOP + 0.05 + TUBE_HEIGHT;
const MANIFOLD_Y = TUBE_TOP + 0.2;
const PANEL_RADIUS = RADIUS + 0.24;
const PANEL_TOP = MANIFOLD_Y + 0.1;
const LEVELS = [
  0.82, 0.64, 0.9, 0.71, 0.58, 0.86, 0.69, 0.77, 0.62, 0.88, 0.73, 0.66, 0.8,
];
const GLOW = { day: 0.05, night: 0.42, pour: 0.7, chosen: 1.1, rest: 0.16 };
const CHOSEN = new THREE.Color("#ffc56b");

const RING = 0.86;
const RING_BASE = 0.26;
const DISC = RING + 0.22;
const RING_TOP = RING_BASE + 0.05 + TUBE_HEIGHT + 0.2;
const RING_STEP = (2 * Math.PI) / AROMAS.length;

type Liquids = React.RefObject<(THREE.MeshPhysicalMaterial | null)[]>;

export function sourceOf(family: AromaNote | null | undefined) {
  return family ? AROMAS.findIndex((aroma) => aroma.note === family) : -1;
}

function angleOf(index: number) {
  return -SPREAD + (index * 2 * SPREAD) / (AROMAS.length - 1);
}

function around(
  angle: number,
  radius: number,
  y: number,
): [number, number, number] {
  return [radius * Math.sin(angle), y, -radius * Math.cos(angle)];
}

function Brass(props: React.ComponentProps<"meshStandardMaterial">) {
  return <meshStandardMaterial {...BRASS} {...props} />;
}

function Arc({
  radius,
  y,
  tube,
  spread,
  roughness,
}: {
  radius: number;
  y: number;
  tube: number;
  spread: number;
  roughness?: number;
}) {
  return (
    <mesh
      position={[0, y, 0]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2 - spread]}
    >
      <torusGeometry args={[radius, tube, 12, 160, 2 * spread]} />
      <Brass roughness={roughness} />
    </mesh>
  );
}

function Plinth() {
  const shape = React.useMemo(() => {
    const outline = new THREE.Shape();
    outline.absarc(
      0,
      0,
      PLINTH_OUTER,
      Math.PI / 2 - PLINTH_SPREAD,
      Math.PI / 2 + PLINTH_SPREAD,
      false,
    );
    outline.absarc(
      0,
      0,
      PLINTH_INNER,
      Math.PI / 2 + PLINTH_SPREAD,
      Math.PI / 2 - PLINTH_SPREAD,
      true,
    );
    outline.closePath();
    return outline;
  }, []);

  return (
    <mesh position={[0, BEVEL, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: PLINTH_TOP - 2 * BEVEL,
            bevelEnabled: true,
            bevelThickness: BEVEL,
            bevelSize: BEVEL,
            bevelSegments: 3,
            curveSegments: 96,
          },
        ]}
      />
      <meshPhysicalMaterial
        color={LACQUER}
        roughness={0.3}
        clearcoat={1}
        clearcoatRoughness={0.12}
      />
    </mesh>
  );
}

function Panel({ duskRef }: { duskRef: React.RefObject<number> }) {
  const glow = React.useMemo(() => {
    const created = surface(8, 256);
    created.paint(drawGlow);
    return created;
  }, []);
  const material = React.useRef<THREE.MeshPhysicalMaterial>(null);
  const height = PANEL_TOP - PLINTH_TOP;

  React.useEffect(() => () => glow.texture.dispose(), [glow]);

  useFrame(() => {
    if (material.current) {
      material.current.emissiveIntensity = duskRef.current * 1.15;
    }
  });

  return (
    <mesh position={[0, PLINTH_TOP + height / 2, 0]}>
      <cylinderGeometry
        args={[
          PANEL_RADIUS,
          PANEL_RADIUS,
          height,
          128,
          1,
          true,
          Math.PI - PLINTH_SPREAD,
          2 * PLINTH_SPREAD,
        ]}
      />
      <meshPhysicalMaterial
        ref={material}
        color={LACQUER}
        roughness={0.42}
        clearcoat={0.7}
        clearcoatRoughness={0.2}
        emissive="#ffb066"
        emissiveMap={glow.texture}
        emissiveIntensity={0}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function Plate({
  text,
  position,
  size = [0.15, 0.075],
}: {
  text: string;
  position: [number, number, number];
  size?: [number, number];
}) {
  const plate = React.useMemo(() => {
    const created = surface(128, 64);
    created.paint((context) => drawPlate(context, text));
    return created;
  }, [text]);
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    let alive = true;
    void document.fonts.ready.then(() => {
      if (!alive) return;
      plate.paint((context) => drawPlate(context, text));
      invalidate();
    });
    return () => {
      alive = false;
      plate.texture.dispose();
    };
  }, [plate, text, invalidate]);

  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial map={plate.texture} roughness={0.7} />
    </mesh>
  );
}

function Tube({
  index,
  base,
  pipeTo,
  plateY,
  plateZ,
  liquidsRef,
}: {
  index: number;
  base: number;
  pipeTo: number;
  plateY: number;
  plateZ: number;
  liquidsRef: Liquids;
}) {
  const aroma = AROMAS[index];
  const tone = LIQUID[aroma ? LIQUID_OF[aroma.note] : "amber"];
  const height = (LEVELS[index] ?? 0.75) * TUBE_HEIGHT;
  const bottom = base + 0.05;
  const top = bottom + TUBE_HEIGHT;
  const pipe = pipeTo - top - 0.06;

  return (
    <group>
      <mesh position={[0, base + 0.025, 0]}>
        <cylinderGeometry
          args={[TUBE_RADIUS + 0.016, TUBE_RADIUS + 0.016, 0.05, 40]}
        />
        <Brass />
      </mesh>
      <mesh position={[0, bottom + TUBE_HEIGHT / 2, 0]}>
        <cylinderGeometry
          args={[TUBE_RADIUS, TUBE_RADIUS, TUBE_HEIGHT, 40, 1, true]}
        />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.14}
          roughness={0.04}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.4}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[0, bottom + height / 2, 0]}>
        <cylinderGeometry
          args={[TUBE_RADIUS - 0.012, TUBE_RADIUS - 0.012, height, 32]}
        />
        <meshPhysicalMaterial
          ref={(material) => {
            liquidsRef.current[index] = material;
          }}
          color={tone}
          emissive={tone}
          emissiveIntensity={0}
          roughness={0.1}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.05}
        />
      </mesh>
      <mesh position={[0, top + 0.03, 0]}>
        <cylinderGeometry
          args={[TUBE_RADIUS + 0.016, TUBE_RADIUS + 0.016, 0.06, 40]}
        />
        <Brass />
      </mesh>
      {pipe > 0 && (
        <mesh position={[0, top + 0.06 + pipe / 2, 0]}>
          <cylinderGeometry args={[0.012, 0.012, pipe, 12]} />
          <Brass />
        </mesh>
      )}
      <Plate
        text={String(index + 1).padStart(2, "0")}
        position={[0, plateY, plateZ]}
      />
    </group>
  );
}

function Spout() {
  const curve = React.useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        [
          new THREE.Vector3(0, MANIFOLD_Y, -RADIUS),
          new THREE.Vector3(0, MANIFOLD_Y + 0.3, -RADIUS + 0.06),
          new THREE.Vector3(0, MANIFOLD_Y + 0.52, -RADIUS * 0.55),
          new THREE.Vector3(0, MANIFOLD_Y + 0.46, -0.2),
          new THREE.Vector3(0, MANIFOLD_Y + 0.24, 0),
          new THREE.Vector3(0, NOZZLE_Y + 0.12, 0),
        ],
        false,
        "centripetal",
      ),
    [],
  );

  return (
    <group>
      <mesh position={[0, MANIFOLD_Y, -RADIUS]}>
        <sphereGeometry args={[0.045, 24, 16]} />
        <Brass roughness={0.2} />
      </mesh>
      <mesh>
        <tubeGeometry args={[curve, 160, 0.026, 20, false]} />
        <Brass roughness={0.18} />
      </mesh>
      <mesh position={[0, NOZZLE_Y + 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.07, 0.009, 12, 48]} />
        <Brass roughness={0.18} />
      </mesh>
      <mesh position={[0, NOZZLE_Y + 0.12, 0]}>
        <cylinderGeometry args={[0.036, 0.036, 0.045, 24]} />
        <Brass roughness={0.18} />
      </mesh>
      <mesh position={[0, NOZZLE_Y + 0.05, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.03, 0.1, 24]} />
        <Brass roughness={0.18} />
      </mesh>
    </group>
  );
}

export function Rack({
  source,
  pourRef,
  duskRef,
  focusRef,
}: {
  source: number;
  pourRef: React.RefObject<Pour>;
  duskRef: React.RefObject<number>;
  focusRef?: React.RefObject<number>;
}) {
  const liquidsRef = React.useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const slotsRef = React.useRef<(THREE.Group | null)[]>([]);
  const postSpread = PLINTH_SPREAD - 0.02;

  useFrame(() => {
    const rest = THREE.MathUtils.lerp(GLOW.day, GLOW.night, duskRef.current);
    const stream = pourRef.current.stream * GLOW.pour;
    const focus = focusRef?.current ?? 0;
    slotsRef.current.forEach((slot, index) => {
      if (slot) slot.position.y = index === source ? focus * 0.16 : 0;
    });
    liquidsRef.current.forEach((material, index) => {
      if (!material) return;
      const chosen = index === source;
      if (chosen) {
        material.emissive.copy(material.color).lerp(CHOSEN, focus);
      }
      material.emissiveIntensity =
        rest + (chosen ? Math.max(stream, focus * 0.9) : 0);
    });
  });

  return (
    <group>
      <Plinth />
      <Panel duskRef={duskRef} />
      <Arc
        radius={PLINTH_INNER - BEVEL}
        y={PLINTH_TOP - BEVEL}
        tube={0.008}
        spread={PLINTH_SPREAD}
      />
      <Arc
        radius={PANEL_RADIUS}
        y={PANEL_TOP}
        tube={0.016}
        spread={PLINTH_SPREAD}
      />
      <Arc
        radius={RADIUS}
        y={MANIFOLD_Y}
        tube={0.02}
        spread={SPREAD + 0.04}
        roughness={0.22}
      />
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh
            position={around(
              side * postSpread,
              PANEL_RADIUS,
              (PANEL_TOP + PLINTH_TOP) / 2,
            )}
          >
            <cylinderGeometry
              args={[0.028, 0.028, PANEL_TOP - PLINTH_TOP + 0.04, 20]}
            />
            <Brass />
          </mesh>
          <mesh
            position={around(side * postSpread, PANEL_RADIUS, PANEL_TOP + 0.05)}
          >
            <sphereGeometry args={[0.04, 24, 16]} />
            <Brass roughness={0.2} />
          </mesh>
          <mesh position={around(side * (SPREAD + 0.04), RADIUS, MANIFOLD_Y)}>
            <sphereGeometry args={[0.032, 20, 14]} />
            <Brass roughness={0.2} />
          </mesh>
        </group>
      ))}
      {AROMAS.map((aroma, index) => {
        const angle = angleOf(index);
        return (
          <group
            key={aroma.note}
            position={around(angle, RADIUS, 0)}
            rotation={[0, -angle, 0]}
          >
            <group
              ref={(slot) => {
                slotsRef.current[index] = slot;
              }}
            >
              <Tube
                index={index}
                base={PLINTH_TOP}
                pipeTo={MANIFOLD_Y}
                plateY={PLINTH_TOP / 2}
                plateZ={RADIUS - PLINTH_INNER + BEVEL + 0.003}
                liquidsRef={liquidsRef}
              />
            </group>
          </group>
        );
      })}
      <Spout />
    </group>
  );
}

export function Carousel({
  selected,
  reduced,
}: {
  selected: number;
  reduced: boolean;
}) {
  const ring = React.useRef<THREE.Group>(null);
  const liquidsRef = React.useRef<(THREE.MeshPhysicalMaterial | null)[]>([]);
  const slotsRef = React.useRef<(THREE.Group | null)[]>([]);
  const lift = React.useRef<number[]>([]);
  const invalidate = useThree((state) => state.invalidate);

  React.useEffect(() => {
    invalidate();
  }, [selected, invalidate]);

  useFrame((_, delta) => {
    const k = reduced ? 1 : 1 - Math.exp(-delta * 5);
    if (ring.current) {
      const target = -selected * RING_STEP;
      const current = ring.current.rotation.y;
      const turn = Math.atan2(
        Math.sin(target - current),
        Math.cos(target - current),
      );
      ring.current.rotation.y = current + turn * k;
    }
    AROMAS.forEach((_, index) => {
      const goal = index === selected ? 1 : 0;
      const now = lift.current[index] ?? goal;
      const next = now + (goal - now) * k;
      lift.current[index] = next;
      const material = liquidsRef.current[index];
      if (material) {
        material.emissiveIntensity = THREE.MathUtils.lerp(
          GLOW.rest,
          GLOW.chosen,
          next,
        );
      }
      const slot = slotsRef.current[index];
      if (slot) {
        const angle = index * RING_STEP;
        const radius = RING + next * 0.12;
        slot.position.set(
          radius * Math.sin(angle),
          next * 0.05,
          radius * Math.cos(angle),
        );
      }
    });
  });

  return (
    <group>
      <mesh position={[0, RING_BASE / 2, 0]}>
        <cylinderGeometry args={[DISC, DISC + 0.03, RING_BASE, 96]} />
        <meshPhysicalMaterial
          color={LACQUER}
          roughness={0.3}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </mesh>
      <mesh position={[0, RING_BASE, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[DISC, 0.008, 10, 128]} />
        <Brass />
      </mesh>
      <group ref={ring}>
        {AROMAS.map((aroma, index) => {
          const angle = index * RING_STEP;
          return (
            <group
              key={aroma.note}
              ref={(slot) => {
                slotsRef.current[index] = slot;
              }}
              position={[RING * Math.sin(angle), 0, RING * Math.cos(angle)]}
              rotation={[0, angle, 0]}
            >
              <Tube
                index={index}
                base={RING_BASE}
                pipeTo={RING_TOP}
                plateY={RING_BASE / 2}
                plateZ={DISC - RING + 0.003}
                liquidsRef={liquidsRef}
              />
            </group>
          );
        })}
        <mesh position={[0, RING_TOP, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[RING, 0.02, 12, 128]} />
          <Brass roughness={0.22} />
        </mesh>
        <mesh position={[0, (RING_BASE + RING_TOP + 0.3) / 2, 0]}>
          <cylinderGeometry
            args={[0.05, 0.06, RING_TOP + 0.3 - RING_BASE, 24]}
          />
          <Brass roughness={0.22} />
        </mesh>
        <mesh position={[0, RING_TOP + 0.34, 0]}>
          <sphereGeometry args={[0.07, 32, 24]} />
          <Brass roughness={0.16} />
        </mesh>
      </group>
    </group>
  );
}
