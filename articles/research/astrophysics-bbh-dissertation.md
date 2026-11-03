# Prospective Detection of Binary Black Holes in the Local Universe with Gravitational Waves

*Stars, Gravity & Systems Modelling · By Domi Jin (July 2018)*

What is *re-search*?

During my doctoral years in physics at the University of Texas at Arlington under the supervision of Dr. Matthew J. Benacquista, I returned to that question often. To me, research is the craft of looking at a complex system over and over from every possible angle—narrowing assumptions, testing orthogonal numerical methods, gathering cleaner data, and making the entire workflow reproducible so the next person can stand on your shoulders.

There is a particular kind of human wonder in sitting at a terminal late at night, submitting a batch job to the supercomputers at the Texas Advanced Computing Center (TACC), and knowing that across 25,000 node-hours and more than 100 terabytes of phase-space history, you are watching **one million stars** live, collide, and die inside a simulated globular cluster.

---

## 1. Why Stars in Globular Clusters Don't Die Alone

If you look up at a small open cluster in our galaxy, its stars are loosely bound; gravitational encounters scatter them apart and the cluster evaporates before long. Conversely, if you look at an entire galaxy, its gravitational potential is so vast and smooth that stars move along quasi-static orbits, rarely coming close enough to perturb one another's internal lives.

**Globular clusters (GCs)** sit at an extraordinary physical sweet spot between those two extremes. Packing roughly \(N \sim 10^6\) ancient stars into a sphere just a few parsecs across, a globular cluster has a **two-body relaxation timescale (\(\tau_{\mathrm{rh}}\)) that is comparable to the timescale of stellar evolution (\(t / \tau_{\mathrm{rh}} \sim \mathcal{O}(1)\))**.

In plain terms: **stars in globular clusters do not die alone.**

As massive stars evolve and collapse into stellar-mass black holes, dynamical mass segregation causes those heavy remnants to sink toward the dense cluster core. There, three-body and four-body gravitational encounters repeatedly swap partners, hardening binary black holes (BBHs) and imparting recoil kicks strong enough to eject them completely out of the host cluster. Once flung into the intergalactic void, these dynamically forged binaries spiral inward over billions of years through the pure emission of Einstein's gravitational radiation.

---

## 2. The 4-Scale Cosmic Funnel: From Galaxies to Standard Sirens

When the advanced Laser Interferometer Gravitational-Wave Observatory (aLIGO) detected the first binary black hole mergers, a central astrophysical question emerged: how can we predict the local universe population of dynamically formed binary black holes—and how many of them will be resolved in the millihertz band by the space-borne **Laser Interferometer Space Antenna (LISA)** long before they merge?

To answer that from first principles, my dissertation constructed a **4-scale computational pipeline** spanning nine orders of magnitude in spatial scale:

```text
[Scale 1: 8,946 Local Universe Galaxies (<= 30 Mpc)]
  Weighted mass-to-light regression + Random Forest feature engineering
         |
         v
[Scale 2: 662,772 Globular Clusters & 3,240 MOCCA Simulations]
  O(N log N) Monte Carlo phase-space dynamics (25k TACC node-hours, >100 TB)
         |
         v
[Scale 3: 17.88 Million Ejected Binary Black Holes (17M x 14 Catalog)]
  Parallelized Peters (1964) relativistic orbital decay & eccentricity evolution
         |
         v
[Scale 4: LISA Space-Borne Interferometry & 17 Standard Sirens]
  Cutler (1998) Fisher Information Matrix -> eta ~= 587 Gpc^-3 yr^-1 & Delta V <= 1 Mpc^3
```

### Scale 1: Populating 8,946 Galaxies Out to 30 Mpc
Observational catalogs of extragalactic globular clusters are inherently incomplete. Using data-science workflows honed during the LSST Data Science Fellowship, I combined weighted linear regression on galaxy mass-to-light ratios (\(M/L\)), correlation matrices, and Random Forest regression across morphological types to synthesize the complete globular cluster population across **8,946 galaxies within \(D \le 30\text{ Mpc}\)**—yielding **662,772 host globular clusters**.

### Scale 2: 3,240 MOCCA Monte Carlo Simulations at TACC
Direct Newtonian \(N\)-body integration scales as \(\mathcal{O}(N^3)\), making a million-star grid computationally prohibitive across thousands of realizations. After studying direct \(N\)-body integrators with Rainer Spurzem at NAOC/PKU and adopting Mirek Giersz's \(\mathcal{O}(N \log N)\) **MOCCA** Monte Carlo code, I executed over **3,140–3,240 full-cluster dynamical realizations** at TACC, generating over **100 TB** of stellar interaction histories across initial cluster masses, metallicities, and tidal radii.

