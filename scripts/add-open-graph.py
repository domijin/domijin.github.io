#!/usr/bin/env python3
"""Give the essay pages Open Graph and Twitter Card metadata.

The regenerated book pages under articles/ have a title, a description and
a canonical URL but no social metadata at all, so a shared link renders a
blank preview. This script adds:

  * Open Graph: title, description, url, image (with true dimensions),
    type, site name, locale, and published time from the sitemap, whose
    dates were verified against the original publications;
  * Twitter Cards: summary_large_image, title, description, image;
  * Article JSON-LD, so authorship and publication date are machine
    readable rather than only implied by the page furniture.

It also repairs the two legacy pages whose og:description swallowed a
MathJax configuration blob, and trims over-long legacy descriptions to a
sentence boundary, which is where every platform truncates them anyway.

Idempotent: pages that already carry og:title are left alone.

Usage:
  python3 scripts/add-open-graph.py [root_dir]
"""
import html
import os
import pathlib
import re
import sys

SITE = "https://domij.info"
SITE_NAME = "Domi Jin"
LOCALE = "en_GB"
TWITTER_CREATOR = "@domij_info"

DEFAULT_IMAGE = ("/images/Photo.JPG", 1777, 1777, "Domi Jin")

# The dissertation essay gets the sky map it produced: the image is the
# 662,772-cluster catalogue the chapter subtitle quotes.
IMAGE_OVERRIDES = {
    "/articles/research/astrophysics-bbh-dissertation.html": (
        "/images/all-sky.jpeg",
        1439,
        846,
        "All-sky map of the 662,772 globular clusters in the local universe",
    ),
}

TITLE_SUFFIX = " — Domi Jin"

MONTHS = {
    "January": "01", "February": "02", "March": "03", "April": "04",
    "May": "05", "June": "06", "July": "07", "August": "08",
    "September": "09", "October": "10", "November": "11", "December": "12",
}


def read_sitemap_dates(root: pathlib.Path):
    """Publication dates, keyed by site path, from the verified sitemap."""
    sm = root / "sitemap.xml"
    if not sm.is_file():
        return {}
    s = sm.read_text(encoding="utf-8")
    dates = {}
    for m in re.finditer(r"<loc>(.*?)</loc>\s*<lastmod>(.*?)</lastmod>", s, re.S):
        loc, lm = m.group(1).strip(), m.group(2).strip()
        if loc.startswith(SITE):
            dates[loc[len(SITE):] or "/"] = lm
    return dates


def meta(text, attr, value):
    m = re.search(rf'<meta\s+{attr}="{re.escape(value)}"\s+content="([^"]*)"', text)
    return html.unescape(m.group(1)) if m else None


def clean_text(s):
    return re.sub(r"\s+", " ", s or "").strip()


def truncate_at_sentence(desc, limit=300):
    """Cut a description at the last sentence boundary that fits.

    Loops until stable, so a single run leaves the file final rather than
    needing a second pass to converge.
    """
    out = desc
    for _ in range(4):
        if len(out) <= limit:
            break
        window = out[:limit]
        candidate = None
        for stop in (". ", "? ", "! "):
            idx = window.rfind(stop)
            if idx > limit * 0.5:
                candidate = window[: idx + 1].strip()
                break
        if candidate is None:
            cut = window.rfind(" ")
            candidate = (window[:cut] if cut > 0 else window).rstrip(",;:") + "…"
        if candidate == out:
            break
        out = candidate
    return out


def truncate_words(text, limit=160):
    """Shorten to roughly `limit` characters, cutting at a word boundary."""
    text = re.sub(r"\s+", " ", text or "").strip()
    if len(text) <= limit:
        return text
    cut = text[:limit].rfind(" ")
    return (text[:cut] if cut > 0 else text[:limit]).rstrip(",;:") + "…"


def build_block(path, url, title, desc, image, date, section):
    img, iw, ih, ialt = image
    img_url = SITE + img
    tags = [
        f'  <meta property="og:type" content="{"article" if section else "website"}" />',
        f'  <meta property="og:site_name" content="{SITE_NAME}" />',
        f'  <meta property="og:locale" content="{LOCALE}" />',
        f'  <meta property="og:title" content="{html.escape(title, quote=True)}" />',
        f'  <meta property="og:description" content="{html.escape(desc, quote=True)}" />',
        f'  <meta property="og:url" content="{url}" />',
        f'  <meta property="og:image" content="{img_url}" />',
        f'  <meta property="og:image:width" content="{iw}" />',
        f'  <meta property="og:image:height" content="{ih}" />',
        f'  <meta property="og:image:alt" content="{html.escape(ialt, quote=True)}" />',
        f'  <meta name="twitter:card" content="summary_large_image" />',
        f'  <meta name="twitter:site" content="{TWITTER_CREATOR}" />',
        f'  <meta name="twitter:creator" content="{TWITTER_CREATOR}" />',
        f'  <meta name="twitter:title" content="{html.escape(title, quote=True)}" />',
        f'  <meta name="twitter:description" content="{html.escape(desc, quote=True)}" />',
        f'  <meta name="twitter:image" content="{img_url}" />',
        f'  <meta name="twitter:url" content="{url}" />',
    ]
    if date:
        tags.append(f'  <meta property="article:published_time" content="{date}" />')
        tags.append(f'  <meta name="author" content="{SITE_NAME} (Dongming Jin)" />')
    if section:
        tags.append(f'  <meta property="article:section" content="{html.escape(section, quote=True)}" />')

    ld = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": desc,
        "url": url,
        "image": img_url,
        "author": {
            "@type": "Person",
            "name": "Domi Jin",
            "alternateName": "Dongming Jin",
            "url": SITE,
        },
        "publisher": {"@type": "Person", "name": SITE_NAME, "url": SITE},
    }
    if date:
        ld["datePublished"] = date
    if section:
        ld["articleSection"] = section
    tags.append(
        '  <script type="application/ld+json">'
        + json.dumps(ld, ensure_ascii=False)
        + "</script>"
    )
    return "\n".join(tags)


