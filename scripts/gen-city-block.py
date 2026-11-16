#!/usr/bin/env python3
"""Generates src/assets/city-block.svg, the axonometric city block on the homepage.

All colour comes from CSS classes (.ax-*) defined in src/styles/global.css, so the
drawing follows the light and dark themes. Re-run after changing the scene:

    python3 scripts/gen-city-block.py

It also prints the hotspot positions (percent of the drawing) used by
src/components/CityIndex.astro.
"""
import random
from pathlib import Path

OX, OY, W, H = 390, 170, 924, 646


def P(x, y, z=0):
    return (OX + (x - y) * 36, OY + (x + y) * 18 - z * 36)


def pts(points):
    return " ".join(f"{a:.1f},{b:.1f}" for a, b in points)


out = []


def poly(p3, cls):
    out.append(f'<polygon class="{cls}" points="{pts([P(*p) for p in p3])}"/>')


def line(a, b, cls):
    (x1, y1), (x2, y2) = P(*a), P(*b)
    out.append(f'<line class="{cls}" x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}"/>')


def box(x0, x1, y0, y1, h, top="ax-top"):
    poly([(x0, y1, 0), (x1, y1, 0), (x1, y1, h), (x0, y1, h)], "ax-left")
    poly([(x1, y0, 0), (x1, y1, 0), (x1, y1, h), (x1, y0, h)], "ax-right")
    poly([(x0, y0, h), (x1, y0, h), (x1, y1, h), (x0, y1, h)], top)
    z = 0.7
    while z < h - 0.2:
        line((x0 + 0.15, y1, z), (x1 - 0.15, y1, z), "ax-floor")
        line((x1, y0 + 0.15, z), (x1, y1 - 0.15, z), "ax-floor")
        z += 0.7


def tree(x, y, r=12):
    line((x, y, 0), (x, y, 0.55), "ax-trunk")
    cx, cy = P(x, y, 0.85)
    out.append(f'<circle class="ax-veg" cx="{cx:.1f}" cy="{cy:.1f}" r="{r}"/>')
    out.append(
        f'<path class="ax-veg-line" d="M{cx - r * 0.45:.1f} {cy + 1:.1f} q{r * 0.45:.1f} {-r * 0.7:.1f} {r * 0.9:.1f} 0"/>'
    )


random.seed(7)

# Ground slab
poly([(0, 10, 0), (14, 10, 0), (14, 10, -0.4), (0, 10, -0.4)], "ax-slab-l")
poly([(14, 0, 0), (14, 10, 0), (14, 10, -0.4), (14, 0, -0.4)], "ax-slab-r")
poly([(0, 0, 0), (14, 0, 0), (14, 10, 0), (0, 10, 0)], "ax-ground")

# Street
poly([(0, 3.3, 0), (14, 3.3, 0), (14, 4.6, 0), (0, 4.6, 0)], "ax-street")
x = 0.3
while x < 13.6:
    line((x, 3.95, 0), (x + 0.5, 3.95, 0), "ax-dash")
    x += 1.0

# Back row; the first building carries the green roof
box(0.8, 3.2, 0.6, 3.0, 4.2, top="ax-veg")
for _ in range(46):
    gx, gy = random.uniform(1.0, 3.0), random.uniform(0.8, 2.8)
    line((gx, gy, 4.2), (gx, gy, 4.2 + random.uniform(0.08, 0.2)), "ax-veg-line")
box(4.0, 6.6, 0.6, 3.0, 2.6)
box(7.4, 9.4, 0.6, 3.0, 5.0)
box(10.2, 13.2, 0.6, 3.0, 1.9)

# Street trees
for tx in (0.9, 2.9, 4.9, 6.9, 8.9, 10.9, 12.9):
    tree(tx, 3.55)

