import React, { useMemo, useRef, useLayoutEffect } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import { C, F } from "./theme";

/**
 * Pixel particles fly in from a scattered cloud and assemble into text.
 * Once assembled, the particles hand over to the solid, crisp text (no particles left on it).
 * At the next stage the solid text breaks back into particles and re-forms.
 */
export type Stage = {
  f: number; // absolute frame the particles start moving to this shape
  text: string;
  cx?: number;
  cy?: number;
  size?: number;
  colors?: string[];
};

const W = 1920,
  H = 1080,
  N = 2800,
  MOVE = 30, // frames to fly into place
  SETTLE = 12, // extra frames after the slowest particle lands
  SOLID = 10; // crossfade to solid text

const font = (st: Stage) => `800 ${st.size ?? 300}px ${F.display}`;

function samplePoints(st: Stage): [number, number][] {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#fff";
  g.font = font(st);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillText(st.text, st.cx ?? W / 2, st.cy ?? H / 2);
  const d = g.getImageData(0, 0, W, H).data;
  const pts: [number, number][] = [];
  const step = Math.max(3, Math.round((st.size ?? 300) / 80));
  for (let y = 0; y < H; y += step)
    for (let x = 0; x < W; x += step) if (d[(y * W + x) * 4 + 3] > 160) pts.push([x, y]);
  return pts;
}

/** Frame at which a stage is fully solid. */
export const solidAt = (st: Stage) => st.f + MOVE + SETTLE + SOLID;

export const Particles: React.FC<{ stages: Stage[]; until: number; px?: number }> = ({ stages, until, px = 3 }) => {
  const frame = useCurrentFrame();
  const ref = useRef<HTMLCanvasElement>(null);
  const seeds = useMemo(
    () =>
      new Array(N).fill(0).map((_, i) => ({
        sx: random("px" + i) * W,
        sy: random("py" + i) * H,
        delay: random("pd" + i) * SETTLE,
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
    const ease = Easing.bezier(0.6, 0, 0.2, 1);
    let k = -1;
    for (let i = 0; i < stages.length; i++) if (frame >= stages[i].f) k = i;
    if (k < 0) return;
    const st = stages[k];
    const next = stages[k + 1];
    const c = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
    const solidIn = interpolate(frame, [st.f + MOVE + SETTLE, st.f + MOVE + SETTLE + SOLID], [0, 1], c);
    const breakAt = next ? next.f : until;
    const solidOut = interpolate(frame, [breakAt - 2, breakAt + 4], [0, 1], c);
    const solid = solidIn * (1 - solidOut);
    const ending = !next && frame >= until - 2;

    const partAlpha = (1 - solid) * interpolate(frame, [stages[0].f - 10, stages[0].f], [0, 1], c);
    if (partAlpha > 0.01) {
      const pts = shapes[k];
      const prev = k > 0 ? shapes[k - 1] : null;
      const cols = st.colors ?? [C.purple, C.purpleHi];
      for (let i = 0; i < N; i++) {
        const s = seeds[i];
        const tgt = pts[Math.floor((i * pts.length) / N)];
        const from: [number, number] = prev
          ? prev[Math.floor((i * prev.length) / N)]
          : [s.sx + Math.sin(frame / 40 + s.ph) * 30, s.sy + Math.cos(frame / 50 + s.ph) * 30];
        const p = ease(Math.min(1, Math.max(0, (frame - st.f - s.delay) / MOVE)));
        const burst = prev ? Math.sin(p * Math.PI) * 120 : 0;
        let x = from[0] + (tgt[0] - from[0]) * p + Math.cos(s.ph) * burst;
        let y = from[1] + (tgt[1] - from[1]) * p + Math.sin(s.ph) * burst;
        let a = 0.25 + 0.75 * p;
        if (ending) {
          const q = Math.min(1, (frame - until + 2) / 14);
          x += Math.cos(s.ph) * q * 260;
          y += Math.sin(s.ph) * q * 260 - q * 40;
          a *= 1 - q;
        }
        g.globalAlpha = a * partAlpha;
        g.fillStyle = cols[Math.floor(s.pick * cols.length)];
        g.fillRect(x, y, px, px);
      }
    }
    if (solid > 0.01) {
      const cols = st.colors ?? [C.purple, C.purpleHi];
      const size = st.size ?? 300;
      const cy = st.cy ?? H / 2;
      g.globalAlpha = solid;
      g.font = font(st);
      g.textAlign = "center";
      g.textBaseline = "middle";
      const grad = g.createLinearGradient(0, cy - size / 2, 0, cy + size / 2);
      grad.addColorStop(0, cols[cols.length > 1 ? 1 : 0]);
      grad.addColorStop(1, cols[0]);
      g.shadowColor = cols[0] + "99";
      g.shadowBlur = 36 * solid;
      g.fillStyle = grad;
      g.fillText(st.text, st.cx ?? W / 2, cy);
      g.shadowBlur = 0;
    }
    g.globalAlpha = 1;
  }, [frame, seeds, shapes, key, until, px]);

  if (frame > until + 16 || frame < stages[0].f - 12) return null;
  return <canvas ref={ref} width={W} height={H} style={{ position: "absolute", inset: 0 }} />;
};
