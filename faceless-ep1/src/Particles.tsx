import React, { useMemo, useRef, useLayoutEffect } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { C, F } from "./theme";
import { MASCOT } from "./lib";

/**
 * Pixel particles that fly in from a scattered cloud and assemble into a shape,
 * then re-form into the next shape at each stage's frame.
 * Shapes: {text}, {mascot}, or {ring}. Positions are in the 1920x1080 frame.
 */
export type Stage = {
  f: number; // absolute frame the particles start moving to this shape
  text?: string;
  mascot?: boolean;
  ring?: boolean;
  cx?: number; // centre of the shape
  cy?: number;
  size?: number; // font size / scale
  colors?: string[];
};

const W = 1920,
  H = 1080,
  N = 2600,
  MOVE = 28;

function samplePoints(st: Stage): [number, number][] {
  const cx = st.cx ?? W / 2,
    cy = st.cy ?? H / 2;
  if (st.mascot) {
    const s = st.size ?? 26;
    const pts: [number, number][] = [];
    MASCOT.forEach((row, y) =>
      row.split("").forEach((ch, x) => {
        if (ch !== "X") return;
        for (let i = 0; i < 3; i++)
          for (let j = 0; j < 3; j++)
            pts.push([cx + (x - 6) * s + (i * s) / 3, cy + (y - 5.5) * s + (j * s) / 3]);
      })
    );
    return pts;
  }
  if (st.ring) {
    const r = st.size ?? 220;
    return new Array(500).fill(0).map((_, i) => {
      const a = (i / 500) * Math.PI * 2;
      const rr = r + (i % 3) * 8;
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
    });
  }
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.font = `800 ${st.size ?? 300}px ${F.display}`;
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(st.text ?? "", cx, cy);
  const d = g.getImageData(0, 0, W, H).data;
  const pts: [number, number][] = [];
  const step = Math.max(4, Math.round((st.size ?? 300) / 70));
  for (let y = 0; y < H; y += step)
    for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 140) pts.push([x, y]);
  return pts;
}

export const Particles: React.FC<{ stages: Stage[]; until: number; px?: number }> = ({ stages, until, px = 4 }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);

  const seeds = useMemo(
    () =>
      new Array(N).fill(0).map((_, i) => ({
        sx: random("px" + i) * W,
        sy: random("py" + i) * H,
        delay: random("pd" + i) * 12,
        ph: random("pp" + i) * Math.PI * 2,
        pick: random("pk" + i),
      })),
    []
  );
  const key = JSON.stringify(stages);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shapes = useMemo(() => stages.map(samplePoints), [key]);

  useLayoutEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const g = cv.getContext("2d")!;
    g.clearRect(0, 0, W, H);
    const ease = Easing.bezier(0.65, 0, 0.25, 1);
    for (let i = 0; i < N; i++) {
      const s = seeds[i];
      // where is this particle for each stage?
      const scatter = (k: number): [number, number] => [
        s.sx + Math.sin(frame / 40 + s.ph + k) * 40,
        s.sy + Math.cos(frame / 50 + s.ph + k) * 40,
      ];
      const target = (k: number): [number, number] | null => {
        const pts = shapes[k];
        if (!pts.length) return null;
        return pts.length >= N ? pts[Math.floor((i * pts.length) / N)] : pts[i % pts.length];
      };
      let pos = scatter(0);
      let color = C.purpleHi;
      let alpha = 0.35;
      for (let k = 0; k < stages.length; k++) {
        const st = stages[k];
        const t0 = st.f + s.delay;
        if (frame < t0) break;
        const p = ease(Math.min(1, (frame - t0) / MOVE));
        const tgt = target(k);
        const used = tgt && (shapes[k].length >= N || i < Math.max(shapes[k].length * 1.6, 600));
        const to: [number, number] = used ? tgt! : scatter(k + 1);
        pos = [pos[0] + (to[0] - pos[0]) * p, pos[1] + (to[1] - pos[1]) * p];
        const cols = st.colors ?? [C.purple, C.purpleHi];
        const nextColor = cols[Math.floor(s.pick * cols.length)];
        color = p > 0.5 ? nextColor : color;
        alpha = used ? 0.35 + 0.65 * p : 0.35 - 0.2 * p;
      }
      // dissolve at the end
      const out = interpolate(frame, [until - 10, until + 12], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const fadeIn = interpolate(frame, [stages[0].f - 14, stages[0].f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
      const shimmer = 0.8 + 0.2 * Math.sin(frame / 6 + s.ph);
      g.globalAlpha = Math.max(0, alpha * out * shimmer * fadeIn);
      g.fillStyle = color;
      g.fillRect(pos[0], pos[1] - (1 - out) * 30, px, px);
    }
    g.globalAlpha = 1;
  }, [frame, seeds, shapes, key, until, px]);

  if (frame > until + 14) return null;
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0 }} />;
};
