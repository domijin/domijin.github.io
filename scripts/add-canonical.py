#!/usr/bin/env python3
"""Give every page a canonical URL.

The regenerated book pages have canonicals; the legacy Pelican archive has
none, so the same essay is reachable at two URLs that each claim to be the
original. That splits search ranking across duplicates. This script:

  * points a legacy page at its book equivalent where one exists;
  * points the old paginated home pages at the current home page;
  * gives every remaining page a self-referential canonical.

Idempotent: a page that already carries a canonical is left alone.

Usage:
  python3 scripts/add-canonical.py [root_dir]
"""
import glob
import os
import pathlib
import re
import sys

SITE = "https://domij.info"

# Build output, and the pages the Next.js export generates at the root.
SKIP_FILES = {
    "index.html", "404.html",
    os.path.join("cluster", "index.html"),
    os.path.join("404", "index.html"),
}
SKIP_DIRS = {".git", "node_modules", ".next", "out", "classic", "_next", "next"}

# The old Pelican home was paginated; those pages are now the archive.
PAGED_HOME = {"index2.html", "index3.html", "index4.html"}


def book_map(root: pathlib.Path):
    """slug -> /articles/... url, for the regenerated book essays."""
    arts = {}
    for f in glob.glob(str(root / "articles" / "*" / "*.html")):
        rel = os.path.relpath(f, root).replace(os.sep, "/")
        slug = os.path.basename(rel)[:-5]
        arts[slug] = "/" + rel
    return arts


def main():
    root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else ".").resolve()
    arts = book_map(root)
    added = redirected = 0

    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS and not d.startswith(".")]
        for fn in sorted(filenames):
            if not fn.endswith(".html"):
                continue
            p = pathlib.Path(dirpath) / fn
            rel = os.path.relpath(p, root).replace(os.sep, "/")
            if rel in SKIP_FILES:
                continue
            text = p.read_text(encoding="utf-8", errors="replace")
            if "<html" not in text or 'rel="canonical"' in text:
                continue

            if rel in PAGED_HOME:
                canonical = SITE + "/"
            elif os.path.basename(rel)[:-5] in arts:
                canonical = SITE + arts[os.path.basename(rel)[:-5]]
                redirected += 1
            else:
                canonical = SITE + "/" + rel

            link = f'    <link rel="canonical" href="{canonical}" />'
            # Insert just before </head>, after the last meta tag there.
            if "</head>" not in text:
                continue
            head = text[: text.index("</head>")]
            insert_at = head.rindex(">") + 1
            updated = head[:insert_at] + "\n" + link + head[insert_at:] + text[text.index("</head>"):]
            p.write_text(updated, encoding="utf-8")
            added += 1

    print(f"canonical links added : {added}")
    print(f"  of which point at a book essay instead of themselves: {redirected}")


if __name__ == "__main__":
    main()
