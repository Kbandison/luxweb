#!/usr/bin/env python3
"""LuxWeb social graphic renderer.

Every graphic is 1080x1080. The layout sets the arrangement and the palette sets
the colors, so a feed of posts doesn't repeat one look.

Layouts
  classic     gradient headline, sublines, tag                   tips, offers, roasts
  center      centered headline and sublines, tag above          tips, offers, Kevin
  number      a giant number beside the headline (--number)      offers, "3 things" tips
  checklist   headline and two to four checked items (--items)   tips, roasts
  card        headline and sublines on a card, tag as a pill     offers, tips
  quote       a quote (--headline) and who said it (--by)        Kevin, stories
  phone       headline beside a phone screenshot (--image)       tips, roasts, demo reveals
  screenshot  headline over a site screenshot in a browser       demo reveals, carousel slides
  photo       headline over a full-bleed photo (--image)         any

Palettes: midnight, violet, cream, lilac, electric, ocean.

Examples
  python scripts/social/render.py --layout classic --palette midnight \\
      --headline "Websites for|small businesses|around Atlanta." \\
      --sub "Buford, Georgia.|Most sites live in 1-2 weeks." \\
      --tag "Veteran owned and Black owned." --out luxweb-intro.png

  python scripts/social/render.py --layout number --palette cream --number 5 \\
      --headline "free|homepage|designs|a month." --sub "It starts with a 15-minute call." \\
      --out offer.png

  python scripts/social/render.py --layout phone --palette ocean \\
      --headline "Make your|number|tap to call." --sub "Put it at the top|of every page." \\
      --image shots/barber-mobile.png --out tip.png

"|" splits lines. Output lands in public/socials/ unless --outdir says otherwise.
A layout exits with an error when the text won't fit; shorten it and run again.
"""
import argparse
import os
import random
import sys

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "assets")
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
DEFAULT_OUT = os.path.join(REPO, "public", "socials")

W = H = 1080
M = 84

WHITE = (255, 255, 255)
INK = (17, 17, 17)
NIGHT = (17, 7, 38)

# bg: ("glow", base, strong glow, soft glow) | ("flat", color) | ("grad", top-left, bottom-right)
# head: one color, or a (left, right) gradient
PALETTES = {
    "midnight": dict(bg=("glow", (0, 0, 0), (124, 58, 237), (168, 85, 247)),
                     head=((168, 85, 247), (236, 72, 153)), sub=WHITE,
                     muted=(156, 163, 175), accent=(168, 85, 247), card=(24, 18, 36)),
    "violet": dict(bg=("grad", (46, 16, 101), NIGHT),
                   head=WHITE, sub=(233, 213, 255), muted=(196, 181, 253),
                   accent=(244, 114, 182), card=(59, 25, 120)),
    "cream": dict(bg=("flat", (246, 241, 233)),
                  head=INK, sub=(55, 55, 55), muted=(110, 104, 96),
                  accent=(124, 58, 237), card=WHITE),
    "lilac": dict(bg=("flat", (237, 231, 255)),
                  head=(46, 16, 101), sub=(76, 29, 149), muted=(109, 90, 160),
                  accent=(219, 39, 119), card=WHITE),
    "electric": dict(bg=("grad", (124, 58, 237), (236, 72, 153)),
                     head=WHITE, sub=WHITE, muted=(253, 230, 255),
                     accent=NIGHT, card=NIGHT, badge=NIGHT),
    "ocean": dict(bg=("glow", (5, 14, 28), (34, 211, 238), (124, 58, 237)),
                  head=((34, 211, 238), (168, 85, 247)), sub=(226, 240, 255),
                  muted=(148, 170, 196), accent=(34, 211, 238), card=(12, 28, 48)),
}


def font(weight, size):
    return ImageFont.truetype(os.path.join(ASSETS, f"Inter-{weight}.ttf"), size)


def solid(color):
    """One color from a color or a gradient (its right end)."""
    return color[1] if isinstance(color[0], tuple) else color


def is_light(color):
    return sum(solid(color)) > 600


