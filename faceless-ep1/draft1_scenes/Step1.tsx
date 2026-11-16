import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, F } from "../theme";
import { Appear, Avatar, Bar, Browser, Card, Chip, Cursor, Hl, Mascot, Scene, Tick, Type, at, end, prog, word } from "../lib";
import { Particles } from "../Particles";
import { Thumb } from "./Right";

/* H — Step 1 title */
export const SceneH: React.FC = () => {
  const from = at("s1a", -0.3),
    to = at("s1b", -0.2);
  return (
    <Scene from={from} to={to} push={0.03}>
      <Particles until={to} stages={[{ f: from + 2, text: "01", cx: 640, cy: 520, size: 420, colors: [C.purple, C.purpleHi, C.pink] }]} />
      <Appear from={at("s1a", 0.2)} dx={40} dy={0} style={{ left: 1000, top: 400 }}>
        <div style={{ fontFamily: F.mono, fontSize: 22, letterSpacing: 4, color: C.purpleHi }}>STEP 1</div>
        <div style={{ fontFamily: F.display, fontSize: 76, fontWeight: 800, color: C.text, lineHeight: 1.05, marginTop: 10 }}>
          Find a niche
          <br />
          with proof
        </div>
      </Appear>
      <Appear from={word("s1a", "don't guess")} style={{ left: 1000, top: 660 }}>
        <Chip color={C.red} size={26}>
          Rule: don't guess
        </Chip>
      </Appear>
    </Scene>
  );
};

const RESULTS = [
  { t: "The strangest planet ever found", ch: "AstroDaily", subs: "1.2M", views: "410K", a: C.blue, b: "#0b1a3a", m: "planet" as const },
  { t: "What's really inside a black hole?", ch: "Cosmos Lab", subs: "860K", views: "220K", a: C.purple, b: "#1a0b3a", m: "ring" as const },
  { t: "NASA can't explain this signal", ch: "Deep Orbit", subs: "8.2K", views: "900K", a: C.orange, b: "#3a1a0b", m: "spark" as const },
  { t: "10 space mysteries in 10 minutes", ch: "SpaceListed", subs: "2.4M", views: "95K", a: C.cyan, b: "#0b2a3a", m: "bars" as const },
];

