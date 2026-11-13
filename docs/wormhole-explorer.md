# Euclidean wormhole learning page

Source route: `green-app/src/app/wormholes/`. The blue-green build exports it to
`next/wormholes/`; promotion produces the root `/wormholes/` route.

The page is a new English educational adaptation of the user-supplied summary
of <https://www.youtube.com/watch?v=MmfEEqiUrfo>, not an article archive or a
transcript. The video page could not be fetched and captions were unavailable.
No speaker attribution, quotations or video timestamps are inferred.

## Scientific contract

- The Three.js surface of revolution uses `r(x) = 0.58 + 0.25 x²`, for
  `-2.4 <= x <= 2.4`, to depict connected topology. Two discs depict the
  disconnected alternative. Drawing units are arbitrary; the surface is not a
  metric, gravitational saddle solution, physical throat profile or time
  evolution. Camera motion moves only the viewpoint.
- The exponential comparison is `exp(-Delta I / hbar)`, with fixed prefactors.
  It is not a normalised probability. It is independent of the schematic shape.
- The entropy comparison assumes non-rotating BTZ, `hbar = k_B = 1`,
  `c_L = c_R = c`, `E = M ell = Delta - c/12`, `c = 3 ell/(2 G_3)` and
  `M = r_+²/(8 G_3 ell²)`. The displayed Cardy expression is the leading
  entropy `2 pi sqrt(c E/3)`; its agreement with `2 pi r_+/(4 G_3)` follows
  algebraically from the selected dictionary, not independent measurements.
  The plot uses `E/c >= 1` and explains the large-c, sparse-light-spectrum
  assumptions and the absence of quantum corrections.
- The ensemble experiment is an exact finite teaching example: three
  equiprobable members, `alpha = {-s, 0, s}`, levels `{0, 1+alpha}` in reference
  energy units, and `Z_alpha(beta) = 1 + exp(-beta (1+alpha))`. Both boundaries
  share alpha. For fixed alpha, independent systems factorise; averaging gives
  covariance. No CFT sampling, OPE formula or gravitational measure is simulated.
- Baby universes and random effective couplings are presented as theoretical
  constructions with model-dependent scope. Universal high-energy OPE
  statistics do not fix every individual coefficient. Ensemble interpretation
  is not asserted to be necessary for every gravity theory. General ensemble
  space, measure, fixed-theory factorisation and de Sitter extension remain
  qualified questions, not implemented or solved physics.

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

## Verification and accessibility

Run the meaningful numerical checks with Node 22:

```sh
node --experimental-strip-types --test green-app/tests/wormholeModels.test.mjs
bash scripts/blue-green-deploy.sh build-green
python3 scripts/verify-articles.py
```

All explanatory sections, initial calculations, SVG plot and sources are
server-rendered. No-JavaScript readers get a notice. A failed WebGL context
uses a state-aware SVG fallback and leaves the calculations working. Controls
use native buttons and labelled range inputs. Camera rotation is opt-in;
reduced-motion settings suppress it. Rendering pauses offscreen/in hidden
tabs; geometry, materials, observers and controls are disposed on unmount.

Build/type checks, numerical checks, browser interaction, and deployment are
separate checkpoints. Record only checks actually performed in the handoff.

Release verification on 12 November 2026: all five numerical tests passed;
both wrapper builds passed compilation, type checks and asset verification;
all 28 archived articles and their index passed integrity checks. The exported
Next.js route passed browser checks for topology switching, fixed-sector and
ensemble covariance, all five ranges, rotation/reset controls and simulated
WebGL context-loss fallback. No horizontal overflow at 1280px or 390px.
Publishing uses the master branch at repository root; live checks are reported
separately after GitHub Pages finishes deployment.