def background(p, seed):
    kind = p["bg"][0]
    if kind == "flat":
        return Image.new("RGB", (W, H), p["bg"][1])
    if kind == "grad":
        a, b = np.array(p["bg"][1]), np.array(p["bg"][2])
        yy, xx = np.mgrid[0:H, 0:W]
        t = ((xx + yy) / (W + H))[..., None]
        return Image.fromarray((a * (1 - t) + b * t).astype(np.uint8), "RGB")
    base, strong, soft = p["bg"][1:]
    img = Image.new("RGB", (W, H), base)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g = ImageDraw.Draw(glow)
    # The strong glow never sits top-left, where the logo usually goes.
    rnd = random.Random(seed)
    corners = [(W - 520, H - 520), (-260, H - 520), (W - 520, -300)]
    a = rnd.choice(corners)
    b = rnd.choice([c for c in corners + [(-260, -300)] if c != a])
    g.ellipse([a[0], a[1], a[0] + 780, a[1] + 780], fill=(*strong, 150))
    g.ellipse([b[0], b[1], b[0] + 680, b[1] + 680], fill=(*soft, 60))
    glow = glow.filter(ImageFilter.GaussianBlur(170))
    img.paste(glow, (0, 0), glow)
    return img


def place_logo(img, p, width, x, y):
    """Paste the logo, on a dark badge when the palette needs one. Returns its size."""
    logo = Image.open(os.path.join(ASSETS, "logo-with-text.png")).convert("RGBA")
    logo = logo.crop(logo.split()[3].point(lambda v: 255 if v > 40 else 0).getbbox())
    logo = logo.resize((width, int(logo.height * width / logo.width)), Image.LANCZOS)
    if x == "center":
        x = (W - logo.width) // 2
    if p.get("badge"):
        ImageDraw.Draw(img).rounded_rectangle(
            [x - 22, y - 16, x + logo.width + 22, y + logo.height + 16], 28, fill=p["badge"])
    img.paste(logo, (x, y), logo)
    return logo.size


def fit(lines, max_width, start, floor=44, weight=800):
    """The largest size from start down to floor at which every line fits max_width."""
    size = start
    while size > floor and max(font(weight, size).getlength(line) for line in lines) > max_width:
        size -= 2
    if max(font(weight, size).getlength(line) for line in lines) > max_width:
        sys.exit(f"text too wide: {max(lines, key=len)!r}. Shorten it.")
    return size


def paint(img, lines, x, y, size, line_h, color, align="left", weight=800):
    """Draw lines in a color or a left-to-right gradient. Returns the y after the block."""
    f = font(weight, size)
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    for i, line in enumerate(lines):
        lx = (W - f.getlength(line)) / 2 if align == "center" else x
        md.text((lx, y + i * line_h), line, font=f, fill=255)
    if isinstance(color[0], tuple):
        t = np.linspace(0, 1, W)[None, :, None]
        fill = np.zeros((H, W, 3), dtype=np.uint8)
        fill[:] = (np.array(color[0]) * (1 - t) + np.array(color[1]) * t).astype(np.uint8)
        layer = Image.fromarray(fill, "RGB")
    else:
        layer = Image.new("RGB", (W, H), color)
    img.paste(layer, (0, 0), mask)
    return y + len(lines) * line_h


def lines_at(draw, lines, x, y, size, step, color, weight=400, align="left"):
    f = font(weight, size)
    for line in lines:
        lx = (W - f.getlength(line)) / 2 if align == "center" else x
        draw.text((lx, y), line, font=f, fill=color)
        y += step
    return y


def place_domain(img, p, a, align="left", color=None):
    f = font(600, 34)
    x = {"left": M, "center": (W - f.getlength(a.domain)) / 2,
         "right": W - M - f.getlength(a.domain)}[align]
    ImageDraw.Draw(img).text((x, H - M - 40), a.domain, font=f, fill=color or p["accent"])


def must_fit(bottom, limit, layout):
    if bottom > limit:
        sys.exit(f"{layout}: the text runs {int(bottom - limit)}px past the space it has. Shorten it.")


def rounded(img, pic, x, y, radius):
    mask = Image.new("L", pic.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, pic.width - 1, pic.height - 1], radius, fill=255)
    img.paste(pic, (x, y), mask)


