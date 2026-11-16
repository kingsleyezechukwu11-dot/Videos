import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Appear, Avatar, Card, Chip, Count, Hl, Scene, Tick, at, end, prog, word } from "../lib";
import { Particles, solidAt } from "../Particles";
import { Screen, Seg, Cam, clipFrame } from "../Screen";

/* ============ A · the big faceless channels (real channel pages) ============ */
const BIG = [
  { id: "a1", key: "zack", subs: "29.7M", subsX: 307, cols: [C.red, C.orange], url: "/@zackdfilms" },
  { id: "a2", key: "bright", subs: "44.5M", subsX: 377, cols: [C.yellow, C.orange], url: "/@BRIGHTSIDEOFFICIAL" },
  { id: "a3", key: "kurz", subs: "25.8M", subsX: 309, cols: [C.blue, C.cyan], url: "/@kurzgesagt" },
];

const HeaderShot: React.FC<{ k: string; subsX: number; color: string; on: number; url: string }> = ({ k, subsX, color, on, url }) => {
  const f = useCurrentFrame();
  const W = 980;
  const cropX = 190; // header screenshot has empty space on the left
  const s = W / (1360 - cropX - 60);
  const box = prog(f, on + 14, 12);
  return (
    <div style={{ width: W, borderRadius: 14, overflow: "hidden", border: `1px solid ${C.line}`, boxShadow: "0 30px 70px rgba(0,0,0,.55)" }}>
      <div style={{ height: 44, display: "flex", alignItems: "center", gap: 9, padding: "0 16px", background: C.card }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: 99, background: c }} />
        ))}
        <div style={{ marginLeft: 14, fontFamily: F.mono, fontSize: 16, color: C.muted }}>
          <span style={{ color: C.text }}>youtube.com</span>
          {url}
        </div>
      </div>
      <div style={{ position: "relative", height: 200 * s, background: "#fff", overflow: "hidden" }}>
        <Img src={staticFile(`rec/head_${k}.png`)} style={{ position: "absolute", left: -cropX * s, top: -8 * s, width: 1360 * s }} />
        <div
          style={{
            position: "absolute",
            left: (subsX - cropX - 8) * s,
            top: (68 - 14) * s,
            width: (116 + 16) * s,
            height: (20 + 20) * s,
            border: `3px solid ${color}`,
            borderRadius: 10,
            opacity: box,
            transform: `scale(${1.25 - 0.25 * box})`,
            boxShadow: `0 0 20px ${color}88`,
          }}
        />
      </div>
    </div>
  );
};

export const SA: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("a1", -0.4),
    to = at("b1", -0.15);
  const face = at("a4", -0.1);
  return (
    <Scene from={from} to={to} push={0.015}>
      <Particles
        until={face}
        stages={BIG.map((b, i) => ({ f: i === 0 ? from : at(b.id, -0.25), text: b.subs, cx: 960, cy: 300, size: 250, colors: b.cols }))}
      />
      <Appear from={from + 8} out={face} style={{ left: 0, width: 1920, top: 440, textAlign: "center" }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: 5, color: C.muted }}>SUBSCRIBERS</div>
      </Appear>
      {BIG.map((b, i) => {
        const on = i === 0 ? from + 10 : at(b.id, -0.1);
        const off = i < 2 ? at(BIG[i + 1].id, -0.15) : face;
        return (
          <Appear key={b.key} from={on} out={off} dy={40} style={{ left: 470, top: 530 }}>
            <HeaderShot k={b.key} subsX={b.subsX} color={b.cols[0]} on={on} url={b.url} />
          </Appear>
        );
      })}
      {/* a4 — none of them are built around a face */}
      <Appear from={face + 4} style={{ left: 0, width: 1920, top: 330, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 84, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>
          None of them are built
          <br />
          around a <Hl on={word("a4", "face")} color={C.purple}>face.</Hl>
        </div>
      </Appear>
      <div style={{ position: "absolute", left: 0, width: 1920, top: 620, display: "flex", justifyContent: "center", gap: 26 }}>
        {[
          ["Zack D. Films", C.red],
          ["Bright Side", C.yellow],
          ["Kurzgesagt", C.blue],
        ].map(([n, c], i) => (
          <Appear key={n} from={face + 10 + i * 4} style={{ position: "relative" }}>
            <Chip color={c} size={26}>
              {n}
            </Chip>
          </Appear>
        ))}
      </div>
    </Scene>
  );
};