/* I — YouTube search → filter → spot the small channel with a big video */
export const SceneI: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("s1b", -0.2),
    to = at("s1e", -0.2);
  const typeOn = at("s1b", 0.6);
  const filterOn = word("s1b", "open the filters");
  const yearOn = word("s1b", "from this year");
  const listOn = yearOn + 16;
  const spot = at("s1c", 0.2);
  const zoom = at("s1d", -0.1);
  const zp = prog(f, zoom, 22);
  return (
    <Scene from={from} to={to} push={0.02}>
      <Appear from={at("s1b")} style={{ left: 210, top: 120 }}>
        <div style={{ transform: `translateX(${-zp * 140}px) scale(${1 - zp * 0.12})`, transformOrigin: "left top" }}>
          <Browser w={1500} h={860} domain="youtube.com" url="/results?search_query=space+mysteries" glow={f > spot && f < zoom ? C.purple : undefined}>
            {/* search bar */}
            <div style={{ position: "absolute", left: 300, top: 26, width: 760, height: 56, borderRadius: 999, border: `1px solid ${C.line}`, background: C.card, display: "flex", alignItems: "center", padding: "0 26px", fontSize: 26, color: C.text }}>
              <Type text="space mysteries" a={typeOn} cps={12} />
            </div>
            <div style={{ position: "absolute", left: 1090, top: 26, height: 56, padding: "0 22px", borderRadius: 999, background: f > filterOn ? C.purpleBg : C.card, border: `1px solid ${f > filterOn ? C.purple : C.line}`, display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 600 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.text} strokeWidth="2">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filters
            </div>
            {/* filter panel */}
            <Appear from={filterOn + 6} out={listOn} style={{ left: 640, top: 110 }}>
              <Card w={520} style={{ padding: 26, background: C.card2 }}>
                <div style={{ fontFamily: F.mono, fontSize: 16, letterSpacing: 2, color: C.muted }}>UPLOAD DATE</div>
                {["Today", "This week", "This month", "This year"].map((o) => {
                  const sel = o === "This year" && f > yearOn + 8;
                  return (
                    <div key={o} style={{ marginTop: 14, padding: "12px 16px", borderRadius: 10, fontSize: 24, background: sel ? C.purpleBg : "transparent", border: `1px solid ${sel ? C.purple : "transparent"}`, color: sel ? "#fff" : C.muted }}>
                      {o}
                    </div>
                  );
                })}
              </Card>
            </Appear>
            {/* results */}
            {RESULTS.map((r, k) => {
              const hot = k === 2;
              const dim = f > spot && !hot ? 0.3 : 1;
              return (
                <Appear key={r.t} from={listOn + k * 4} style={{ left: 60, top: 120 + k * 176 }}>
                  <div style={{ display: "flex", gap: 26, opacity: dim, padding: 8, borderRadius: 14, background: hot && f > spot ? "#ffffff08" : "transparent", outline: hot && f > spot ? `2px solid ${C.yellow}` : "none" }}>
                    <Thumb w={280} h={150} a={r.a} b={r.b} motif={r.m} dur={["12:01", "18:44", "9:12", "10:30"][k]} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 4 }}>
                      <div style={{ fontSize: 28, fontWeight: 600, color: C.text }}>{r.t}</div>
                      <div style={{ fontSize: 20, color: C.muted }}>
                        <span style={{ color: hot && f > zoom ? C.orange : C.muted, fontWeight: hot && f > zoom ? 700 : 400 }}>{r.views} views</span> · 3 months ago
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 20, color: C.muted }}>
                        <Avatar letter={r.ch[0]} color={r.a} size={30} />
                        {r.ch} ·{" "}
                        <span style={{ color: hot && f > zoom ? C.yellow : C.muted, fontWeight: hot && f > zoom ? 700 : 400 }}>{r.subs} subscribers</span>
                      </div>
                    </div>
                  </div>
                </Appear>
              );
            })}
          </Browser>
        </div>
      </Appear>
      <Cursor
        path={[
          { f: filterOn - 6, x: 1500, y: 600 },
          { f: filterOn, x: 1360, y: 230, click: true },
          { f: yearOn + 4, x: 1100, y: 590 },
          { f: yearOn + 8, x: 1060, y: 590, click: true },
          { f: spot, x: 900, y: 690 },
        ]}
      />
      {/* the ratio callout */}
      <Appear from={zoom + 10} dx={50} dy={0} style={{ left: 1330, top: 240 }}>
        <Card w={500} glow={C.yellow} style={{ padding: 34 }}>
          <div style={{ fontSize: 20, color: C.muted }}>Deep Orbit</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
            <div>
              <div style={{ fontFamily: F.display, fontSize: 60, fontWeight: 800, color: C.yellow }}>8.2K</div>
              <div style={{ fontSize: 18, color: C.muted }}>subscribers</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: F.display, fontSize: 60, fontWeight: 800, color: C.orange }}>900K</div>
              <div style={{ fontSize: 18, color: C.muted }}>views on one video</div>
            </div>
          </div>
          <Appear from={word("s1d", "tells you")} style={{ position: "relative" }}>
            <div style={{ marginTop: 28, paddingTop: 22, borderTop: `1px solid ${C.line}`, fontSize: 26, lineHeight: 1.4 }}>
              ≈ <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 40, color: C.purpleHi }}>110×</span> the channel's size.
              <br />
              <Hl on={word("s1d", "the topic is pulling")} color={C.purple}>The topic did that.</Hl>
            </div>
          </Appear>
        </Card>
      </Appear>
    </Scene>
  );
};

