#!/usr/bin/env python3
"""Render "How a model's knowledge boundary grows" — the GIF for the
front-page section on how a language model works.

The storyboard, the annotations and the reasoning behind every choice live in
docs/knowledge-growth-gif-script.md. This file is the implementation of it.

The shape is the point: collective human knowledge is drawn as a spiky closed
outline, and the model grows as a smoother version of the same silhouette. At
the end the model's boundary is still inside the human one everywhere except
in the two fields where the frontier is sharpest and most codifiable — game
playing and protein structure — where it crosses. Mathematics it comes close
to without crossing.

Usage:
    python3 scripts/make-knowledge-growth-gif.py [out_path]
"""
import math
import os
import sys

from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "images", "knowledge-growth.gif")

W, H = 1000, 760         # final size — the page shows it up to 1088px wide
SS = 2                   # supersampling factor
FRAME_COUNT = 40

BG = (11, 32, 52)
HUMAN = (29, 174, 223)    # collective human knowledge
HUMAN_DIM = (18, 60, 82)
MODEL_EDGE = (125, 211, 252)
EXPERT = (251, 191, 36)
STREAM = (251, 191, 36)
CROSS = (244, 114, 182)
TEXT = (226, 232, 240)
TEXT_DIM = (148, 163, 184)

CX, CY = W / 2, 400.0
R_BASE = 112.0            # the base radius of the human shape
SIG_HUMAN = 0.075         # sharp spikes
SIG_MODEL = 0.17          # the model's lobes are broader — it is a smoothed copy
SIG_MODEL_BASE = 0.16

FONT_PATH = "/System/Library/Fonts/Menlo.ttc"

# Everything measured in the old 760px canvas scales with the canvas.
K = W / 760.0

# The model's radius is R_BASE; this scales how large it is *drawn*, so the
# shape fills the frame without changing a single number of the model.
DRAW = 1.6

# --------------------------------------------------------------------------
# The domains. Each is one spike in the human shape: the depth of that
# field's knowledge. The lengths are deliberately uneven — the essay's point
# that human knowledge is anisotropic.
#
#   angle   degrees, clockwise from straight up
#   amp     how far this field pushes the human outline outward
#   gain    how much further the frontier moves when someone breaks through
#   reach   how close the model gets to the human outline here, at the end.
#           Above 1.0 means it crosses.
#   t       the frame at which this field has its breakthrough
# --------------------------------------------------------------------------
DOMAINS = [
    dict(angle=-90, amp=0.06, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=-64, amp=0.05, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=-38, amp=0.42, gain=0.18, reach=1.045, label="AlphaGo", t=17),
    dict(angle=-15, amp=0.07, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=8, amp=0.40, gain=0.17, reach=1.035, label="AlphaFold", t=22),
    dict(angle=31, amp=0.05, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=53, amp=0.36, gain=0.15, reach=0.965, label="mathematics", t=27),
    dict(angle=75, amp=0.06, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=96, amp=0.16, gain=0.09, reach=0.88, label="LLM alignment", t=31),
    dict(angle=118, amp=0.05, gain=0.05, reach=0.88, label="wet-lab protocol", t=None),
    dict(angle=140, amp=0.16, gain=0.08, reach=0.88, label="ad auctions", t=None),
    dict(angle=162, amp=0.04, gain=0.05, reach=0.88, label="traffic control", t=20),
    dict(angle=184, amp=0.06, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=206, amp=0.04, gain=0.04, reach=0.88, label="airworthiness", t=25),
    dict(angle=228, amp=0.05, gain=0.00, reach=0.84, label=None, t=None),
    dict(angle=250, amp=0.05, gain=0.05, reach=0.88, label="cluster dynamics", t=29),
    dict(angle=272, amp=0.06, gain=0.00, reach=0.84, label=None, t=None),
]

# --------------------------------------------------------------------------
# Annotations. Each entry is (first_frame, text).
# --------------------------------------------------------------------------
ANNOTATIONS = [
    (0, "A sketch: how a model's knowledge boundary grows"),
    (4, "collective human knowledge — anisotropic: deep in some fields, thin in others"),
    (10, "a model starts small — the boundary is the edge of what it can recall"),
    (14, "an expert works a frontier"),
    (17, "a breakthrough moves the frontier out"),
    (20, "the result becomes training data — and the boundary moves"),
    (26, "and again — in fields where the graph is thin, one good result is worth a lot"),
    (32, "the singularity moment is not consciousness"),
    (35, "it is the boundary reaching the frontier"),
    (37, "and where the frontier is sharpest, it goes past"),
]

