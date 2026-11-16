import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { Bg, at, word } from "./lib";
import { solidAt } from "./Particles";
import { clipFrame } from "./Screen";
import { SA, SB, SC, SD, SE, SF, SG, SH, ytSegs, trSegs } from "./scenes/Ep";
import timeline from "./timeline.json";
import { FPS } from "./theme";

const Sfx: React.FC<{ f: number; n: string; v?: number }> = ({ f, n, v = 0.5 }) => (
  <Sequence from={Math.max(0, f)} durationInFrames={60} layout="none">
    <Audio src={staticFile(`sfx/${n}.wav`)} volume={v} />
  </Sequence>
);

const sfxList = (): { f: number; n: string; v?: number }[] => {
  const L: { f: number; n: string; v?: number }[] = [];
  const yt = ytSegs(), tr = trSegs();
  const Y = "rec/youtube/clip.mp4", T = "rec/trends/clip.mp4";
  // scene changes
  for (const [id, o] of [["a4", -0.15], ["b1", -0.2], ["b2", -0.2], ["b3", -0.2], ["c1", -0.2], ["c2", -0.4], ["c5", -0.35], ["d1", -0.2]] as const)
    L.push({ f: at(id, o), n: "whoosh", v: 0.35 });
  // particles: riser lands on the moment the shape turns solid
  const stages = [at("a1", -0.4), at("a2", -0.25), at("a3", -0.25), at("c1", -0.15), at("d1", -0.15)];
  for (const s of stages) L.push({ f: solidAt({ f: s, text: "" }) - 36, n: "riser", v: 0.32 });
  // cards
  for (const f of [at("a1", -0.1), at("a2", -0.1), at("a3", -0.1), at("b1"), at("b3"), word("c4", "The topic is doing", 0.2), at("c6")]) L.push({ f, n: "pop", v: 0.4 });
  for (const p of ["a niche from", "an AI script", "stock footage", "upload", "repeat"]) L.push({ f: word("b2", p), n: "pop", v: 0.35 });
  // real clicks in the recordings
  for (const t of [2.41, 10.17, 13.62]) L.push({ f: clipFrame(yt, Y, t), n: "click", v: 0.6 });
  for (const t of [4.1, 7.46]) L.push({ f: clipFrame(tr, T, t), n: "click", v: 0.6 });
  // typing "space mysteries"
  for (let i = 0; i < 15; i++) L.push({ f: clipFrame(yt, Y, 2.72 + i * 0.1), n: "key", v: 0.4 });
  // ticks
  L.push({ f: at("c6", 0.25), n: "tick", v: 0.45 }, { f: at("c6", 0.6), n: "tick", v: 0.45 });
  return L;
};

export const Main: React.FC = () => {
  const total = Math.ceil(timeline.total * FPS);
  return (
    <AbsoluteFill style={{ background: "#0a0a0f" }}>
      <Bg />
      <SA />
      <SB />
      <SC />
      <SD />
      <SE />
      <SF />
      <SG />
      <SH />
      <Audio src={staticFile("vo.wav")} />
      <Audio
        src={staticFile("sfx/music.wav")}
        volume={(f) => interpolate(f, [0, 20, total - 40, total], [0, 0.11, 0.11, 0], { extrapolateRight: "clamp" })}
      />
      {sfxList().map((s, i) => (
        <Sfx key={i} {...s} />
      ))}
    </AbsoluteFill>
  );
};
