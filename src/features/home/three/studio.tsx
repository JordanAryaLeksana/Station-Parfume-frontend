"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

type Backdrop = "cove" | "clear";

const DAY = {
  background: new THREE.Color("#faf6ee"),
  cove: new THREE.Color("#f6efe4"),
  key: new THREE.Color("#fff3df"),
};

const NIGHT = {
  background: new THREE.Color("#0f0e0d"),
  cove: new THREE.Color("#15130f"),
  key: new THREE.Color("#ffe1b3"),
};

const LIGHT = {
  hemisphere: [0.85, 0.06],
  key: [2.4, 0.22],
  fill: [0.8, 0.16],
  rim: [1, 1.6],
  lamp: [0, 30],
  wash: [5, 18],
} as const;

const COVE = { front: 14, back: -3.4, radius: 1.6, top: 14 };

function approach(value: number, target: number, k: number) {
  return value + (target - value) * k;
}

function between(pair: readonly [number, number], t: number) {
  return THREE.MathUtils.lerp(pair[0], pair[1], t);
}

function coveGeometry() {
  const floor = COVE.front - (COVE.back + COVE.radius);
  const bend = (Math.PI / 2) * COVE.radius;
  const wall = COVE.top - COVE.radius;
  const total = floor + bend + wall;
  const geometry = new THREE.PlaneGeometry(60, 1, 1, 240);
  const position = geometry.getAttribute("position");

  for (let index = 0; index < position.count; index += 1) {
    const along = (position.getY(index) + 0.5) * total;
    let y = COVE.radius + (along - floor - bend);
    let z = COVE.back;
    if (along <= floor) {
      y = 0;
      z = COVE.front - along;
    } else if (along <= floor + bend) {
      const angle = (along - floor) / COVE.radius;
      y = COVE.radius - COVE.radius * Math.cos(angle);
      z = COVE.back + COVE.radius - COVE.radius * Math.sin(angle);
    }
    position.setY(index, y);
    position.setZ(index, z);
  }

  geometry.computeVertexNormals();
  return geometry;
}