def drop_shadow(img, box, radius, alpha):
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    x0, y0, x1, y1 = box
    ImageDraw.Draw(sh).rounded_rectangle([x0, y0 + 18, x1, y1 + 18], radius, fill=(0, 0, 0, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(30))
    img.paste(sh, (0, 0), sh)


def need(a, *fields):
    missing = [f"--{f}" for f in fields if not getattr(a, f)]
    if missing:
        sys.exit(f"--layout {a.layout} needs {' and '.join(missing)}")


# ---------- layouts ----------

def render_classic(a, p, img):
    _, logo_h = place_logo(img, p, 300, M - 6, M - 10)
    size = fit(a.head, W - 2 * M, 84)
    y = paint(img, a.head, M, max(300, M + logo_h + 40), size, int(size * 1.17), p["head"])
    draw = ImageDraw.Draw(img)
    y = lines_at(draw, a.subs, M, y + 56, 38, 54, p["sub"])
    if a.tag:
        draw.text((M, y + 42), a.tag, font=font(400, 38), fill=p["muted"])
        y += 42 + 46
    must_fit(y, H - M - 80, "classic")
    place_domain(img, p, a)


def render_center(a, p, img):
    place_logo(img, p, 230, "center", M)
    size = fit(a.head, W - 2 * M, 96)
    lh = int(size * 1.12)
    block = len(a.head) * lh + (40 + len(a.subs) * 52 if a.subs else 0)
    y = (H - block) // 2 + 30
    draw = ImageDraw.Draw(img)
    if a.tag:
        lines_at(draw, [a.tag.upper()], 0, y - 80, 30, 0, p["muted"], weight=600, align="center")
    y = paint(img, a.head, 0, y, size, lh, p["head"], align="center")
    y = lines_at(draw, a.subs, 0, y + 40, 36, 52, p["sub"], align="center")
    must_fit(y, H - M - 80, "center")
    place_domain(img, p, a, align="center")


def render_number(a, p, img):
    need(a, "number")
    place_logo(img, p, 220, M - 6, H - M - 110)
    big = a.number
    size = 640
    while font(800, size).getlength(big) > W * 0.45:
        size -= 20
    f = font(800, size)
    bb = f.getbbox(big)
    paint(img, [big], M - bb[0] - 10, 120 - bb[1], size, size, p["head"])
    nx = M + (bb[2] - bb[0]) + 50
    hs = fit(a.head, W - M - nx, 72)
    head_color = p["sub"] if not is_light(p["bg"][1]) else solid(p["head"])
    paint(img, a.head, nx, 200, hs, int(hs * 1.15), head_color)
    draw = ImageDraw.Draw(img)
    y = lines_at(draw, a.subs, M, 120 + (bb[3] - bb[1]) + 70, 38, 54, p["sub"])
    if a.tag:
        draw.text((M, y + 30), a.tag, font=font(600, 36), fill=p["muted"])
        y += 30 + 44
    must_fit(y, H - M - 130, "number")
    place_domain(img, p, a, align="right")


def render_checklist(a, p, img):
    need(a, "items")
    items = a.items.split("|")
    if not 2 <= len(items) <= 4:
        sys.exit("--items takes two to four items")
    size = fit(a.head, W - 2 * M, 80)
    y = paint(img, a.head, M, 150, size, int(size * 1.15), p["head"])
    draw = ImageDraw.Draw(img)
    isz = fit(items, W - 2 * M - 90, 42, floor=32, weight=600)
    mark = WHITE if not is_light(p["accent"]) else NIGHT
    y += 70
    for item in items:
        draw.ellipse([M, y, M + 60, y + 60], fill=p["accent"])
        draw.line([(M + 17, y + 31), (M + 27, y + 41), (M + 44, y + 21)], fill=mark, width=6, joint="curve")
        draw.text((M + 90, y + 30), item, font=font(600, isz), fill=p["sub"], anchor="lm")
        y += 104
    must_fit(y, H - M - 130, "checklist")
    place_logo(img, p, 220, W - M - 220, H - M - 110)
    place_domain(img, p, a)


def render_card(a, p, img):
    place_logo(img, p, 230, "center", M - 10)
    x0, y0, x1, y1 = M, 270, W - M, H - M - 90
    drop_shadow(img, (x0, y0, x1, y1), 44, 45 if is_light(p["bg"][1]) else 90)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([x0, y0, x1, y1], 44, fill=p["card"])
    light = is_light(p["card"])
    top = y0 + 60
    if a.tag:
        tag = a.tag.upper() if len(a.tag) < 26 else a.tag
        f = font(600, 28)
        pill = p["accent"] if p["accent"] != p["card"] else p["sub"]
        draw.rounded_rectangle([x0 + 60, top, x0 + 104 + f.getlength(tag), top + 54], 27, fill=pill)
        draw.text((x0 + 82, top + 27), tag, font=f, fill=WHITE if not is_light(pill) else NIGHT, anchor="lm")
        top += 100
    size = fit(a.head, x1 - x0 - 120, 80)
    head = p["head"] if not (light and not isinstance(p["head"][0], tuple) and is_light(p["head"])) else INK
    y = paint(img, a.head, x0 + 60, top, size, int(size * 1.15), head)
    y = lines_at(draw, a.subs, x0 + 60, y + 40, 36, 50, (70, 70, 70) if light else (225, 225, 235))
    must_fit(y, y1 - 50, "card")
    place_domain(img, p, a, align="center")


def render_quote(a, p, img):
    need(a, "by")
    draw = ImageDraw.Draw(img)
    for qx in (M, M + 120):  # an opening quote mark, drawn so it reads at any weight
        draw.ellipse([qx, 200, qx + 96, 296], fill=p["accent"])
        draw.polygon([(qx + 4, 240), (qx + 40, 130), (qx + 70, 140), (qx + 50, 230)], fill=p["accent"])
    size = fit(a.head, W - 2 * M, 84)
    color = p["sub"] if not is_light(p["bg"][1]) else solid(p["head"])
    y = paint(img, a.head, M, 360, size, int(size * 1.18), color)
    draw.line([(M, y + 50), (M + 90, y + 50)], fill=p["accent"], width=6)
    draw.text((M, y + 80), a.by, font=font(600, 38), fill=p["muted"])
    must_fit(y + 130, H - M - 130, "quote")
    place_logo(img, p, 220, W - M - 220, H - M - 110)
    place_domain(img, p, a)


def render_phone(a, p, img):
    need(a, "image")
    _, logo_h = place_logo(img, p, 230, M - 6, M - 6)
    pw, ph, bezel, bar = 400, 820, 14, 48
    px, py = W - M - pw + 10, (H - ph) // 2 + 30
    drop_shadow(img, (px, py, px + pw, py + ph), 64, 140)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([px, py, px + pw, py + ph], 64, fill=(14, 14, 18))
    sw, sh = pw - 2 * bezel, ph - 2 * bezel
    shot = Image.open(a.image).convert("RGB")
    shot = shot.resize((sw, int(shot.height * sw / shot.width)), Image.LANCZOS).crop((0, 0, sw, sh - bar))
    screen = Image.new("RGB", (sw, sh), shot.getpixel((sw // 2, 4)))
    screen.paste(shot, (0, bar))
    ImageDraw.Draw(screen).text((34, 14), "9:41", font=font(600, 18), fill=WHITE)
    rounded(img, screen, px + bezel, py + bezel, 52)
    draw.rounded_rectangle([px + pw // 2 - 56, py + bezel + 10, px + pw // 2 + 56, py + bezel + 40], 15,
                           fill=(0, 0, 0))
    col = px - M - 50
    size = fit(a.head, col, 84)
    y = paint(img, a.head, M, max(300, M + logo_h + 40), size, int(size * 1.15), p["head"])
    y = lines_at(draw, a.subs, M, y + 44, 34, 48, p["sub"])
    if a.tag:
        draw.text((M, y + 34), a.tag, font=font(600, 30), fill=p["muted"])
        y += 34 + 40
    must_fit(y, H - M - 80, "phone")
    place_domain(img, p, a)


def render_screenshot(a, p, img):
    need(a, "image")
    _, logo_h = place_logo(img, p, 260, M - 6, M - 6)
    size = fit(a.head, W - 2 * M, 64)
    y = paint(img, a.head, M, max(250, M + logo_h + 40), size, int(size * 1.17), p["head"])
    # The screenshot in a browser frame: a bar with three dots, then the page.
    shot = Image.open(a.image).convert("RGB")
    bar = 40
    card_w, card_h = W - 2 * M, H - y - 40 - (M + 60) - bar
    if card_h < 300:
        sys.exit("screenshot: the headline leaves too little room. Shorten it.")
    scale = min(card_w / shot.width, card_h / shot.height)
    shot = shot.resize((int(shot.width * scale), int(shot.height * scale)), Image.LANCZOS)
    frame = Image.new("RGB", (shot.width, shot.height + bar), (32, 32, 40))
    fd = ImageDraw.Draw(frame)
    for i, c in enumerate([(255, 95, 87), (254, 188, 46), (40, 200, 64)]):
        fd.ellipse([20 + i * 24, 14, 32 + i * 24, 26], fill=c)
    frame.paste(shot, (0, bar))
    x0, y0 = M + (card_w - frame.width) // 2, y + 40
    drop_shadow(img, (x0, y0, x0 + frame.width, y0 + frame.height), 20, 120)
    rounded(img, frame, x0, y0, 20)
    place_domain(img, p, a)


def render_photo(a, p, img):
    need(a, "image")
    pic = Image.open(a.image).convert("RGB")
    s = max(W / pic.width, H / pic.height)
    pic = pic.resize((int(pic.width * s) + 1, int(pic.height * s) + 1), Image.LANCZOS)
    x0, y0 = (pic.width - W) // 2, (pic.height - H) // 2
    img.paste(pic.crop((x0, y0, x0 + W, y0 + H)))
    size = fit(a.head, W - 2 * M, 84)
    lh = int(size * 1.15)
    top = H - M - 70 - len(a.subs) * 52 - (30 if a.subs else 0) - len(a.head) * lh
    must_fit(M + 160, top - 120, "photo")
    # A fade in the palette's background color, solid by the time it reaches the text.
    t = np.clip((np.arange(H) - (top - 340)) / 300, 0, 1) ** 1.2
    fade = np.zeros((H, W, 4), dtype=np.uint8)
    fade[..., :3] = p["bg"][2] if p["bg"][0] == "grad" else p["bg"][1]
    fade[..., 3] = (t[:, None] * 245).astype(np.uint8)
    fade = Image.fromarray(fade, "RGBA")
    img.paste(fade, (0, 0), fade)
    place_logo(img, dict(badge=NIGHT), 220, M - 6, M - 10)
    y = paint(img, a.head, M, top, size, lh, p["head"])
    lines_at(ImageDraw.Draw(img), a.subs, M, y + 30, 36, 52, p["sub"])
    place_domain(img, p, a)


LAYOUTS = {
    "classic": render_classic, "center": render_center, "number": render_number,
    "checklist": render_checklist, "card": render_card, "quote": render_quote,
    "phone": render_phone, "screenshot": render_screenshot, "photo": render_photo,
}


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--layout", choices=LAYOUTS)
    p.add_argument("--template", choices=["text", "screenshot"], help="old name: text is --layout classic")
    p.add_argument("--palette", choices=PALETTES, default="midnight")
    p.add_argument("--headline", required=True, help='lines split by "|" (the quote, for --layout quote)')
    p.add_argument("--sub", default="", help='support lines, split by "|"')
    p.add_argument("--tag", default="", help="a short label: the post's kind or its call to action")
    p.add_argument("--number", help="the big number (number layout)")
    p.add_argument("--items", help='two to four items split by "|" (checklist layout)')
    p.add_argument("--by", help="who said it (quote layout)")
    p.add_argument("--image", help="a screenshot or photo (phone, screenshot, photo layouts)")
    p.add_argument("--domain", default="luxwebstudio.dev")
    p.add_argument("--out", required=True, help="file name, e.g. demo-barber.png")
    p.add_argument("--outdir", default=DEFAULT_OUT)
    a = p.parse_args()
    a.layout = a.layout or {"text": "classic", "screenshot": "screenshot"}.get(a.template, "classic")
    a.head = a.headline.split("|")
    a.subs = a.sub.split("|") if a.sub else []

    palette = PALETTES[a.palette]
    img = background(palette, a.out)
    LAYOUTS[a.layout](a, palette, img)
    os.makedirs(a.outdir, exist_ok=True)
    path = os.path.join(a.outdir, a.out)
    img.save(path, "PNG", optimize=True)
    print(path)


if __name__ == "__main__":
    main()
