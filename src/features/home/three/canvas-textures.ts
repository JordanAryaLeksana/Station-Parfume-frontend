import * as THREE from "three";

import { BLENDS } from "@/features/catalog/blends";
import type { Concentration } from "@/features/catalog/types";

const RUPIAH = new Intl.NumberFormat("id-ID");

export function family(variable: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}

export type Surface = {
  texture: THREE.CanvasTexture;
  paint: (draw: (context: CanvasRenderingContext2D) => void) => void;
};

export function surface(width: number, height: number): Surface {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D tidak tersedia");
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;

  return {
    texture,
    paint(draw) {
      draw(context);
      texture.needsUpdate = true;
    },
  };
}

function spaced(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  context.letterSpacing = `${spacing}px`;
  context.fillText(text, x + spacing / 2, y);
  context.letterSpacing = "0px";
}

export function drawLabel(
  context: CanvasRenderingContext2D,
  label: {
    number: number | null;
    name: string | null;
    volume: number;
    blend: Concentration;
    sprig: HTMLImageElement | null;
  },
) {
  const { width, height } = context.canvas;
  const serif = family("--font-primary-loaded", "Georgia, serif");
  const sans = family("--font-secondary-loaded", "system-ui, sans-serif");

  const paper = context.createLinearGradient(0, 0, 0, height);
  paper.addColorStop(0, "#f7f0e3");
  paper.addColorStop(1, "#ece2cf");
  context.fillStyle = paper;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "#a9884c";
  context.lineWidth = 6;
  context.strokeRect(16, 16, width - 32, height - 32);
  context.lineWidth = 1.5;
  context.strokeRect(30, 30, width - 60, height - 60);

  context.textAlign = "center";
  context.textBaseline = "alphabetic";

  if (label.sprig?.complete && label.sprig.naturalWidth > 0) {
    const sprigHeight = 118;
    const sprigWidth =
      (label.sprig.naturalWidth / label.sprig.naturalHeight) * sprigHeight;
    context.drawImage(
      label.sprig,
      width / 2 - sprigWidth / 2,
      58,
      sprigWidth,
      sprigHeight,
    );
  }

  context.fillStyle = "#7e5c24";
  context.font = `600 26px ${sans}`;
  spaced(
    context,
    label.number === null ? "STASIUN RACIK" : `NO. ${label.number}`,
    width / 2,
    232,
    8,
  );

  if (label.name) {
    context.fillStyle = "#141110";
    let size = 76;
    let lines = [label.name];
    const fits = (candidate: string[], fontSize: number) => {
      context.font = `400 ${fontSize}px ${serif}`;
      return candidate.every(
        (line) => context.measureText(line).width <= width - 110,
      );
    };
    while (size > 48 && !fits(lines, size)) size -= 2;
    if (!fits(lines, size) && label.name.includes(" ")) {
      const words = label.name.split(" ");
      const middle = Math.ceil(words.length / 2);
      lines = [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
      size = 64;
      while (size > 36 && !fits(lines, size)) size -= 2;
    }
    context.font = `400 ${size}px ${serif}`;
    const top = lines.length > 1 ? 316 : 344;
    lines.forEach((line, index) => {
      context.fillText(line, width / 2, top + index * size * 1.02);
    });
  }

  context.strokeStyle = "#a9884c";
  context.lineWidth = 2;
  for (let tick = 0; tick <= 24; tick += 1) {
    const x = 116 + tick * ((width - 232) / 24);
    const tall = tick % 6 === 0;
    context.beginPath();
    context.moveTo(x, 470);
    context.lineTo(x, 470 - (tall ? 22 : 11));
    context.stroke();
  }

  context.fillStyle = "#4a3f33";
  context.font = `600 22px ${sans}`;
  spaced(
    context,
    `${label.volume} ML · ${BLENDS[label.blend].name.toUpperCase()}`,
    width / 2,
    530,
    6,
  );
}

function tabular(
  context: CanvasRenderingContext2D,
  text: string,
  right: number,
  y: number,
) {
  const cell = context.measureText("0").width;
  context.textAlign = "center";
  let x = right;
  for (const char of [...text].reverse()) {
    const advance = /\d/.test(char) ? cell : context.measureText(char).width;
    context.fillText(char, x - advance / 2, y);
    x -= advance;
  }
}

export function drawMeter(
  context: CanvasRenderingContext2D,
  reading: { ml: number; rupiah: number; volume: number; paid?: boolean },
) {
  const width = 1024;
  const height = 512;
  const sans = family("--font-secondary-loaded", "system-ui, sans-serif");
  context.setTransform(
    context.canvas.width / width,
    0,
    0,
    context.canvas.height / height,
    0,
    0,
  );

  const glass = context.createLinearGradient(0, 0, 0, height);
  glass.addColorStop(0, "#151412");
  glass.addColorStop(1, "#0a0a09");
  context.fillStyle = glass;
  context.fillRect(0, 0, width, height);

  context.strokeStyle = "rgba(226, 197, 142, 0.18)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(40, height / 2);
  context.lineTo(width - 40, height / 2);
  context.stroke();

  const rows = [
    { label: "TAKAR", unit: "ML", value: `${Math.floor(reading.ml)}`, y: 0 },
    {
      label: "HARGA",
      unit: "RP",
      value: `${RUPIAH.format(reading.rupiah)},00`,
      y: height / 2,
    },
  ];

  context.textBaseline = "middle";
  for (const row of rows) {
    const middle = row.y + height / 4;
    context.fillStyle = "rgba(226, 197, 142, 0.62)";
    context.font = `600 26px ${sans}`;
    context.textAlign = "left";
    spaced(context, row.label, 48, middle - 52, 7);
    context.font = `600 34px ${sans}`;
    spaced(context, row.unit, 48, middle + 22, 4);

    context.fillStyle = "#f0d49a";
    context.shadowColor = "rgba(232, 190, 110, 0.55)";
    context.shadowBlur = 18;
    context.font = `600 112px ${sans}`;
    tabular(context, row.value, width - 48, middle + 6);
    context.shadowBlur = 0;
  }

  for (let tick = 0; tick <= reading.volume; tick += 1) {
    const x = 48 + (tick / reading.volume) * (width - 96);
    const tall = tick % 10 === 0;
    const filled = tick <= reading.ml;
    context.fillStyle = filled
      ? "rgba(240, 212, 154, 0.95)"
      : "rgba(226, 197, 142, 0.22)";
    context.fillRect(x - 1.5, height / 2 - (tall ? 14 : 7), 3, tall ? 14 : 7);
  }

  if (reading.paid) drawStamp(context, width * 0.47, height * 0.25);
}

function drawStamp(context: CanvasRenderingContext2D, x: number, y: number) {
  const sans = family("--font-secondary-loaded", "system-ui, sans-serif");
  context.save();
  context.translate(x, y);
  context.rotate(-0.14);
  context.globalAlpha = 0.94;
  context.strokeStyle = "#f0d49a";
  context.fillStyle = "rgba(10, 10, 9, 0.72)";
  context.lineWidth = 7;
  context.beginPath();
  context.roundRect(-190, -62, 380, 124, 18);
  context.fill();
  context.stroke();
  context.lineWidth = 2;
  context.beginPath();
  context.roundRect(-174, -46, 348, 92, 10);
  context.stroke();
  context.fillStyle = "#f0d49a";
  context.font = `700 78px ${sans}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  spaced(context, "LUNAS", 0, 4, 14);
  context.restore();
}

export function drawEmblem(
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  const sprig = images[0];
  if (!sprig?.complete || sprig.naturalWidth === 0) return;
  const scale = Math.min(
    (width * 0.8) / sprig.naturalWidth,
    (height * 0.8) / sprig.naturalHeight,
  );
  const w = sprig.naturalWidth * scale;
  const h = sprig.naturalHeight * scale;
  context.drawImage(sprig, (width - w) / 2, (height - h) / 2, w, h);
}

export function drawBrand(
  context: CanvasRenderingContext2D,
  images: HTMLImageElement[],
) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  const [sprig, wordmark] = images;
  if (!sprig?.complete || !wordmark?.complete) return;
  if (sprig.naturalWidth === 0 || wordmark.naturalWidth === 0) return;
  const tall = height * 0.86;
  const sprigWidth = (sprig.naturalWidth / sprig.naturalHeight) * tall;
  const wordHeight = height * 0.6;
  const wordWidth =
    (wordmark.naturalWidth / wordmark.naturalHeight) * wordHeight;
  const gap = height * 0.12;
  const total = sprigWidth + gap + wordWidth;
  const left = (width - total) / 2;
  context.drawImage(sprig, left, (height - tall) / 2, sprigWidth, tall);
  context.drawImage(
    wordmark,
    left + sprigWidth + gap,
    (height - wordHeight) / 2,
    wordWidth,
    wordHeight,
  );
}

export function drawRuler(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.fillStyle = "#c8a15a";
  context.fillRect(0, 0, width, 5);
  const step = width / 5;
  for (let tick = 0; tick < 5; tick += 1) {
    const long = tick === 0;
    context.fillRect(
      tick * step,
      0,
      long ? 5 : 4,
      long ? height : height * 0.45,
    );
  }
}

export function drawGlow(context: CanvasRenderingContext2D) {
  const { width, height } = context.canvas;
  const light = context.createLinearGradient(0, 0, 0, height);
  light.addColorStop(0, "#000000");
  light.addColorStop(0.1, "#ffffff");
  light.addColorStop(0.42, "#8a8a8a");
  light.addColorStop(1, "#000000");
  context.fillStyle = light;
  context.fillRect(0, 0, width, height);
}

export function drawPlate(context: CanvasRenderingContext2D, text: string) {
  const { width, height } = context.canvas;
  const sans = family("--font-secondary-loaded", "system-ui, sans-serif");
  context.fillStyle = "#efe6d4";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#a9884c";
  context.lineWidth = 3;
  context.strokeRect(4, 4, width - 8, height - 8);
  context.fillStyle = "#3d3328";
  context.font = `600 34px ${sans}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  spaced(context, text, width / 2, height / 2 + 2, 3);
}