/* J — Social Blade */
export const SceneJ: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("s1e", -0.2),
    to = at("s1f", -0.2);
  const statsOn = word("s1e", "It shows");
  const draw = prog(f, word("s1e", "how fast"), 50);
  const pts = new Array(24).fill(0).map((_, i) => [i * 44, 300 - Math.pow(i / 23, 2.2) * 250 - Math.sin(i) * 6]);
  return (
    <Scene from={from} to={to}>
      <Appear from={at("s1e")} style={{ left: 210, top: 130 }}>
        <Browser w={1500} h={820} domain="socialblade.com" url={"/youtube/handle/deeporbit".slice(0, Math.max(0, Math.floor((f - at("s1e", 0.3)) / 1.5)))}>
          <div style={{ padding: "30px 40px", display: "flex", alignItems: "center", gap: 18, borderBottom: `1px solid ${C.line}` }}>
            <Avatar letter="D" color={C.orange} size={64} />
            <div>
              <div style={{ fontSize: 32, fontWeight: 700 }}>Deep Orbit</div>
              <div style={{ fontSize: 19, color: C.muted }}>YouTube channel stats</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 22, padding: "28px 40px" }}>
            {[
              { k: "Subscribers", v: "8.2K", c: C.yellow, d: "+3.1K last 30 days" },
              { k: "Video views", v: "1.4M", c: C.orange, d: "+960K last 30 days" },
              { k: "Uploads", v: "14", c: C.blue, d: "about 2 per week" },
            ].map((s, k) => (
              <Appear key={s.k} from={statsOn + k * 5} style={{ position: "relative" }}>
                <Card w={455} style={{ padding: 24, background: C.card2 }} glow={k === 2 && f > word("s1e", "how often") ? C.blue : k === 0 && f > word("s1e", "how fast") && f < word("s1e", "how often") ? C.yellow : undefined}>
                  <div style={{ fontSize: 18, color: C.muted }}>{s.k}</div>
                  <div style={{ fontFamily: F.display, fontSize: 52, fontWeight: 800, color: s.c }}>{s.v}</div>
                  <div style={{ fontSize: 18, color: C.green }}>{s.d}</div>
                </Card>
              </Appear>
            ))}
          </div>
          <div style={{ padding: "0 40px" }}>
            <div style={{ fontSize: 18, color: C.muted }}>Subscribers, last 6 months</div>
            <svg width={1420} height={320} style={{ marginTop: 10 }}>
              {[80, 160, 240].map((y) => (
                <line key={y} x1={0} x2={1420} y1={y} y2={y} stroke={C.line} strokeDasharray="4 6" />
              ))}
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.yellow} strokeWidth={5} strokeDasharray={1400} strokeDashoffset={1400 - draw * 1400} strokeLinejoin="round" />
            </svg>
          </div>
        </Browser>
      </Appear>
    </Scene>
  );
};

/* K — Google Trends: switch Web Search → YouTube Search */
export const SceneK: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("s1f", -0.2),
    to = at("s1g", -0.2);
  const ddOpen = word("s1f", "Change the search type");
  const pick = word("s1f", "to YouTube Search");
  const picked = f > pick + 8;
  const draw = prog(f, pick + 14, 45);
  const pts = new Array(52).fill(0).map((_, i) => [i * 27, 230 - (40 + i * 2.2 + Math.sin(i * 0.9) * 16 + Math.sin(i * 0.27) * 22)]);
  const opts = ["Web Search", "Image search", "News search", "Google Shopping", "YouTube Search"];
  return (
    <Scene from={from} to={to}>
      <Appear from={at("s1f")} style={{ left: 210, top: 130 }}>
        <Browser w={1500} h={820} domain="trends.google.com" url="/trends/explore?q=space+mysteries">
          <div style={{ padding: "26px 40px", display: "flex", alignItems: "center", gap: 14, borderBottom: `1px solid ${C.line}` }}>
            {[C.blue, C.red, C.yellow, C.green].map((c) => (
              <span key={c} style={{ width: 10, height: 28, borderRadius: 3, background: c }} />
            ))}
            <span style={{ fontSize: 28, fontWeight: 600, marginLeft: 6 }}>Trends</span>
            <span style={{ fontSize: 22, color: C.muted, marginLeft: 20 }}>Explore</span>
          </div>
          <div style={{ display: "flex", gap: 20, padding: "26px 40px" }}>
            <Card w={360} style={{ padding: "16px 22px", background: C.card2, borderLeft: `5px solid ${C.blue}` }}>
              <div style={{ fontSize: 24, fontWeight: 600 }}>space mysteries</div>
              <div style={{ fontSize: 16, color: C.muted }}>Search term</div>
            </Card>
            {["Worldwide", "Past 12 months", "All categories"].map((t) => (
              <div key={t} style={{ alignSelf: "center", fontSize: 22, color: C.muted, padding: "10px 16px" }}>
                {t} ▾
              </div>
            ))}
            <div style={{ alignSelf: "center", fontSize: 22, padding: "10px 18px", borderRadius: 10, color: picked ? C.text : C.muted, background: f > ddOpen ? C.purpleBg : "transparent", border: `1px solid ${f > ddOpen ? C.purple : "transparent"}` }}>
              {picked ? "YouTube Search" : "Web Search"} ▾
            </div>
          </div>
          <Appear from={ddOpen + 8} out={pick + 12} style={{ left: 1080, top: 210 }}>
            <Card w={330} style={{ padding: 12, background: C.card2 }}>
              {opts.map((o) => {
                const sel = o === "YouTube Search" && f > pick;
                return (
                  <div key={o} style={{ padding: "12px 16px", borderRadius: 8, fontSize: 22, background: sel ? C.purpleBg : "transparent", color: sel ? "#fff" : o === "Web Search" ? C.text : C.muted }}>
                    {o}
                  </div>
                );
              })}
            </Card>
          </Appear>
          <div style={{ padding: "10px 40px" }}>
            <div style={{ fontSize: 20, color: C.muted }}>Interest over time · YouTube Search</div>
            <svg width={1420} height={260} style={{ marginTop: 14 }}>
              {[60, 130, 200].map((y) => (
                <line key={y} x1={0} x2={1420} y1={y} y2={y} stroke={C.line} strokeDasharray="4 6" />
              ))}
              <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke={C.blue} strokeWidth={4} strokeDasharray={1600} strokeDashoffset={1600 - draw * 1600} strokeLinejoin="round" />
            </svg>
          </div>
        </Browser>
      </Appear>
      <Cursor
        path={[
          { f: ddOpen - 6, x: 1500, y: 700 },
          { f: ddOpen + 2, x: 1300, y: 330, click: true },
          { f: pick, x: 1240, y: 655 },
          { f: pick + 4, x: 1240, y: 655, click: true },
          { f: pick + 30, x: 1450, y: 820 },
        ]}
      />
      <Appear from={word("s1f", "so you see")} style={{ left: 1560, top: 860 }}>
        <Chip color={C.red} size={22}>
          YouTube, not Google
        </Chip>
      </Appear>
    </Scene>
  );
};

