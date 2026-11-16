import React from "react";
import { useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Appear, Avatar, Card, Chip, Cursor, Scene, Tick, at, prog, word } from "../lib";

/** A video thumbnail drawn in code (no stock images). */
export const Thumb: React.FC<{ w: number; h: number; a: string; b: string; motif?: "planet" | "ring" | "bars" | "spark" | "grey"; dur?: string }> = ({
  w,
  h,
  a,
  b,
  motif = "planet",
  dur = "8:14",
}) => (
  <div style={{ position: "relative", width: w, height: h, borderRadius: 10, overflow: "hidden", background: `linear-gradient(135deg, ${a}, ${b})`, flexShrink: 0 }}>
    {motif === "planet" && (
      <>
        <div style={{ position: "absolute", width: h * 0.7, height: h * 0.7, borderRadius: 999, left: w * 0.52, top: h * 0.16, background: `radial-gradient(circle at 35% 35%, #fff8, ${b} 60%)` }} />
        <div style={{ position: "absolute", width: h * 1.1, height: h * 0.18, borderRadius: 999, left: w * 0.42, top: h * 0.42, border: `3px solid #fff7`, transform: "rotate(-14deg)" }} />
      </>
    )}
    {motif === "ring" && <div style={{ position: "absolute", width: h * 0.6, height: h * 0.6, borderRadius: 999, left: w / 2 - h * 0.3, top: h * 0.2, border: `${h * 0.08}px solid #fff9` }} />}
    {motif === "bars" &&
      [0.3, 0.55, 0.8].map((v, i) => (
        <div key={i} style={{ position: "absolute", bottom: 0, left: w * (0.15 + i * 0.25), width: w * 0.16, height: h * v, background: "#fff6", borderRadius: "6px 6px 0 0" }} />
      ))}
    {motif === "spark" && <div style={{ position: "absolute", left: w * 0.1, top: h * 0.2, fontSize: h * 0.5, fontWeight: 900, color: "#fffc", fontFamily: F.display }}>?!</div>}
    {motif === "grey" && <div style={{ position: "absolute", left: w * 0.1, top: h * 0.35, width: w * 0.8, height: h * 0.12, background: "#ffffff22", borderRadius: 4 }} />}
    <div style={{ position: "absolute", right: 6, bottom: 6, background: "#000c", color: "#fff", fontSize: Math.max(11, h * 0.11), padding: "1px 5px", borderRadius: 4, fontFamily: F.body, fontWeight: 600 }}>{dur}</div>
  </div>
);

