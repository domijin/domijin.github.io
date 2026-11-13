# Atmospheric Newtonian noise learning page

Source route: `green-app/src/app/newtonian-noise/`. The blue-green build exports
it to `next/newtonian-noise/`; promotion produces the root `/newtonian-noise/`
route.

The page is an interactive gravitational-wave instrumentation study adapted from
Wenhui Wang's UT Arlington Ph.D. dissertation record
(<https://mavmatrix.uta.edu/physics_dissertations/180>, Spring 2025; advisor
Teviet Creighton) and Wenhui Wang & Teviet Creighton (May 2025), *Atmospheric
Newtonian Noise May Constrain Third-Generation Gravitational-Wave Detectors*
(<https://arxiv.org/abs/2505.05690>). The direct MavMatrix PDF download
(`viewcontent.cgi?article=1180&context=physics_dissertations`) returned HTTP 403
to automated retrieval, so all equations, detector baselines and simulation
prescriptions are drawn from the dissertation metadata and published companion
paper.

## Scientific contract

- **Synchronized dual 3D stage (`NewtonianObserver.tsx` + `NewtonianModelStage.tsx` + `newtonianNoiseModels.ts`)**:
  - Pairs a Three.js rendered physical environment (suspended mirror inside a
    vacuum chamber, interferometer laser arm, stratified rock/turf overburden or
    surface enclosure, drifting Kolmogorov thermal parcels and infrasound wave
    sheets) with an abstracted Three.js geometric model synchronized 1:1 on time,
    exclusion depth `D` (or `D_eff`), eddy cycloid radius `R`, and the live
    rendered camera's frustum & sight ray (`Isometric`, `Top-down`, `Side
    profile`, `Behind cam` presets plus pointer-drag orbit).
  - Compressed visual depth maps physical `D` from `5 m .. 1000 m` smoothly onto
    the stage without falsifying the numerical formulas in the HUD and lower
    waveform/analytical sections.
- **Infrasonic Newtonian noise (`infrasonicStrainASD`, Section 01)**:
  - Implements Eq. (5) (coherent horizontal plane waves, exponential shielding
    `exp(-omega D / v_s)`) and Eq. (10) (finite wave-packet quality factor
    `Q = l / lambda`, boundary-layer height `H = 1 km`), evaluated against the
    95th-percentile noon spectrum `sqrt(S_P) = 0.1 Pa/rtHz * (f/Hz)^(-1)` at
    `rho = 1.2 kg/m^3`, `v_s = 340 m/s`, `P = 1e5 Pa`, `gamma = 1.4`.
- **Advected thermal turbulence & 1D Appendix A Monte Carlo (`thermalTurbulentStrainASD`, `runCycloidal1DSimulation`, Section 02)**:
  - Contrasts smooth laminar wind (`exp(-omega D / v)` cutoff) against
    cycloidal turbulent circulation (`Eq. 20` / Section 4 normalized form),
    showing both the broadband floor (`Q = 0.1`) and worst-case narrow-band
    locus (`Q -> inf`).
  - Runs a deterministic in-browser 1D radix-2 FFT Monte Carlo following
    Appendix A.1: generates 4,096 white Gaussian deviates (`dx = 0.25 m`, `1,024 m`
    ribbon), filters in Fourier space by `(k^2 + k_cut^2)^(-(1+p)/4)` (`p = 2/3`),
    verifies and rescales the empirical structure function to `D_T(dr) = 0.2 * dr^(2/3) K^2`,
    translates parcels along `x(t) = vt + R cos(Omega t), z(t) = D + R sin(Omega t)`,
    integrates `G * dm_i * x_i / r_i^3` over `T = 48 s`, and FFTs `dg_x(t)` against
    the analytic 1D peak locus Eq. (A.2) (`theoreticalPeak1D`).
- **Detector sensitivity comparisons (`DETECTOR_PROFILES`, Section 03)**:
  - Overlays digitized design sensitivity curves from Figs. 4-7 of Wang &
    Creighton (2025) for Advanced LIGO (`L = 4 km`), Einstein Telescope (`L = 10 km`),
    Cosmic Explorer (`L = 40 km`), TOBA (`L = 10 m`), and SOGRO (`L = 10 m`),
    computing exceeded frequency bands as depth `D` and wind speed `v` vary.
- **Surface enclosures & active tomography (`effectiveShelterDepth`, `numericalBoxEffectiveDepth`, `activeSubtractionSensorCount`, Section 04)**:
  - Implements `D_eff = (1/4)<r^(-1)>^(-1)` (`0.5 R` hemisphere, `2R/pi` long
    semicylinder, `0.5480 h` half-cube reported by the paper vs `0.6015 h`
    verified by direct uniform upper-hemisphere quadrature) and the Section 5
    volumetric sensor scaling `N ~ (2 pi f D / v)^3`.

## Verification

```sh
node --experimental-strip-types --test green-app/tests/newtonianNoiseModels.test.mjs
./green-app/node_modules/.bin/tsc -p green-app/tsconfig.json --noEmit
bash scripts/blue-green-deploy.sh build-green
python3 scripts/verify-articles.py
```
