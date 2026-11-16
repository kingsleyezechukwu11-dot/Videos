import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Appear, Avatar, Bar, Card, Chip, Count, Hl, Mascot, Post, Scene, Tick, at, end, prog, word } from "../lib";
import { Particles } from "../Particles";

const CHANNELS = [
  { id: "h1", name: "Zack D. Films", letter: "Z", color: C.red, subs: "29M", what: "3D-animated shorts", cols: [C.red, C.orange] },
  { id: "h2", name: "Bright Side", letter: "B", color: C.yellow, subs: "44M", what: "Animated facts and stories", cols: [C.yellow, C.orange] },
  { id: "h3", name: "Kurzgesagt", letter: "K", color: C.blue, subs: "25M", what: "Science animation", cols: [C.blue, C.cyan] },
];

/* A — three big faceless channels, numbers built from particles */
export const SceneA: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("h1", -0.6),
    to = at("h5", -0.2);
  return (
    <Scene from={from} to={to} push={0.02}>
      <Particles
        until={to}
        stages={[
          ...CHANNELS.map((c) => ({ f: at(c.id, -0.4), text: c.subs, cx: 560, cy: 520, size: 330, colors: c.cols })),
          { f: at("h4", -0.2), mascot: true, cx: 560, cy: 520, size: 30, colors: [C.purple, C.purpleHi] },
        ]}
      />
      <Appear from={at("h1", 0.2)} style={{ left: 300, top: 700 }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, color: C.muted, letterSpacing: 3, width: 520, textAlign: "center" }}>
          {f < at("h4", -0.2) ? "SUBSCRIBERS" : "NO FACE ON CAMERA"}
        </div>
      </Appear>
      {CHANNELS.map((c, i) => {
        const on = at(c.id, -0.1);
        const active = f >= on && (i === 2 || f < at(CHANNELS[i + 1]?.id ?? "h4", -0.1));
        return (
          <Appear key={c.id} from={on} dx={60} dy={0} style={{ left: 1060, top: 250 + i * 190 }}>
            <Card
              w={620}
              h={160}
              glow={active ? c.color : undefined}
              style={{ display: "flex", alignItems: "center", gap: 24, padding: "0 30px", opacity: active || f >= at("h4", -0.2) ? 1 : 0.5 }}
            >
              <Avatar letter={c.letter} color={c.color} size={78} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 20, color: C.muted, marginTop: 6 }}>{c.what}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: F.display, fontSize: 40, fontWeight: 800, color: c.color }}>{c.subs}</div>
                <div style={{ fontSize: 15, color: C.muted }}>subscribers</div>
              </div>
              <div style={{ position: "absolute", right: -14, top: -14 }}>
                {f >= at("h4", 0.2 + i * 0.35) && <Tick on={at("h4", 0.2 + i * 0.35)} size={34} />}
              </div>
            </Card>
          </Appear>
        );
      })}
    </Scene>
  );
};