function Cove({
  start,
  surfaceRef,
}: {
  start: THREE.Color;
  surfaceRef: React.RefObject<THREE.MeshStandardMaterial | null>;
}) {
  const cove = React.useMemo(() => coveGeometry(), []);
  React.useEffect(() => () => cove.dispose(), [cove]);

  return (
    <mesh geometry={cove}>
      <meshStandardMaterial
        ref={surfaceRef}
        color={start}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

export function Atmosphere({
  night,
  reduced,
  duskRef,
  backdrop,
}: {
  night: boolean;
  reduced: boolean;
  duskRef: React.RefObject<number>;
  backdrop: Backdrop;
}) {
  const invalidate = useThree((state) => state.invalidate);
  const [start] = React.useState(() => (night ? NIGHT : DAY));
  const [washTarget] = React.useState(() => new THREE.Object3D());
  const background = React.useRef<THREE.Color>(null);
  const fog = React.useRef<THREE.Fog>(null);
  const hemisphere = React.useRef<THREE.HemisphereLight>(null);
  const key = React.useRef<THREE.DirectionalLight>(null);
  const fill = React.useRef<THREE.DirectionalLight>(null);
  const rim = React.useRef<THREE.DirectionalLight>(null);
  const lamp = React.useRef<THREE.SpotLight>(null);
  const wash = React.useRef<THREE.SpotLight>(null);
  const surfaceRef = React.useRef<THREE.MeshStandardMaterial>(null);

  React.useEffect(() => {
    invalidate();
  }, [night, invalidate]);

  useFrame((_, delta) => {
    const goal = night ? 1 : 0;
    const k = reduced ? 1 : 1 - Math.exp(-delta * 3);
    duskRef.current = approach(duskRef.current, goal, k);
    if (Math.abs(duskRef.current - goal) < 0.001) duskRef.current = goal;
    const t = duskRef.current;

    background.current?.lerpColors(DAY.background, NIGHT.background, t);
    fog.current?.color.lerpColors(DAY.background, NIGHT.background, t);
    surfaceRef.current?.color.lerpColors(DAY.cove, NIGHT.cove, t);
    if (hemisphere.current) {
      hemisphere.current.intensity = between(LIGHT.hemisphere, t);
    }
    if (key.current) {
      key.current.intensity = between(LIGHT.key, t);
      key.current.color.lerpColors(DAY.key, NIGHT.key, t);
    }
    if (fill.current) fill.current.intensity = between(LIGHT.fill, t);
    if (rim.current) rim.current.intensity = between(LIGHT.rim, t);
    if (lamp.current) lamp.current.intensity = between(LIGHT.lamp, t);
    if (wash.current) wash.current.intensity = between(LIGHT.wash, t);
  });

  return (
    <>
      {backdrop !== "clear" && (
        <color ref={background} attach="background" args={[start.background]} />
      )}
      {backdrop === "cove" && (
        <fog ref={fog} attach="fog" args={[start.background, 28, 64]} />
      )}
      <hemisphereLight ref={hemisphere} args={["#fff8ec", "#d9c9ab", 0]} />
      <directionalLight ref={key} position={[-4, 6.5, 5]} intensity={0} />
      <directionalLight
        ref={fill}
        position={[6, 3, 3]}
        intensity={0}
        color="#fff6ea"
      />
      <directionalLight
        ref={rim}
        position={[1.5, 3.5, -5]}
        intensity={0}
        color="#ffe9c8"
      />
      <spotLight
        ref={lamp}
        position={[0.4, 5.2, 2.4]}
        angle={0.42}
        penumbra={0.85}
        decay={1.6}
        distance={14}
        intensity={0}
        color="#ffd8a4"
      />
      {backdrop === "cove" && (
        <>
          <primitive object={washTarget} position={[0.8, 1.5, COVE.back]} />
          <spotLight
            ref={wash}
            target={washTarget}
            position={[-2.6, 4.6, 2.2]}
            angle={0.5}
            penumbra={1}
            decay={1.6}
            distance={16}
            intensity={0}
            color="#ffe2b8"
          />
          <Cove start={start.cove} surfaceRef={surfaceRef} />
        </>
      )}
    </>
  );
}

type Panel = {
  color: string;
  intensity: number;
  position: [number, number, number];
  scale: [number, number];
  target: [number, number, number];
  ring?: boolean;
};

const PANELS: Record<"day" | "night", Panel[]> = {
  day: [
    {
      color: "#fff6e8",
      intensity: 2.6,
      position: [-4, 5, 4],
      scale: [6, 4],
      target: [0, 0, 0],
    },
    {
      color: "#ffffff",
      intensity: 1.2,
      position: [5, 3, 2],
      scale: [4, 3],
      target: [0, 0, 0],
    },
    {
      color: "#fff2dc",
      intensity: 0.8,
      position: [0, 6, -2],
      scale: [3, 3],
      target: [0, 0, 0],
      ring: true,
    },
  ],
  night: [
    {
      color: "#ffd9a6",
      intensity: 1.6,
      position: [1, 6, 2],
      scale: [3, 1.2],
      target: [0, 0, 0],
    },
    {
      color: "#fff1d8",
      intensity: 1,
      position: [-5, 2.5, 1],
      scale: [0.4, 4],
      target: [0, 1, 0],
    },
    {
      color: "#fff1d8",
      intensity: 0.8,
      position: [5, 2.5, -1],
      scale: [0.4, 4],
      target: [0, 1, 0],
    },
  ],
};

const SHOWROOM: Panel[] = [
  {
    color: "#fff3e0",
    intensity: 2.4,
    position: [0, 3.2, 9],
    scale: [18, 1.1],
    target: [0, 0.8, 0],
  },
  {
    color: "#ffe9cc",
    intensity: 1.1,
    position: [0, 0.7, 9],
    scale: [18, 0.45],
    target: [0, 0.6, 0],
  },
];

function studioEnvironment(
  renderer: THREE.WebGLRenderer,
  night: boolean,
  showroom: boolean,
) {
  const room = new THREE.Scene();
  const parts: { dispose: () => void }[] = [];
  const panels = [
    ...PANELS[night ? "night" : "day"],
    ...(showroom ? SHOWROOM : []),
  ];

  for (const panel of panels) {
    const geometry = panel.ring
      ? new THREE.RingGeometry(0.5, 1, 64)
      : new THREE.PlaneGeometry(1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(panel.color).multiplyScalar(panel.intensity),
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...panel.position);
    mesh.scale.set(panel.scale[0], panel.scale[1], 1);
    mesh.lookAt(...panel.target);
    room.add(mesh);
    parts.push(geometry, material);
  }

  const generator = new THREE.PMREMGenerator(renderer);
  const target = generator.fromScene(room, 0, 0.1, 100);
  generator.dispose();
  for (const part of parts) part.dispose();
  return target;
}

export function Studio({
  night,
  showroom = false,
}: {
  night: boolean;
  showroom?: boolean;
}) {
  const get = useThree((state) => state.get);

  React.useEffect(() => {
    const { gl, scene, invalidate } = get();
    const target = studioEnvironment(gl, night, showroom);
    scene.environment = target.texture;
    invalidate();
    return () => {
      if (scene.environment === target.texture) scene.environment = null;
      target.dispose();
    };
  }, [get, night, showroom]);

  return null;
}
