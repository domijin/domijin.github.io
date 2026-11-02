#!/usr/bin/env python3
"""Set specific meta descriptions on article pages that still carry the generic placeholder."""
import io, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DESCRIPTIONS = {
 "articles/medium/another-team-building-skynet-in-the-name-of-jarvis-ama-163389dc5285.html":
   "An AMA on building ThirdEar, later TwinMind: a Chrome extension and proactive personal AI "
   "memory for voice, privacy and retrieval.",
 "articles/medium/boeings-future-at-stake-the-growing-challenge-from-spacex-177b63b10882.html":
   "SpaceX advances in composite materials and new manufacturing put Boeing’s dominance in "
   "commercial aerospace under pressure.",
 "articles/medium/from-traffic-lights-to-lifes-direction-57176d5d7a06.html":
   "A traffic-light countdown in Amap prompts questions about crowdsourced inference, smart-city "
   "data, and who actually benefits.",
 "articles/medium/is-dark-mode-doing-more-harm-than-good-a-deeper-look-at-our-choices-a9685daad170.html":
   "Dark mode’s eye-strain claims rest on thin evidence, so work-style choices deserve first "
   "principles rather than folklore.",
 "articles/medium/observation-the-dilemma-and-cultural-difference-behind-the-evtol-field-df42e91af109.html":
   "A reply on EHang’s CAAC certification: eVTOL progress depends on local regulation and local "
   "markets, not on one global standard.",
 "articles/medium/rethinking-digital-advertising-from-guesswork-to-user-engagement-6e1916a2aced.html":
   "Digital advertising should read user intent through interactive engagement rather than guess "
   "it from incomplete behavioural data.",
 "articles/medium/the-future-of-advertising-moving-beyond-relevance-to-demand-profiling-and-dynamic-personalization-5f4ccc03697c.html":
   "Demand profiling and dynamically personalised ads move past binary intent toward latent needs, "
   "using generative content at scale.",
}

bad = 0
for rel, desc in DESCRIPTIONS.items():
    p = os.path.join(ROOT, rel)
    s = io.open(p, encoding="utf-8").read()
    if not (110 <= len(desc) <= 165):
        print(f"  ! description length {len(desc)} outside 110-165 for {rel}")
        bad += 1
    new, n = re.subn(
        r'(<meta name="description" content=")[^"]*(")',
        lambda m: m.group(1) + desc.replace("&", "&amp;").replace('"', "&quot;") + m.group(2),
        s, count=1)
    if n != 1:
        print(f"  ! could not patch {rel}")
        bad += 1
        continue
    io.open(p, "w", encoding="utf-8").write(new)
    print(f"  {os.path.basename(rel)}: {len(desc)} chars")

sys.exit(1 if bad else 0)
