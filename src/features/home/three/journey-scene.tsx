"use client";

import React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";

import type { Concentration } from "@/features/catalog/types";
import type { HeroScent } from "@/features/home/hero-scents";

import { BlobShadow, useBlob } from "./blob-shadow";
import { Bottle, BOTTLE, scaleOf, Turntable } from "./bottle";
import { Conveyor, PACK_SPOT, Road, type Span } from "./conveyor";
import { Meter, type Reading } from "./meter";
import { Parcel, PARCEL } from "./parcel";
import { EMPTY_LEVEL, FULL_LEVEL, pourAt, type Pour } from "./pour";
import { SIZES, SizeRack, slotOf } from "./size-rack";
import { Effects, Stage } from "./stage";
import { Rack, sourceOf } from "./station";
import { band, damp, LAST_STEP, type Story } from "./story";
import { Atmosphere, Studio } from "./studio";
import { useNight, useReducedMotion, useTier } from "./use-stage";
import { DOOR, DOOR_SLIDE, Van, WHEEL } from "./van";

export type JourneyRacik = {
  scent: HeroScent;
  volume: number;
  blend: Concentration;
  price: number | null;
};

const HERO_VOLUME = 30;
const MOVING = 1;
const VAN = { x: 4.25, z: 2.55, scale: 1.45, from: 15, exit: -19 };
const DOOR_WORLD = {
  x: VAN.x + DOOR.x * VAN.scale,
  z: VAN.z + 0.5 * VAN.scale,
  floor: DOOR.bottom * VAN.scale,
};
const ROAD_Z = VAN.z + 0.95 * VAN.scale;

const RAIL = new THREE.CatmullRomCurve3(
  [
    PACK_SPOT.clone(),
    new THREE.Vector3(0.45, 0, 2.55),
    new THREE.Vector3(1.4, 0, 3.95),
    new THREE.Vector3(3.1, 0, 4.3),
    new THREE.Vector3(DOOR_WORLD.x - 0.2, 0, 4.15),
    new THREE.Vector3(DOOR_WORLD.x, 0, DOOR_WORLD.z + 0.5),
  ],
  false,
  "centripetal",
);

const TIMELINE = {
  drain: [0.35, 0.85],
  focus: [0.55, 0.95],
  unfocus: [1.55, 1.95],
  rackIn: [1.45, 1.85],
  rackOut: [2.6, 3.0],
  capOff: [2.5, 2.72],
  pour: [2.75, 3.35],
  capOn: [3.38, 3.6],
  paid: 3.9,
  railIn: [4.35, 4.62],
  boxIn: [4.55, 4.9],
  intoBox: [4.92, 5.18],
  cover: [5.18, 5.38],
  seal: [5.38, 5.48],
  arrive: [5.7, 5.92],
  doorOpen: [5.92, 5.97],
  ride: [5.97, 6.12],
  enter: [6.12, 6.18],
  doorClose: [6.18, 6.22],
  railOut: [6.18, 6.26],
  depart: [6.26, 6.5],
} as const;

const STILL = [0, 1.3, 2.3, 3.62, 4.3, 5.49, 6.24];

const MOVES: [number, number][] = [
  [0.15, 0.85],
  [1.15, 1.85],
  [2.15, 2.85],
  [3.15, 3.85],
  [4.15, 4.85],
  [5.1, 5.68],
];

function cameraTime(s: number) {
  for (let index = 0; index < MOVES.length; index += 1) {
    const [from, to] = MOVES[index] ?? [index, index + 1];
    if (s <= from) return index;
    if (s < to) return index + band(s, from, to);
  }
  return MOVES.length;
}

type Shot = {
  target: [number, number, number];
  direction: [number, number, number];
  distance: number;
  shiftX: number;
  shiftY: number;
};

const SHOTS: Shot[] = [
  {
    target: [0.1, 0.8, -0.4],
    direction: [0.2, 0.33, 1],
    distance: 11.5,
    shiftX: 0.21,
    shiftY: 0.08,
  },
  {
    target: [0.05, 1.0, -0.95],
    direction: [0.06, 0.16, 1],
    distance: 7.6,
    shiftX: 0.24,
    shiftY: 0,
  },
  {
    target: [1.0, 0.42, 0.6],
    direction: [0.08, 0.36, 1],
    distance: 9.1,
    shiftX: 0.25,
    shiftY: 0,
  },
  {
    target: [-0.3, 0.85, 0.1],
    direction: [0.16, 0.28, 1],
    distance: 7,
    shiftX: 0.24,
    shiftY: 0,
  },
  {
    target: [-0.5, 0.55, 0.45],
    direction: [0.28, 0.22, 1],
    distance: 5.4,
    shiftX: 0.24,
    shiftY: 0,
  },
  {
    target: [0.15, 0.55, 1],
    direction: [0.15, 0.42, 1],
    distance: 6.4,
    shiftX: 0.24,
    shiftY: 0,
  },
  {
    target: [4.2, 0.75, 2.6],
    direction: [-0.12, 0.3, 1],
    distance: 13.5,
    shiftX: 0.2,
    shiftY: 0,
  },
];

