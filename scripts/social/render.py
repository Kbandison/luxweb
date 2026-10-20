#!/usr/bin/env python3
"""LuxWeb social graphic renderer.

Two templates, both 1080x1080 on the brand's black with the purple glow:

  text        headline (gradient) + sublines + tag + domain      -- intro, tips, offers
  screenshot  short headline + a site screenshot on a card       -- demo reveals, roasts

Examples
  python scripts/social/render.py --template text \
      --headline "Websites for|small businesses|around Atlanta." \
      --sub "Buford, Georgia.|Most sites live in 1-2 weeks." \
      --tag "Veteran owned and Black owned." --out luxweb-intro.png

  python scripts/social/render.py --template screenshot \
      --headline "Built this one|in two days." --image shots/barber-home.png \
      --out demo-barber.png

"|" splits lines. Output lands in public/socials/ unless --outdir says otherwise.
"""
import argparse
import os
import sys

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
DEFAULT_OUT = os.path.join(REPO, "public", "socials")

W = H = 1080
M = 84

# Brand tokens (luxwebstudio.dev)
BLACK = (0, 0, 0)
PURPLE = (168, 85, 247)   # purple-500
PINK = (236, 72, 153)     # pink-500
VIOLET = (124, 58, 237)   # violet-600
WHITE = (255, 255, 255)
GRAY = (156, 163, 175)    # gray-400


def font(weight, size):
    return ImageFont.truetype(os.path.join(ASSETS, f"Inter-{weight}.ttf"), size)


def base_canvas():
    img = Image.new("RGB", (W, H), BLACK)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    g.ellipse([W - 520, H - 520, W + 260, H + 260], fill=(*VIOLET, 150))
    g.ellipse([-260, -300, 420, 380], fill=(*PURPLE, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(170))
    img.paste(glow, (0, 0), glow)
    return img


def place_logo(img, width=400, y=M - 10):
    logo = Image.open(os.path.join(ASSETS, "logo-with-text.png")).convert("RGBA")
    logo = logo.crop(logo.getbbox())
    logo = logo.resize((width, int(logo.height * width / logo.width)), Image.LANCZOS)
    img.paste(logo, (M - 6, y), logo)
    return y + logo.height


def gradient_text(img, lines, y, size, line_h):
    """Headline in the brand gradient, left aligned. Returns y after the block."""
    f = font(800, size)
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    for i, line in enumerate(lines):
        md.text((M, y + i * line_h), line, font=f, fill=255)
    grad = np.zeros((H, W, 3), dtype=np.uint8)
    t = np.linspace(0, 1, W)[None, :, None]
    grad[:] = (np.array(PURPLE) * (1 - t) + np.array(PINK) * t).astype(np.uint8)
    img.paste(Image.fromarray(grad, "RGB"), (0, 0), mask)
    return y + len(lines) * line_h


def fit_headline(lines, max_width=W - 2 * M, start=84):
    """Shrink the headline font until the longest line fits the content width."""
    size = start
    while size > 48:
        f = font(800, size)
        if max(f.getlength(line) for line in lines) <= max_width:
            break
        size -= 4
    return size, int(size * 1.17)


def render_text(a):
    img = base_canvas()
    place_logo(img)
    head = a.headline.split("|")
    size, line_h = fit_headline(head)
    y = gradient_text(img, head, 300, size, line_h)
    draw = ImageDraw.Draw(img)
    y += 56
    for line in (a.sub.split("|") if a.sub else []):
        draw.text((M, y), line, font=font(400, 38), fill=WHITE)
        y += 54
    if a.tag:
        draw.text((M, y + 42), a.tag, font=font(400, 38), fill=GRAY)
    draw.text((M, H - M - 40), a.domain, font=font(600, 34), fill=PURPLE)
    return img


def render_screenshot(a):
    if not a.image:
        sys.exit("--image is required for the screenshot template")
    img = base_canvas()
    place_logo(img, width=300, y=M - 6)
    head = a.headline.split("|")
    size, line_h = fit_headline(head, start=64)
    y = gradient_text(img, head, 262, size, line_h)

    # Screenshot on a rounded card with a faint purple border
    shot = Image.open(a.image).convert("RGB")
    card_w = W - 2 * M
    card_h = H - y - 40 - (M + 60)
    scale = min(card_w / shot.width, card_h / shot.height)
    shot = shot.resize((int(shot.width * scale), int(shot.height * scale)), Image.LANCZOS)
    radius = 28
    mask = Image.new("L", shot.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, shot.width - 1, shot.height - 1], radius, fill=255)
    x0 = M + (card_w - shot.width) // 2
    y0 = y + 40
    border = Image.new("RGBA", (shot.width + 4, shot.height + 4), (0, 0, 0, 0))
    ImageDraw.Draw(border).rounded_rectangle(
        [0, 0, shot.width + 3, shot.height + 3], radius + 2, outline=(*PURPLE, 110), width=2)
    img.paste(border, (x0 - 2, y0 - 2), border)
    img.paste(shot, (x0, y0), mask)

    draw = ImageDraw.Draw(img)
    draw.text((M, H - M - 40), a.domain, font=font(600, 34), fill=PURPLE)
    return img


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--template", choices=["text", "screenshot"], default="text")
    p.add_argument("--headline", required=True, help='lines split by "|"')
    p.add_argument("--sub", default="", help='white support lines, split by "|" (text template)')
    p.add_argument("--tag", default="", help="gray line under the sublines (text template)")
    p.add_argument("--image", help="screenshot path (screenshot template)")
    p.add_argument("--domain", default="luxwebstudio.dev")
    p.add_argument("--out", required=True, help="file name, e.g. demo-barber.png")
    p.add_argument("--outdir", default=DEFAULT_OUT)
    a = p.parse_args()

    img = render_text(a) if a.template == "text" else render_screenshot(a)
    os.makedirs(a.outdir, exist_ok=True)
    path = os.path.join(a.outdir, a.out)
    img.save(path, "PNG", optimize=True)
    print(path)


if __name__ == "__main__":
    main()
