#!/usr/bin/env python3
"""Measure whether rendered stars are round discs or squares.

Decodes a PNG with the standard library and fits the brightness profile of
isolated bright points: a round sprite has a symmetric, radially falling
profile, while a square point has flat edges and bright corners.

The key metric is the ratio of brightness at the corners of a point's
half-maximum bounding box to the brightness at its edge midpoint. A square
point scores 1.000; a disc scores well below that because its corners fall
outside the half-maximum radius.

Usage:
  python3 scripts/measure-star-profile.py <screenshot.png> [--full]

Without --full the analysis is restricted to the globular-cluster panel of the
site; with --full it scans the whole frame, which is what the synthetic
control image needs.
"""
import struct, sys, zlib


def read_png(path):
    data = open(path, "rb").read()
    assert data[:8] == b"\x89PNG\r\n\x1a\n", "not a PNG"
    pos = 8
    idat = b""
    w = h = bitdepth = colortype = None
    while pos < len(data):
        length = struct.unpack(">I", data[pos:pos + 4])[0]
        ctype = data[pos + 4:pos + 8]
        chunk = data[pos + 8:pos + 8 + length]
        if ctype == b"IHDR":
            w, h, bitdepth, colortype = struct.unpack(">IIBB", chunk[:10])
        elif ctype == b"IDAT":
            idat += chunk
        elif ctype == b"IEND":
            break
        pos += 12 + length
    assert bitdepth == 8, f"unsupported bit depth {bitdepth}"
    channels = {0: 1, 2: 3, 4: 2, 6: 4}[colortype]
    raw = zlib.decompress(idat)
    stride = w * channels
    out = bytearray(h * stride)
    prev = bytearray(stride)
    p = 0
    for y in range(h):
        f = raw[p]; p += 1
        line = bytearray(raw[p:p + stride]); p += stride
        if f == 1:
            for i in range(channels, stride):
                line[i] = (line[i] + line[i - channels]) & 0xFF
        elif f == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 0xFF
        elif f == 3:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                line[i] = (line[i] + ((a + prev[i]) >> 1)) & 0xFF
        elif f == 4:
            for i in range(stride):
                a = line[i - channels] if i >= channels else 0
                b = prev[i]
                c = prev[i - channels] if i >= channels else 0
                pp = a + b - c
                pa, pb, pc = abs(pp - a), abs(pp - b), abs(pp - c)
                pr = a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)
                line[i] = (line[i] + pr) & 0xFF
        out[y * stride:(y + 1) * stride] = line
        prev = line
    return w, h, channels, out


def main():
    path = sys.argv[1]
    w, h, ch, px = read_png(path)
    lum = bytearray(w * h)
    for i in range(w * h):
        r, g, b = px[i * ch], px[i * ch + 1], px[i * ch + 2]
        lum[i] = (r * 299 + g * 587 + b * 114) // 1000

    # Find isolated bright local maxima inside the cluster panel region.
    def at(x, y):
        return lum[y * w + x]

    # Region of interest: the globular-cluster panel of the real render, or
    # the whole frame of the synthetic control (which has no panel).
    full = "--full" in sys.argv
    x0, x1 = (4, w - 4) if full else (120, 700)
    y0, y1 = (4, h - 4) if full else (240, 700)

    peaks = []
    for y in range(y0, y1):
        for x in range(x0, x1):
            v = at(x, y)
            if v < 120:
                continue
            if v >= at(x - 1, y) and v > at(x + 1, y) and v >= at(x, y - 1) and v > at(x, y + 1):
                # isolate: no brighter neighbour within 4 px
                if max(at(x + dx, y + dy) for dx in range(-4, 5) for dy in range(-4, 5)) == v:
                    peaks.append((x, y, v))

    print(f"image {w}x{h}, isolated bright peaks found: {len(peaks)}")
    if not peaks:
        print("no isolated peaks to measure")
        return

    # For each peak, measure the horizontal and vertical half-width at half max
    # and check whether the four diagonal corners are darker than the edges.
    hw, vw, corner_ratio = [], [], []
    for x, y, v in peaks[:200]:
        if v < 150:
            continue
        half = v / 2
        l = x
        while l > 0 and at(l, y) > half:
            l -= 1
        r = x
        while r < w - 1 and at(r, y) > half:
            r += 1
        t = y
        while t > 0 and at(x, t) > half:
            t -= 1
        b = y
        while b < h - 1 and at(x, b) > half:
            b += 1
        hspan, vspan = r - l, b - t
        if hspan < 2 or vspan < 2:
            continue
        hw.append(hspan); vw.append(vspan)
        # True corner of the half-maximum bounding box versus the edge midpoint.
        # For a square point the corner sits exactly on the half-max contour
        # (ratio ~1.0); for a disc it lies outside the half-max radius and is
        # much dimmer.
        corner = at(l + 1, t + 1)
        edge = at((l + r) // 2, (t + b) // 2)
        if edge > 0:
            corner_ratio.append(corner / edge)

    if not hw:
        print("peaks too small to measure")
        return
    n = len(hw)
    print(f"measured {n} peaks")
    print(f"  horizontal half-max width: mean {sum(hw)/n:.2f} px")
    print(f"  vertical   half-max width: mean {sum(vw)/n:.2f} px")
    print(f"  width/height anisotropy   : {abs(sum(hw)/sum(vw) - 1)*100:.1f}%  (square point -> large, disc -> small)")
    print(f"  diagonal/edge brightness  : mean {sum(corner_ratio)/len(corner_ratio):.3f}"
          f"  (square point -> ~1.0, disc -> well below 1.0)")


if __name__ == "__main__":
    main()
