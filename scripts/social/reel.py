#!/usr/bin/env python3
"""LuxWeb demo Reel: a vertical scroll down a demo's home page, then an end card.

Takes a full-page phone screenshot of the demo (390 px wide at device scale 3,
reduced motion) and writes a 1080x1920 H.264 MP4 with a silent audio track, the
shape Facebook and Instagram Reels, X, and LinkedIn all take. Needs ffmpeg.

  python scripts/social/reel.py --shot scripts/social/shots/barber-mobile-full.png \\
      --headline "Built this one|for a barbershop." --tag "Demo site" \\
      --palette violet --out demo-barber.mp4

"|" splits headline lines. Output lands in public/socials/ unless --outdir says otherwise.
"""
import argparse
import os
import subprocess
import sys
import tempfile

from PIL import Image, ImageDraw, ImageFilter
import numpy as np

sys.dont_write_bytecode = True  # no __pycache__ next to the scripts for a run to commit by mistake
from render import ASSETS, DEFAULT_OUT, PALETTES, font, solid  # noqa: E402

W, H = 1080, 1920
FPS = 30
SPEED = 700       # px per second while scrolling
HOLD_TOP = 1.2    # seconds on the first screen
HOLD_END = 0.8    # seconds on the last screen before the end card
END_CARD = 2.8    # seconds of end card
FADE = 0.5


def strip(shot_path, screens):
    """The screenshot at 1080 wide, cut to the first `screens` screen heights."""
    shot = Image.open(shot_path).convert("RGB")
    shot = shot.resize((W, int(shot.height * W / shot.width)), Image.LANCZOS)
    if shot.height < H:
        sys.exit("the screenshot is shorter than one screen; take it with fullPage")
    return shot.crop((0, 0, W, min(shot.height, screens * H)))


def end_card(p, headline, tag, domain):
    kind = p["bg"][0]
    if kind == "flat":
        img = Image.new("RGB", (W, H), p["bg"][1])
    elif kind == "grad":
        t = np.linspace(0, 1, H)[:, None, None]
        img = Image.fromarray((np.array(p["bg"][1]) * (1 - t) + np.array(p["bg"][2]) * t)
                              .repeat(W, axis=1).astype(np.uint8), "RGB")
    else:
        img = Image.new("RGB", (W, H), p["bg"][1])
        glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        ImageDraw.Draw(glow).ellipse([W - 640, H - 760, W + 340, H + 220], fill=(*p["bg"][2], 150))
        glow = glow.filter(ImageFilter.GaussianBlur(200))
        img.paste(glow, (0, 0), glow)
    draw = ImageDraw.Draw(img)

    logo = Image.open(os.path.join(ASSETS, "logo-with-text.png")).convert("RGBA")
    logo = logo.crop(logo.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox())
    logo = logo.resize((420, int(logo.height * 420 / logo.width)), Image.LANCZOS)
    lx, ly = (W - logo.width) // 2, 420
    if p.get("badge"):
        draw.rounded_rectangle([lx - 28, ly - 20, lx + logo.width + 28, ly + logo.height + 20], 34, fill=p["badge"])
    img.paste(logo, (lx, ly), logo)

    y = ly + logo.height + 140
    if tag:
        f = font(600, 36)
        draw.text(((W - f.getlength(tag.upper())) / 2, y), tag.upper(), font=f, fill=p["muted"])
        y += 90
    lines = headline.split("|")
    size = 96
    while size > 48 and max(font(800, size).getlength(line) for line in lines) > W - 160:
        size -= 2
    f = font(800, size)
    for line in lines:
        draw.text(((W - f.getlength(line)) / 2, y), line, font=f, fill=solid(p["head"]))
        y += int(size * 1.15)
    f = font(600, 44)
    draw.text(((W - f.getlength(domain)) / 2, H - 260), domain, font=f, fill=p["accent"])
    return img


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--shot", required=True, help="full-page phone screenshot of the demo")
    ap.add_argument("--headline", required=True, help='end card lines, split by "|"')
    ap.add_argument("--tag", default="", help="a short line above the end card's headline")
    ap.add_argument("--palette", choices=PALETTES, default="midnight")
    ap.add_argument("--screens", type=int, default=5, help="how many screens of the page to scroll")
    ap.add_argument("--domain", default="luxwebstudio.dev")
    ap.add_argument("--out", required=True, help="file name, e.g. demo-barber.mp4")
    ap.add_argument("--outdir", default=DEFAULT_OUT)
    a = ap.parse_args()

    page = strip(a.shot, a.screens)
    dist = page.height - H
    scroll = max(6.0, dist / SPEED)
    run = HOLD_TOP + scroll + HOLD_END
    total = run + END_CARD - FADE
    # Ease in and out of the scroll: y = dist * smoothstep((t - hold) / scroll).
    p = f"clip((t-{HOLD_TOP})/{scroll:.3f}\\,0\\,1)"
    y = f"{dist}*pow({p}\\,2)*(3-2*{p})"

    os.makedirs(a.outdir, exist_ok=True)
    path = os.path.join(a.outdir, a.out)
    with tempfile.TemporaryDirectory() as tmp:
        page_png, card_png = os.path.join(tmp, "page.png"), os.path.join(tmp, "card.png")
        page.save(page_png)
        end_card(PALETTES[a.palette], a.headline, a.tag, a.domain).save(card_png)
        graph = (
            f"[0:v]crop={W}:{H}:0:{y},format=yuv420p,setsar=1[a];"
            f"[1:v]format=yuv420p,setsar=1[b];"
            f"[a][b]xfade=transition=fade:duration={FADE}:offset={run - FADE:.3f}[v]"
        )
        cmd = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-loop", "1", "-framerate", str(FPS), "-t", f"{run:.3f}", "-i", page_png,
            "-loop", "1", "-framerate", str(FPS), "-t", str(END_CARD), "-i", card_png,
            "-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=44100:cl=stereo",
            "-filter_complex", graph, "-map", "[v]", "-map", "2:a",
            "-c:v", "libx264", "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-r", str(FPS),
            "-c:a", "aac", "-b:a", "96k", "-t", f"{total:.3f}", "-movflags", "+faststart", path,
        ]
        subprocess.run(cmd, check=True)
    print(path)


if __name__ == "__main__":
    main()
