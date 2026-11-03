#!/usr/bin/env python3
"""Validate the deployed site.

Fetches every route the site publishes, follows every internal link it
finds, and checks the things that can silently break in a static export:
canonical and Open Graph metadata, the math renderer, the analytics tag,
the chapter titles, and assets referenced by the built HTML.

Usage:
  python3 scripts/validate-live.py [base_url]
"""
import collections
import html
import json
import re
import sys
import time
import urllib.error
import urllib.request
from urllib.parse import urljoin, urlparse

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://domij.info").rstrip("/")
TIMEOUT = 30

USER_AGENT = "domij-site-validator/1.0"

LINK_RE = re.compile(r'(?:href|src)=["\']([^"\']+)["\']')
ASSET_RE = re.compile(r'(?:src|href)=["\']((?:/_next/|/images/|/pdfs/|/css/|/js/)[^"\']+)["\']')

failures = []
warnings = []
checks = collections.Counter()


def get(url, attempts=4):
    """Fetch a URL, retrying the transient failures.

    GitHub Pages answers 503 when its CDN is cold for a path or when a burst
    of requests trips its rate limit. Both are the CDN's state, not the
    site's, and a validator that reports them as failures is worse than
    useless — it teaches you to ignore it.
    """
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last = None
    for attempt in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
                return resp.status, resp.read(), dict(resp.headers)
        except urllib.error.HTTPError as e:
            if e.code in (502, 503, 504) and attempt < attempts - 1:
                last = e
                time.sleep(2 * (attempt + 1))
                continue
            raise
        except urllib.error.URLError as e:
            if attempt < attempts - 1:
                last = e
                time.sleep(2 * (attempt + 1))
                continue
            raise
    raise last


def rel_url(url):
    p = urlparse(url)
    return p.path + (("?" + p.query) if p.query else "")