LONG_MS = 900
SHORT_MS = 300


def font(size, index=0):
    return ImageFont.truetype(FONT_PATH, size * SS, index=index)


def annotation_for(frame):
    text = ANNOTATIONS[0][1]
    for start, t in ANNOTATIONS:
        if frame >= start:
            text = t
    return text


def is_annotation_start(frame):
    return any(f == frame for f, _ in ANNOTATIONS)


def ease(t):
    return t * t * (3 - 2 * t)


def angle_of(d):
    return math.radians(d["angle"] - 90.0)


def gauss(theta, centre, sigma):
    delta = (theta - centre + math.pi) % (2 * math.pi) - math.pi
    return math.exp(-(delta ** 2) / (2 * sigma ** 2))


def amp_now(d, frame):
    """How far the field pushes the human outline out at this frame."""
    if d["t"] is None or frame < d["t"]:
        return d["amp"]
    grow = min(1.0, (frame - d["t"]) / 4.0)
    return d["amp"] + d["gain"] * ease(grow)


def reach_now(d, frame):
    """How close the model gets to the human outline in this field."""
    if d["t"] is None or frame < d["t"]:
        return 0.0
    grow = min(1.0, (frame - d["t"]) / 9.0)
    return d["reach"] * ease(grow)


def fill_level(frame):
    """How much of the human shape the model's own body covers."""
    t = max(0.0, min(1.0, (frame - 10) / (FRAME_COUNT - 12)))
    return 0.84 * ease(t)


def human_radius(theta, frame):
    r = R_BASE
    for d in DOMAINS:
        r += R_BASE * amp_now(d, frame) * gauss(theta, angle_of(d), SIG_HUMAN)
    return r


def model_radius(theta, frame):
    """The model's boundary: a smoothed copy of the human shape, filled to a
    level that grows, then pushed locally toward the fields it has learned."""
    body = R_BASE
    for d in DOMAINS:
        body += R_BASE * amp_now(d, frame) * 0.72 * gauss(theta, angle_of(d), SIG_MODEL_BASE)
    r = fill_level(frame) * body

    for d in DOMAINS:
        if d["t"] is None:
            continue
        reach = reach_now(d, frame)
        if reach <= 0:
            continue
        w = gauss(theta, angle_of(d), SIG_MODEL)
        if w < 0.02:
            continue
        target = reach * human_radius(theta, frame)
        r += w * max(0.0, target - r)
    return r


def boundary_points(frame, points=300, fn=model_radius):
    pts = []
    for i in range(points):
        a = 2 * math.pi * i / points
        r = fn(a, frame) * DRAW
        pts.append((CX + r * math.cos(a), CY + r * math.sin(a)))
    return pts


def crossings(frame, points=300):
    """Where the model's boundary is outside the human one."""
    spans = []
    start = None
    for i in range(points):
        a = 2 * math.pi * i / points
        out = model_radius(a, frame) > human_radius(a, frame) + 0.6
        if out and start is None:
            start = a
        elif not out and start is not None:
            spans.append((start, a))
            start = None
    if start is not None:
        spans.append((start, 2 * math.pi))
    return spans


def dashed_span(draw, a0, a1, frame, colour, width, steps=None):
    """The human boundary between two angles, dashed.

    This is where the model's edge has gone past the human one, so it has
    to be drawn on the human boundary itself — an arc on the base circle
    says nothing about where anything happened.
    """
    span = a1 - a0
    n = steps or max(6, int(span / 0.05))
    on = True
    for i in range(n):
        if on:
            t0 = a0 + span * i / n
            t1 = a0 + span * (i + 1) / n
            r0 = human_radius(t0, frame) * DRAW
            r1 = human_radius(t1, frame) * DRAW
            draw.line(
                [
                    ((CX + r0 * math.cos(t0)) * SS, (CY + r0 * math.sin(t0)) * SS),
                    ((CX + r1 * math.cos(t1)) * SS, (CY + r1 * math.sin(t1)) * SS),
                ],
                fill=colour,
                width=width,
            )
        on = not on


def dashed_arc(draw, cx, cy, r, a0, a1, colour, width, dash=7, gap=5):
    span = a1 - a0
    if span <= 0:
        return
    step = (dash + gap) / r
    t = a0
    while t < a1:
        draw.arc([cx - r, cy - r, cx + r, cy + r],
                 math.degrees(t), math.degrees(min(t + dash / r, a1)), fill=colour, width=width)
        t += step