function route(scale: number) {
  const targets = SHOTS.map((shot) => new THREE.Vector3(...shot.target));
  const positions = SHOTS.map((shot, index) =>
    (targets[index] ?? new THREE.Vector3())
      .clone()
      .addScaledVector(
        new THREE.Vector3(...shot.direction).normalize(),
        shot.distance * scale,
      ),
  );
  return {
    targets: new THREE.CatmullRomCurve3(targets, false, "centripetal"),
    positions: new THREE.CatmullRomCurve3(positions, false, "centripetal"),
  };
}

const WIDE = route(1);

const PHONE: Shot[] = [
  {
    target: [0.15, 0.75, -0.2],
    direction: [0.18, 0.36, 1],
    distance: 9.6,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [0.05, 0.95, -0.85],
    direction: [0.06, 0.2, 1],
    distance: 7.2,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [0.75, 0.42, 0.55],
    direction: [0.08, 0.38, 1],
    distance: 7.6,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [-0.25, 0.7, 0.2],
    direction: [0.12, 0.3, 1],
    distance: 7.4,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [-0.55, 0.55, 0.45],
    direction: [0.24, 0.22, 1],
    distance: 5.4,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [0.1, 0.5, 1.0],
    direction: [0.12, 0.44, 1],
    distance: 6.2,
    shiftX: 0,
    shiftY: 0,
  },
  {
    target: [2.6, 0.75, 2.6],
    direction: [-0.06, 0.32, 1],
    distance: 15.5,
    shiftX: 0,
    shiftY: 0,
  },
];

function routeOf(shots: Shot[]) {
  const targets = shots.map((shot) => new THREE.Vector3(...shot.target));
  const positions = shots.map((shot, index) =>
    (targets[index] ?? new THREE.Vector3())
      .clone()
      .addScaledVector(
        new THREE.Vector3(...shot.direction).normalize(),
        shot.distance,
      ),
  );
  return {
    targets: new THREE.CatmullRomCurve3(targets, false, "centripetal"),
    positions: new THREE.CatmullRomCurve3(positions, false, "centripetal"),
  };
}

const NARROW = routeOf(PHONE);
const SLOTS = new Map(SIZES.map((ml) => [ml, slotOf(ml)]));
const ORIGIN = new THREE.Vector3();

function shiftAt(s: number, key: "shiftX" | "shiftY") {
  const index = Math.min(SHOTS.length - 2, Math.max(0, Math.floor(s)));
  const from = SHOTS[index]?.[key] ?? 0;
  const to = SHOTS[index + 1]?.[key] ?? from;
  return THREE.MathUtils.lerp(from, to, band(s, index, index + 1));
}

function storyValue(story: Story) {
  return story.value;
}

function StoryClock({
  storyRef,
  reduced,
  onStory,
}: {
  storyRef: React.RefObject<Story>;
  reduced: boolean;
  onStory?: (value: number) => void;
}) {
  const reported = React.useRef(-1);

  useFrame((_, delta) => {
    const story = storyRef.current;
    if (reduced) {
      const step = Math.min(LAST_STEP, Math.max(0, Math.round(story.target)));
      story.value = STILL[step] ?? step;
      story.velocity = 0;
    } else {
      damp(story, Math.min(delta, 0.05), 0.32);
    }
    if (Math.abs(story.value - reported.current) > 0.004) {
      reported.current = story.value;
      onStory?.(story.value);
    }
  });
  return null;
}

function Bridge({
  invalidateRef,
}: {
  invalidateRef: React.RefObject<(() => void) | null>;
}) {
  const get = useThree((state) => state.get);

  React.useLayoutEffect(() => {
    const { invalidate, camera } = get();
    camera.layers.enable(MOVING);
    invalidateRef.current = invalidate;
    return () => {
      invalidateRef.current = null;
    };
  }, [get, invalidateRef]);

  return null;
}

