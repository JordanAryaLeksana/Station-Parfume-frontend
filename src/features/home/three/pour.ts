export type Pour = {
  level: number;
  cap: number;
  stream: number;
  progress: number;
};

export const FULL_LEVEL = 0.86;
export const EMPTY_LEVEL = 0.03;

const PHASES = {
  drain: 0.5,
  lift: 0.75,
  open: 0.3,
  fill: 2.7,
  close: 0.3,
  back: 0.85,
};

const easeInOut = (k: number) =>
  k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const clamp = (k: number) => Math.min(1, Math.max(0, k));

export const RESTING: Pour = {
  level: FULL_LEVEL,
  cap: 0,
  stream: 0,
  progress: 1,
};

export function pourAt(elapsed: number, startLevel: number, pace = 1): Pour {
  let t = elapsed;
  const step = (duration: number) => {
    const length = duration * pace;
    const k = clamp(t / length);
    t -= length;
    return k;
  };

  const drain = step(PHASES.drain);
  const lift = step(PHASES.lift);
  const open = step(PHASES.open);
  const fill = step(PHASES.fill);
  const close = step(PHASES.close);
  const back = step(PHASES.back);

  const filling = easeInOut(fill);
  const level =
    fill > 0
      ? EMPTY_LEVEL + (FULL_LEVEL - EMPTY_LEVEL) * filling
      : startLevel + (EMPTY_LEVEL - startLevel) * easeInOut(drain);

  return {
    level,
    cap: easeInOut(lift) * (1 - easeInOut(back)),
    stream: open * (1 - close),
    progress: filling,
  };
}
