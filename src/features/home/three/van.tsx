"use client";

import React from "react";
import * as THREE from "three";

import sprigDark from "@/assets/brand/sprig-dark.png";
import wordmarkDark from "@/assets/brand/wordmark-dark.png";

import { drawBrand } from "./canvas-textures";
import { BRASS, LACQUER } from "./materials";
import { usePainted } from "./painted";

export const WHEEL = 0.22;
export const DOOR = { x: -0.08, width: 0.84, bottom: 0.5, height: 0.95 };
export const DOOR_SLIDE = 0.9;
const BRAND = [sprigDark.src, wordmarkDark.src];
const AXLES = [-1.08, 0.95];

function Paint() {
  return (
    <meshPhysicalMaterial
      color={LACQUER}
      roughness={0.24}
      clearcoat={1}
      clearcoatRoughness={0.06}
    />
  );
}

function Glass() {
  return (
    <meshPhysicalMaterial
      color="#0b0b0c"
      roughness={0.04}
      metalness={0.3}
      clearcoat={1}
      envMapIntensity={1.6}
    />
  );
}

function Brass() {
  return <meshStandardMaterial {...BRASS} roughness={0.22} />;
}

function Wheel({
  position,
  wheelRef,
}: {
  position: [number, number, number];
  wheelRef: (wheel: THREE.Group | null) => void;
}) {
  const outward = position[2] > 0 ? 1 : -1;
  return (
    <group position={position}>
      <group ref={wheelRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[WHEEL, WHEEL, 0.18, 40]} />
          <meshStandardMaterial color="#0c0c0c" roughness={0.88} />
        </mesh>
        <mesh position={[0, 0, outward * 0.006]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.18, 40]} />
          <Brass />
        </mesh>
        {[0, 1, 2, 3, 4].map((spoke) => (
          <mesh
            key={spoke}
            position={[0, 0, outward * 0.097]}
            rotation={[0, 0, (spoke * 2 * Math.PI) / 5]}
          >
            <boxGeometry args={[0.022, 0.2, 0.006]} />
            <meshStandardMaterial color="#141210" roughness={0.6} />
          </mesh>
        ))}
        <mesh position={[0, 0, outward * 0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.01, 24]} />
          <Brass />
        </mesh>
      </group>
    </group>
  );
}

function bodyShape() {
  const shape = new THREE.Shape();
  shape.moveTo(1.45, 0.36);
  shape.lineTo(1.25, 0.36);
  shape.absarc(0.95, 0.3, 0.3, 0, Math.PI, false);
  shape.lineTo(-0.78, 0.36);
  shape.absarc(-1.08, 0.3, 0.3, 0, Math.PI, false);
  shape.lineTo(-1.72, 0.36);
  shape.quadraticCurveTo(-1.78, 0.36, -1.78, 0.42);
  shape.lineTo(-1.78, 0.76);
  shape.quadraticCurveTo(-1.78, 0.86, -1.66, 0.9);
  shape.quadraticCurveTo(-1.56, 0.93, -1.5, 0.98);
  shape.lineTo(-1.1, 1.38);
  shape.quadraticCurveTo(-1.0, 1.5, -0.82, 1.5);
  shape.lineTo(1.35, 1.5);
  shape.quadraticCurveTo(1.45, 1.5, 1.45, 1.4);
  shape.lineTo(1.45, 0.36);
  return shape;
}

function windowShape() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.66, 1.0);
  shape.lineTo(-0.66, 1.36);
  shape.lineTo(-1.06, 1.36);
  shape.lineTo(-1.4, 1.0);
  shape.lineTo(-0.66, 1.0);
  return shape;
}

const EXTRUDE = {
  depth: 0.92,
  bevelEnabled: true,
  bevelThickness: 0.04,
  bevelSize: 0.04,
  bevelSegments: 4,
  curveSegments: 32,
};

const WINDSHIELD = Math.atan2(0.4, 0.4);