import json  # noqa: E402  (used by build_block)


def add_to_articles(root: pathlib.Path, dates):
    articles = root / "articles"
    added = 0
    for path in sorted(articles.rglob("*.html")):
        text = path.read_text(encoding="utf-8")
        if "og:title" in text:
            continue
        site_path = "/" + str(path.relative_to(root)).replace(os.sep, "/")
        url = SITE + site_path
        canonical = re.search(r'<link rel="canonical" href="([^"]+)"', text)
        if canonical:
            url = canonical.group(1)
        title_tag = re.search(r"<title>(.*?)</title>", text, re.S)
        title = clean_text(html.unescape(title_tag.group(1))) if title_tag else ""
        if title.endswith(TITLE_SUFFIX):
            title = title[: -len(TITLE_SUFFIX)]
        desc = meta(text, "name", "description") or ""
        if not title or not desc:
            print(f"  SKIP (no title/description): {site_path}")
            continue
        section_m = re.search(r'class="publication-badge">(.*?)</span>', text, re.S)
        section = clean_text(html.unescape(section_m.group(1))) if section_m else ""
        if path.name == "index.html":
            section = ""
            url = SITE + "/articles/"
        image = IMAGE_OVERRIDES.get(site_path, DEFAULT_IMAGE)
        date = dates.get(site_path) or dates.get("/articles/")
        block = build_block(site_path, url, title, desc, image, date, section)
        text = text.replace("</head>", f"{block}\n</head>", 1)
        path.write_text(text, encoding="utf-8")
        added += 1
    return added


def repair_legacy(root: pathlib.Path):
    """Fix descriptions that swallowed script blobs, and trim long ones."""
    # Build output and the regenerated book pages are excluded: the former
    # is rewritten by every export, the latter is handled above.
    skip_dirs = {".git", "node_modules", ".next", "out", "articles", "cluster",
                 "beta", "classic", "_next", "next"}
    fixed_noise, trimmed, filled_descs = 0, 0, 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in skip_dirs and not d.startswith(".")]
        for fn in sorted(filenames):
            if not fn.endswith(".html"):
                continue
            p = pathlib.Path(dirpath) / fn
            text = p.read_text(encoding="utf-8", errors="replace")
            if "og:description" not in text:
                continue
            m = re.search(r'(<meta property="og:description" content=")([^"]*)(")', text)
            if not m:
                continue
            stored = m.group(2)
            clean = html.unescape(stored)
            noised = False
            if "mathjaxscript" in clean or "MathJax.Hub" in clean or "function gtag" in clean:
                # Keep the readable lead-in, drop the script that followed it.
                cut = clean.find("if (")
                if cut > 40:
                    clean = clean[:cut]
                clean = re.sub(r"\s+", " ", clean).strip()
                if clean and not clean.endswith((".", "!", "?", "…")):
                    clean += "."
                noised = True
            clean = truncate_at_sentence(clean)
            # Compare against the stored attribute value, not the unescaped
            # one: re-encoding can differ from what the file already holds,
            # which would otherwise make the script re-write the same bytes.
            encoded = html.escape(clean, quote=True)
            if encoded != stored:
                updated = text.replace(m.group(0), m.group(1) + encoded + m.group(3))
                if updated != text:
                    p.write_text(updated, encoding="utf-8")
                    if noised:
                        fixed_noise += 1
                    else:
                        trimmed += 1

            # A page with an empty meta description leaves search engines to
            # invent one from the body. Reuse the (now repaired) social
            # description instead.
            md = re.search(r'(<meta name="description" content=")([^"]*)(")', text)
            if md and not md.group(2).strip():
                filled = html.escape(truncate_words(html.unescape(encoded)), quote=True)
                if filled != md.group(2):
                    text = text.replace(md.group(0), md.group(1) + filled + md.group(3))
                    p.write_text(text, encoding="utf-8")
                    filled_descs += 1
    return fixed_noise, trimmed, filled_descs


def main():
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    dates = read_sitemap_dates(root)
    added = add_to_articles(root, dates)
    noise, trimmed, filled = repair_legacy(root)
    print(f"og/twitter/article blocks added : {added}")
    print(f"legacy descriptions de-noised     : {noise}")
    print(f"legacy descriptions trimmed      : {trimmed}")
    print(f"empty meta descriptions filled   : {filled}")


if __name__ == "__main__":
    main()