/* ============ B · your channel, the template, the policy ============ */
export const SB: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("b1", -0.15),
    to = at("b2", -0.15);
  const pts = new Array(30).fill(0).map((_, i) => [i * 23, 120 - (i % 7 === 3 ? 16 : i % 5 === 1 ? 9 : 3)]);
  return (
    <Scene from={from} to={to}>
      <Appear from={from + 2} dx={-40} dy={0} style={{ left: 140, top: 300 }}>
        <Card w={720} style={{ padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar letter="Y" color={C.purple} size={56} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 24 }}>Your channel</div>
              <div style={{ color: C.muted, fontSize: 19 }}>@your_channel · day 60</div>
            </div>
          </div>
          <div style={{ marginTop: 22, fontSize: 32, lineHeight: 1.45, color: "#e2e2ea" }}>
            34 videos. Every night editing.
            <br />
            <Hl on={word("b1", "three hundred")} color={C.red}>311 views. Total.</Hl>
          </div>
        </Card>
      </Appear>
      <Appear from={from + 8} dx={40} dy={0} style={{ left: 960, top: 270 }}>
        <Card w={820} style={{ padding: 34 }}>
          <div style={{ fontSize: 21, color: C.muted }}>Channel analytics · last 60 days</div>
          <div style={{ display: "flex", gap: 60, marginTop: 18 }}>
            {[
              ["Views", 311, C.red],
              ["Subscribers", 9, C.text],
            ].map(([k, v, c]) => (
              <div key={k as string}>
                <div style={{ fontSize: 19, color: C.muted }}>{k}</div>
                <div style={{ fontFamily: F.display, fontSize: 76, fontWeight: 800, color: c as string }}>
                  <Count from={0} to={v as number} a={from + 10} b={from + 50} />
                </div>
              </div>
            ))}
          </div>
          <svg width={752} height={150} style={{ marginTop: 10 }}>
            {[40, 90, 140].map((y) => (
              <line key={y} x1={0} x2={752} y1={y} y2={y} stroke={C.line} strokeDasharray="4 6" />
            ))}
            <polyline
              points={pts.map((p) => p.join(",")).join(" ")}
              fill="none"
              stroke={C.red}
              strokeWidth={4}
              strokeDasharray={900}
              strokeDashoffset={900 - prog(f, from + 12, 40) * 900}
              strokeLinejoin="round"
            />
          </svg>
        </Card>
      </Appear>
    </Scene>
  );
};

/** Boxes linked to each other by short connectors (no long line underneath). */
const Flow: React.FC<{ items: { t: string; on: number; c: string; icon: string }[]; loopOn: number }> = ({ items, loopOn }) => {
  const f = useCurrentFrame();
  const BW = 270,
    GAP = 86,
    BH = 190;
  const total = items.length * BW + (items.length - 1) * GAP;
  return (
    <div style={{ position: "absolute", left: (1920 - total) / 2, top: 360, width: total, height: 420 }}>
      {items.map((it, i) => {
        const x = i * (BW + GAP);
        const lit = f >= it.on;
        return (
          <React.Fragment key={it.t}>
            <Appear from={it.on} dy={20} style={{ left: x, top: 0 }}>
              <Card w={BW} h={BH} glow={lit && (items[i + 1] ? f < items[i + 1].on : f < loopOn) ? it.c : undefined} style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div style={{ width: 50, height: 50, borderRadius: 12, background: it.c + "26", display: "grid", placeItems: "center", fontSize: 28, color: it.c, fontWeight: 800, fontFamily: F.display }}>{it.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 650, lineHeight: 1.2 }}>{it.t}</div>
              </Card>
            </Appear>
            {i < items.length - 1 && (
              <svg style={{ position: "absolute", left: x + BW + 6, top: BH / 2 - 12 }} width={GAP - 12} height={24}>
                <line x1={0} y1={12} x2={(GAP - 22) * prog(f, items[i + 1].on - 8, 8)} y2={12} stroke={C.purpleHi} strokeWidth={3} strokeLinecap="round" />
                {f >= items[i + 1].on && <path d={`M${GAP - 24} 4 L${GAP - 14} 12 L${GAP - 24} 20`} stroke={C.purpleHi} strokeWidth={3} fill="none" strokeLinecap="round" />}
              </svg>
            )}
          </React.Fragment>
        );
      })}
      {/* loop back: last box → first box, drawn under the row, never through text */}
      <svg style={{ position: "absolute", left: 0, top: BH + 6 }} width={total} height={110}>
        <path
          d={`M ${total - BW / 2} 0 L ${total - BW / 2} 60 Q ${total - BW / 2} 80 ${total - BW / 2 - 20} 80 L ${BW / 2 + 20} 80 Q ${BW / 2} 80 ${BW / 2} 60 L ${BW / 2} 8`}
          fill="none"
          stroke={C.red}
          strokeWidth={3}
          strokeDasharray={2200}
          strokeDashoffset={2200 - prog(f, loopOn, 20) * 2200}
          strokeLinecap="round"
        />
        {f > loopOn + 18 && <path d={`M ${BW / 2 - 9} 18 L ${BW / 2} 6 L ${BW / 2 + 9} 18`} stroke={C.red} strokeWidth={3} fill="none" strokeLinecap="round" />}
      </svg>
      <Appear from={loopOn + 16} style={{ left: total / 2 - 110, top: BH + 110 }}>
        <Chip color={C.red} size={30}>
          ×30 uploads
        </Chip>
      </Appear>
    </div>
  );
};