def dashed_line(draw, p0, p1, colour, width, dash=8, gap=6):
    x0, y0 = p0
    x1, y1 = p1
    dist = math.hypot(x1 - x0, y1 - y0)
    if dist < 1:
        return
    ux, uy = (x1 - x0) / dist, (y1 - y0) / dist
    t = 0.0
    while t < dist:
        seg = min(dash, dist - t)
        draw.line([x0 + ux * t, y0 + uy * t, x0 + ux * (t + seg), y0 + uy * (t + seg)],
                  fill=colour, width=width)
        t += dash + gap


def render(frame):
    img = Image.new("RGB", (W * SS, H * SS), BG)
    d = ImageDraw.Draw(img)
    s = SS

    # --- the human shape: spiky, and the same silhouette as the model's ----
    human_pts = [(x * s, y * s) for x, y in boundary_points(frame, fn=human_radius)]
    if frame >= 4:
        d.polygon(human_pts, fill=(10, 30, 49))
        d.line(human_pts + [human_pts[0]], fill=HUMAN, width=3 * s, joint="curve")
    else:
        d.line(human_pts + [human_pts[0]], fill=HUMAN_DIM, width=3 * s, joint="curve")

    # --- the model's boundary, filled inside it ----------------------------
    if frame >= 10:
        model_pts = [(x * s, y * s) for x, y in boundary_points(frame)]
        d.polygon(model_pts, fill=(13, 38, 66))
        d.line(model_pts + [model_pts[0]], fill=MODEL_EDGE, width=3 * s, joint="curve")

    # --- the labels, at the tip of each spike ------------------------------
    for idx, dom in enumerate(DOMAINS):
        if not dom["label"]:
            continue
        if frame < 6 + idx // 2:
            continue
        a = angle_of(dom)
        r = human_radius(a, frame) * DRAW
        lx = (CX + (r + 18) * math.cos(a)) * s
        ly = (CY + (r + 18) * math.sin(a)) * s
        anchor = "mm"
        if abs(math.cos(a)) > 0.72:
            anchor = "lm" if math.cos(a) > 0 else "rm"
        d.text((lx, ly), dom["label"], font=font(13), fill=TEXT_DIM, anchor=anchor)

    # --- the expert's result, on the spike it was made on ------------------
    for dom in DOMAINS:
        if dom["t"] is None or frame < dom["t"] - 2:
            continue
        a = angle_of(dom)
        r = human_radius(a, frame) * DRAW
        tx = (CX + r * math.cos(a)) * s
        ty = (CY + r * math.sin(a)) * s
        rad = 5 * s
        d.ellipse([tx - rad, ty - rad, tx + rad, ty + rad], fill=EXPERT)

    # --- the crossings -----------------------------------------------------
    if frame >= 30:
        for a0, a1 in crossings(frame):
            dashed_span(d, a0, a1, frame, CROSS, 4 * s)

    # --- distillation: the breakthrough flows into the model ----------------
    for dom in DOMAINS:
        if dom["t"] is None or frame < dom["t"] + 1:
            continue
        a = angle_of(dom)
        r = human_radius(a, frame) * DRAW
        tip_x = CX + r * math.cos(a)
        tip_y = CY + r * math.sin(a)
        mr = model_radius(a, frame) * DRAW
        edge_x = CX + mr * math.cos(a)
        edge_y = CY + mr * math.sin(a)
        dashed_line(d, (tip_x * s, tip_y * s), (edge_x * s, edge_y * s), STREAM, 3 * s, dash=9 * s, gap=8 * s)

    # --- the annotation -----------------------------------------------------
    text = annotation_for(frame)
    f = font(17 if frame >= 4 else 21)
    d.text((32 * s, 30 * s), text, font=f, fill=TEXT if frame >= 4 else TEXT_DIM)

    legend = "spiky outline: collective human knowledge  ·  solid boundary: what the model can recall"
    d.text((32 * s, (H - 22) * s), legend, font=font(13), fill=TEXT_DIM)

    return img.resize((W, H), Image.LANCZOS)


def main():
    frames = []
    durations = []
    for f in range(FRAME_COUNT):
        frames.append(render(f))
        durations.append(LONG_MS if is_annotation_start(f) else SHORT_MS)

    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=True,
        disposal=2,
    )
    size = os.path.getsize(OUT) / 1024
    print(f"wrote {OUT} — {FRAME_COUNT} frames, {sum(durations)/1000:.1f}s, {size:.0f} KB")


if __name__ == "__main__":
    main()