function JourneyCamera({
  storyRef,
  reduced,
}: {
  storyRef: React.RefObject<Story>;
  reduced: boolean;
}) {
  const pointer = React.useRef({ x: 0, y: 0, sx: 0, sy: 0 });
  const scratch = React.useRef<{
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);

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
    const wide = width >= 980;
    const fov = THREE.MathUtils.clamp(
      THREE.MathUtils.radToDeg(
        2 *
          Math.atan(Math.tan(THREE.MathUtils.degToRad(19)) / (width / height)),
      ),
      20,
      46,
    );
    const s = cameraTime(storyValue(storyRef.current));
    const t = THREE.MathUtils.clamp(s / LAST_STEP, 0, 1);
    const path = wide ? WIDE : NARROW;

    scratch.current ??= {
      position: new THREE.Vector3(),
      target: new THREE.Vector3(),
    };
    const { position, target } = scratch.current;
    path.positions.getPoint(t, position);
    path.targets.getPoint(t, target);

    const follow = 1 - Math.exp(-Math.min(delta, 0.05) * 3);
    const hand = pointer.current;
    hand.sx += (hand.x - hand.sx) * follow;
    hand.sy += (hand.y - hand.sy) * follow;
    if (wide && !reduced) {
      position.x += hand.sx * 0.22;
      position.y -= hand.sy * 0.1;
    }

    camera.position.copy(position);
    camera.lookAt(target);
    camera.fov = fov;
    const shiftX = wide ? shiftAt(s, "shiftX") : 0;
    const shiftY = wide ? shiftAt(s, "shiftY") : 0;
    camera.setViewOffset(
      width,
      height,
      -shiftX * width,
      shiftY * height,
      width,
      height,
    );
    camera.updateProjectionMatrix();
  });

  return null;
}

type Placement = { value: number; velocity: number; volume: number };

function dampTo(place: Placement, goal: number, step: number, time: number) {
  const omega = 2 / time;
  const x = omega * step;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = place.value - goal;
  const swing = (place.velocity + omega * change) * step;
  place.velocity = (place.velocity - omega * swing) * decay;
  place.value = goal + (change + swing) * decay;
}

function Director({
  racik,
  storyRef,
  reduced,
  pourRef,
  readingRef,
  packRef,
  sizeRef,
  placeRef,
  focusRef,
  spanRef,
  presenceRef,
  onSwitch,
}: {
  racik: JourneyRacik;
  storyRef: React.RefObject<Story>;
  reduced: boolean;
  pourRef: React.RefObject<Pour>;
  readingRef: React.RefObject<Reading>;
  packRef: React.RefObject<number>;
  sizeRef: React.RefObject<number>;
  placeRef: React.RefObject<Placement>;
  focusRef: React.RefObject<number>;
  spanRef: React.RefObject<Span>;
  presenceRef: React.RefObject<number>;
  onSwitch: (volume: number) => void;
}) {
  const clock = React.useRef({ time: 0, cue: -1, start: 0, from: EMPTY_LEVEL });

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const s = storyValue(storyRef.current);

    const hero = clock.current;
    hero.time += step;
    if (hero.cue !== racik.scent.id) {
      hero.from = hero.cue === -1 ? EMPTY_LEVEL : pourRef.current.level;
      hero.cue = racik.scent.id;
      hero.start = hero.time;
    }
    const loop = reduced
      ? { level: FULL_LEVEL, cap: 0, stream: 0, progress: 1 }
      : pourAt(hero.time - hero.start, hero.from, 1);
    const heroWeight = 1 - band(s, 0.12, 0.34);

    const drained = band(s, ...TIMELINE.drain);
    const filled = band(s, ...TIMELINE.pour);
    const storyLevel =
      s < TIMELINE.pour[0]
        ? THREE.MathUtils.lerp(FULL_LEVEL, EMPTY_LEVEL, drained)
        : THREE.MathUtils.lerp(EMPTY_LEVEL, FULL_LEVEL, filled);
    const storyCap =
      band(s, ...TIMELINE.capOff) * (1 - band(s, ...TIMELINE.capOn));
    const storyStream =
      band(s, TIMELINE.pour[0] - 0.06, TIMELINE.pour[0] + 0.04) *
      (1 - band(s, TIMELINE.pour[1] - 0.04, TIMELINE.pour[1] + 0.06));

    const pour = pourRef.current;
    pour.level = THREE.MathUtils.lerp(storyLevel, loop.level, heroWeight);
    pour.cap = THREE.MathUtils.lerp(storyCap, loop.cap, heroWeight);
    pour.stream = THREE.MathUtils.lerp(storyStream, loop.stream, heroWeight);
    pour.progress = heroWeight > 0.5 ? loop.progress : filled;

    focusRef.current =
      band(s, ...TIMELINE.focus) * (1 - band(s, ...TIMELINE.unfocus));
    presenceRef.current =
      band(s, ...TIMELINE.rackIn) * (1 - band(s, ...TIMELINE.rackOut));

    const place = placeRef.current;
    const want = racik.volume;
    if (reduced) {
      if (place.volume !== want) {
        place.volume = want;
        onSwitch(want);
      }
      place.value = 1;
      place.velocity = 0;
    } else {
      dampTo(place, place.volume !== want ? 0 : 1, step, 0.42);
      if (place.volume !== want && place.value < 0.03) {
        place.volume = want;
        onSwitch(want);
      }
    }
    sizeRef.current = place.volume;

    const reading = readingRef.current;
    if (heroWeight > 0.5) {
      const price = racik.scent.price ?? 0;
      reading.volume = HERO_VOLUME;
      reading.ml = HERO_VOLUME * loop.progress;
      reading.rupiah =
        loop.progress >= 1
          ? price
          : Math.floor((price * loop.progress) / 500) * 500;
      reading.paid = false;
    } else {
      const price = racik.price ?? 0;
      reading.volume = place.volume;
      reading.ml = place.volume * filled;
      reading.rupiah =
        filled >= 1 ? price : Math.floor((price * filled) / 500) * 500;
      reading.paid = s >= TIMELINE.paid;
    }

    packRef.current =
      s < TIMELINE.cover[0]
        ? 0.6
        : s < TIMELINE.seal[0]
          ? 0.62 + 0.24 * band(s, ...TIMELINE.cover)
          : 0.86 + 0.14 * band(s, ...TIMELINE.seal);

    spanRef.current.from = band(s, ...TIMELINE.railOut);
    spanRef.current.to = band(s, ...TIMELINE.railIn);
  });

  return null;
}