export const SC: React.FC = () => {
  const from = at("b2", -0.15),
    to = at("b3", -0.15);
  return (
    <Scene from={from} to={to} push={0.02}>
      <Appear from={from + 2} style={{ left: 0, width: 1920, top: 190, textAlign: "center" }}>
        <div style={{ fontFamily: F.display, fontSize: 60, fontWeight: 800, color: C.text }}>
          The <span style={{ color: C.red }}>same template</span> as everyone
        </div>
      </Appear>
      <Flow
        items={[
          { t: "Niche from a list", on: word("b2", "a niche from"), c: C.orange, icon: "1" },
          { t: "AI script", on: word("b2", "an AI script"), c: C.purpleHi, icon: "2" },
          { t: "Stock footage", on: word("b2", "stock footage"), c: C.blue, icon: "3" },
          { t: "Upload", on: word("b2", "upload"), c: C.green, icon: "4" },
          { t: "Repeat", on: word("b2", "repeat"), c: C.red, icon: "↺" },
        ]}
        loopOn={word("b2", "repeat", 0.1)}
      />
    </Scene>
  );
};

export const SD: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("b3", -0.15),
    to = at("c1", -0.15);
  const strike = prog(f, word("b3", "updated its rules"), 14);
  return (
    <Scene from={from} to={to} push={0.02}>
      <Appear from={from + 2} style={{ left: 260, top: 260 }}>
        <Card w={1400} style={{ padding: "40px 50px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 62, height: 62, borderRadius: 14, background: C.red, display: "grid", placeItems: "center" }}>
              <svg width="28" height="28" viewBox="0 0 24 24">
                <path d="M8 5 L19 12 L8 19 Z" fill="#fff" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>YouTube · Monetization policy update</div>
              <div style={{ fontSize: 21, color: C.muted }}>July 15, 2025</div>
            </div>
          </div>
          <div style={{ marginTop: 40, fontSize: 52, fontWeight: 800, display: "flex", gap: 28, alignItems: "center", fontFamily: F.display }}>
            <span style={{ position: "relative", color: strike > 0.5 ? C.muted : C.text }}>
              “Repetitious content”
              <span style={{ position: "absolute", left: 0, top: "54%", height: 5, width: `${strike * 100}%`, background: C.red, borderRadius: 3 }} />
            </span>
            <span style={{ color: C.muted, opacity: strike }}>→</span>
            <span style={{ color: C.yellow, opacity: strike }}>“Inauthentic content”</span>
          </div>
          <div style={{ marginTop: 34, fontSize: 40, lineHeight: 1.45, color: "#e2e2ea" }}>
            Covers content that is <Hl on={word("b3", "mass-produced")} color={C.red}>mass-produced or repetitive.</Hl>
          </div>
        </Card>
      </Appear>
    </Scene>
  );
};

/* ============ C · step 1, with real screen recordings ============ */
export const SE: React.FC = () => {
  const from = at("c1", -0.15),
    to = at("c2", -0.35);
  const st = { f: from, text: "PROOF", cx: 960, cy: 430, size: 300, colors: [C.purple, C.purpleHi, C.pink] };
  return (
    <Scene from={from} to={to} push={0.02}>
      <Particles until={to - 4} stages={[st]} />
      <Appear from={solidAt(st) - 6} style={{ left: 0, width: 1920, top: 640, display: "flex", justifyContent: "center" }}>
        <Chip color={C.purple} size={34}>
          Step 1 · Pick a niche with proof
        </Chip>
      </Appear>
    </Scene>
  );
};

export const ytSegs = (): Seg[] => [
  { at: at("c2", -0.35), src: "rec/youtube/clip.mp4", from: 2.0, rate: 1.75 },
  { at: word("c2", "Open Filters", -0.45), src: "rec/youtube/clip.mp4", from: 9.25, rate: 1.0 },
  { at: word("c2", "and pick This year", -0.25), src: "rec/youtube/clip.mp4", from: 12.5, rate: 1.0 },
  { at: at("c3", -0.1), src: "rec/youtube/clip.mp4", from: 15.6, rate: 3.0 },
  { at: at("c4", -0.1), src: "rec/channel/clip.mp4", from: 0.8, rate: 1.0 },
  { at: word("c4", "Six hundred", -0.2), src: "rec/youtube/clip.mp4", from: 24.7, rate: 0.6 },
];

export const SF: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("c2", -0.35),
    to = at("c5", -0.3);
  const segs = ytSegs();
  const yt = "rec/youtube/clip.mp4";
  const work = word("c4", "The topic is doing");
  const cams: Cam[] = [
    { f: from, x: 800, y: 450, z: 1, d: 1 },
    { f: from + 12, x: 760, y: 60, z: 2.1, d: 12 },
    { f: clipFrame(segs, yt, 9.5), x: 1420, y: 120, z: 2.3, d: 12 },
    { f: word("c2", "and pick This year", -0.25) + 8, x: 800, y: 420, z: 1.5, d: 8 },
    { f: clipFrame(segs, yt, 13.35), x: 780, y: 430, z: 2.5, d: 10 },
    { f: at("c3", 0.15), x: 800, y: 450, z: 1, d: 12 },
    { f: at("c4", -0.1), x: 640, y: 160, z: 1.3, d: 1 },
    { f: at("c4", 0.35), x: 640, y: 150, z: 2.7, d: 12 },
    { f: word("c4", "Six hundred", -0.2), x: 900, y: 300, z: 1.6, d: 1 },
    { f: word("c4", "Six hundred", 0.25), x: 900, y: 300, z: 2.6, d: 12 },
    { f: work + 2, x: 820, y: 330, z: 1.35, d: 16 },
  ];
  // shrink the screen to the left when the callout comes in, so nothing covers the page
  const side = prog(f, work - 4, 18);
  const W = 1500 - side * 440;
  return (
    <Scene from={from} to={to} push={0}>
      <div style={{ position: "absolute", left: 210 - side * 130, top: 108 + side * 80 }}>
        <Screen segs={segs} end={to + 12} cams={cams} domain="youtube.com" path="/results?search_query=space+mysteries" width={W} />
      </div>
      {/* label chips sit above the screen, never on it */}
      <Appear from={from + 4} out={at("c3", -0.1)} style={{ left: 210, top: 28 }}>
        <Chip color={C.red} size={26}>Search → Filters → This year</Chip>
      </Appear>
      <Appear from={at("c3", 0)} out={at("c4", -0.15)} style={{ left: 210, top: 28 }}>
        <Chip color={C.yellow} size={26}>Small channel, huge video</Chip>
      </Appear>
      <Appear from={at("c4", 0.3)} out={word("c4", "Six hundred", -0.3)} style={{ left: 210, top: 28 }}>
        <Chip color={C.yellow} size={26}>Space Dude · 55.1K subscribers</Chip>
      </Appear>
      <Appear from={word("c4", "Six hundred", 0.3)} out={work - 4} style={{ left: 210, top: 28 }}>
        <Chip color={C.orange} size={26}>One video · 651K views</Chip>
      </Appear>
      {/* callout to the right of the screen */}
      <Appear from={work + 6} dx={40} dy={0} style={{ left: 1260, top: 300 }}>
        <Card w={560} glow={C.yellow} style={{ padding: 36 }}>
          <div style={{ fontSize: 22, color: C.muted }}>Space Dude</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 64, fontWeight: 800, color: C.yellow }}>55.1K</div>
              <div style={{ fontSize: 20, color: C.muted }}>subscribers</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F.display, fontSize: 64, fontWeight: 800, color: C.orange }}>651K</div>
              <div style={{ fontSize: 20, color: C.muted }}>views, one video</div>
            </div>
          </div>
          <div style={{ marginTop: 26, paddingTop: 22, borderTop: `1px solid ${C.line}`, fontSize: 30, lineHeight: 1.35 }}>
            <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 48, color: C.purpleHi }}>≈12×</span> the channel's size.
            <br />
            <span style={{ color: C.muted }}>The topic did that.</span>
          </div>
        </Card>
      </Appear>
    </Scene>
  );
};

