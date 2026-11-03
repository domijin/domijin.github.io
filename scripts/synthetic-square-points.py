#!/usr/bin/env python3
"""Render synthetic square points to validate the star-profile metric.

Writes a PNG with square point sprites of the same half-maximum size as the
real render, so the same analyser can be run against it as a control.

Usage:
  python3 scripts/synthetic-square-points.py <out.png> [half-width-px]
"""
import struct, sys, zlib


def write_png(path, w, h, rgb):
    raw = bytearray()
    for y in range(h):
        raw.append(0)  # filter: none
        raw += rgb[y * w * 3:(y + 1) * w * 3]

    def chunk(tag, data):
        c = struct.pack(">I", len(data)) + tag + data
        return c + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

    png = b"\x89PNG\r\n\x1a\n"
    png += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
    png += chunk(b"IDAT", zlib.compress(bytes(raw), 6))
    png += chunk(b"IEND", b"")
    open(path, "wb").write(png)


def main():
    path = sys.argv[1]
    half = int(sys.argv[2]) if len(sys.argv) > 2 else 9
    w = h = 400
    rgb = bytearray(w * h * 3)  # black background

    def put(x, y, v):
        if 0 <= x < w and 0 <= y < h:
            i = (y * w + x) * 3
            rgb[i] = rgb[i + 1] = rgb[i + 2] = max(rgb[i], v)

    # grid of square points with a flat-topped profile (like THREE.PointsMaterial)
    for gy in range(0, 6):
        for gx in range(0, 6):
            cx, cy = 40 + gx * 60, 40 + gy * 60
            for dy in range(-half, half + 1):
                for dx in range(-half, half + 1):
                    put(cx + dx, cy + dy, 255)

    write_png(path, w, h, rgb)
    print(f"wrote {path}: {w}x{h}, square points of half-width {half}px")


if __name__ == "__main__":
    main()
