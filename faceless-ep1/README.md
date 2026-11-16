# Faceless channel — Episode 1 (motion draft)

Remotion project. Every scene is drawn in code; the voiceover is generated with Kokoro (open-source TTS).

- `script/SCRIPT.md` — full episode script with on-screen notes
- `script/lines.json` — the lines animated in this draft (edit text here)
- `script/tts.py` — regenerates `public/vo.wav` and `src/timeline.json` from `lines.json`
- `src/scenes/*` — one component per section; timings come from the voiceover, so editing a line re-times its scene

```bash
npm install
python3 script/tts.py <kokoro-v1.0.onnx> <voices-v1.0.bin> af_heart
npm run render
```