export const trSegs = (): Seg[] => [
  { at: at("c5", -0.3), src: "rec/trends/clip.mp4", from: 1.6, rate: 1.0 },
  { at: word("c5", "and switch", -0.2), src: "rec/trends/clip.mp4", from: 3.4, rate: 1.7 },
];

export const SG: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("c5", -0.3),
    to = at("d1", -0.15);
  const segs = trSegs();
  const tr = "rec/trends/clip.mp4";
  const picked = clipFrame(segs, tr, 7.46);
  const cams: Cam[] = [
    { f: from, x: 800, y: 450, z: 1, d: 1 },
    { f: word("c5", "and switch", 0.1), x: 860, y: 270, z: 2.3, d: 14 },
    { f: clipFrame(segs, tr, 5.2), x: 860, y: 360, z: 1.9, d: 10 },
    { f: picked + 8, x: 760, y: 430, z: 1.2, d: 16 },
  ];
  const niche = at("c6", -0.05);
  const side = prog(f, niche, 16);
  const W = 1500 - side * 440;
  return (
    <Scene from={from} to={to} push={0}>
      <div style={{ position: "absolute", left: 210 - side * 130, top: 108 + side * 80 }}>
        <Screen segs={segs} end={to + 12} cams={cams} domain="trends.google.com" path="/trends/explore?q=space+mysteries" width={W} />
      </div>
      <Appear from={from + 4} out={niche} style={{ left: 210, top: 28 }}>
        <Chip color={C.blue} size={26}>Web Search → YouTube Search</Chip>
      </Appear>
      <Appear from={niche + 4} dx={40} dy={0} style={{ left: 1260, top: 330 }}>
        <Card w={560} style={{ padding: 36 }}>
          <div style={{ fontFamily: F.mono, fontSize: 19, letterSpacing: 3, color: C.purpleHi }}>NICHE CHECK</div>
          {[
            ["Small channel, huge video", niche + 8],
            ["Trend steady or rising", niche + 18],
          ].map(([t, on]) => (
            <div key={t as string} style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 24, fontSize: 28, fontWeight: 600 }}>
              <Tick on={on as number} size={40} />
              {t}
            </div>
          ))}
          <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${C.line}`, fontFamily: F.display, fontSize: 46, fontWeight: 800, opacity: prog(f, word("c6", "That's your niche"), 10) }}>
            Niche: <span style={{ color: C.green }}>found</span>
          </div>
        </Card>
      </Appear>
    </Scene>
  );
};

/* ============ D · next episode ============ */
export const SH: React.FC = () => {
  const from = at("d1", -0.15),
    to = end("d1", 0.9);
  const st = { f: from, text: "PART 2", cx: 960, cy: 400, size: 250, colors: [C.purple, C.purpleHi, C.blue] };
  return (
    <Scene from={from} to={to} push={0.02}>
      <Particles until={to + 30} stages={[st]} />
      <Appear from={solidAt(st) - 8} style={{ left: 0, width: 1920, top: 600, display: "flex", justifyContent: "center", gap: 24 }}>
        <div style={{ display: "flex", gap: 24 }}>
          <Chip color={C.orange} size={32}>Finding the titles people click</Chip>
          <div style={{ padding: "14px 30px", borderRadius: 999, background: C.text, color: C.bg, fontFamily: F.body, fontWeight: 700, fontSize: 30 }}>Subscribe</div>
        </div>
      </Appear>
    </Scene>
  );
};
