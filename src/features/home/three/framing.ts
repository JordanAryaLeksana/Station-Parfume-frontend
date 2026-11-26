import React from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type View = {
  target: THREE.Vector3;
  position: THREE.Vector3;
  distance: number;
};

export type Box = { left: number; right: number; top: number; bottom: number };

export type Fit = {
  view: View;
  visible: number;
  offsetX: number;
  offsetY: number;
};

export function view(
  target: [number, number, number],
  direction: [number, number, number],
  distance: number,
): View {
  const origin = new THREE.Vector3(...target);
  const position = origin
    .clone()
    .addScaledVector(new THREE.Vector3(...direction).normalize(), distance);
  return { target: origin, position, distance };
}

export function fitBox(
  width: number,
  height: number,
  camera: View,
  box: Box,
  span: number,
  rise: number,
): Fit {
  const scale = Math.min(
    (box.right - box.left) / span,
    (box.bottom - box.top) / rise,
  );
  return {
    view: camera,
    visible: width / scale,
    offsetX: width / 2 - (box.left + box.right) / 2,
    offsetY: height / 2 - (box.top + box.bottom) / 2,
  };
}

function approach(value: number, target: number, k: number) {
  return value + (target - value) * k;
}

export function Rig({
  fit,
  reduced,
  sway = 1,
}: {
  fit: (width: number, height: number) => Fit;
  reduced: boolean;
  sway?: number;
}) {
  const framed = React.useRef("");
  const pointer = React.useRef({ x: 0, y: 0 });
  const look = React.useRef<THREE.Vector3 | null>(null);
  const goal = React.useRef<THREE.Vector3 | null>(null);
  const lens = React.useRef({ fov: 0, x: 0, y: 0 });

  React.useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((state, delta) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    const { width, height } = state.size;
    const shot = fit(width, height);
    const fov = THREE.MathUtils.radToDeg(
      2 * Math.atan(shot.visible / 2 / (width / height) / shot.view.distance),
    );

    const size = `${width}x${height}`;
    const snap = reduced || framed.current !== size;
    framed.current = size;
    const k = snap ? 1 : 1 - Math.exp(-delta * 2.6);

    lens.current.fov = approach(lens.current.fov, fov, k);
    lens.current.x = approach(lens.current.x, shot.offsetX, k);
    lens.current.y = approach(lens.current.y, shot.offsetY, k);
    camera.fov = lens.current.fov;
    camera.setViewOffset(
      width,
      height,
      lens.current.x,
      lens.current.y,
      width,
      height,
    );
    camera.updateProjectionMatrix();

    goal.current ??= new THREE.Vector3();
    goal.current.copy(shot.view.position);
    if (!reduced) {
      goal.current.x += pointer.current.x * 0.5 * sway;
      goal.current.y -= pointer.current.y * 0.25 * sway;
    }
    if (snap) camera.position.copy(goal.current);
    else camera.position.lerp(goal.current, k);

    look.current ??= shot.view.target.clone();
    if (snap) look.current.copy(shot.view.target);
    else look.current.lerp(shot.view.target, k);
    camera.lookAt(look.current);
  });

  return null;
}
