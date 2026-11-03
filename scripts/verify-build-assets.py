#!/usr/bin/env python3
"""Check that every build asset the repository publishes still exists.

A deploy that removes a chunk while a build-id directory naming it is still
in the repository leaves a browser that cached that build's HTML unable to
load it — Next.js throws, and the page becomes "Application error: a
client-side exception has occurred" instead of the site. GitHub Pages never
tells a browser that, so the repository has to stay self-consistent on its
own.

Three checks, for the root build and for the staged mirror:

1. Every asset the deployed HTML names exists on disk.
2. Every build-id directory present still has both of its manifests.
3. Every chunk a kept generation's manifest names is still in the tree —
   this is what catches a generation that was kept for a cached client but
   then half-pruned.

Exits non-zero and lists what is missing.
"""

import re
import sys
from pathlib import Path

ASSET = re.compile(r'(?:src|href)="(/[^"]*_next/[^"]+)"')
SKIP = {"next", "classic", "green-app", "articles", "docs", "scripts",
        "node_modules", ".git", "pdfs", "images", "beta", "pages", "theme",
        "feeds", "author", "category", "tags"}
CHUNK = re.compile(r'"(static/chunks/[^"]+)"')


def check(repo: Path, prefix: str):
    """Check one build. `prefix` is its URL prefix ("" or "next/")."""
    problems = []
    html_root = repo / prefix if prefix else repo
    static = repo / prefix / "_next" / "static" if prefix else repo / "_next" / "static"

    # 1. every asset the deployed HTML names
    pages = []
    for html in html_root.rglob("*.html"):
        rel = html.relative_to(html_root)
        if rel.parts and rel.parts[0] in SKIP:
            continue
        pages.append(html)
        text = html.read_text(encoding="utf-8", errors="replace")
        for ref in set(ASSET.findall(text)):
            if not (repo / ref.lstrip("/")).is_file():
                problems.append(f"{html}: missing asset {ref}")

    # 2 & 3. every generation kept in the tree is complete
    if static.is_dir():
        for d in sorted(static.iterdir()):
            if not d.is_dir() or d.name in ("chunks", "css", "media"):
                continue
            manifest = d / "_buildManifest.js"
            if not manifest.is_file():
                problems.append(f"{d}: no _buildManifest.js")
                continue
            if not (d / "_ssgManifest.js").is_file():
                problems.append(f"{d}: no _ssgManifest.js")
            for chunk in set(CHUNK.findall(manifest.read_text(encoding="utf-8",
                                                              errors="replace"))):
                # Manifest paths are relative to the build's "_next" directory.
                if not (static.parent / chunk).is_file():
                    problems.append(f"{d}: manifest names {chunk}, "
                                    f"which is not in the tree")

    return len(pages), problems


def main():
    repo = Path(__file__).resolve().parent.parent
    failures = 0

    for prefix in ("", "next/"):
        label = prefix or "root"
        pages, problems = check(repo, prefix)
        if problems:
            failures += len(problems)
            print(f"FAIL {label}: {len(problems)} problem(s)")
            for p in problems:
                print(f"   {p}")
        else:
            print(f"ok   {label}: {pages} page(s), every build asset present")

    if failures:
        print(f"\n{failures} problem(s)")
        return 1
    print("\nall build assets present")
    return 0


if __name__ == "__main__":
    sys.exit(main())
