#!/usr/bin/env python3
"""Keep the outgoing generation's build assets across a deploy.

GitHub Pages serves whatever is committed to the repository, and it never
tells a browser that the HTML it cached yesterday now points at chunk files
that no longer exist. When that happens Next.js fails to load the chunk and
the visitor gets "Application error: a client-side exception has occurred"
instead of the site.

So: before the new build replaces the old one, collect the files the
currently deployed HTML points at, and put them back afterwards. One
generation of grace is enough — by the following release, no browser can
still be holding HTML from two generations back.

Two modes:

    collect <html_root> <repo_root> <dest> <asset_prefix>
    restore <src> <repo_root>

`html_root` is where the outgoing HTML lives (the repository root, or
`next/` for the staged mirror). `asset_prefix` is the URL prefix its assets
are served under ("" or "next/").
"""

import os
import re
import shutil
import sys
from pathlib import Path

# Matches "/_next/..." for the root build and "/next/_next/..." for the
# staged mirror.
ASSET = re.compile(r'(?:src|href)="(/[^"]*_next/[^"]+)"')

# Directories whose HTML does not belong to this build.
SKIP = {"next", "classic", "green-app", "articles", "docs", "scripts",
        "node_modules", ".git", "pdfs", "images", "beta", "pages", "theme",
        "feeds", "author", "category", "tags"}


def collect(html_root: Path, repo_root: Path, dest: Path, prefix: str):
    dest.mkdir(parents=True, exist_ok=True)

    refs = set()
    for html in html_root.rglob("*.html"):
        rel = html.relative_to(html_root)
        if rel.parts and rel.parts[0] in SKIP:
            continue
        try:
            text = html.read_text(encoding="utf-8", errors="replace")
        except OSError:
            continue
        refs.update(ASSET.findall(text))

    # The per-build manifest directory, which the app router fetches at
    # runtime using the build id baked into the HTML.
    static = repo_root.joinpath(prefix, "_next", "static")
    if static.is_dir():
        for d in static.iterdir():
            if d.is_dir() and d.name not in ("chunks", "css", "media"):
                for f in d.rglob("*"):
                    if f.is_file():
                        refs.add(f"/{prefix}_next/static/"
                                 + str(f.relative_to(static)).replace(os.sep, "/"))

    kept = 0
    for r in sorted(refs):
        src = repo_root / r.lstrip("/")
        if not src.is_file():
            continue
        out = dest / r.lstrip("/")
        out.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, out)
        kept += 1

    print(f"  collected {kept} asset(s) from the outgoing generation "
          f"({prefix or 'root'})")


def restore(src: Path, repo_root: Path):
    if not src.is_dir():
        return
    restored = 0
    for f in sorted(src.rglob("*")):
        if not f.is_file():
            continue
        dst = repo_root / f.relative_to(src)
        dst.parent.mkdir(parents=True, exist_ok=True)
        if not dst.exists():
            shutil.copy2(f, dst)
            restored += 1
    print(f"  restored {restored} asset(s) for clients still holding the "
          f"previous HTML")


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 1

    cmd = argv[1]
    if cmd == "collect" and len(argv) == 6:
        prefix = argv[5]
        collect(Path(argv[2]), Path(argv[3]), Path(argv[4]), prefix)
        return 0
    if cmd == "restore" and len(argv) == 4:
        restore(Path(argv[2]), Path(argv[3]))
        return 0

    print(__doc__)
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
