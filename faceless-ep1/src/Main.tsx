import React from "react";
import { AbsoluteFill, Audio, staticFile } from "remotion";
import { Bg } from "./lib";
import { SceneA, SceneB, SceneC } from "./scenes/Hook";
import { SceneD } from "./scenes/Right";
import { SceneE, SceneF, SceneG } from "./scenes/Wrong";
import { SceneH, SceneI, SceneJ, SceneK, SceneL } from "./scenes/Step1";

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: "#0a0a0f" }}>
    <Bg />
    <SceneA />
    <SceneB />
    <SceneC />
    <SceneD />
    <SceneE />
    <SceneF />
    <SceneG />
    <SceneH />
    <SceneI />
    <SceneJ />
    <SceneK />
    <SceneL />
    <Audio src={staticFile("vo.wav")} />
  </AbsoluteFill>
);
