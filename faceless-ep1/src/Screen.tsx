import React from "react";
import { Easing, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F, FPS } from "./theme";

/** One stretch of a recording: starts at absolute frame `at`, plays `src` from `from` seconds at `rate`. */
export type Seg = { at: number; src: string; from: number; rate: number };
/** Camera key: reach centre (x, y) in page CSS px (1600x900 page) at zoom z by frame f, moving over d frames. */
export type Cam = { f: number; x: number; y: number; z: number; d?: number };

const PW = 1600,
  PH = 900;

/** Absolute output frame at which clip time `t` (seconds) of `src` is shown. */
export const clipFrame = (segs: Seg[], src: string, t: number) => {
  for (let i = segs.length - 1; i >= 0; i--) {
    const s = segs[i];
    if (s.src === src && t >= s.from) return Math.round(s.at + ((t - s.from) / s.rate) * FPS);
  }
  return segs[0].at;
};

const camAt = (cams: Cam[], f: number) => {
  let cur = { x: cams[0].x, y: cams[0].y, z: cams[0].z };
  for (const k of cams) {
    const d = k.d ?? 16;
    if (f <= k.f - d) break;
    const p = interpolate(f, [k.f - d, k.f], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.45, 0, 0.2, 1),
    });
    // zoom in log space feels even
    const z = Math.exp(Math.log(cur.z) + (Math.log(k.z) - Math.log(cur.z)) * p);
    cur = { x: cur.x + (k.x - cur.x) * p, y: cur.y + (k.y - cur.y) * p, z };
  }
  return cur;
};

export const Screen: React.FC<{
  segs: Seg[];
  end: number;
  cams: Cam[];
  domain: string;
  path: string;
  width: number; // on-screen width of the page area
  glow?: string;
}> = ({ segs, end, cams, domain, path, width, glow }) => {
  const f = useCurrentFrame();
  const s = width / PW;
  const cam = camAt(cams, f);
  const z = Math.max(1, cam.z);
  const cx = Math.min(PW - PW / 2 / z, Math.max(PW / 2 / z, cam.x));
  const cy = Math.min(PH - PH / 2 / z, Math.max(PH / 2 / z, cam.y));
  const curSrc = [...segs].reverse().find((g) => f >= g.at)?.src ?? segs[0].src;
  return (
    <div
      style={{
        width,
        borderRadius: 16,
        overflow: "hidden",
        background: "#fff",
        border: `1px solid ${glow ?? C.line}`,
        boxShadow: glow ? `0 0 0 1px ${glow}, 0 0 50px ${glow}55, 0 30px 80px rgba(0,0,0,.6)` : "0 30px 80px rgba(0,0,0,.6)",
      }}
    >
      <div style={{ height: 50, display: "flex", alignItems: "center", gap: 10, padding: "0 18px", background: C.card, borderBottom: `1px solid ${C.line}` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
        ))}
        <div
          style={{
            marginLeft: 16,
            flex: 1,
            maxWidth: width * 0.62,
            height: 32,
            borderRadius: 8,
            background: C.bg2,
            border: `1px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            fontFamily: F.mono,
            fontSize: 17,
            color: C.muted,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          <span style={{ color: C.text }}>{typeof domain === "string" ? (curSrc.includes("channel") ? "youtube.com" : domain) : domain}</span>
          <span>{curSrc.includes("channel") ? "/@space.dudeYT" : path}</span>
        </div>
      </div>
      <div style={{ position: "relative", width, height: PH * s, overflow: "hidden" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: PW,
            height: PH,
            transformOrigin: "0 0",
            transform: `scale(${s}) translate(${PW / 2 - cx * z}px, ${PH / 2 - cy * z}px) scale(${z})`,
          }}
        >
          {segs.map((g, i) => {
            const next = segs[i + 1]?.at ?? end;
            return (
              <Sequence key={i} from={g.at} durationInFrames={Math.max(1, next - g.at)} layout="none">
                <OffthreadVideo
                  src={staticFile(g.src)}
                  startFrom={Math.round(g.from * FPS)}
                  playbackRate={g.rate}
                  muted
                  style={{ position: "absolute", left: 0, top: 0, width: PW, height: PH }}
                />
              </Sequence>
            );
          })}
        </div>
      </div>
    </div>
  );
};
