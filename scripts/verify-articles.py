#!/usr/bin/env python3
"""Verify every article page against the house style spec.

Usage:  python3 scripts/verify-articles.py
Exit code 0 when clean, 1 when problems are found.
"""
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTICLES = os.path.join(ROOT, "articles")

HTML = sorted(os.path.join(r, f) for r, d, fs in os.walk(ARTICLES) for f in fs if f.endswith(".html"))
problems = []
figs = svgs = 0

RAW_MD = re.compile(r'(?m)^\s*(#{2,6}\s|\|.*\||>\s)|\*\*[^*]+\*\*')
TAGS = ["figure", "svg", "blockquote", "ul", "ol", "li", "p", "div", "article",
        "main", "table", "pre", "header", "footer", "nav", "span"]


def unescape(s):
    return (s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
             .replace("&quot;", '"').replace("&middot;", "·").replace("&rsquo;", "’")
             .replace("&ldquo;", "“").replace("&rdquo;", "”").replace("&mdash;", "—")
             .replace("&ndash;", "–").replace("&#x27;", "'"))


for p in HTML:
    s = io.open(p, encoding="utf-8").read()
    body = s[s.find("<article"):s.find("</article>")] if "<article" in s else ""
    figs += s.count("<figure")
    svgs += s.count("<svg ")

    if os.path.basename(p) == "index.html":
        continue  # archive index, not an article page

    if re.search(r'chapter', s, re.I):
        problems.append(f"{p}: contains 'chapter'")
    if "chapter-badge" in s:
        problems.append(f"{p}: .chapter-badge present")

    m = RAW_MD.search(body)
    if m:
        problems.append(f"{p}: raw markdown in body near {body[max(0, m.start()-30):m.start()+40]!r}")

    for t in TAGS:
        o = len(re.findall(r'<' + t + r'(?:\s[^>]*)?>', s))
        c = len(re.findall(r'</' + t + r'>', s))
        if o != c:
            problems.append(f"{p}: unbalanced <{t}> ({o} open / {c} close)")

    for req in ['<link rel="canonical"', 'class="essay-eyebrow article-kicker"',
                'class="publication-badge"', 'aria-label="Site navigation"',
                'footer class="colophon"', '"PingFang SC"', '<meta name="description"']:
        if req not in s:
            problems.append(f"{p}: missing {req}")

    dm = re.search(r'<meta name="description" content="([^"]+)"', s)
    if dm and ("Essay and technical notes by Domi Jin" in dm.group(1) or len(dm.group(1)) < 60):
        problems.append(f"{p}: weak meta description {dm.group(1)[:70]!r}")

    md = p[:-5] + ".md"
    if not os.path.exists(md):
        problems.append(f"{p}: missing .md pair")
        continue
    m = io.open(md, encoding="utf-8").read()
    mt = re.search(r'(?m)^# (.+)$', m)
    ht = re.search(r'<h1[^>]*>(.+?)</h1>', s, re.S)
    if not mt or not ht:
        problems.append(f"{p}: missing title")
        continue
    if mt.group(1).strip() != unescape(re.sub(r'<[^>]+>', '', ht.group(1))).strip():
        problems.append(f"{p}: title mismatch")
    mk = m.split("\n")[2].strip().strip("*")
    if mk and unescape(mk).split("·")[0].strip() not in unescape(s):
        problems.append(f"{p}: kicker not mirrored (md={mk!r})")

print(f"checked {len(HTML) - 1} article pages + 1 archive index")
print(f"inline figures: {figs} | inline svg: {svgs}")
print(f"problems: {len(problems)}")
for x in problems:
    print("  -", x)
sys.exit(1 if problems else 0)