### Scale 3: Relativistic Evolution of 17.88 Million Binary Black Holes
Extracting every dynamically formed and ejected compact binary from the simulation grid produced a `17.88M × 14` relativistic catalog (**17,883,502 binary black holes**). Using parallelized general-relativistic orbital evolution routines (integrating coupled differential equations for semi-major axis \(a\) and eccentricity \(e\) via gravitational-wave energy and angular momentum loss), we evolved each binary forward to the present epoch.

### Scale 4: Fisher Matrix Localization & LISA Standard Sirens
Finally, we projected the present-day millihertz gravitational-wave strain of all 17.88 million binaries onto the 3-arm space-borne **LISA** detector response function. Using Cutler's **Fisher Information Matrix (\(\Gamma_{ij}\))** formalism across a 4-year mission baseline, we evaluated signal-to-noise ratios (\(\mathrm{SNR} \ge 7\)) and sky-volume localization uncertainties (\(\Delta V\)).

---

## 3. Summary of Key Dissertation Findings

| Pipeline Stage / Metric | Quantitative Result | Physical & Cosmological Significance |
| :--- | :--- | :--- |
| **Local Galaxy Volume (\(D \le 30\text{ Mpc}\))** | **8,946 Galaxies** | Complete local volume catalog mapped via \(M/L\) and Random Forest regression |
| **Synthesized Globular Cluster Population** | **662,772 Globular Clusters** | Captures full host-galaxy morphological and metallicity scaling relations |
| **Supercomputer Simulation Grid (TACC)** | **3,240 MOCCA Runs (>100 TB)** | \(\mathcal{O}(N \log N)\) Monte Carlo phase-space evolution over 25,000+ node-hours |
| **Dynamically Ejected BBH Catalog** | **17,883,502 Binary Black Holes** | `17.88M × 14` state matrix tracked through relativistic inspiral |
| **Local Dynamical BBH Merger Rate (\(\eta\))** | **\(\eta \simeq 587\text{ Gpc}^{-3}\text{ yr}^{-1}\)** | Lower-bound local merger rate density consistent with LIGO-Virgo-KAGRA bounds |
| **LISA Resolved Extragalactic Sirens** | **17 BBH Systems (\(\Delta V \le 1\text{ Mpc}^3\))** | Pinpointed tightly enough in 3D volume to identify unique host galaxies and measure \(H_0\) |

---

## 4. Standard Sirens, \(H_0\), and What Astrophysics Taught Me About Systems

Why does localizing a binary black hole to within \(\Delta V \le 1\text{ Mpc}^3\) matter so deeply to cosmology?

As Bernard Schutz first pointed out, an inspiraling binary black hole is a **gravitational-wave standard siren**. Unlike Type Ia supernovae—which require a complex cosmic distance ladder of calibration—the gravitational waveform alone directly encodes the absolute luminosity distance \(d_L\) from general relativity. If LISA's Fisher matrix error box is small enough (\(\le 1\text{ Mpc}^3\)) to uniquely identify the host galaxy out of the 8,946 galaxies in our 30 Mpc catalog, an optical telescope can measure that galaxy's redshift \(z\), giving us an independent, calibration-free measurement of the **Hubble constant (\(H_0\))**.

Looking back, the years I spent modeling globular clusters and gravitational waves shaped everything I have built since in machine learning, real-time decision systems, and human-AI collaboration:

- **Scale Bridging (\(\mathcal{O}(N^3) \to \mathcal{O}(N \log N)\))**: Knowing when exact pairwise computation breaks down—and how to design statistical approximations that preserve the underlying physics—is the exact same skill required to build sub-50ms machine learning inference systems.
- **Multi-Messenger Inference**: Inferring an unseen black hole binary from faint spacetime strain amidst instrument noise is the purest form of signal extraction under uncertainty.
- **Open Science & Reproducibility**: Every plot and table in my dissertation was built inside version-controlled Jupyter notebooks so future researchers could inspect, challenge, and extend the pipeline.

---

## Original Dissertation Artifacts

- [Full Doctoral Dissertation PDF (`/pdfs/main.pdf`)](/pdfs/main.pdf)
- [Full Dissertation with the Jupyter code embedded (`/pdfs/main.pdf`)](/pdfs/main.pdf)
- [Opening Notes for Defense (`/opening-notes-for-defense.html`)](/opening-notes-for-defense.html)
- [Opening Notes for Defense (`/opening-notes-for-defense.html`)](/opening-notes-for-defense.html)
- [Research Overview Archive (`/pages/research.html`)](/pages/research.html)

---
*Originally published as a [Doctoral Dissertation at the University of Texas at Arlington](https://domij.info/pdfs/main.pdf) (July 2018).*
