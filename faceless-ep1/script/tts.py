"""Generate the voiceover with Kokoro and write public/vo.wav + src/timeline.json.

Usage: python3 script/tts.py <kokoro.onnx> <voices.bin> [voice]
"""
import json, sys, pathlib
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

root = pathlib.Path(__file__).resolve().parent.parent
model, voices = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else "af_heart"

lines = json.loads((root / "script/lines.json").read_text())
k = Kokoro(model, voices)

SR = 24000
LEAD = 0.4          # silence before the first line
GAP = 0.22          # pause between lines
SECTION_GAP = 0.45   # longer pause when the section letter changes

out, timeline, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
prev = None
for ln in lines:
    sec = ln["id"][0]
    if prev is not None:
        gap = SECTION_GAP if sec != prev else GAP
        out.append(np.zeros(int(gap * SR), np.float32)); t += gap
    audio, sr = k.create(ln.get("tts", ln["text"]), voice=voice, speed=float(sys.argv[4]) if len(sys.argv) > 4 else 1.0, lang="en-us")
    assert sr == SR
    # trim leading/trailing near-silence so timing is tight
    idx = np.where(np.abs(audio) > 0.01)[0]
    if len(idx):
        audio = audio[max(0, idx[0] - 600): idx[-1] + 1200]
    dur = len(audio) / SR
    timeline.append({"id": ln["id"], "text": ln["text"], "start": round(t, 3), "dur": round(dur, 3)})
    out.append(audio.astype(np.float32)); t += dur
    prev = sec
    print(f'{ln["id"]:4s} {t - dur:7.2f}s  {dur:5.2f}s')

out.append(np.zeros(int(1.0 * SR), np.float32)); t += 1.0
(root / "public").mkdir(exist_ok=True)
sf.write(root / "public/vo.wav", np.concatenate(out), SR)
(root / "src").mkdir(exist_ok=True)
(root / "src/timeline.json").write_text(json.dumps({"total": round(t, 3), "lines": timeline}, indent=1))
print("total", round(t, 2))