/* B — the viewer's own channel: a post + flat analytics */
export const SceneB: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("h5", -0.2),
    to = at("h7", -0.2);
  const chartOn = word("h5", "it looks like this");
  const pts = new Array(30).fill(0).map((_, i) => [i * 24, 150 - (i % 7 === 3 ? 18 : i % 5 === 1 ? 10 : 4)]);
  const draw = prog(f, chartOn + 6, 40);
  return (
    <Scene from={from} to={to}>
      <Appear from={at("h5", 0.1)} dx={-40} dy={0} style={{ left: 170, top: 260 }}>
        <Post name="You" handle="@your_channel" avatar={<Avatar letter="Y" color={C.purple} />} tag="Day 60 of the faceless channel" w={680}>
          34 videos uploaded. Sixty days of editing at night.
          <br />
          <Hl on={at("h6", 1.2)} color={C.red}>311 views. Total.</Hl> Is the algorithm broken?
        </Post>
      </Appear>
      <Appear from={chartOn} dx={40} dy={0} style={{ left: 960, top: 230 }}>
        <Card w={780} h={540} style={{ padding: 34 }}>
          <div style={{ fontSize: 20, color: C.muted }}>Channel analytics · last 60 days</div>
          <div style={{ display: "flex", gap: 50, marginTop: 22 }}>
            {[
              { k: "Videos", v: <Count from={0} to={34} a={at("h6")} b={at("h6", 1)} />, c: C.text },
              { k: "Views", v: <Count from={0} to={311} a={at("h6", 0.8)} b={at("h6", 2.2)} />, c: C.red },
              { k: "Subscribers", v: <Count from={0} to={9} a={at("h6", 0.8)} b={at("h6", 2.2)} />, c: C.text },
            ].map((s) => (
              <div key={s.k}>
                <div style={{ fontSize: 18, color: C.muted }}>{s.k}</div>
                <div style={{ fontFamily: F.display, fontSize: 64, fontWeight: 800, color: s.c }}>{s.v}</div>
              </div>
            ))}
          </div>
          <svg width={712} height={260} style={{ marginTop: 18 }}>
            {[60, 130, 200].map((y) => (
              <line key={y} x1={0} x2={712} y1={y} y2={y} stroke={C.line} strokeDasharray="4 6" />
            ))}
            <polyline
              points={pts.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={C.red}
              strokeWidth={4}
              strokeDasharray={1000}
              strokeDashoffset={1000 - draw * 1000}
              strokeLinejoin="round"
            />
          </svg>
        </Card>
      </Appear>
      <Appear from={at("h6", 2.4)} style={{ left: 1775, top: 640 }}>
        <Mascot size={110} face="sad" />
      </Appear>
    </Scene>
  );
};

/* C — "three things" + the roadmap of the video */
export const SceneC: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("h7", -0.2),
    to = at("r1", -0.3);
  const roadmapOn = at("h8", -0.1);
  const nodes = [
    { t: "What they do right", c: C.green, on: word("h8", "what they do right") },
    { t: "What you're doing wrong", c: C.red, on: word("h8", "where you're probably") },
    { t: "Step by step", c: C.purple, on: word("h8", "build a channel") },
    { t: "The exact sites to open", c: C.blue, on: word("h8", "the exact sites") },
  ];
  return (
    <Scene from={from} to={to}>
      {/* three unknowns */}
      <Appear from={at("h7")} out={roadmapOn} style={{ left: 0, top: 300, width: 1920, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <Mascot size={150} face="?" />
          <div style={{ display: "flex", gap: 26 }}>
            {[C.orange, C.yellow, C.blue].map((c, i) => {
              const on = word("h7", "three things", i * 0.25);
              return (
                <Appear key={i} from={on} style={{ position: "relative" }}>
                  <Card w={250} h={300} glow={f > on + 6 ? c : undefined} style={{ display: "grid", placeItems: "center" }}>
                    <div style={{ fontFamily: F.display, fontSize: 130, fontWeight: 800, color: c }}>{i + 1}</div>
                  </Card>
                </Appear>
              );
            })}
          </div>
        </div>
      </Appear>
      <Appear from={word("h7", "most new faceless")} out={roadmapOn} style={{ left: 0, top: 690, width: 1920, textAlign: "center" }}>
        <div style={{ fontSize: 34, fontFamily: F.body, color: C.muted }}>
          that most new faceless channels <span style={{ color: C.red, fontWeight: 700 }}>get wrong</span>
        </div>
      </Appear>
      {/* roadmap */}
      <div style={{ position: "absolute", left: 160, top: 470, width: 1600, height: 140 }}>
        <svg width={1600} height={140} style={{ position: "absolute", inset: 0 }}>
          <line x1={150} x2={1450} y1={70} y2={70} stroke={C.line} strokeWidth={3} />
          <line x1={150} x2={150 + 1300 * prog(f, roadmapOn + 4, 9.5 * 30)} y1={70} y2={70} stroke={C.purple} strokeWidth={3} />
        </svg>
        {nodes.map((n, i) => (
          <Appear key={n.t} from={n.on} style={{ left: i * 433, top: 40, width: 300, display: "flex", justifyContent: "center" }}>
            <Chip color={n.c} size={24}>
              {n.t}
            </Chip>
          </Appear>
        ))}
      </div>
      <Appear from={roadmapOn + 4} style={{ left: 880, top: 250 }}>
        <Mascot size={150} face={f > word("h8", "step by step") ? "ok" : "cursor"} />
      </Appear>
    </Scene>
  );
};
