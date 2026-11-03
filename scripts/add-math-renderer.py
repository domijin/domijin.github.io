#!/usr/bin/env python3
"""Typeset the LaTeX in the standalone article pages.

The regenerated book pages carry real LaTeX (\tau_{\\mathrm{rh}},
\\mathcal{O}(N^3), …) but no typesetting engine, so the source was visible
as literal delimiters. This script:

  1. rewrites inline $...$ math to the unambiguous \\(...\\) form the legacy
     archive already uses (a bare $ is ambiguous with prices such as ~$30);
  2. repairs the three baby-AI cells where a previous converter dropped the
     delimiters and left an escaped LaTeX operator as an HTML entity;
  3. loads KaTeX and its auto-render extension on every article page.

Idempotent: pages that already carry the KaTeX marker are left alone.

Usage:
  python3 scripts/add-math-renderer.py [root_dir]
"""
import pathlib
import re
import sys

KATEX_VERSION = "0.16.11"
BASE = f"https://cdn.jsdelivr.net/npm/katex@{KATEX_VERSION}/"
CSS_INTEGRITY = "sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
JS_INTEGRITY = "sha384-7zkQWkzuo3B5mTepMUcHkMB5jZaolc2xDwL6VFqjFALcbeS9Ggm/Yr2r3Dy4lfFg"
AR_INTEGRITY = "sha384-43gviWU0YVjaDtb/GhzOouOXtZMP/7XUzwPTstBeZFe/+rCMvRwr4yROQP43s0Xk"

MARKER = "katex.min.css"

HEAD_BLOCK = f"""  <!-- LaTeX typesetting (KaTeX {KATEX_VERSION}) -->
  <link rel="stylesheet" href="{BASE}dist/katex.min.css" integrity="{CSS_INTEGRITY}" crossorigin="anonymous" />
  <script defer src="{BASE}dist/katex.min.js" integrity="{JS_INTEGRITY}" crossorigin="anonymous"></script>
  <script defer src="{BASE}dist/contrib/auto-render.min.js" integrity="{AR_INTEGRITY}" crossorigin="anonymous"
    onload="renderMathInElement(document.body,{{delimiters:[{{left:'\\\\(',right:'\\\\)',display:false}},{{left:'\\\\[',right:'\\\\]',display:true}}],throwOnError:false,ignoredTags:['script','noscript','style','textarea','pre','code','option']}});"></script>
"""

# Cells where an earlier converter stripped the $...$ delimiters and left the
# operator as an HTML entity inside a <code> span.
REPAIRS = {
    "articles/github/baby-ai.html": [
        (
            "<td>Hardware BOM &le; $150; 0 bytes unapproved WAN egress</td>",
            "<td>Hardware BOM \\(\\le \\$150\\); 0 bytes unapproved WAN egress</td>",
        ),
        (
            "<td><code>&ge; 3 tok/s</code> edge latency;",
            "<td>\\(\\ge 3\\text{ tok/s}\\) edge latency;",
        ),
        (
            "<td><code>&ge; 90%</code> abstention accuracy on ambiguous/high-regret prompts</td>",
            "<td>\\(\\ge 90\\%\\) abstention accuracy on ambiguous/high-regret prompts</td>",
        ),
    ],
}

# $...$ -> \(...\), ignoring already-escaped dollars.
DOLLAR_MATH = re.compile(r"(?<!\\)\$(?!\s)([^$\n]{1,200}?)(?<!\s)\$")


def convert_dollar_math(text: str) -> str:
    return DOLLAR_MATH.sub(lambda m: "\\(" + m.group(1) + "\\)", text)


def main():
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    articles = root / "articles"
    pages = sorted(articles.rglob("*.html"))
    injected = converted = repaired = 0

    for path in pages:
        text = path.read_text(encoding="utf-8")
        original = text

        for old, new in REPAIRS.get(str(path.relative_to(root)), []):
            if old in text:
                text = text.replace(old, new)
                repaired += 1

        if DOLLAR_MATH.search(text):
            text = convert_dollar_math(text)
            converted += 1

        if MARKER not in text and "</head>" in text:
            text = text.replace("</head>", f"{HEAD_BLOCK}</head>", 1)
            injected += 1

        if text != original:
            path.write_text(text, encoding="utf-8")

    print(f"katex version : {KATEX_VERSION}")
    print(f"pages scanned : {len(pages)}")
    print(f"renderer added: {injected}")
    print(f"pages with $..$ converted to \\(..\\): {converted}")
    print(f"cells repaired: {repaired}")


if __name__ == "__main__":
    main()