# Water square (sunken)
x0, x1, y0, y1, d = 0.8, 4.4, 5.0, 7.2, 0.45
out.append(f'<clipPath id="ax-pit"><polygon points="{pts([P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)])}"/></clipPath>')
out.append('<g clip-path="url(#ax-pit)">')
poly([(x0, y0, -d), (x1 + 1, y0, -d), (x1 + 1, y1 + 1, -d), (x0, y1 + 1, -d)], "ax-pit-floor")
poly([(x0 + 0.5, y0 + 0.5, -d), (x1 + 0.2, y0 + 0.5, -d), (x1 + 0.2, y1 + 0.2, -d), (x0 + 0.5, y1 + 0.2, -d)], "ax-water")
for k in range(5):
    wy = y0 + 0.9 + k * 0.42
    line((x0 + 0.9, wy, -d), (x0 + 1.6, wy, -d), "ax-water-line")
    line((x0 + 2.2, wy + 0.15, -d), (x0 + 3.0, wy + 0.15, -d), "ax-water-line")
poly([(x0, y0, 0), (x1, y0, 0), (x1, y0, -d), (x0, y0, -d)], "ax-right")
poly([(x0, y0, 0), (x0, y1, 0), (x0, y1, -d), (x0, y0, -d)], "ax-left")
for s in (0.15, 0.3):
    line((x0, y0 + s, -s), (x1, y0 + s, -s), "ax-floor")
out.append("</g>")
poly([(x0, y0, 0), (x1, y0, 0), (x1, y1, 0), (x0, y1, 0)], "ax-outline")

box(5.2, 7.6, 5.2, 7.2, 1.8)

# Cool schoolyard
poly([(8.4, 5.0, 0), (10.8, 5.0, 0), (10.8, 7.2, 0), (8.4, 7.2, 0)], "ax-yard")
cx, cy = P(9.6, 6.1)
out.append(f'<ellipse class="ax-court" cx="{cx:.1f}" cy="{cy:.1f}" rx="30" ry="15"/>')
line((8.4, 6.1, 0), (10.8, 6.1, 0), "ax-court")
for t in ((8.7, 5.3), (10.5, 5.3), (8.7, 6.9)):
    tree(*t, r=10)
box(11.5, 13.4, 5.2, 7.2, 3.0)

# Living shoreline
poly([(0, 7.7, 0), (14, 7.7, 0), (14, 8.5, 0), (0, 8.5, 0)], "ax-marsh")
for _ in range(150):
    rx, ry = random.uniform(0.1, 13.9), random.uniform(7.75, 8.6)
    line((rx, ry, 0), (rx + random.uniform(-0.05, 0.05), ry, random.uniform(0.15, 0.38)), "ax-veg-line")

# Water
poly([(0, 8.5, 0), (14, 8.5, 0), (14, 10, 0), (0, 10, 0)], "ax-river")
for _ in range(40):
    wx, wy = random.uniform(0.2, 13.0), random.uniform(8.75, 9.85)
    line((wx, wy, 0), (wx + random.uniform(0.3, 0.8), wy, 0), "ax-water-line")
line((0, 8.5, 0), (14, 8.5, 0), "ax-shore")
poly([(0, 0, 0), (14, 0, 0), (14, 10, 0), (0, 10, 0)], "ax-outline")

svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" class="ax" aria-hidden="true" focusable="false">\n' + "\n".join(out) + "\n</svg>\n"
target = Path(__file__).resolve().parent.parent / "src" / "assets" / "city-block.svg"
target.write_text(svg)

anchors = {
    "green-roof": (2.0, 1.8, 4.2),
    "water-square": (2.6, 6.1, 0),
    "street-trees": (6.9, 3.55, 1.1),
    "cool-schoolyard": (9.6, 6.1, 0),
    "living-shoreline": (7.0, 9.0, 0),
}
for name, a in anchors.items():
    sx, sy = P(*a)
    print(f"{name}: left {sx / W * 100:.2f}%  top {sy / H * 100:.2f}%")
