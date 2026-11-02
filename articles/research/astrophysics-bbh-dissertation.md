---
title: "Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves"
author: "Domi Jin (Dongming Jin)"
date: "July 2018"
source: "Ph.D. Dissertation, University of Texas at Arlington"
original_url: "https://domij.info/pages/research.html"
local_html: "/articles/research/astrophysics-bbh-dissertation.html"
---

> **Repository Mirror & Reference Copy**
> This article is archived directly in [`domijin.github.io`](https://github.com/domijin/domijin.github.io) for preservation and offline inspection.
> - **Original Publication**: [Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves](https://domij.info/pages/research.html) (Ph.D. Dissertation, University of Texas at Arlington, July 2018)

# Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves

## Abstract

The dynamical evolution of globular clusters (GCs) is expected to produce stellar-mass binary black holes (BBHs) with higher total mass than found in the field population of binary black holes. Such systems are identified as gravitational-wave (GW) sources with the detections made by the advanced Laser Interferometer Gravitational-Wave Observatory (aLIGO). We use the Monte Carlo code MOCCA to simulate the generation of binary black holes from globular clusters. These compact binary systems are found to be ejected quickly from the host globular clusters. Thereafter, they evolve independently due to the emission of gravitational radiation. We model the population of globular clusters for galaxies out to 30 Mpc and present the statistics of the results, alongside the prospects for detecting dynamically formed binary black holes at extragalactic distances using space-borne gravitational-wave detectors (LISA).

---

## Key Empirical Findings & Numbers

- **Local Universe Globular Cluster Population ($D \le 30	ext{ Mpc}$)**: Across 8,946 galaxies in the Gravitational Wave Galaxy Catalogue (GWGC), our Globular Cluster Specific Number ($S_N$) regression model estimates **662,772 globular clusters** within 30 Mpc (with up to 11,560 GCs in the elliptical galaxy ESO093-003 at 20.80 Mpc).
- **Systematic MOCCA Simulation Library**: **3,240 globular cluster simulations** (324 base parameter configurations across 5 dimensions $	imes$ 10 statistical realizations, >100 TB, ~25,000 node-hours on Texas Advanced Computing Center superclusters) evolved over a full Hubble time ($13.5	ext{ Gyr}$) combining Single/Binary Stellar Evolution (SSE/BSE, Hurley et al.) and direct $N$-body few-body integration (`Fewbody`, Fregeau et al.).
- **Dynamical Relaxation vs Stellar Evolution Timescales**:
  - Stellar dynamical timescale: $	au_{	ext{dyn}} \sim (2Gar{ho})^{-1/2} \sim 1000	ext{ s}\,(R/R_\odot)^{3/2}(M_\odot/M)^{1/2}$.
  - Thermal (Kelvin–Helmholtz) timescale: $	au_{	ext{th}} \sim GM^2/(RL) \sim 30	ext{ Myr}\,(M/M_\odot)^2(R_\odot/R)(L_\odot/L)$.
  - Nuclear main-sequence timescale: $	au_{	ext{nuc}} \sim arepsilon M c^2 / L \sim 3	ext{ Gyr}\,(M/M_\odot)(L_\odot/L)$, with massive OB stars ($M \gtrsim 20\,M_\odot$) collapsing into black holes within $3	ext{--}10	ext{ Myr}$.
  - Half-mass relaxation time (Spitzer 1987): $	au_{rh} = rac{v^3}{8\pi G^2 m^2 n \ln(\gamma N)} \simeq rac{2	imes 10^{12}	ext{ yr}}{\ln(\gamma N)} \left(rac{v}{10	ext{ km s}^{-1}}ight)^3 \left(rac{m}{M_\odot}ight)^{-2} \left(rac{n}{1	ext{ pc}^{-3}}ight)^{-1} \sim 10^8	ext{--}10^9	ext{ yr}$.
  - Mass segregation timescale for heavy remnants of mass $M_{	ext{BH}}$: $t_{	ext{seg}} \sim (\langle m angle / M_{	ext{BH}}) 	au_{rh} \sim 0.05\,	au_{rh}$, driving stellar-mass black holes into the dense core where binary–single and binary–binary encounters dynamically harden BBHs until recoil ejection.
- **Dynamically Formed Binary Black Holes**:
  - **17,883,760 inspiralling present-day BBHs** extracted across the 662,772 local-universe GCs.
  - **86,939 BBH mergers** over a Hubble time within the $30	ext{ Mpc}$ volume.
- **Lower-Bound Volumetric Merger Rate**:
  - Using Peters (1964) relativistic orbital decay $\dot{f} = k_0 f^{11/3}$ with $k_0 = rac{96}{5}(2\pi)^{8/3} rac{G^{5/3}}{c^5}\mathcal{M}^{5/3}$, the lower-bound local merger rate of dynamically formed GC binary black holes is:
    $$\eta = N rac{8k_0}{3} f_{\min}^{8/3} \left(rac{30	ext{ Mpc}}{1	ext{ Gpc}}ight)^{-3} \left(rac{13.5	ext{ Gyr}}{1	ext{ yr}}ight)^{-1} \simeq 587	ext{ Gpc}^{-3}	ext{ yr}^{-1}$$
    compared with pre-LIGO theoretical estimates of $\sim 100	ext{ Gpc}^{-3}	ext{ yr}^{-1}$ (Rodriguez et al. 2015) and early LIGO O1 empirical bounds of $9	ext{--}240	ext{ Gpc}^{-3}	ext{ yr}^{-1}$ (Abbott et al. 2016a).
- **LISA Space-Borne Gravitational-Wave Astrometry**:
  - Modeling the 3-spacecraft equilateral triangle LISA antenna ($L = 2.5	imes 10^6	ext{ km}$, $60^\circ$ arms with $\sqrt{3}/2$ response factor, 1 AU heliocentric orbit $20^\circ$ behind Earth) over a fiducial $T = 2	ext{ yr}$ mission in the $0.3	ext{ mHz}	ext{--}0.1	ext{ Hz}$ band.
  - Annual orbital motion introduces predictable Amplitude Modulation (AM), Doppler Frequency Modulation (FM, $\psi_D(t) = 2\pi f(t) c^{-1} R \sin	heta_s \cos[\phi(t)-\phi_s]$), and Phase Modulation (PM).
  - Using Fisher Information Matrix localization (Cutler 1998; Kyutoku & Seto 2017), **17 extragalactic BBHs** within 30 Mpc are localized to an error volume $\Delta V \le 1	ext{ Mpc}^3$ with unique host galaxy identification (standard sirens).

---

## Original Documents in Repository

- [Full Doctoral Dissertation PDF (`/pdfs/main.pdf`)](/pdfs/main.pdf)
- [Research Overview Page (`/pages/research.html`)](/pages/research.html)
- [Opening Notes for Defense (`/opening-notes-for-defense.html`)](/opening-notes-for-defense.html)

