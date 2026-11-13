import type { Metadata } from "next";
import WormholeExplorer from "@/components/WormholeExplorer";
import "./wormholes.css";

const basePath = process.env.NEXT_BASE_PATH ?? "/next";
const url = `https://domij.info${basePath}/wormholes/`;
const title = "Euclidean wormholes: from geometry to statistics | Domi Jin";
const description = "Explore Euclidean wormholes, baby universes and factorisation through conceptual Three.js topology, leading Cardy–BTZ entropy and a finite ensemble experiment. Research results, teaching models and open questions are distinguished throughout.";

export const metadata: Metadata = {
  title, description,
  alternates: { canonical: url },
  openGraph: { title, description, url, locale: "en_GB", type: "article" },
  twitter: { card: "summary", title, description },
};

export default function WormholesPage() {
  return <main lang="en-GB" className="wh-page">
    <a className="wh-skip" href="#geometry">Skip to the experiments</a>
    <div className="wh-container">
      <header className="wh-header"><a href={`${basePath}/`}>Domi Jin <span>/ Thoughts and experiments</span></a><a href="#sources">Sources and scope ↗</a></header>
      <section className="wh-hero" aria-labelledby="wh-title">
        <p className="wh-eyebrow">QUANTUM GRAVITY · AN INTERACTIVE NOTE</p>
        <h1 id="wh-title">Euclidean wormholes<span>From geometry to statistics.</span></h1>
        <p>Why might a geometry connecting two boundaries change how we calculate the quantum world? Turn it around, change a parameter, then compare two ways of averaging.</p>
        <div className="wh-hero-note"><span>About 8 minutes to read</span><span>3D topology + 3 numerical experiments</span><span>An interactive learning note</span></div>
      </section>
      <nav className="wh-nav" aria-label="Reading order"><a href="#geometry"><b>01</b> Euclidean geometry</a><a href="#baby"><b>02</b> Baby universes</a><a href="#entropy"><b>03</b> Counting black-hole states</a><a href="#ensemble"><b>04</b> Ensembles and factorisation</a></nav>
      <p className="wh-premise">This page concerns Euclidean saddles in the gravitational path integral and the quantum statistical structure they may reveal. Traversable wormholes require different Lorentzian spacetime and causal conditions; this page offers no scheme for travel, communication or constructing wormholes.</p>
      <noscript><div className="wh-callout">JavaScript is disabled: the explanations, initial calculations and sources remain readable. Sliders and the 3D viewpoint require JavaScript; only the 3D figure also requires WebGL.</div></noscript>
      <WormholeExplorer />
      <section className="wh-section wh-reading" aria-labelledby="wh-purpose"><div className="wh-section-heading"><span className="wh-number">→</span><div><p className="wh-eyebrow">WHAT THIS HELPS US ASK</p><h2 id="wh-purpose">What might wormholes help us understand?</h2></div></div><p>In this research, Euclidean wormholes help test theories: they organise connected contributions to the gravitational path integral, probe black-hole microstate statistics and raise questions about compatibility between gravity and boundary quantum theories. Their potential value lies in understanding quantum gravity, rather than a demonstrated engineering application.</p></section>
      <footer id="sources" className="wh-sources">
        <p className="wh-eyebrow">SOURCES & SCOPE</p><h2>Where this comes from, and where it stops</h2>
        <p>This is a newly written interactive learning note, adapted from a user-supplied summary of the <a href="https://www.youtube.com/watch?v=MmfEEqiUrfo">lecture</a>, with scientific statements checked against the primary papers below. Video captions were unavailable, so this is neither a transcript nor a complete recreation of the lecture. No unverified timestamps are given.</p>
        <ol>
          <li id="ref-baby"><a href="https://arxiv.org/abs/2002.08950">Marolf & Maxfield (2020), Transcending the ensemble</a><span>Baby universes, α sectors, spacetime wormholes and ensemble interpretations; conclusions depend on the model.</span></li>
          <li id="ref-strominger"><a href="https://arxiv.org/abs/hep-th/9712251">Strominger (1998), Black Hole Entropy from Near-Horizon Microstates</a><span>The correspondence between AdS₃ black-hole entropy and asymptotic state counting.</span></li>
          <li id="ref-spectrum"><a href="https://arxiv.org/abs/1405.5137">Hartman, Keller & Stoica (2014), Universal Spectrum of 2d Conformal Field Theory in the Large c Limit</a><span>Large central charge, a sparse low-energy spectrum and conditions for the Cardy regime.</span></li>
          <li id="ref-jt"><a href="https://arxiv.org/abs/1903.11115">Saad, Shenker & Stanford (2019), JT gravity as a matrix integral</a><span>A concrete correspondence between two-dimensional JT gravity and a matrix integral, not a proof for all gravity.</span></li>
          <li id="ref-ope"><a href="https://arxiv.org/abs/1912.00222">Collier, Maloney, Maxfield & Tsiares (2020), Universal Dynamics of Heavy Operators in CFT₂</a><span>Universal asymptotic statistics of heavy-operator OPE data and their applicable limits.</span></li>
          <li id="ref-ensemble"><a href="https://arxiv.org/abs/2203.06511">Chandra, Collier, Hartman & Maloney (2022), Semiclassical 3D gravity as an average of large-c CFTs</a><span>Consistency-constrained CFT data ensembles and semiclassical three-dimensional gravity.</span></li>
        </ol>
        <p className="wh-caption">Model scope: the geometry has no physical length or evolution time; the exponential slider compares relative weights at fixed prefactors; the Cardy plot shows an analytic leading term; the three-member ensemble is a deliberately specified exact example. None is observational data or a solved wormhole simulation.</p>
        <a className="wh-back" href={`${basePath}/`}>← Back to the website</a>
      </footer>
    </div>
  </main>;
}
