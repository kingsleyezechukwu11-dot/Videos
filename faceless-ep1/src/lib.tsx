import React, { useMemo } from "react";
import { Easing, interpolate, random, useCurrentFrame } from "remotion";
import timeline from "./timeline.json";
import { C, F, FPS } from "./theme";

type Line = { id: string; text: string; start: number; dur: number };
const LINES: Record<string, Line> = Object.fromEntries(
  (timeline.lines as Line[]).map((l) => [l.id, l])
);

export const line = (id: string) => {
  const l = LINES[id];
  if (!l) throw new Error("unknown line " + id);
  return l;
};
/** Absolute frame where line `id` starts (+ offset seconds). */
export const at = (id: string, off = 0) => Math.round((line(id).start + off) * FPS);
/** Absolute frame where line `id` ends. */
export const end = (id: string, off = 0) =>
  Math.round((line(id).start + line(id).dur + off) * FPS);
/** Approximate frame where `phrase` is spoken inside line `id` (by character position). */
export const word = (id: string, phrase: string, off = 0) => {
  const l = line(id);
  const i = l.text.indexOf(phrase);
  if (i < 0) throw new Error(`phrase "${phrase}" not in ${id}`);
  return Math.round((l.start + (l.dur * i) / l.text.length + off) * FPS);
};

const ease = Easing.bezier(0.2, 0.8, 0.2, 1);
/** 0→1 eased progress starting at absolute frame `from`. */
export const prog = (frame: number, from: number, dur = 14) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });

/** Fade + rise + slight blur in at `from`; optional fade out at `out`. */
export const Appear: React.FC<{
  from: number;
  out?: number;
  dy?: number;
  dx?: number;
  scale?: number;
  dur?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ from, out, dy = 24, dx = 0, scale = 0.97, dur = 16, style, children }) => {
  const f = useCurrentFrame();
  const p = prog(f, from, dur);
  const q = out === undefined ? 0 : prog(f, out, 12);
  const o = p * (1 - q);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: "absolute",
        opacity: o,
        filter: `blur(${(1 - p) * 8 + q * 6}px)`,
        transform: `translate(${(1 - p) * dx}px, ${(1 - p) * dy - q * 10}px) scale(${
          scale + (1 - scale) * p
        })`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------------- background ---------------- */
export const Bg: React.FC = () => {
  const f = useCurrentFrame();
  const dots = useMemo(
    () =>
      new Array(70).fill(0).map((_, i) => ({
        x: random("x" + i) * 1920,
        y: random("y" + i) * 1080,
        s: 1 + random("s" + i) * 2,
        v: 0.1 + random("v" + i) * 0.35,
        c: [C.purple, C.blue, C.pink, C.text][i % 4],
      })),
    []
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: C.bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(${C.line} 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {dots.map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: d.x,
            top: (d.y - f * d.v + 1080 * 4) % 1080,
            width: d.s,
            height: d.s,
            background: d.c,
            opacity: 0.25,
          }}
        />
      ))}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(139,92,246,0.10), transparent 55%), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.7))",
        }}
      />
    </div>
  );
};