function useMoving(ref: React.RefObject<THREE.Object3D | null>) {
  React.useLayoutEffect(() => {
    ref.current?.traverse((object) => object.layers.set(MOVING));
  }, [ref]);
}

function Carrier({
  storyRef,
  placeRef,
  shadow,
  children,
}: {
  storyRef: React.RefObject<Story>;
  placeRef: React.RefObject<Placement>;
  shadow: THREE.Texture;
  children: React.ReactNode;
}) {
  const group = React.useRef<THREE.Group>(null);
  const blob = React.useRef<THREE.Group>(null);
  const blobMaterial = React.useRef<THREE.MeshBasicMaterial>(null);
  const scratch = React.useRef<THREE.Vector3 | null>(null);
  useMoving(group);

  useFrame(() => {
    if (!group.current) return;
    const s = storyValue(storyRef.current);
    const place = placeRef.current;
    const slot = SLOTS.get(place.volume) ?? ORIGIN;
    scratch.current ??= new THREE.Vector3();
    const position = scratch.current;
    position.lerpVectors(slot, ORIGIN, place.value);
    position.y += Math.sin(Math.PI * place.value) * 0.55;

    const boxScale = scaleOf(place.volume);
    const into = band(s, ...TIMELINE.intoBox);
    const floor = PARCEL.wall * boxScale - BOTTLE.base + 0.02;
    position.x = THREE.MathUtils.lerp(position.x, PACK_SPOT.x, into);
    position.z = THREE.MathUtils.lerp(position.z, PACK_SPOT.z, into);
    position.y =
      THREE.MathUtils.lerp(position.y, floor, into) +
      Math.sin(Math.PI * into) * (0.22 + PARCEL.tray * boxScale);

    group.current.position.copy(position);
    group.current.visible = s < TIMELINE.cover[1];

    if (blob.current) blob.current.position.y = -position.y + 0.004;
    if (blobMaterial.current) {
      blobMaterial.current.opacity = 0.5 / (1 + Math.max(0, position.y) * 3);
    }
  });

  return (
    <group ref={group}>
      {children}
      <group ref={blob}>
        <BlobShadow
          texture={shadow}
          width={0.9}
          depth={0.7}
          materialRef={blobMaterial}
        />
      </group>
    </group>
  );
}

