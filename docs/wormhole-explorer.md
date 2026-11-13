# Euclidean wormhole learning page

Source route: `green-app/src/app/wormholes/`. The blue-green build exports it to
`next/wormholes/`; promotion produces the root `/wormholes/` route.

The page is a new English educational adaptation of the user-supplied summary
of <https://www.youtube.com/watch?v=MmfEEqiUrfo>, not an article archive or a
transcript. The video page could not be fetched and captions were unavailable.
No speaker attribution, quotations or video timestamps are inferred.

## Scientific contract

- **Relativistic observer simulation (`WormholeObserver.tsx` + `WormholeModelStage.tsx` + `wormholeModels.ts`)**:
  - **Synchronized dual stage (Rendered + Abstracted Model)**: pairs the first-person GLSL ray-traced sky side-by-side with an interactive Three.js 3D geometric model (`WormholeModelStage.tsx`) plotting the exact isometric Flamm-style embedding `z(ell)` (`dz^2 + dr^2 = d(ell)^2`), observer camera position, exact local FOV frustum (`shaderRayDirection`), and live RK4 geodesic rays colored by destination. Supports `Isometric`, `Top-down`, `Side profile`, and `Behind cam` viewpoints across all four regimes.
  - **Regime 01 (Lorentzian wormhole)**: integrates the null geodesic equations
    `d(ell)/d(lambda) = p_ell`, `dp_ell/d(lambda) = b^2 r'(ell)/r(ell)^3`,
    `d(phi)/d(lambda) = b/r(ell)^2` via 4th-order Runge-Kutta (both in GLSL for
    real-time sky rendering and in TypeScript for the paired 3D model & 2D ray
    cross-section), using the smooth DNEG / Morris-Thorne radial profile from James et al. (2015,
    [1502.03809](https://arxiv.org/abs/1502.03809)). Two procedural starfields and
    galactic dust bands distinguish Side A (`ell > 0`) from Side B (`ell < 0`).
    This Lorentzian metric illustrates what an observer would see around and across
    a traversable spherical throat; Euclidean saddles in the lecture do not
    support Lorentzian travel.
  - **Regime 02 (Euclidean pinch-off)**: integrates a schematic 1D quartic WKB
    bounce barrier via composite Simpson's rule (`solveEuclideanBounce`), shrinking
    the effective throat radius and showing a detaching closed baby-universe
    bubble weighted by `exp(-Delta I / hbar)`.
  - **Regime 03 (AdS3 / BTZ black-hole box)**: integrates static non-rotating BTZ
    null geodesics (`f(r) = r^2 - r_+^2` in units `ell_AdS = 1`, `r_+` scaled from
    `cardyBTZ`) via RK4 inside a reflective conformal boundary box (`r_box = 9.5`),
    separating rays captured by the horizon shadow from rays reaching the CFT
    boundary shell.
  - **Regime 04 (Ensemble & de Sitter)**: pairs an illustrative large-`c`
    fluctuation suppression (`exp(-0.03 * max(0, c - 30))`) over the wormhole
    throat with a static de Sitter (`Lambda > 0`) cosmological-horizon sky view to
    distinguish solved AdS models from open questions.
- **Schematic topology (`WormholeTopology.tsx`)**:
  - The Three.js surface of revolution uses `r(x) = 0.58 + 0.25 x^2`, for
    `-2.4 <= x <= 2.4`, to depict connected Euclidean topology. Two discs depict
    the disconnected alternative. Drawing units are arbitrary.
- **Analytical experiments (`01`, `03`, `04`)**:
  - The exponential comparison is `exp(-Delta I / hbar)`, with fixed prefactors.
    It is not a normalised probability.
  - The entropy comparison assumes non-rotating BTZ, `hbar = k_B = 1`,
    `c_L = c_R = c`, `E = M ell = Delta - c/12`, `c = 3 ell/(2 G_3)` and
    `M = r_+^2/(8 G_3 ell^2)`. The displayed Cardy expression is the leading
    entropy `2 pi sqrt(c E/3)`; its agreement with `2 pi r_+/(4 G_3)` follows
    algebraically from the selected dictionary.
  - The ensemble experiment is an exact finite teaching example: three
    equiprobable members, `alpha = {-s, 0, s}`, levels `{0, 1+alpha}` in
    reference energy units, and `Z_alpha(beta) = 1 + exp(-beta (1+alpha))`.

## Primary references

1. Marolf & Maxfield, [2002.08950](https://arxiv.org/abs/2002.08950): baby universes,
   alpha sectors and ensembles.
2. Strominger, [hep-th/9712251](https://arxiv.org/abs/hep-th/9712251): asymptotic
   microstate count and AdS3 black-hole entropy.
3. Hartman, Keller & Stoica, [1405.5137](https://arxiv.org/abs/1405.5137):
   universality at large c with a sparse light spectrum.
4. Saad, Shenker & Stanford, [1903.11115](https://arxiv.org/abs/1903.11115):
   the concrete JT gravity / matrix integral correspondence.
5. Collier et al., [1912.00222](https://arxiv.org/abs/1912.00222): asymptotic
   statistics of heavy-operator OPE data.
6. Chandra et al., [2203.06511](https://arxiv.org/abs/2203.06511): constrained CFT
   data averages and semiclassical 3D gravity.
7. James, von Tunzelmann, Franklin & Thorne, [1502.03809](https://arxiv.org/abs/1502.03809):
   smooth DNEG wormhole metric and relativistic null-geodesic ray-tracing.

## Verification and accessibility

Run the meaningful numerical checks with Node 22:

```sh
node --experimental-strip-types --test green-app/tests/wormholeModels.test.mjs
bash scripts/blue-green-deploy.sh build-green
python3 scripts/verify-articles.py
```

All explanatory sections, initial calculations, SVG plots and sources are
server-rendered. No-JavaScript readers get a notice. A failed WebGL context
falls back gracefully and leaves the 2D RK4 ray cross-section and analytical
experiments functional. Rendering pauses offscreen and in hidden tabs; WebGL
resources and observers are disposed on unmount.