/* L — the checklist, then the bridge to step 2 */
export const SceneL: React.FC = () => {
  const f = useCurrentFrame();
  const from = at("s1g", -0.2),
    to = end("s1h", 1.2);
  const items = [
    { t: "Trend is flat or going up", on: word("s1g", "flat or going up"), c: C.blue },
    { t: "3 small channels winning with it", on: word("s1g", "three small channels"), c: C.yellow },
  ];
  const nicheOn = word("s1g", "you have your niche");
  const bridge = at("s1h", -0.1);
  return (
    <Scene from={from} to={to}>
      <Appear from={at("s1g")} out={bridge} style={{ left: 460, top: 260 }}>
        <Card w={1000} style={{ padding: 40 }}>
          <div style={{ fontFamily: F.mono, fontSize: 20, letterSpacing: 3, color: C.purpleHi }}>NICHE CHECK</div>
          {items.map((it) => (
            <Appear key={it.t} from={it.on - 4} style={{ position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 22, marginTop: 28, fontSize: 36, fontWeight: 600 }}>
                <Tick on={it.on + 6} size={46} />
                {it.t}
              </div>
            </Appear>
          ))}
          <Appear from={nicheOn} style={{ position: "relative" }}>
            <div style={{ marginTop: 36, paddingTop: 28, borderTop: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: F.display, fontSize: 52, fontWeight: 800 }}>
                Niche: <span style={{ color: C.green }}>found</span>
              </div>
              <div style={{ fontSize: 24, color: C.muted, opacity: prog(f, word("s1g", "If not"), 12) }}>Not both? Try the next topic.</div>
            </div>
          </Appear>
        </Card>
      </Appear>
      <Appear from={nicheOn} out={bridge} style={{ left: 1520, top: 200 }}>
        <Mascot size={130} face="ok" />
      </Appear>
      {/* bridge */}
      <Appear from={bridge} style={{ left: 0, width: 1920, top: 330, display: "flex", justifyContent: "center", gap: 60, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 60 }}>
          <Card w={420} h={200} style={{ display: "grid", placeItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, color: C.muted }}>Niche</div>
              <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8 }}>what to make</div>
            </div>
          </Card>
          <svg width={120} height={30}>
            <line x1={0} x2={120 * prog(f, word("s1h", "It doesn't"), 14)} y1={15} y2={15} stroke={C.purple} strokeWidth={4} />
          </svg>
          <Appear from={word("s1h", "which videos")} style={{ position: "relative" }}>
            <Card w={520} h={200} glow={C.orange} style={{ display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 22, color: C.muted }}>Still missing</div>
                <div style={{ fontSize: 36, fontWeight: 700, marginTop: 8, color: C.orange }}>which videos get clicked?</div>
              </div>
            </Card>
          </Appear>
        </div>
      </Appear>
      <Appear from={word("s1h", "That's step two")} style={{ left: 0, width: 1920, top: 640, display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <Mascot size={110} face="?" />
          <Chip color={C.purple} size={34}>
            Step 2 · Find what people click
          </Chip>
        </div>
      </Appear>
    </Scene>
  );
};