/* ---------------- primitives ---------------- */
export const Card: React.FC<{
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  glow?: string;
  children?: React.ReactNode;
}> = ({ w, h, style, glow, children }) => (
  <div
    style={{
      width: w,
      height: h,
      background: C.card,
      border: `1px solid ${glow ?? C.line}`,
      borderRadius: 14,
      boxShadow: glow
        ? `0 0 0 1px ${glow}, 0 0 40px ${glow}55, 0 20px 50px rgba(0,0,0,0.5)`
        : "0 20px 50px rgba(0,0,0,0.5)",
      fontFamily: F.body,
      color: C.text,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  color?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: number;
  style?: React.CSSProperties;
}> = ({ color = C.purple, icon, children, size = 22, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: size * 0.45,
      padding: `${size * 0.45}px ${size * 0.8}px`,
      background: C.card,
      border: `1px solid ${C.line}`,
      borderRadius: 999,
      fontFamily: F.body,
      fontWeight: 600,
      fontSize: size,
      color: C.text,
      whiteSpace: "nowrap",
      boxShadow: "0 10px 30px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    <span
      style={{
        width: size * 0.55,
        height: size * 0.55,
        borderRadius: 999,
        background: color,
        boxShadow: `0 0 12px ${color}`,
        display: icon ? "none" : "block",
      }}
    />
    {icon}
    {children}
  </div>
);

export const Hl: React.FC<{ on: number; color?: string; children: React.ReactNode }> = ({
  on,
  color = C.purple,
  children,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, on, 12);
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${color}55, ${color}55)`,
        backgroundSize: `${p * 100}% 100%`,
        backgroundRepeat: "no-repeat",
        borderRadius: 4,
        padding: "0 3px",
        color: p > 0.5 ? "#fff" : undefined,
      }}
    >
      {children}
    </span>
  );
};

export const Tick: React.FC<{ on: number; size?: number; color?: string; cross?: boolean }> = ({
  on,
  size = 30,
  color = C.green,
  cross,
}) => {
  const f = useCurrentFrame();
  const p = prog(f, on, 10);
  const s = interpolate(p, [0, 0.7, 1], [0, 1.2, 1]);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: color,
        transform: `scale(${s})`,
        display: "grid",
        placeItems: "center",
        boxShadow: `0 0 18px ${color}88`,
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24">
        {cross ? (
          <path d="M6 6 L18 18 M18 6 L6 18" stroke="#0a0a0f" strokeWidth={3.4} strokeLinecap="round" />
        ) : (
          <path d="M5 12.5 L10 17.5 L19 7" stroke="#0a0a0f" strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        )}
      </svg>
    </div>
  );
};

export const Bar: React.FC<{ w: number; h?: number; c?: string; o?: number }> = ({
  w,
  h = 10,
  c = C.line,
  o = 1,
}) => <div style={{ width: w, height: h, borderRadius: h, background: c, opacity: o }} />;

/** Numbers that count up between two frames. */
export const Count: React.FC<{ from: number; to: number; a: number; b: number; fmt?: (n: number) => string }> = ({
  from,
  to,
  a,
  b,
  fmt = (n) => Math.round(n).toLocaleString("en-US"),
}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [a, b], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  return <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(v)}</span>;
};

/** Typewriter text. */
export const Type: React.FC<{ text: string; a: number; cps?: number; caret?: boolean }> = ({
  text,
  a,
  cps = 16,
  caret = true,
}) => {
  const f = useCurrentFrame();
  const n = Math.max(0, Math.min(text.length, Math.floor(((f - a) / FPS) * cps)));
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <span>
      {text.slice(0, n)}
      {caret && (n < text.length || blink) && f >= a ? (
        <span style={{ color: C.purpleHi }}>|</span>
      ) : null}
    </span>
  );
};

/** Mouse cursor that glides between points and clicks. */
export const Cursor: React.FC<{ path: { f: number; x: number; y: number; click?: boolean }[] }> = ({ path }) => {
  const f = useCurrentFrame();
  if (f < path[0].f - 8) return null;
  let x = path[0].x,
    y = path[0].y,
    click = 0;
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1],
      b = path[i];
    if (f >= a.f) {
      const p = prog(f, a.f, Math.max(1, b.f - a.f));
      x = a.x + (b.x - a.x) * p;
      y = a.y + (b.y - a.y) * p;
    }
  }
  for (const pt of path) if (pt.click && f >= pt.f && f < pt.f + 8) click = 1 - (f - pt.f) / 8;
  const o = prog(f, path[0].f - 8, 8);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o, zIndex: 50 }}>
      {click > 0 && (
        <div
          style={{
            position: "absolute",
            left: -22,
            top: -22,
            width: 44,
            height: 44,
            borderRadius: 99,
            border: `2px solid ${C.purpleHi}`,
            opacity: click,
            transform: `scale(${1.6 - click * 0.6})`,
          }}
        />
      )}
      <svg width="30" height="36" viewBox="0 0 20 24" style={{ transform: `scale(${1 - click * 0.12})` }}>
        <path d="M2 1 L2 19 L7 14.5 L10.5 22 L13.5 20.6 L10 13.3 L17 13.3 Z" fill="#fff" stroke="#000" strokeWidth="1.2" />
      </svg>
    </div>
  );
};

/* ---------------- browser window ---------------- */
export const Browser: React.FC<{
  w: number;
  h: number;
  url: string;
  domain: string;
  glow?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ w, h, url, domain, glow, children, style }) => (
  <Card w={w} h={h} glow={glow} style={{ background: C.bg2, ...style }}>
    <div
      style={{
        height: 52,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "0 18px",
        borderBottom: `1px solid ${C.line}`,
        background: C.card,
      }}
    >
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: 99, background: c }} />
      ))}
      <div
        style={{
          marginLeft: 18,
          flex: 1,
          maxWidth: w * 0.6,
          height: 32,
          borderRadius: 8,
          background: C.bg2,
          border: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          fontFamily: F.mono,
          fontSize: 16,
          color: C.muted,
          whiteSpace: "nowrap",
          overflow: "hidden",
        }}
      >
        <svg width="12" height="14" viewBox="0 0 12 14">
          <rect x="1" y="6" width="10" height="7" rx="1.5" fill={C.muted} />
          <path d="M3.5 6 V4 a2.5 2.5 0 0 1 5 0 V6" stroke={C.muted} strokeWidth="1.5" fill="none" />
        </svg>
        <span style={{ color: C.text }}>{domain}</span>
        <span>{url}</span>
      </div>
    </div>
    <div style={{ position: "relative", width: w, height: h - 52 }}>{children}</div>
  </Card>
);

/* ---------------- post / tweet card ---------------- */
export const Post: React.FC<{
  name: string;
  handle: string;
  avatar: React.ReactNode;
  tag?: string;
  w?: number;
  children: React.ReactNode;
  footer?: boolean;
}> = ({ name, handle, avatar, tag, w = 620, children, footer = true }) => (
  <Card w={w} style={{ padding: "26px 30px 22px" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 52, height: 52, borderRadius: 99, overflow: "hidden", flexShrink: 0 }}>{avatar}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 21, display: "flex", alignItems: "center", gap: 8 }}>
          {name}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="11" fill={C.blue} />
            <path d="M7 12.5 L10.5 16 L17 9" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ color: C.muted, fontSize: 17 }}>{handle}</div>
      </div>
      <svg width="22" height="22" viewBox="0 0 24 24">
        <path d="M5 5 L19 19 M19 5 L5 19" stroke={C.muted} strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    </div>
    {tag && (
      <div style={{ marginTop: 16, color: C.dim, fontSize: 15, display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 14, height: 10, border: `1.5px solid ${C.dim}`, borderRadius: 2 }} />
        {tag}
      </div>
    )}
    <div style={{ marginTop: 14, fontSize: 27, lineHeight: 1.45, color: "#dcdce6" }}>{children}</div>
    {footer && (
      <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between", opacity: 0.45 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} style={{ width: 20, height: 16, border: `1.6px solid ${C.muted}`, borderRadius: i % 2 ? 8 : 3 }} />
        ))}
      </div>
    )}
  </Card>
);

export const Avatar: React.FC<{ letter: string; color: string; size?: number }> = ({ letter, color, size = 52 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: 99,
      background: `linear-gradient(135deg, ${color}, ${color}88)`,
      display: "grid",
      placeItems: "center",
      fontFamily: F.display,
      fontWeight: 800,
      fontSize: size * 0.46,
      color: "#0a0a0f",
    }}
  >
    {letter}
  </div>
);

/* ---------------- mascot: "Blank", a pixel creature whose face is an empty screen ---------------- */
export const MASCOT = [
  "....XXXX....",
  "..XXXXXXXX..",
  ".XXXXXXXXXX.",
  ".XSSSSSSSSX.",
  "XXSSSSSSSSXX",
  "XXSSSSSSSSXX",
  ".XSSSSSSSSX.",
  ".XXXXXXXXXX.",
  "..XXXXXXXX..",
  "..XX....XX..",
  "..XX....XX..",
];

export type Face = "cursor" | "?" | "!" | "ok" | "sad";

export const Mascot: React.FC<{ size?: number; face?: Face; color?: string }> = ({
  size = 120,
  face = "cursor",
  color = C.purple,
}) => {
  const f = useCurrentFrame();
  const px = size / 12;
  const bob = Math.sin(f / 9) * px * 0.35;
  const blink = Math.floor(f / 15) % 2 === 0;
  const faceColor = face === "ok" ? C.green : face === "!" || face === "sad" ? C.red : C.purpleHi;
  return (
    <div style={{ position: "relative", width: size, height: px * 11, transform: `translateY(${bob}px)` }}>
      <svg width={size} height={px * 11} viewBox="0 0 12 11" shapeRendering="crispEdges">
        {MASCOT.flatMap((row, y) =>
          row.split("").map((ch, x) =>
            ch === "." ? null : (
              <rect key={x + "-" + y} x={x} y={y} width={1.02} height={1.02} fill={ch === "X" ? color : "#0b0b12"} />
            )
          )
        )}
        <rect x={2} y={0.6} width={1} height={1} fill="#ffffff55" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: px * 2,
          top: px * 3,
          width: px * 8,
          height: px * 4,
          display: "grid",
          placeItems: "center",
          fontFamily: F.mono,
          fontWeight: 700,
          fontSize: px * 2.6,
          color: faceColor,
          textShadow: `0 0 ${px}px ${faceColor}`,
        }}
      >
        {face === "cursor" ? (blink ? "_" : "") : face === "ok" ? "✓" : face === "sad" ? "x_x" : face}
      </div>
    </div>
  );
};

/** Wraps a scene: fades in/out and adds a slow camera push. */
export const Scene: React.FC<{ from: number; to: number; children: React.ReactNode; push?: number }> = ({
  from,
  to,
  children,
  push = 0.035,
}) => {
  const f = useCurrentFrame();
  if (f < from - 2 || f > to + 12) return null;
  const o = Math.min(prog(f, from, 10), 1 - prog(f, to, 10));
  const s = 1 + interpolate(f, [from, to], [0, push], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, opacity: o, transform: `scale(${s})` }}>{children}</div>
  );
};
