"use client";

import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { drawRuler, surface } from "./canvas-textures";
import { BRASS, LACQUER } from "./materials";

export const PACK_SPOT = new THREE.Vector3(0, 0, 1.15);

export type Span = { from: number; to: number };

const GAUGE = 0.17;
const SEGMENTS = 200;
const RADIAL = 8;
const SAMPLES = 80;
const SLEEPER_STEP = 0.32;
const HIDDEN = new THREE.Matrix4().makeScale(0, 0, 0);

function offsetCurve(rail: THREE.Curve<THREE.Vector3>, side: number) {
  const points: THREE.Vector3[] = [];
  const tangent = new THREE.Vector3();
  for (let index = 0; index <= SAMPLES; index += 1) {
    const t = index / SAMPLES;
    const point = rail.getPointAt(t);
    rail.getTangentAt(t, tangent);
    points.push(
      new THREE.Vector3(
        point.x - tangent.z * GAUGE * side,
        0.022,
        point.z + tangent.x * GAUGE * side,
      ),
    );
  }
  return new THREE.CatmullRomCurve3(points);
}

function sleeperMatrices(rail: THREE.Curve<THREE.Vector3>, count: number) {
  const tangent = new THREE.Vector3();
  const rotation = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const scale = new THREE.Vector3(1, 1, 1);
  return Array.from({ length: count }, (_, index) => {
    const t = count === 1 ? 0 : index / (count - 1);
    const point = rail.getPointAt(t);
    rail.getTangentAt(t, tangent);
    rotation.setFromAxisAngle(up, -Math.atan2(tangent.z, tangent.x));
    return new THREE.Matrix4().compose(
      new THREE.Vector3(point.x, 0.008, point.z),
      rotation,
      scale,
    );
  });
}

export function Conveyor({
  rail,
  spanRef,
}: {
  rail: THREE.Curve<THREE.Vector3>;
  spanRef: React.RefObject<Span>;
}) {
  const group = React.useRef<THREE.Group>(null);
  const tubes = React.useRef<(THREE.TubeGeometry | null)[]>([]);
  const sleepers = React.useRef<THREE.InstancedMesh>(null);
  const shownRange = React.useRef("");
  const curves = React.useMemo(
    () => [offsetCurve(rail, 1), offsetCurve(rail, -1)],
    [rail],
  );
  const count = Math.floor(rail.getLength() / SLEEPER_STEP) + 1;
  const matrices = React.useMemo(
    () => sleeperMatrices(rail, count),
    [rail, count],
  );

  useFrame(() => {
    const { from, to } = spanRef.current;
    const shown = to - from > 0.002;
    if (group.current) group.current.visible = shown;
    if (!shown) return;

    const perSegment = RADIAL * 6;
    const start = Math.floor(from * SEGMENTS) * perSegment;
    const end = Math.ceil(to * SEGMENTS) * perSegment;
    for (const tube of tubes.current) {
      tube?.setDrawRange(start, Math.max(0, end - start));
    }

    const mesh = sleepers.current;
    if (!mesh) return;
    const first = Math.ceil(from * (count - 1));
    const last = Math.floor(to * (count - 1));
    const key = `${first}:${last}`;
    if (key === shownRange.current) return;
    shownRange.current = key;
    matrices.forEach((matrix, index) => {
      mesh.setMatrixAt(
        index,
        index >= first && index <= last ? matrix : HIDDEN,
      );
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group} visible={false}>
      {curves.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry
            ref={(geometry) => {
              tubes.current[index] = geometry;
            }}
            args={[curve, SEGMENTS, 0.014, RADIAL, false]}
          />
          <meshStandardMaterial {...BRASS} roughness={0.22} />
        </mesh>
      ))}
      <instancedMesh ref={sleepers} args={[undefined, undefined, count]}>
        <boxGeometry args={[0.05, 0.016, GAUGE * 2.6]} />
        <meshPhysicalMaterial color={LACQUER} roughness={0.4} clearcoat={0.6} />
      </instancedMesh>
    </group>
  );
}

export function Road({ z, length }: { z: number; length: number }) {
  const ruler = React.useMemo(() => {
    const created = surface(320, 48);
    created.paint(drawRuler);
    created.texture.wrapS = THREE.RepeatWrapping;
    created.texture.repeat.set(length / 1.25, 1);
    return created;
  }, [length]);

  React.useEffect(() => () => ruler.texture.dispose(), [ruler]);

  return (
    <mesh position={[0, 0.003, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[length, 0.16]} />
      <meshBasicMaterial map={ruler.texture} transparent toneMapped={false} />
    </mesh>
  );
}
