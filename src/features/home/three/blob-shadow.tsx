"use client";

import React from "react";
import * as THREE from "three";

import { surface } from "./canvas-textures";

function paintBlob(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  const glow = context.createRadialGradient(
    width / 2,
    height / 2,
    0,
    width / 2,
    height / 2,
    width / 2,
  );
  glow.addColorStop(0, "rgba(0, 0, 0, 0.85)");
  glow.addColorStop(0.45, "rgba(0, 0, 0, 0.45)");
  glow.addColorStop(1, "rgba(0, 0, 0, 0)");
  context.clearRect(0, 0, width, height);
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);
}

export function useBlob() {
  const blob = React.useMemo(() => {
    const created = surface(128, 128);
    created.paint(paintBlob);
    return created;
  }, []);
  React.useEffect(() => () => blob.texture.dispose(), [blob]);
  return blob.texture;
}

export function BlobShadow({
  texture,
  width,
  depth,
  opacity = 0.55,
  materialRef,
}: {
  texture: THREE.Texture;
  width: number;
  depth: number;
  opacity?: number;
  materialRef?: React.Ref<THREE.MeshBasicMaterial>;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} renderOrder={1}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial
        ref={materialRef}
        map={texture}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