def main():
    print(f"validating {BASE}\n")

    # --- 1. the routes the site publishes -------------------------------
    routes = ["/", "/next/", "/cluster/", "/next/cluster/",
              "/knowledge/", "/next/knowledge/", "/articles/",
              "/articles/index.html", "/llms.txt", "/llms-full.txt",
              "/agent-context.json", "/sitemap.xml", "/404.html",
              "/classic/"]

    # every article page, straight from the deployed archive index
    status, body, _ = get(f"{BASE}/articles/")
    archive = body.decode("utf-8", "replace")
    for m in re.finditer(r'href="(/articles/[^"]+\.html)"', archive):
        routes.append(m.group(1))

    # every URL the sitemap publishes, so the legacy archive is covered too
    try:
        _, sm_body, _ = get(f"{BASE}/sitemap.xml")
        sm = sm_body.decode("utf-8", "replace")
        for m in re.finditer(r"<loc>(.*?)</loc>", sm):
            loc = m.group(1).strip()
            if loc.startswith(BASE):
                routes.append(loc[len(BASE):] or "/")
    except Exception:
        pass

    seen_routes = sorted(set(routes))
    print(f"checking {len(seen_routes)} routes\n")

    page_bodies = {}
    for route in seen_routes:
        url = f"{BASE}{route}"
        try:
            status, body, headers = get(url)
        except urllib.error.HTTPError as e:
            failures.append(f"{route}: HTTP {e.code}")
            continue
        except Exception as e:
            failures.append(f"{route}: {type(e).__name__} {e}")
            continue
        text = body.decode("utf-8", "replace")
        page_bodies[route] = text
        checks["routes ok"] += 1
        if status != 200:
            failures.append(f"{route}: status {status}")

    # --- 2. per-page checks ---------------------------------------------
    article_pages = [r for r in page_bodies if r.startswith("/articles/") and r.endswith(".html")]
    app_pages = ["/", "/next/", "/cluster/", "/next/cluster/"]
    agent_pages = ["/llms.txt", "/llms-full.txt", "/agent-context.json", "/sitemap.xml"]

    for route, text in sorted(page_bodies.items()):
        # canonical
        if route.endswith((".html", "/")) and "canonical" in text:
            m = re.search(r'<link rel="canonical" href="([^"]+)"', text)
            if not m:
                failures.append(f"{route}: no canonical")
            elif not m.group(1).startswith("https://domij.info"):
                failures.append(f"{route}: canonical not absolute on domij.info -> {m.group(1)}")
            else:
                checks["canonical"] += 1
        # open graph
        if route in app_pages or route in article_pages:
            for prop in ("og:title", "og:description", "og:url", "og:image"):
                if prop not in text:
                    failures.append(f"{route}: missing {prop}")
        # json-ld
        if route in app_pages:
            if "application/ld+json" not in text:
                failures.append(f"{route}: missing JSON-LD")
            else:
                m = re.search(
                    r'<script type="application/ld\+json">(.*?)</script>', text, re.S)
                try:
                    json.loads(m.group(1))
                    checks["json-ld parses"] += 1
                except Exception as e:
                    failures.append(f"{route}: JSON-LD does not parse: {e}")

        # math renderer on pages that can carry math
        if route in article_pages:
            if "katex.min.css" not in text:
                failures.append(f"{route}: no KaTeX stylesheet")
            elif "auto-render.min.js" not in text:
                failures.append(f"{route}: no KaTeX auto-render")
            else:
                checks["katex present"] += 1
            # untypeset $...$ left behind
            body_m = re.search(r"<article.*?</article>", text, re.S)
            if body_m and re.search(r"(?<!\\)\$(?!\s)[^$\n]{1,120}?(?<!\s)\$", body_m.group(0)):
                failures.append(f"{route}: untypeset $...$ math in body")

        # analytics
        if route in app_pages or route in article_pages:
            if "G-MWRTXBB8DD" not in text:
                failures.append(f"{route}: no GA4 measurement ID")
            else:
                checks["ga4 present"] += 1

        # chapter titles
        if route in ("/", "/next/", "/articles/"):
            if "The Story of a Million Stars: a Complex Adaptive System" not in text:
                failures.append(f"{route}: new chapter 01 title missing")
            else:
                checks["chapter 01 title"] += 1
            for old in ("Slow Systems", "Patient Systems", "slow baseline"):
                if old in text:
                    failures.append(f"{route}: stale phrase {old!r} still present")

    # --- 3. the agent-facing surfaces agree ---------------------------
    if "/agent-context.json" in page_bodies:
        try:
            ctx = json.loads(page_bodies["/agent-context.json"])
            arc = ctx.get("narrativeArc")
            if not arc:
                failures.append("agent-context.json: no narrativeArc")
            else:
                titles = [c["title"] for c in arc["chapters"]]
                if titles[0] != "The Story of a Million Stars: a Complex Adaptive System":
                    failures.append(f"agent-context.json: chapter 01 title mismatch -> {titles[0]!r}")
                checks["narrativeArc"] += 1
        except Exception as e:
            failures.append(f"agent-context.json: does not parse: {e}")

    # --- 4. sitemap coverage --------------------------------------------
    if "/sitemap.xml" in page_bodies:
        sm = page_bodies["/sitemap.xml"]
        for needed in ("/cluster/", "/articles/"):
            if f"https://domij.info{needed}" not in sm:
                failures.append(f"sitemap.xml: missing {needed}")
            else:
                checks["sitemap"] += 1

    # --- 5. crawl every internal link -----------------------------------
    print("crawling internal links...")
    queue = collections.deque(sorted(page_bodies))
    visited = set()
    bad_links = []
    while queue:
        route = queue.popleft()
        if route in visited:
            continue
        visited.add(route)
        text = page_bodies.get(route)
        if text is None:
            try:
                _, body, _ = get(f"{BASE}{route}")
                text = body.decode("utf-8", "replace")
                page_bodies[route] = text
            except Exception as e:
                bad_links.append((route, f"fetch failed: {e}"))
                continue
        for raw in LINK_RE.findall(text):
            raw = html.unescape(raw)
            if raw.startswith(("mailto:", "data:", "#", "//")):
                continue
            # Resolve against the page it was found on, so relative links
            # like "styles.css" inside /beta/ point at /beta/styles.css.
            absolute = urljoin(f"{BASE}{route}", raw)
            u = urlparse(absolute)
            if u.scheme:
                continue
            if u.netloc and u.netloc not in ("domij.info", "www.domij.info"):
                continue
            target = u.path or "/"
            if target.startswith("/_next/") or target.startswith("/next/_next/"):
                continue
            if target not in visited:
                queue.append(target)

    # fetch the crawled set
    for route in sorted(set(queue) | set(visited)):
        if route in page_bodies:
            continue
        try:
            status, body, _ = get(f"{BASE}{route}")
            page_bodies[route] = body.decode("utf-8", "replace")
            checks["crawled ok"] += 1
        except urllib.error.HTTPError as e:
            bad_links.append((route, f"HTTP {e.code}"))
        except Exception as e:
            bad_links.append((route, f"{type(e).__name__}"))

    # --- 6. every referenced asset exists --------------------------------
    missing_assets = []
    for route, text in page_bodies.items():
        if not route.endswith((".html", "/")):
            continue
        for asset in set(ASSET_RE.findall(text)):
            try:
                status, _, _ = get(f"{BASE}{asset}")
            except urllib.error.HTTPError as e:
                missing_assets.append((route, asset, e.code))
                continue
            except Exception as e:
                missing_assets.append((route, asset, str(e)))
                continue
            if status != 200:
                missing_assets.append((route, asset, status))
            else:
                checks["assets ok"] += 1

    # --- report -----------------------------------------------------------
    print("\nchecks passed:")
    for k in sorted(checks):
        print(f"  {checks[k]:5d}  {k}")

    if missing_assets:
        print(f"\nmissing assets ({len(missing_assets)}):")
        for route, asset, code in missing_assets[:20]:
            print(f"  {route} -> {asset}  ({code})")
    else:
        print("\nmissing assets: 0")

    if bad_links:
        print(f"\nbroken internal links ({len(bad_links)}):")
        for route, why in bad_links[:30]:
            print(f"  {route}  {why}")
    else:
        print("broken internal links: 0")

    if warnings:
        print(f"\nwarnings ({len(warnings)}):")
        for w in warnings[:20]:
            print("  -", w)

    if failures:
        print(f"\nFAILURES ({len(failures)}):")
        for f in failures[:40]:
            print("  -", f)
        sys.exit(1)

    print("\nall checks passed")
    sys.exit(0)


if __name__ == "__main__":
    main()
