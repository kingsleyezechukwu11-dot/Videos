"""Turn screencast frames (variable timing) into a constant 30 fps mp4.
Usage: python3 encode.py <dir>   -> <dir>/clip.mp4
"""
import json, subprocess, sys, pathlib

d = pathlib.Path(sys.argv[1])
frames = json.loads((d / "frames.json").read_text())
lst = d / "concat.txt"
with lst.open("w") as f:
    for a, b in zip(frames, frames[1:] + [None]):
        dur = (b["t"] - a["t"]) if b else 1.0
        f.write(f"file 'frames/{a['file']}'\nduration {max(dur, 0.001):.4f}\n")
    f.write(f"file 'frames/{frames[-1]['file']}'\n")
# frame 0 sits at t of the first frame; pad the start so clip time == event time
pad = frames[0]["t"]
subprocess.run([
    "ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(lst),
    "-vf", f"tpad=start_duration={pad:.3f}:start_mode=clone,fps=30,scale=3200:1800,format=yuv420p",
    "-c:v", "libx264", "-crf", "16", "-preset", "medium", str(d / "clip.mp4"),
], check=True)
print("ok", d / "clip.mp4")
