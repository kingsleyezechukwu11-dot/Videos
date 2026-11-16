"""Synthesize sound effects and a placeholder music bed into public/sfx/.
Replace public/sfx/music.wav with the real track when it's ready.
"""
import pathlib
import numpy as np
import soundfile as sf

SR = 44100
out = pathlib.Path(__file__).resolve().parent.parent / "public/sfx"
out.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(7)
t = lambda d: np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.2):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr) ** 2
    return e


def lowpass(x, cut):
    # one-pole low-pass with per-sample cutoff (array or float)
    cut = np.broadcast_to(cut, x.shape)
    y = np.zeros_like(x)
    a = np.exp(-2 * np.pi * cut / SR)
    acc = 0.0
    for i in range(len(x)):
        acc = (1 - a[i]) * x[i] + a[i] * acc
        y[i] = acc
    return y


def save(name, x, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    sf.write(out / f"{name}.wav", np.stack([x, x], 1).astype(np.float32), SR)


# whoosh: noise swept through a low-pass, swelling then fading
d = 0.55
n = rng.standard_normal(int(d * SR))
sweep = 300 + 5200 * np.sin(np.linspace(0, np.pi, len(n))) ** 2
save("whoosh", lowpass(n, sweep) * np.sin(np.linspace(0, np.pi, len(n))) ** 1.5, 0.6)

# soft UI click
x = t(0.05)
save("click", (np.sin(2 * np.pi * 2400 * x) * 0.6 + rng.standard_normal(len(x)) * 0.4) * np.exp(-x * 160), 0.5)

# pop for cards appearing
x = t(0.16)
f = 900 - 500 * (x / x[-1])
save("pop", np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 30), 0.55)

# key tap for typing
x = t(0.035)
save("key", rng.standard_normal(len(x)) * np.exp(-x * 220) + np.sin(2 * np.pi * 1800 * x) * np.exp(-x * 300), 0.35)

# tick for check marks
x = t(0.12)
save("tick", (np.sin(2 * np.pi * 1320 * x) + 0.5 * np.sin(2 * np.pi * 1980 * x)) * np.exp(-x * 40), 0.5)

# shimmer riser for particles assembling, ending in a soft hit
d = 1.2
x = t(d)
sh = sum(np.sin(2 * np.pi * (600 * k + 900 * x / d * k) * x) for k in (1, 1.5, 2.01)) / 3
noise = lowpass(rng.standard_normal(len(x)), 2500 + 6000 * x / d)
rise = (sh * 0.5 + noise * 0.8) * (x / d) ** 2.2
hit = np.zeros_like(x)
hx = t(0.4)
hk = np.sin(2 * np.pi * (55 + 90 * np.exp(-hx * 30)) * hx) * np.exp(-hx * 9)
hit[-len(hx):] = 0  # keep the hit separate
save("riser", np.concatenate([rise, hk * 1.4]), 0.7)

# ---- placeholder music: 60 s, 96 bpm, soft pads + gentle beat
BPM, dur = 96, 62.0
beat = 60 / BPM
x = t(dur)
music = np.zeros_like(x)
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G
mid = lambda m: 440 * 2 ** ((m - 69) / 12)
bar = beat * 4
for i, start in enumerate(np.arange(0, dur, bar)):
    seg = (x >= start) & (x < start + bar)
    tt = x[seg] - start
    e = np.minimum(1, tt / 0.6) * np.minimum(1, (bar - tt) / 0.4)
    for m in chords[i % 4]:
        f0 = mid(m)
        music[seg] += (np.sin(2 * np.pi * f0 * tt) + 0.3 * np.sin(2 * np.pi * f0 * 2.003 * tt)) * e * 0.12
    f0 = mid(chords[i % 4][0] - 24)
    music[seg] += np.sin(2 * np.pi * f0 * tt) * e * 0.18
# kick on 1 and 3, hats on eighths, pluck arpeggio
kx = t(0.35)
kick = np.sin(2 * np.pi * (48 + 70 * np.exp(-kx * 25)) * kx) * np.exp(-kx * 10)
hx = t(0.05)
hat = rng.standard_normal(len(hx)) * np.exp(-hx * 90)
hat = hat - lowpass(hat, 6000)
for k, start in enumerate(np.arange(0, dur - 1, beat / 2)):
    i = int(start * SR)
    if k % 4 == 0:
        music[i:i + len(kick)] += kick * 0.45
    music[i:i + len(hat)] += hat * (0.07 if k % 2 else 0.04)
    ch = chords[int(start // bar) % 4]
    f0 = mid(ch[k % 3] + 12)
    px = t(0.3)
    pl = np.sin(2 * np.pi * f0 * px) * np.exp(-px * 12) * 0.05
    music[i:i + len(pl)] += pl[: len(music) - i]
fade = np.minimum(1, x / 1.5) * np.minimum(1, (dur - x) / 2.5)
save("music", lowpass(music, 5000) * fade, 0.7)
print("ok", sorted(p.name for p in out.iterdir()))
