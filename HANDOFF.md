# Handoff — faceless channel, episode 1

Read this first if you're a new Claude session picking up this project.

## Goal
A faceless YouTube channel about using AI tools (Claude etc.). Style reference: the AI LABS video
"Creator Of The Best Design Skill Just Unveiled His AI Design Workflow" — dark canvas, UI cards,
post/quote cards with highlighted words, real browser screens with zooms. Our accent is purple,
supported by red, orange, yellow, blue, green.

## Where it stands (v2)
- `faceless-ep1/` is a Remotion project. v2 is a 58.7 s "Part 1": hook (real channel pages,
  particle numbers) → the template everyone uses → YouTube's July 2025 "inauthentic content" rename →
  Step 1: find a niche with proof (real YouTube search + filter + Space Dude example, real Google Trends switch).
- Script: `faceless-ep1/script/lines.json` (60 s cut). Full long-form script: `script/SCRIPT.md`.
- Real recordings: `faceless-ep1/capture/record.js` (Playwright, visible cursor, 2x frames) →
  `capture/encode.py` → `public/rec/<flow>/clip.mp4`. mp4s are git-ignored; re-run to recreate:
  `node capture/record.js youtube public/rec/youtube` (also `channel`, `trends`), then
  `python3 capture/encode.py public/rec/youtube`. Camera zoom keys in `src/scenes/Ep.tsx` use the
  event times printed by the recorder; re-check them if a re-recording's timings differ.
- Audio: `public/vo.wav` is a TEMPORARY Kokoro voice. `public/sfx/music.wav` is a TEMPORARY synth bed.

## User's rules (keep these)
- No mascot. Particles must finish as solid shapes. Nothing may cover text.
- Connect boxes box → arrow → box; never one long line with things layered on it.
- Show real sites with real click-throughs and zoom into what's clicked.
- Part 1 must stay ≤ 60 s.
- Plain human writing, no AI clichés; push back when the user is wrong.

## Next steps
1. Voice: the user generates the `lines.json` text in Higgsfield (ElevenLabs v4, their cloned voice).
   Save it as `public/vo.wav`, split it at pauses into the 14 lines, rewrite `src/timeline.json`
   (`{"total", "lines":[{id,text,start,dur}]}`), re-render. Keep ≤ 60 s (tighten gaps if needed).
2. Music: ElevenLabs Music v2.5 in Higgsfield, instrumental, 60 s. Replace `public/sfx/music.wav`.
3. Render: `cd faceless-ep1 && npm install && npx remotion render src/index.ts Main out/video.mp4 --codec=h264 --crf=17`
   (on a Mac, drop the `--browser-executable` flag from `npm run render`).
4. Then animate Steps 2–7 from `SCRIPT.md` as separate ≤ 60 s parts, same system.