/* D — what the big channels do right */
export const SceneD: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("r1", -0.3),
    to = at("w1", -0.3);
  const s2 = at("r3", -0.1),
    s3 = at("r4", -0.1);

  return (
    <Scene from={from} to={to} push={0.02}>
      {/* section label */}
      <Appear from={from + 2} style={{ left: 90, top: 70 }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.green }}>WHAT THEY DO RIGHT</div>
      </Appear>

      {/* 1 — own one idea */}
      <Appear from={at("r1")} out={s2 - 4} style={{ left: 0, width: 1920, top: 130, display: "flex", justifyContent: "center" }}>
        <MovingChip on={at("r1")} label="1 · Own one idea" color={C.orange} />
      </Appear>
      {[
        { on: word("r2", "Kurzgesagt"), name: "Kurzgesagt", letter: "K", c: C.blue, tag: "Big science questions · same look", th: [[C.blue, "#1e3a8a"], ["#0ea5e9", "#1e3a8a"], ["#6366f1", "#1e3a8a"], ["#22d3ee", "#1e40af"]] },
        { on: word("r2", "Zack D. Films"), name: "Zack D. Films", letter: "Z", c: C.red, tag: "One strange question · under 60 s", th: [[C.red, "#7f1d1d"], [C.orange, "#7f1d1d"], ["#f43f5e", "#7f1d1d"], ["#fb923c", "#7c2d12"]] },
      ].map((ch, i) => (
        <Appear key={ch.name} from={ch.on} out={s2 - 4} dy={30} style={{ left: 200 + i * 790, top: 300 }}>
          <Card w={730} h={420} glow={ch.c} style={{ padding: 30 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Avatar letter={ch.letter} color={ch.c} size={56} />
              <div>
                <div style={{ fontSize: 26, fontWeight: 700 }}>{ch.name}</div>
                <div style={{ fontSize: 18, color: ch.c }}>{ch.tag}</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
              {ch.th.map(([a, b], k) => (
                <Appear key={k} from={ch.on + 6 + k * 4} style={{ position: "relative" }}>
                  <Thumb w={325} h={120} a={a} b={b} motif={i === 0 ? "planet" : "spark"} dur={i === 0 ? ["10:12", "9:48", "11:03", "12:20"][k] : "0:" + (41 + k * 4)} />
                </Appear>
              ))}
            </div>
          </Card>
        </Appear>
      ))}
      <Cursor path={[{ f: word("r2", "before you click"), x: 1300, y: 900 }, { f: word("r2", "before you click", 0.6), x: 1160, y: 560, click: true }]} />

      {/* 2 — picture and voice made for each other */}
      <Appear from={s2} out={s3 - 4} style={{ left: 0, width: 1920, top: 130, display: "flex", justifyContent: "center" }}>
        <Chip color={C.yellow} size={30}>2 · Picture and voice, made together</Chip>
      </Appear>
      <Appear from={s2 + 8} out={s3 - 4} style={{ left: 210, top: 330 }}>
        <Card w={1500} h={430} style={{ padding: 36 }}>
          <div style={{ fontFamily: F.mono, fontSize: 18, color: C.muted }}>VOICE</div>
          <svg width={1428} height={90} style={{ marginTop: 10 }}>
            {new Array(120).fill(0).map((_, i) => {
              const h = 10 + Math.abs(Math.sin(i * 1.7) * 30 + Math.sin(i * 0.33) * 25);
              const lit = prog(f, s2 + 10, 110) * 120 > i;
              return <rect key={i} x={i * 11.9} y={45 - h / 2} width={6} height={h} rx={3} fill={lit ? C.yellow : C.line} />;
            })}
          </svg>
          <div style={{ fontFamily: F.mono, fontSize: 18, color: C.muted, marginTop: 30 }}>PICTURE</div>
          <div style={{ display: "flex", gap: 14, marginTop: 12 }}>
            {[C.purple, C.blue, C.orange, C.red, C.green, C.pink].map((c, k) => {
              const on = s2 + 14 + k * 17;
              return (
                <Appear key={k} from={on} dy={16} style={{ position: "relative" }}>
                  <div style={{ position: "relative" }}>
                    <Thumb w={226} h={130} a={c} b="#111" motif={(["ring", "bars", "planet", "spark", "ring", "bars"] as const)[k]} dur={`0:${String(k * 4 + 2).padStart(2, "0")}`} />
                    <div style={{ position: "absolute", left: 0, top: -64, width: 2, height: 60, background: C.yellow, opacity: 0.6 }} />
                  </div>
                </Appear>
              );
            })}
          </div>
        </Card>
      </Appear>

      {/* 3 — nothing copied */}
      <Appear from={s3} style={{ left: 0, width: 1920, top: 130, display: "flex", justifyContent: "center" }}>
        <Chip color={C.blue} size={30}>3 · Nothing copied</Chip>
      </Appear>
      <div style={{ position: "absolute", left: 270, top: 300, display: "grid", gridTemplateColumns: "repeat(4, 330px)", gap: 24 }}>
        {[
          [C.purple, "ring"],
          [C.orange, "planet"],
          [C.blue, "bars"],
          [C.red, "spark"],
          [C.green, "planet"],
          [C.yellow, "ring"],
          [C.pink, "bars"],
          [C.cyan, "spark"],
        ].map(([c, m], k) => (
          <Appear key={k} from={s3 + 6 + k * 3} style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <Thumb w={330} h={186} a={c} b="#0f0f18" motif={m as "ring"} dur={`${7 + k}:${String((k * 13) % 60).padStart(2, "0")}`} />
              <div style={{ position: "absolute", right: -10, top: -10 }}>
                <Tick on={word("r4", "new idea", k * 0.08)} size={30} />
              </div>
            </div>
          </Appear>
        ))}
      </div>
    </Scene>
  );
};

const MovingChip: React.FC<{ on: number; label: string; color: string }> = ({ on, label, color }) => {
  const f = useCurrentFrame();
  const p = prog(f, on + 22, 16);
  return (
    <div style={{ transform: `translateY(${(1 - p) * 330}px) scale(${1.6 - 0.6 * p})` }}>
      <Chip color={color} size={30}>
        {label}
      </Chip>
    </div>
  );
};
