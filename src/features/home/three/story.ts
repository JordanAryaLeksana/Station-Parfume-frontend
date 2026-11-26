export type Story = { target: number; value: number; velocity: number };

export const LAST_STEP = 6;

type Panel = { index: number; top: number; height: number };

export function storyFrom(panels: Panel[], line: number): number {
  let current = panels.at(0);
  for (const panel of panels) {
    if (panel.top <= line) current = panel;
  }
  if (!current) return 0;
  const center = current.top + current.height / 2;
  const offset = (line - center) / Math.max(1, current.height);
  const value = current.index + Math.min(0.5, Math.max(-0.5, offset));
  return Math.min(LAST_STEP + 0.5, Math.max(0, value));
}

export function damp(story: Story, delta: number, smoothTime: number) {
  const omega = 2 / smoothTime;
  const x = omega * delta;
  const decay = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = story.value - story.target;
  const swing = (story.velocity + omega * change) * delta;
  story.velocity = (story.velocity - omega * swing) * decay;
  story.value = story.target + (change + swing) * decay;
  if (
    Math.abs(story.value - story.target) < 0.0005 &&
    Math.abs(story.velocity) < 0.0005
  ) {
    story.value = story.target;
    story.velocity = 0;
  }
}

function smooth(k: number) {
  const t = Math.min(1, Math.max(0, k));
  return t * t * (3 - 2 * t);
}

export function band(value: number, from: number, to: number) {
  return smooth((value - from) / (to - from));
}
