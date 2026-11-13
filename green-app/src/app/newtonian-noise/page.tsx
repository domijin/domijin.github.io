import type { Metadata } from "next";
import NewtonianNoiseExplorer from "@/components/NewtonianNoiseExplorer";
import "./newtonian-noise.css";

const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const url = `https://domij.info${basePath}/newtonian-noise/`;
const title = "Atmospheric Newtonian noise: from air to strain | Domi Jin";
const description =
  "Interactive 3D atmospheric Newtonian noise simulation paired with synced standoff geometry, finite-Q infrasound shielding, cycloidal Kolmogorov advection Monte Carlo, and 3G detector sensitivity budgets.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, locale: "en_GB", type: "article" },
  twitter: { card: "summary", title, description },
};

export default function NewtonianNoisePage() {
  return (
    <main lang="en-GB" className="wh-page">
      <a className="wh-skip" href="#observer">
        Skip to the simulation
      </a>
      <div className="wh-container">
        <header className="wh-header">
          <a href={`${basePath}/`}>
            Domi Jin <span>/ Thoughts and experiments</span>
          </a>
          <a href="#sources">Sources and scope ↗</a>
        </header>

        <section className="wh-hero" aria-labelledby="nn-title">
          <p className="wh-eyebrow">GRAVITATIONAL-WAVE INSTRUMENTATION · AN INTERACTIVE SIMULATION</p>
          <h1 id="nn-title">
            Atmospheric Newtonian noise
            <span>When the air above an observatory pulls directly on its mirrors.</span>
          </h1>
          <p>
            No acoustic barrier can block gravity. Explore how passing infrasound wave packets and
            turbulent daytime air parcels couple gravitationally to suspended interferometer mirrors—and
            why thermal eddies force third-generation detectors deep underground.
          </p>
          <div className="wh-hero-note">
            <span>Synced 3D physical scene + geometric model</span>
            <span>Live 1D Kolmogorov Monte Carlo FFT</span>
            <span>aLIGO · ET · CE · TOBA · SOGRO</span>
          </div>
        </section>

        <nav className="wh-nav wh-nav-five" aria-label="Reading order">
          <a href="#observer">
            <b>00</b> 3D scene &amp; model
          </a>
          <a href="#infrasound">
            <b>01</b> Infrasound shielding
          </a>
          <a href="#thermal">
            <b>02</b> Thermal turbulence
          </a>
          <a href="#detectors">
            <b>03</b> Detector budgets
          </a>
          <a href="#mitigation">
            <b>04</b> Shelters &amp; tomography
          </a>
        </nav>

        <p className="wh-premise">
          Based on Wenhui Wang&apos;s UT Arlington Ph.D. dissertation (2025) and the companion paper
          by Wenhui Wang &amp; Teviet Creighton (2025). The direct MavMatrix PDF download returned
          HTTP 403 to automated retrieval, so all equations, environmental baselines, detector
          curves and 1D numerical validation steps implemented here come directly from Wang&apos;s
          dissertation record and the published companion paper (arXiv:2505.05690).
        </p>

        <noscript>
          <div className="wh-callout">
            JavaScript is disabled: the physical framing, initial plots and primary references remain
            readable. Live Three.js rendering, sliders and the in-browser 1D Kolmogorov Monte Carlo
            require JavaScript.
          </div>
        </noscript>

        <NewtonianNoiseExplorer />

        <section className="wh-section wh-reading" aria-labelledby="nn-purpose">
          <div className="wh-section-heading">
            <span className="wh-number">→</span>
            <div>
              <p className="wh-eyebrow">WHAT THIS CHANGES FOR OBSERVATORIES</p>
              <h2 id="nn-purpose">Why thermal advection sets the low-frequency frontier</h2>
            </div>
          </div>
          <p>
            Coherent seismic and acoustic fluctuations can in principle be monitored with sparse
            seismometers or infrasound arrays and subtracted in feed-forward pipelines. Wind-advected
            temperature perturbations, however, carry correlation scales of only a couple of metres at
            1 Hz—meaning atmospheric Newtonian noise acts as an irreducible siting constraint unless
            detectors bury test masses at least ~100 m underground (for 2–10 Hz sensitivity) or leave
            Earth&apos;s atmosphere behind in solar orbit below 1 Hz.
          </p>
        </section>

        <footer id="sources" className="wh-sources">
          <p className="wh-eyebrow">SOURCES &amp; SCOPE</p>
          <h2>Where this comes from, and where the approximations stop</h2>
          <p>
            Interactive instrumentation study built on the UTA Ph.D. research of Wenhui Wang and
            Teviet Creighton. Full analytical derivations, digitized observatory curves and numerical
            tests trace to the sources below; full 3D computational fluid dynamics lies outside both
            the analytic paper and this browser model.
          </p>
          <ol>
            <li id="ref-wang-thesis">
              <a href="https://mavmatrix.uta.edu/physics_dissertations/180">
                Wang (2025), Improving Models of Thermal Atmospheric Newtonian Noise for Advanced and
                3rd Generation Gravitational-Wave Detectors
              </a>
              <span>
                UT Arlington Ph.D. dissertation record (Spring 2025; advisor Teviet Creighton).
                Direct full-text PDF endpoint returned HTTP 403 to automated fetch.
              </span>
            </li>
            <li id="ref-wang-paper">
              <a href="https://arxiv.org/abs/2505.05690">
                Wang &amp; Creighton (2025), Atmospheric Newtonian Noise May Constrain Third-Generation
                Gravitational-Wave Detectors
              </a>
              <span>
                Primary source for generalized infrasound Eq. (10), turbulent thermal Eq. (20),
                Section 4 canonical curves, surface D_eff heuristic, and Appendix A simulation recipe.
              </span>
            </li>
            <li id="ref-creighton">
              <a href="https://arxiv.org/abs/gr-qc/0007050">
                Creighton (2008), Tumbleweeds and airborne gravitational noise sources for LIGO
              </a>
              <span>
                Foundational Class. Quantum Grav. 25, 125011 derivation of half-space acoustic and
                advected thermal gravity-gradient noise.
              </span>
            </li>
            <li id="ref-fiorucci">
              <a href="https://journals.aps.org/prd/abstract/10.1103/PhysRevD.97.062003">
                Fiorucci et al. (2018), Impact of infrasound atmospheric noise on gravity detectors
              </a>
              <span>
                Numerical hemisphere transfer function (R = 6 m) matched closely by the D_eff = R/2
                heuristic in Section 2.3.
              </span>
            </li>
            <li id="ref-brundu">
              <a href="https://arxiv.org/abs/2206.02610">
                Brundu et al. (2022), Atmospheric Newtonian noise modeling for third-generation GW
                detectors
              </a>
              <span>
                Numerical analysis relaxing frozen-in turbulence to thermal convection under uniform
                mean flow.
              </span>
            </li>
            <li id="ref-harms">
              <a href="https://link.springer.com/article/10.1007/s41114-019-0022-2">
                Harms (2019), Terrestrial gravity fluctuations
              </a>
              <span>
                Living Reviews in Relativity survey of seismic and atmospheric Newtonian noise and
                Wiener feed-forward cancellation.
              </span>
            </li>
          </ol>
          <p className="wh-caption">
            Model scope: Sections 01–04 evaluate the analytic scaling expressions of Wang &amp;
            Creighton (2025) under 95th-percentile noon infrasound and Coulman (1985) daytime peak
            temperature fluctuations (c_T² = 0.2 K² m⁻²/³, v = 10 m/s, cos θ = 1); detector sensitivity
            curves are digitized directly from the paper&apos;s vector figures; the Appendix A 1D
            Monte Carlo integrates frozen cycloidal Kolmogorov parcels (δA = 1 m²) without
            interactive fluid feedback.
          </p>
          <a className="wh-back" href={`${basePath}/`}>
            ← Back to the website
          </a>
        </footer>
      </div>
    </main>
  );
}
