"use client";

import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import {
  Bloom,
  EffectComposer,
  ToneMapping,
  Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import * as THREE from "three";

import { DPR } from "./tier";
import {
  lowerSharedTier,
  useNight,
  useReducedMotion,
  useTier,
} from "./use-stage";

function Settle() {
  const frames = React.useRef(0);
  useFrame((state) => {
    frames.current += 1;
    if (frames.current < 8) state.invalidate();
  });
  return null;
}

function Warmup({ onWarm }: { onWarm: () => void }) {
  const get = useThree((state) => state.get);
  const compiled = React.useRef(false);
  const frames = React.useRef(0);
  const done = React.useRef(false);

  React.useEffect(() => {
    let alive = true;
    const { gl, scene, camera } = get();
    const target = new THREE.WebGLRenderTarget(1, 1, {
      type: THREE.HalfFloatType,
    });
    const previous = gl.getRenderTarget();
    const toScreen = gl.compileAsync(scene, camera);
    gl.setRenderTarget(target);
    const toTarget = gl.compileAsync(scene, camera);
    gl.setRenderTarget(previous);
    const finish = () => {
      target.dispose();
      if (!alive) return;
      compiled.current = true;
      get().invalidate();
    };
    Promise.all([toScreen, toTarget]).then(finish, finish);
    return () => {
      alive = false;
    };
  }, [get]);

  useFrame((state) => {
    if (!compiled.current || done.current) return;
    frames.current += 1;
    state.invalidate();
    if (frames.current < 4) return;
    done.current = true;
    requestAnimationFrame(onWarm);
  });

  return null;
}

function Deferred({
  onMounted,
  children,
}: {
  onMounted: () => void;
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    React.startTransition(() => setMounted(true));
  }, []);

  React.useEffect(() => {
    if (mounted) onMounted();
  }, [mounted, onMounted]);

  return mounted ? children : null;
}

export function Stage({
  active,
  onReady,
  children,
}: {
  active: boolean;
  onReady?: () => void;
  children: React.ReactNode;
}) {
  const tier = useTier();
  const reduced = useReducedMotion();
  const night = useNight();
  const [mounted, setMounted] = React.useState(false);
  const [warm, setWarm] = React.useState(false);
  const onMounted = React.useCallback(() => setMounted(true), []);
  const onWarm = React.useCallback(() => {
    setWarm(true);
    onReady?.();
  }, [onReady]);
  const frameloop = !warm
    ? "demand"
    : !active
      ? "never"
      : reduced
        ? "demand"
        : "always";

  return (
    <Canvas
      dpr={DPR[tier]}
      frameloop={frameloop}
      camera={{ fov: 22, near: 0.5, far: 80, position: [2.6, 5, 12.5] }}
      gl={{ antialias: true, toneMapping: THREE.NeutralToneMapping }}
    >
      {warm && <PerformanceMonitor flipflops={3} onDecline={lowerSharedTier} />}
      <Deferred onMounted={onMounted}>{children}</Deferred>
      {mounted && <Warmup onWarm={onWarm} />}
      <Settle key={night ? "night" : "day"} />
    </Canvas>
  );
}

export function Effects({ night }: { night: boolean }) {
  const tier = useTier();
  if (tier !== "high") return null;

  return (
    <EffectComposer multisampling={4}>
      <Bloom
        mipmapBlur
        intensity={night ? 0.6 : 0.12}
        luminanceThreshold={0.82}
        luminanceSmoothing={0.2}
      />
      <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      <Vignette offset={0.3} darkness={night ? 0.55 : 0.2} />
    </EffectComposer>
  );
}
