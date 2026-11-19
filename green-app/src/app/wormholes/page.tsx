import type { Metadata } from "next";
import WormholeExplorer from "@/components/WormholeExplorer";
import "./wormholes.css";

const basePath = process.env.NEXT_BASE_PATH ?? "";
const url = `https://domij.info${basePath}/wormholes/`;
const title = "Euclidean wormholes: from geometry to statistics | Domi Jin";
const description =
  "Experience relativistic wormhole ray-tracing alongside Euclidean WKB pinch-off, leading Cardy–BTZ black-hole entropy in an AdS₃ box, and ensemble factorisation.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: { title, description, url, locale: "en_GB", type: "article" },
  twitter: { card: "summary", title, description },
};

export default function WormholesPage() {
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
        <section className="wh-hero" aria-labelledby="wh-title">
          <p className="wh-eyebrow">QUANTUM GRAVITY · AN INTERACTIVE SIMULATION</p>
          <h1 id="wh-title">
            Euclidean wormholes<span>What you would see, and what the path integral computes.</span>
          </h1>
          <p>
            Look through a ray-traced spherical throat into another sky, fly across it, or rotate to
            Euclidean time to watch why instanton wormholes pinch off into baby universes and
            statistical ensembles instead.
          </p>
          <div className="wh-hero-note">
            <span>Real-time GPU RK4 ray-tracing</span>
            <span>4 spacetime regimes</span>
            <span>Synced numerical experiments</span>
          </div>
        </section>
        <nav className="wh-nav wh-nav-five" aria-label="Reading order">
          <a href="#observer">
            <b>00</b> Observer simulation
          </a>
          <a href="#geometry">
            <b>01</b> Euclidean geometry
          </a>
          <a href="#baby">
            <b>02</b> Baby universes
          </a>
          <a href="#entropy">
            <b>03</b> Black-hole entropy
          </a>
          <a href="#ensemble">
            <b>04</b> Ensembles
          </a>
        </nav>
        <p className="wh-premise">
          Regime 00 integrates null geodesics in a smooth Lorentzian wormhole metric (of the
          Morris–Thorne / DNEG family) so you can experience spherical gravitational lensing directly,
          before comparing it with the lecture&apos;s Euclidean saddles, AdS₃ black-hole boxes and
          ensemble statistics. Euclidean saddles themselves carry no Lorentzian travel route.
        </p>
        <noscript>
          <div className="wh-callout">
            JavaScript is disabled: the explanations, initial calculations and sources remain
            readable. Sliders and the WebGL ray-tracer require JavaScript.
          </div>
        </noscript>
        <WormholeExplorer />
        <section className="wh-section wh-reading" aria-labelledby="wh-purpose">
          <div className="wh-section-heading">
            <span className="wh-number">→</span>
            <div>
              <p className="wh-eyebrow">WHAT THIS HELPS US ASK</p>
              <h2 id="wh-purpose">What might wormholes help us understand?</h2>
            </div>
          </div>
          <p>
            In this research, Euclidean wormholes help test theories: they organise connected
            contributions to the gravitational path integral, probe black-hole microstate statistics
            and raise questions about compatibility between gravity and boundary quantum theories.
            Their potential value lies in understanding quantum gravity, rather than a demonstrated
            engineering application.
          </p>
        </section>
        <footer id="sources" className="wh-sources">
          <p className="wh-eyebrow">SOURCES &amp; SCOPE</p>
          <h2>Where this comes from, and where it stops</h2>
          <p>
            This is an interactive learning note adapted from the{" "}
            <a href="https://www.youtube.com/watch?v=MmfEEqiUrfo">lecture</a> summary, with
            scientific statements checked against the primary papers below. Video captions were
            unavailable, so this is neither a transcript nor a complete recreation of the lecture.
          </p>
          <ol>
            <li id="ref-baby">
              <a href="https://arxiv.org/abs/2002.08950">
                Marolf &amp; Maxfield (2020), Transcending the ensemble
              </a>
              <span>
                Baby universes, α sectors, spacetime wormholes and ensemble interpretations;
                conclusions depend on the model.
              </span>
            </li>
            <li id="ref-strominger">
              <a href="https://arxiv.org/abs/hep-th/9712251">
                Strominger (1998), Black Hole Entropy from Near-Horizon Microstates
              </a>
              <span>
                The correspondence between AdS₃ black-hole entropy and asymptotic state counting.
              </span>
            </li>
            <li id="ref-spectrum">
              <a href="https://arxiv.org/abs/1405.5137">
                Hartman, Keller &amp; Stoica (2014), Universal Spectrum of 2d Conformal Field Theory
                in the Large c Limit
              </a>
              <span>
                Large central charge, a sparse low-energy spectrum and conditions for the Cardy
                regime.
              </span>
            </li>
            <li id="ref-jt">
              <a href="https://arxiv.org/abs/1903.11115">
                Saad, Shenker &amp; Stanford (2019), JT gravity as a matrix integral
              </a>
              <span>
                A concrete correspondence between two-dimensional JT gravity and a matrix integral,
                not a proof for all gravity.
              </span>
            </li>
            <li id="ref-ope">
              <a href="https://arxiv.org/abs/1912.00222">
                Collier, Maloney, Maxfield &amp; Tsiares (2020), Universal Dynamics of Heavy
                Operators in CFT₂
              </a>
              <span>
                Universal asymptotic statistics of heavy-operator OPE data and their applicable
                limits.
              </span>
            </li>
            <li id="ref-ensemble">
              <a href="https://arxiv.org/abs/2203.06511">
                Chandra, Collier, Hartman &amp; Maloney (2022), Semiclassical 3D gravity as an
                average of large-c CFTs
              </a>
              <span>
                Consistency-constrained CFT data ensembles and semiclassical three-dimensional
                gravity.
              </span>
            </li>
            <li id="ref-dneg">
              <a href="https://arxiv.org/abs/1502.03809">
                James, von Tunzelmann, Franklin &amp; Thorne (2015), Visualizing Interstellar&apos;s
                Wormhole
              </a>
              <span>
                Smooth DNEG radial throat profile r(ℓ) and null geodesic integration used in the
                Lorentzian observer simulation.
              </span>
            </li>
          </ol>
          <p className="wh-caption">
            Model scope: the Lorentzian ray-tracer solves null geodesic ODEs via 4th-order
            Runge–Kutta in the stated DNEG and static BTZ metrics with procedural skies; the WKB
            bounce integrates a schematic quartic barrier; the Cardy plot shows an analytic leading
            term; the three-member ensemble is an exact finite teaching example.
          </p>
          <a className="wh-back" href={`${basePath}/`}>
            ← Back to the website
          </a>
        </footer>
      </div>
    </main>
  );
}