function ParcelRide({
  storyRef,
  packRef,
  volume,
  shadow,
}: {
  storyRef: React.RefObject<Story>;
  packRef: React.RefObject<number>;
  volume: number;
  shadow: THREE.Texture;
}) {
  const group = React.useRef<THREE.Group>(null);
  const blob = React.useRef<THREE.Group>(null);
  const scratch = React.useRef<{
    point: THREE.Vector3;
    tangent: THREE.Vector3;
  } | null>(null);
  const scale = scaleOf(volume);
  useMoving(group);

  useFrame(() => {
    if (!group.current) return;
    const s = storyValue(storyRef.current);
    const arrive = band(s, ...TIMELINE.boxIn);
    const ride = band(s, ...TIMELINE.ride);
    const enter = band(s, ...TIMELINE.enter);
    const along = s < TIMELINE.intoBox[0] ? 1 - arrive : ride;
    scratch.current ??= {
      point: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
    };
    const { point, tangent } = scratch.current;
    RAIL.getPointAt(along, point);
    RAIL.getTangentAt(along, tangent);
    const facing = -Math.atan2(tangent.z, tangent.x);

    const inside = VAN.z - 0.1;
    const x = point.x;
    const z = THREE.MathUtils.lerp(point.z, inside, enter);
    const lift = Math.min(1, enter * 2.2);
    const y = 0.03 + (DOOR_WORLD.floor - 0.03) * lift;
    group.current.position.set(x, y, z);
    group.current.rotation.y = THREE.MathUtils.lerp(
      facing,
      Math.PI / 2,
      band(s, TIMELINE.ride[1] - 0.05, TIMELINE.enter[0] + 0.02),
    );
    group.current.visible =
      s >= TIMELINE.boxIn[0] - 0.01 && s < TIMELINE.enter[1] + 0.005;
    if (blob.current) blob.current.position.y = -y + 0.004;
  });

  return (
    <group ref={group} visible={false}>
      <group scale={scale}>
        <Parcel packRef={packRef} />
      </group>
      <group ref={blob}>
        <BlobShadow
          texture={shadow}
          width={PARCEL.width * scale * 1.6}
          depth={PARCEL.depth * scale * 1.8}
          opacity={0.5}
        />
      </group>
    </group>
  );
}

function Delivery({
  storyRef,
  reduced,
  shadow,
}: {
  storyRef: React.RefObject<Story>;
  reduced: boolean;
  shadow: THREE.Texture;
}) {
  const van = React.useRef<THREE.Group>(null);
  const bodyRef = React.useRef<THREE.Group>(null);
  const doorRef = React.useRef<THREE.Group>(null);
  const wheelsRef = React.useRef<(THREE.Group | null)[]>([]);
  const motion = React.useRef({ x: VAN.from, speed: 0, pitch: 0 });
  useMoving(van);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.05);
    const s = storyValue(storyRef.current);
    const arriving = band(s, ...TIMELINE.arrive);
    const [from, to] = TIMELINE.depart;
    const leaving = Math.min(1, Math.max(0, (s - from) / (to - from)));
    const easeOut = 1 - Math.pow(1 - arriving, 3);
    const x =
      s < from
        ? THREE.MathUtils.lerp(VAN.from, VAN.x, easeOut)
        : THREE.MathUtils.lerp(VAN.x, VAN.exit, leaving * leaving);

    const state = motion.current;
    const dx = x - state.x;
    const speed = step > 0 ? dx / step : 0;
    const acceleration = step > 0 ? (speed - state.speed) / step : 0;
    state.x = x;
    state.speed = speed;
    const goal =
      reduced || Math.abs(dx) > 3
        ? 0
        : THREE.MathUtils.clamp(acceleration * 0.003, -0.035, 0.035);
    state.pitch += (goal - state.pitch) * (1 - Math.exp(-step * 6));

    if (van.current) {
      van.current.position.x = x;
      van.current.visible = s >= TIMELINE.arrive[0] - 0.02 && x > VAN.exit + 1;
    }
    if (Math.abs(dx) < 3) {
      for (const wheel of wheelsRef.current) {
        if (wheel) wheel.rotation.z -= dx / (WHEEL * VAN.scale);
      }
    }
    if (bodyRef.current) bodyRef.current.rotation.z = state.pitch;
    if (doorRef.current) {
      const open =
        band(s, ...TIMELINE.doorOpen) * (1 - band(s, ...TIMELINE.doorClose));
      doorRef.current.position.x = DOOR_SLIDE * open;
      doorRef.current.position.z = 0.03 * Math.min(1, open * 4);
    }
  });

  return (
    <group
      ref={van}
      position={[VAN.from, 0, VAN.z]}
      scale={VAN.scale}
      visible={false}
    >
      <Van bodyRef={bodyRef} wheelsRef={wheelsRef} doorRef={doorRef} />
      <group position={[0, 0.004, 0]}>
        <BlobShadow texture={shadow} width={4.2} depth={1.6} opacity={0.6} />
      </group>
    </group>
  );
}

