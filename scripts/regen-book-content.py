#!/usr/bin/env python3
"""Regenerate green-app/src/data/bookContentData.ts from the proofread article Markdown.

The in-page reader must show exactly what the published essays say, so the bundle is
derived from /articles/**/*.md rather than hand-maintained.

Usage:  python3 scripts/regen-book-content.py
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "green-app/src/data/bookContentData.ts")

CJK = re.compile(r'[　-鿿＀-￯]')
LIST_RE = re.compile(r'^(?:[-*+]|\d+[.)])\s+(.*)$')
BLOCK_START = re.compile(r'^(?:#{1,6}\s|\||>|<figure|```)')


def is_cjk_boundary(text):
    """True when the last character is CJK, so wrapped lines join without a space."""
    return bool(text) and bool(CJK.match(text[-1]))


def split_blocks(body):
    """Split a Markdown body into blocks the in-page reader can render."""
    lines = body.split("\n")
    n = len(lines)
    blocks = []
    i = 0

    while i < n:
        s = lines[i].strip()
        if not s:
            i += 1
            continue

        # --- inline SVG figure: keep the whole <figure>…</figure> together ---
        if s.startswith("<figure"):
            buf = [lines[i]]
            i += 1
            while i < n and "</figure>" not in "\n".join(buf):
                buf.append(lines[i])
                i += 1
            blocks.append("\n".join(buf).strip())
            continue

        # --- fenced code -> raw <pre><code> so the reader renders it as code ---
        if s.startswith("```"):
            lang = s[3:].strip()
            i += 1
            code = []
            while i < n and not lines[i].strip().startswith("```"):
                code.append(lines[i].rstrip())
                i += 1
            i += 1  # closing fence
            esc = "\n".join(code).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            cls = f' class="language-{lang}"' if lang else ""
            blocks.append(f"<pre><code{cls}>{esc}</code></pre>")
            continue

        # --- heading ---
        if s.startswith("#"):
            blocks.append(s)
            i += 1
            continue

        # --- markdown table: keep the rows together ---
        if s.startswith("|"):
            buf = []
            while i < n and lines[i].strip().startswith("|"):
                buf.append(lines[i].rstrip())
                i += 1
            blocks.append("\n".join(buf))
            continue

        # --- list: bullets or ordered, normalised to "• " and grouped in one block ---
        if LIST_RE.match(s):
            items = []
            while i < n:
                s2 = lines[i].strip()
                if not s2:
                    # a blank line only ends the list if the next content is not a list item
                    j = i
                    while j < n and not lines[j].strip():
                        j += 1
                    if j < n and LIST_RE.match(lines[j].strip()):
                        i = j
                        continue
                    break
                m = LIST_RE.match(s2)
                if m:
                    items.append("• " + m.group(1).strip())
                elif s2.startswith("  ") and items:
                    items[-1] += " " + s2
                else:
                    break
                i += 1
            if items:
                blocks.append("\n".join(items))
            continue

        # --- block quote: flatten to one quoted line ---
        if s.startswith(">"):
            q = []
            while i < n and lines[i].strip().startswith(">"):
                q.append(lines[i].strip().lstrip(">").strip())
                i += 1
            blocks.append("> " + " ".join(x for x in q if x))
            continue

        # --- paragraph: rejoin soft-wrapped lines ---
        para = []
        while i < n and lines[i].strip() and not BLOCK_START.match(lines[i].strip()) \
                and not LIST_RE.match(lines[i].strip()):
            para.append(lines[i].strip())
            i += 1
        if not para:
            para = [lines[i].strip()]
            i += 1
        text = ""
        for p in para:
            if not text:
                text = p
            elif is_cjk_boundary(text):
                text += p
            else:
                text += " " + p
        blocks.append(text)

    return blocks


VENUE_BY_DIR = {
    "substack": "Substack (Domi’s Mind Waves)",
    "medium": "Medium",
    "github": "GitHub Specification",
    "blog": "Domi’s Universe (domij.info)",
    "research": "University of Texas at Arlington Doctoral Dissertation",
}


def extract_meta(text, path):
    lines = text.split("\n")
    title = re.sub(r'^#\s+', '', lines[0]).strip()

    kicker = ""
    for l in lines[1:6]:
        ls = l.strip()
        if ls.startswith("*") and ls.endswith("*") and len(ls) > 3:
            kicker = ls.strip("*").strip()
            break

    date = ""
    m = re.search(r'\(([A-Z][a-z]+ \d{4})\)', kicker) or \
        re.search(r'—\s*By Domi Jin\s*·\s*([A-Z][a-z]+ \d{4})', kicker)
    if m:
        date = m.group(1)
    if not date:
        m = re.search(r'(\d{4}[–-]\d{4})', kicker)
        if m:
            date = m.group(1)
    if not date:
        m = re.search(r'([A-Z][a-z]+ \d{4})', kicker)
        if m:
            date = m.group(1)

    venue, original = "", ""
    for l in lines:
        if "Originally published" in l or "First published in" in l:
            mv = re.search(r'\[([^\]]+)\]\((https?://[^)]+)\)', l)
            if mv:
                venue, original = mv.group(1), mv.group(2)
            break
    if not venue:
        venue = VENUE_BY_DIR[os.path.basename(os.path.dirname(path))]
    return title, date, venue, original


def main():
    articles = os.path.join(ROOT, "articles")
    mds = []
    for r, d, fs in os.walk(articles):
        for f in sorted(fs):
            if f.endswith(".md") and f != "README.md":
                mds.append(os.path.join(r, f))
    mds.sort()

    entries = []
    for p in mds:
        rel = "/articles/" + os.path.relpath(p, articles).replace(os.sep, "/")
        rel = rel[: -len(".md")] + ".html"   # the reader keys on the .html URL
        text = io.open(p, encoding="utf-8").read()

        title, date, venue, original = extract_meta(text, p)
        if not original:
            print(f"  ! no original URL for {rel}", file=sys.stderr)
        if not date:
            print(f"  ! no date for {rel}", file=sys.stderr)

        body_lines = []
        seen_kicker = False
        for l in text.split("\n")[1:]:
            ls = l.strip()
            if not seen_kicker:
                if ls.startswith("*") and ls.endswith("*") and len(ls) > 3:
                    seen_kicker = True
                continue
            if "Originally published" in ls or "First published in" in ls:
                continue
            body_lines.append(l)

        blocks = split_blocks("\n".join(body_lines).strip())
        entries.append((rel, title, date, venue, original, blocks))

    out = []
    out.append("// Auto-generated from /articles/**/*.md — do not edit by hand.")
    out.append("// Regenerate with: python3 scripts/regen-book-content.py")
    out.append("export interface BookEssayEntry {")
    out.append("  url: string;")
    out.append("  title: string;")
    out.append("  date: string;")
    out.append("  venue: string;")
    out.append("  originalUrl: string;")
    out.append("  blocks: string[];")
    out.append("}")
    out.append("")
    out.append("export const BOOK_ESSAYS_BY_URL: Record<string, BookEssayEntry> = {")
    for rel, title, date, venue, original, blocks in entries:
        out.append(f'  "{rel}": {{')
        out.append(f'    "url": "{rel}",')
        out.append(f'    "title": "{title.replace(chr(34), "&quot;")}",')
        out.append(f'    "date": "{date}",')
        out.append(f'    "venue": "{venue.replace(chr(34), "&quot;")}",')
        out.append(f'    "originalUrl": "{original}",')
        out.append('    "blocks": [')
        for b in blocks:
            esc = b.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
            out.append(f'      "{esc}",')
        out.append("    ],")
        out.append("  },")
    out.append("};")
    out.append("")

    io.open(OUT, "w", encoding="utf-8").write("\n".join(out))
    total = sum(len(e[5]) for e in entries)
    print(f"wrote {OUT} — {len(entries)} essays, {total} blocks")


if __name__ == "__main__":
    main()
