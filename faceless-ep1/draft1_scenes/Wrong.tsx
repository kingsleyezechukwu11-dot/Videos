import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Appear, Bar, Browser, Card, Chip, Hl, Mascot, Scene, Tick, at, prog, word } from "../lib";
import { Particles } from "../Particles";
import { Thumb } from "./Right";

const Icon: React.FC<{ kind: string; c: string }> = ({ kind, c }) => (
  <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    {kind === "list" && <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />}
    {kind === "ai" && <path d="M12 3l2.2 5.6L20 11l-5.8 2.4L12 19l-2.2-5.6L4 11l5.8-2.4z" />}
    {kind === "voice" && <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" />}
    {kind === "film" && <path d="M4 5h16v14H4zM8 5v14M16 5v14M4 9h4M4 15h4M16 9h4M16 15h4" />}
    {kind === "up" && <path d="M12 16V5M7 10l5-5 5 5M5 19h14" />}
  </svg>
);

/* E — the usual faceless setup, repeated thirty times */
export const SceneE: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("w1", -0.3),
    to = at("w3", -0.2);
  const steps = [
    { t: "“Most profitable niches” list", k: "list", c: C.orange, on: word("w2", "Pick a niche") },
    { t: "AI writes the script", k: "ai", c: C.purpleHi, on: word("w2", "Ask AI") },
    { t: "Paste into a voice tool", k: "voice", c: C.yellow, on: word("w2", "Paste it") },
    { t: "Cover with stock footage", k: "film", c: C.blue, on: word("w2", "Cover it") },
    { t: "Upload", k: "up", c: C.red, on: word("w2", "Upload") },
  ];
  const repeatOn = word("w2", "Then do it again");
  const pipeOut = repeatOn + 4;
  return (
    <Scene from={from} to={to}>
      <Appear from={from + 2} style={{ left: 90, top: 70 }}>
        <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.red }}>WHAT YOU'RE PROBABLY DOING</div>
      </Appear>
      <Appear from={at("w1", 0.1)} out={steps[0].on - 2} style={{ left: 0, width: 1920, top: 480, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 64, fontWeight: 700, color: C.text }}>
          The usual <span style={{ color: C.red }}>faceless setup</span>
        </div>
      </Appear>
      <div style={{ position: "absolute", left: 120, top: 400, display: "flex", alignItems: "center", gap: 0, opacity: 1 - prog(f, pipeOut, 12) }}>
        {steps.map((s, i) => (
          <React.Fragment key={s.t}>
            <Appear from={s.on} style={{ position: "relative" }}>
              <Card w={270} h={250} glow={f >= s.on && f < (steps[i + 1]?.on ?? repeatOn) ? s.c : undefined} style={{ padding: 26, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Icon kind={s.k} c={s.c} />
                <div style={{ fontSize: 24, fontWeight: 600, lineHeight: 1.25 }}>{s.t}</div>
              </Card>
            </Appear>
            {i < 4 && (
              <div style={{ width: 70, height: 4, margin: "0 0", background: C.line, position: "relative", left: 0 }}>
                <div style={{ width: `${prog(f, steps[i + 1].on - 6, 10) * 100}%`, height: 4, background: C.purple }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* ×30 identical uploads */}
      <div style={{ position: "absolute", left: 160, top: 210, display: "grid", gridTemplateColumns: "repeat(6, 250px)", gap: 18 }}>
        {new Array(30).fill(0).map((_, k) => (
          <Appear key={k} from={repeatOn + 6 + k * 1.2} dur={10} style={{ position: "relative" }}>
            <Thumb w={250} h={128} a="#3a3a4a" b="#22222c" motif="grey" dur="8:00" />
          </Appear>
        ))}
      </div>
      <Appear from={repeatOn + 30} style={{ left: 1500, top: 830 }}>
        <div style={{ fontFamily: F.display, fontSize: 120, fontWeight: 800, color: C.red, textShadow: `0 0 40px ${C.red}88` }}>×30</div>
      </Appear>
    </Scene>
  );
};

/* F — YouTube's inauthentic-content policy */
export const SceneF: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("w3", -0.2),
    to = at("w6", -0.2);
  const scan = interpolate(f, [at("w3"), at("w3", 2.6)], [180, 900], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardOn = at("w4", -0.1);
  const strike = prog(f, word("w4", "to inauthentic"), 14);
  return (
    <Scene from={from} to={to} push={0.025}>
      {/* the grid from before, being scanned */}
      <div style={{ position: "absolute", left: 160, top: 210, display: "grid", gridTemplateColumns: "repeat(6, 250px)", gap: 18, opacity: 1 - prog(f, cardOn, 12) }}>
        {new Array(30).fill(0).map((_, k) => {
          const hit = scan > 210 + Math.floor(k / 6) * 146;
          return (
            <div key={k} style={{ position: "relative", outline: hit ? `2px solid ${C.red}` : "none", borderRadius: 10 }}>
              <Thumb w={250} h={128} a={hit ? "#5a2a2a" : "#3a3a4a"} b="#22222c" motif="grey" dur="8:00" />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 120, width: 1680, top: scan, height: 4, background: C.red, boxShadow: `0 0 30px ${C.red}`, opacity: 1 - prog(f, cardOn, 8) }} />

      {/* policy card */}
      <Appear from={cardOn} style={{ left: 330, top: 250 }}>
        <Card w={1000} style={{ padding: "34px 40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: C.red, display: "grid", placeItems: "center" }}>
              <svg width="26" height="26" viewBox="0 0 24 24">
                <path d="M8 5 L19 12 L8 19 Z" fill="#fff" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 700 }}>YouTube · Monetization policy update</div>
              <div style={{ fontSize: 18, color: C.muted }}>July 15, 2025</div>
            </div>
          </div>
          <div style={{ marginTop: 30, fontSize: 40, fontWeight: 700, display: "flex", gap: 22, alignItems: "center", fontFamily: F.display }}>
            <span style={{ position: "relative", color: strike > 0 ? C.muted : C.text }}>
              “Repetitious content”
              <span style={{ position: "absolute", left: 0, top: "52%", height: 4, width: `${strike * 100}%`, background: C.red }} />
            </span>
            <span style={{ color: C.muted, opacity: strike }}>→</span>
            <span style={{ color: C.yellow, opacity: strike }}>“Inauthentic content”</span>
          </div>
          <div style={{ marginTop: 26, fontSize: 30, lineHeight: 1.5, color: "#d8d8e2" }}>
            Covers content that is <Hl on={word("w4", "mass-produced")} color={C.red}>mass-produced or repetitive.</Hl>
          </div>
        </Card>
      </Appear>
      <Appear from={cardOn + 10} style={{ left: 1400, top: 300 }}>
        <Mascot size={150} face="!" />
      </Appear>
      {/* AI ok, templates not */}
      <Appear from={word("w5", "Using AI")} style={{ left: 330, top: 720 }}>
        <Card w={480} h={120} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 30px" }}>
          <Tick on={word("w5", "allowed")} size={46} />
          <div style={{ fontSize: 30, fontWeight: 600 }}>Using AI</div>
        </Card>
      </Appear>
      <Appear from={word("w5", "Uploading the same")} style={{ left: 850, top: 720 }}>
        <Card w={480} h={120} glow={C.red} style={{ display: "flex", alignItems: "center", gap: 20, padding: "0 30px" }}>
          <Tick on={word("w5", "isn't")} size={46} color={C.red} cross />
          <div style={{ fontSize: 30, fontWeight: 600 }}>Same template ×30</div>
        </Card>
      </Appear>
    </Scene>
  );
};

/* G — the Trending page is gone → Charts, then "step by step" */
export const SceneG: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("w6", -0.2),
    to = at("s1a", -0.3);
  const gone = word("w6", "it's gone");
  const charts = word("w6", "replaced it with Charts");
  const stepOn = at("w7", -0.1);
  return (
    <Scene from={from} to={to}>
      <Appear from={at("w6")} out={stepOn} dx={-30} dy={0} style={{ left: 160, top: 200 }}>
        <Browser w={900} h={620} domain="youtube.com" url="/feed/trending">
          <div style={{ padding: 30, opacity: 1 - prog(f, gone, 14) * 0.75, filter: `grayscale(${prog(f, gone, 14)})` }}>
            <div style={{ fontSize: 30, fontWeight: 700, color: C.text }}>Trending</div>
            {[0, 1, 2].map((k) => (
              <div key={k} style={{ display: "flex", gap: 20, marginTop: 24 }}>
                <Thumb w={260} h={140} a={[C.red, C.orange, C.blue][k]} b="#111" motif={(["spark", "planet", "bars"] as const)[k]} />
                <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingTop: 10 }}>
                  <Bar w={360} h={16} c={C.line} />
                  <Bar w={240} h={12} c={C.line} o={0.6} />
                  <Bar w={180} h={12} c={C.line} o={0.6} />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              position: "absolute",
              left: 260,
              top: 230,
              padding: "16px 30px",
              border: `4px solid ${C.red}`,
              borderRadius: 12,
              color: C.red,
              fontFamily: F.display,
              fontWeight: 800,
              fontSize: 44,
              transform: `rotate(-8deg) scale(${interpolate(prog(f, gone, 10), [0, 1], [1.6, 1])})`,
              opacity: prog(f, gone, 6),
              background: "#0a0a0fcc",
            }}
          >
            REMOVED · JULY 2025
          </div>
        </Browser>
      </Appear>
      <Appear from={charts} out={stepOn} dx={40} dy={0} style={{ left: 1140, top: 300 }}>
        <Card w={620} style={{ padding: 30 }} glow={C.blue}>
          <div style={{ fontSize: 30, fontWeight: 700 }}>YouTube Charts</div>
          <div style={{ fontSize: 18, color: C.muted, marginTop: 4 }}>What replaced it</div>
          {["Trending music videos", "Top podcast shows", "Trending movie trailers"].map((t, k) => (
            <Appear key={t} from={charts + 8 + k * 5} style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 22, fontSize: 24 }}>
                <span style={{ width: 12, height: 12, borderRadius: 99, background: [C.pink, C.yellow, C.orange][k] }} />
                {t}
              </div>
            </Appear>
          ))}
          <div style={{ marginTop: 26, fontSize: 19, color: C.muted }}>Not built for finding video ideas in your niche.</div>
        </Card>
      </Appear>
      <Particles until={to} stages={[{ f: stepOn, text: "STEP BY STEP", cx: 960, cy: 540, size: 170, colors: [C.purple, C.purpleHi, C.blue, C.pink] }]} />
    </Scene>
  );
};
