import React from "react";
import { Composition } from "remotion";
import { Main } from "./Main";
import timeline from "./timeline.json";
import { FPS } from "./theme";

export const Root: React.FC = () => (
  <Composition id="Main" component={Main} width={1920} height={1080} fps={FPS} durationInFrames={Math.ceil(timeline.total * FPS)} />
);