export function Van({
  bodyRef,
  wheelsRef,
  doorRef,
}: {
  bodyRef: React.RefObject<THREE.Group | null>;
  wheelsRef: React.RefObject<(THREE.Group | null)[]>;
  doorRef?: React.Ref<THREE.Group>;
}) {
  const brand = usePainted(1024, 256, BRAND, drawBrand);
  const body = React.useMemo(() => bodyShape(), []);
  const pane = React.useMemo(() => windowShape(), []);

  return (
    <group>
      <group ref={bodyRef}>
        <mesh position={[0, 0, -0.46]}>
          <extrudeGeometry args={[body, EXTRUDE]} />
          <Paint />
        </mesh>
        <mesh position={[0, 0, 0.505]}>
          <shapeGeometry args={[pane]} />
          <Glass />
        </mesh>
        <mesh position={[-1.31, 1.19, 0]} rotation={[0, 0, WINDSHIELD]}>
          <boxGeometry args={[0.56, 0.014, 0.86]} />
          <Glass />
        </mesh>
        <mesh position={[-0.58, 0.9, 0.503]}>
          <boxGeometry args={[0.006, 1.06, 0.004]} />
          <meshStandardMaterial color="#050505" roughness={0.6} />
        </mesh>
        <mesh position={[-0.7, 0.9, 0.512]}>
          <boxGeometry args={[0.1, 0.022, 0.012]} />
          <Brass />
        </mesh>
        <mesh position={[0.2, 0.47, 0.503]}>
          <boxGeometry args={[2.3, 0.016, 0.006]} />
          <Brass />
        </mesh>
        <mesh position={[DOOR.x, DOOR.bottom + DOOR.height / 2, 0.506]}>
          <planeGeometry args={[DOOR.width, DOOR.height]} />
          <meshBasicMaterial color="#050505" />
        </mesh>
        <group ref={doorRef}>
          <mesh position={[DOOR.x, DOOR.bottom + DOOR.height / 2, 0.522]}>
            <boxGeometry
              args={[DOOR.width + 0.04, DOOR.height + 0.04, 0.024]}
            />
            <Paint />
          </mesh>
          <mesh
            position={[
              DOOR.x - DOOR.width / 2 + 0.1,
              DOOR.bottom + DOOR.height * 0.48,
              0.54,
            ]}
          >
            <boxGeometry args={[0.03, 0.16, 0.02]} />
            <Brass />
          </mesh>
          <mesh position={[DOOR.x, DOOR.bottom + DOOR.height + 0.03, 0.536]}>
            <boxGeometry args={[DOOR.width + 0.04, 0.012, 0.01]} />
            <Brass />
          </mesh>
        </group>
        <mesh position={[0.93, 1.02, 0.504]}>
          <planeGeometry args={[1.04, 0.26]} />
          <meshStandardMaterial
            map={brand}
            transparent
            roughness={0.4}
            metalness={0}
          />
        </mesh>
        {[1, -1].map((side) => (
          <group key={side}>
            <mesh position={[-1.822, 0.7, side * 0.3]}>
              <boxGeometry args={[0.02, 0.1, 0.24]} />
              <meshStandardMaterial
                color="#fff1d0"
                emissive="#ffd9a0"
                emissiveIntensity={2.4}
              />
            </mesh>
            <mesh position={[1.492, 0.66, side * 0.4]}>
              <boxGeometry args={[0.02, 0.2, 0.1]} />
              <meshStandardMaterial
                color="#5a1a10"
                emissive="#c0482a"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        ))}
        {[0.5, 0.56, 0.62].map((y) => (
          <mesh key={y} position={[-1.822, y, 0]}>
            <boxGeometry args={[0.012, 0.016, 0.4]} />
            <Brass />
          </mesh>
        ))}
        <mesh position={[-1.81, 0.4, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.98]} />
          <Brass />
        </mesh>
        <mesh position={[1.49, 0.4, 0]}>
          <boxGeometry args={[0.06, 0.08, 0.98]} />
          <Brass />
        </mesh>
        <mesh position={[-1.18, 1.16, 0.56]}>
          <boxGeometry args={[0.04, 0.12, 0.12]} />
          <Paint />
        </mesh>
      </group>
      {AXLES.flatMap((x, axle) =>
        [1, -1].map((side, index) => (
          <Wheel
            key={`${x}${side}`}
            position={[x, WHEEL, side * 0.44]}
            wheelRef={(wheel) => {
              wheelsRef.current[axle * 2 + index] = wheel;
            }}
          />
        )),
      )}
    </group>
  );
}