function Scene({
  racik,
  storyRef,
  invalidateRef,
  onStory,
}: {
  racik: JourneyRacik;
  storyRef: React.RefObject<Story>;
  invalidateRef: React.RefObject<(() => void) | null>;
  onStory?: (value: number) => void;
}) {
  const night = useNight();
  const reduced = useReducedMotion();
  const tier = useTier();
  const shadow = useBlob();
  const duskRef = React.useRef(night ? 1 : 0);
  const pourRef = React.useRef<Pour>({
    level: EMPTY_LEVEL,
    cap: 0,
    stream: 0,
    progress: 0,
  });
  const readingRef = React.useRef<Reading>({
    ml: 0,
    rupiah: 0,
    volume: HERO_VOLUME,
    paid: false,
  });
  const packRef = React.useRef(0.6);
  const sizeRef = React.useRef(HERO_VOLUME);
  const focusRef = React.useRef(0);
  const spanRef = React.useRef<Span>({ from: 0, to: 0 });
  const presenceRef = React.useRef(0);
  const placeRef = React.useRef<Placement>({
    value: 1,
    velocity: 0,
    volume: HERO_VOLUME,
  });
  const [shown, setShown] = React.useState(HERO_VOLUME);

  return (
    <>
      <Bridge invalidateRef={invalidateRef} />
      <StoryClock storyRef={storyRef} reduced={reduced} onStory={onStory} />
      <Director
        racik={racik}
        storyRef={storyRef}
        reduced={reduced}
        pourRef={pourRef}
        readingRef={readingRef}
        packRef={packRef}
        sizeRef={sizeRef}
        placeRef={placeRef}
        focusRef={focusRef}
        spanRef={spanRef}
        presenceRef={presenceRef}
        onSwitch={setShown}
      />
      <Atmosphere
        night={night}
        reduced={reduced}
        duskRef={duskRef}
        backdrop="cove"
      />
      <Studio night={night} showroom />
      <JourneyCamera storyRef={storyRef} reduced={reduced} />

      <Rack
        source={sourceOf(racik.scent.family)}
        pourRef={pourRef}
        duskRef={duskRef}
        focusRef={focusRef}
      />
      <Turntable />
      <SizeRack
        tone={racik.scent.liquid}
        tier={tier}
        outRef={sizeRef}
        presenceRef={presenceRef}
      />
      <Meter readingRef={readingRef} />
      <Conveyor rail={RAIL} spanRef={spanRef} />
      <Road z={ROAD_Z} length={48} />

      <Carrier storyRef={storyRef} placeRef={placeRef} shadow={shadow}>
        <Bottle
          tone={racik.scent.liquid}
          label={{
            number: racik.scent.id,
            name: racik.scent.name,
            volume: shown,
            blend: racik.blend,
          }}
          tier={tier}
          reduced={reduced}
          pourRef={pourRef}
          glass="physical"
        />
      </Carrier>
      <ParcelRide
        storyRef={storyRef}
        packRef={packRef}
        volume={racik.volume}
        shadow={shadow}
      />
      <Delivery storyRef={storyRef} reduced={reduced} shadow={shadow} />

      <ContactShadows
        key={tier}
        position={[0.6, 0.001, 0.2]}
        scale={[10, 6]}
        resolution={tier === "low" ? 512 : 1024}
        blur={2.4}
        far={2.2}
        opacity={night ? 0.8 : 0.45}
        frames={1}
      />
      <Effects night={night} />
    </>
  );
}

export default function JourneyScene({
  racik,
  storyRef,
  invalidateRef,
  onStory,
  active,
  onReady,
}: {
  racik: JourneyRacik;
  storyRef: React.RefObject<Story>;
  invalidateRef: React.RefObject<(() => void) | null>;
  onStory?: (value: number) => void;
  active: boolean;
  onReady: () => void;
}) {
  return (
    <Stage active={active} onReady={onReady}>
      <Scene
        racik={racik}
        storyRef={storyRef}
        invalidateRef={invalidateRef}
        onStory={onStory}
      />
    </Stage>
  );
}
