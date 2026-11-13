"use client";

import { useState } from "react";
import { cardyBTZ, ensembleExample, saddleWeight } from "@/lib/wormholeModels";
import Topology from "./WormholeTopology";

function Range({ id, label, value, min, max, step, onChange, display }: {
  id: string; label: string; value: number; min: number; max: number; step: number;
  onChange: (value: number) => void; display?: string;
}) {
  return <div className="wh-range">
    <label htmlFor={id}>{label}<output htmlFor={id}>{display ?? value}</output></label>
    <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </div>;
}

export default function WormholeExplorer() {
  const [connected, setConnected] = useState(true);
  const [rotating, setRotating] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [action, setAction] = useState(2);
  const [centralCharge, setCentralCharge] = useState(60);
  const [energyRatio, setEnergyRatio] = useState(2);
  const [spread, setSpread] = useState(0.6);
  const [beta, setBeta] = useState(1);
  const [fixed, setFixed] = useState(false);
  const [sector, setSector] = useState(1);
  const weight = saddleWeight(action);
  const btz = cardyBTZ(centralCharge, energyRatio);
  const ensemble = ensembleExample(spread, 1, beta);
  const selected = ensemble.rows[sector];
  const product = fixed ? selected.product : ensemble.productOfMeans;
  const joint = fixed ? selected.product : ensemble.meanProduct;
  const covariance = fixed ? 0 : ensemble.covariance;

  return <>
    <section id="geometry" className="wh-section" aria-labelledby="geometry-title">
      <div className="wh-section-heading"><span className="wh-number">01</span><div><p className="wh-eyebrow">EUCLIDEAN GEOMETRY</p><h2 id="geometry-title">Connecting boundaries in a calculation</h2></div></div>
      <div className="wh-lab">
        <div className="wh-geometry-panel">
          <div className="wh-toolbar" role="group" aria-label="Topology connection state">
            <button aria-pressed={connected} onClick={() => setConnected(true)}>Connected geometry</button>
            <button aria-pressed={!connected} onClick={() => setConnected(false)}>Disconnected geometry</button>
            <span className="wh-tag">Conceptual illustration</span>
          </div>
          <Topology connected={connected} rotating={rotating} resetKey={resetKey} />
          <div className="wh-view-controls">
            <button aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? "Stop automatic rotation" : "Rotate automatically"}</button>
            <button onClick={() => setResetKey(resetKey + 1)}>Reset view</button>
          </div>
          <p className="wh-caption" aria-live="polite">{connected ? "One surface connects both boundaries, illustrating a connected topology that a path integral may include." : "Each boundary has its own separate filling, illustrating the disconnected alternative in a path integral."} Blue and cyan distinguish the boundaries only; no particles travel through the surface and there is no physical timeline.</p>
        </div>
        <aside className="wh-experiment" aria-label="Semiclassical weight experiment">
          <p className="wh-eyebrow">Try it · Increase the action difference</p>
          <h3>How does geometry enter an answer?</h3>
          <p>The Euclidean path integral sums over geometries satisfying boundary conditions. The semiclassical approximation organises contributions around saddles, commonly with an exponential factor e<sup>−I<sub>E</sub>/ℏ</sup>. This is related to Euclidean methods used to describe quantum tunnelling.<a href="#ref-baby">[1]</a></p>
          <div className="wh-equation">Z ≈ Σ<sub>s</sub> A<sub>s</sub> e<sup>−I<sub>E,s</sub>/ℏ</sup></div>
          <Range id="wh-action" label="ΔI / ℏ (dimensionless)" min={0} max={8} step={0.1} value={action} onChange={setAction} display={action.toFixed(1)} />
          <div className="wh-meter"><span style={{ width: `${weight * 100}%` }} /></div>
          <div className="wh-readout"><span>Relative exponential weight e<sup>−ΔI/ℏ</sup></span><strong>{weight.toFixed(4)}</strong></div>
          <p className="wh-caption">A teaching comparison at fixed prefactors, not a normalised probability, event rate or measure of traversability. The slider does not change the throat width: no metric is solved from the action here.</p>
        </aside>
      </div>
      <details className="wh-details"><summary>What exactly does this geometry show?</summary><p>The 3D figure revolves r(x) = 0.58 + 0.25x² (−2.4 ≤ x ≤ 2.4) around an axis, making a two-dimensional surface with two circular boundaries embedded in three-dimensional drawing space. Disconnected mode shows two separate discs. Coordinates are drawing units: this is neither a complete spacetime nor a numerical solution of Einstein’s equations. Euclidean geometry uses a positive-definite metric; drawing a tunnel does not establish a travel route in Lorentzian spacetime. Automatic rotation changes only the viewpoint and respects the system’s reduced-motion setting.</p></details>
    </section>

    <section id="baby" className="wh-section wh-reading" aria-labelledby="baby-title">
      <div className="wh-section-heading"><span className="wh-number">02</span><div><p className="wh-eyebrow">BABY UNIVERSES</p><h2 id="baby-title">What if some degrees of freedom lie outside our description?</h2></div></div>
      <div className="wh-two-columns">
        <div><p>Baby universes are a theoretical construction in quantum gravity: closed spatial branches can enter the description as additional degrees of freedom. They are not observed new universes or celestial objects emerging from the illustrated wormhole.</p><p>In some models, treating these degrees of freedom can be reformulated as averaging over effective coupling parameters. α sectors distinguish fixing one theory from averaging many theories; parameters within a given sector do not jump randomly over time.<a href="#ref-baby">[1]</a></p></div>
        <div className="wh-callout"><span className="wh-eyebrow">A familiar distinction</span><h3>One coin, or a bag of different coins</h3><p>Repeatedly tossing one coin gives random outcomes within a fixed model. Drawing from a bag of coins with different biases and then averaging introduces differences between models. This is an analogy for two kinds of averaging, not a physical model of baby universes.</p><a href="#ensemble">Switch between fixed sector and ensemble average in section 04 ↓</a></div>
      </div>
    </section>

    <section id="entropy" className="wh-section" aria-labelledby="entropy-title">
      <div className="wh-section-heading"><span className="wh-number">03</span><div><p className="wh-eyebrow">AdS₃ / CFT₂</p><h2 id="entropy-title">One entropy, two ways of counting</h2></div></div>
      <p className="wh-lead">Holographic duality lets gravity and a boundary quantum theory test each other. For a BTZ black hole in three-dimensional anti-de Sitter space (AdS₃), high-energy state counting in the boundary two-dimensional conformal field theory reproduces the leading black-hole entropy. This illustration uses the non-rotating case; it is not an exact formula for every black hole.<a href="#ref-strominger">[2]</a></p>
      <div className="wh-lab wh-entropy-lab">
        <div className="wh-chart-panel">
          <div className="wh-chart-heading"><span>Leading entropy S / c</span><span className="wh-tag">Analytic relation</span></div>
          <svg className="wh-chart" viewBox="0 0 560 270" role="img" aria-labelledby="wh-entropy-chart-title wh-entropy-chart-desc">
            <title id="wh-entropy-chart-title">Leading Cardy entropy as energy changes</title>
            <desc id="wh-entropy-chart-desc">The horizontal axis is E/c from 1 to 8; the vertical axis is S/c. The solid Cardy curve and dashed BTZ entropy curve coincide under the chosen relations. Current E/c: {energyRatio}; S/c: {(btz.cardy / centralCharge).toFixed(3)}.</desc>
            {[4, 6, 8, 10].map((tick) => <g key={tick}><path d={`M52 ${230 - tick * 19}H530`} className="wh-grid-line" /><text x="36" y={234 - tick * 19}>{tick}</text></g>)}
            <path d="M52 20V230H530" className="wh-axis" />
            {[1, 2, 4, 6, 8].map((tick) => <text key={tick} x={52 + (tick - 1) / 7 * 478} y="251" textAnchor="middle">{tick}</text>)}
            <text x="530" y="268" textAnchor="end">E / c</text>
            <path d={Array.from({ length: 81 }, (_, i) => { const e = 1 + i / 80 * 7; return `${i === 0 ? "M" : "L"}${52 + i / 80 * 478},${230 - 2 * Math.PI * Math.sqrt(e / 3) * 19}`; }).join(" ")} fill="none" stroke="#5bd6ec" strokeWidth="5" />
            <path d={Array.from({ length: 81 }, (_, i) => { const e = 1 + i / 80 * 7; return `${i === 0 ? "M" : "L"}${52 + i / 80 * 478},${230 - cardyBTZ(centralCharge, e).bekensteinHawking / centralCharge * 19}`; }).join(" ")} fill="none" stroke="#8ca4ff" strokeWidth="2" strokeDasharray="7 5" />
            <circle cx={52 + (energyRatio - 1) / 7 * 478} cy={230 - btz.cardy / centralCharge * 19} r="6" fill="#fff" stroke="#1daedf" strokeWidth="3" />
          </svg>
          <div className="wh-legend"><span>━ Leading Cardy term</span><span>┄ BTZ entropy</span></div>
          <p className="wh-caption">The curves coincide because of the adopted holographic parameter relations, not because they are independent observations. Higher energy permits more microstates; entropy measures the logarithmic growth of the state count.</p>
        </div>
        <div className="wh-experiment">
          <Range id="wh-charge" label="Central charge c per chiral sector" min={30} max={120} step={10} value={centralCharge} onChange={setCentralCharge} />
          <Range id="wh-energy" label="Dimensionless energy E / c" min={1} max={8} step={0.1} value={energyRatio} onChange={setEnergyRatio} display={energyRatio.toFixed(1)} />
          <div className="wh-equation">S<sub>Cardy</sub> ≈ 2π√(cE / 3)</div>
          <div className="wh-readout"><span>Leading Cardy entropy</span><strong>{btz.cardy.toFixed(2)}</strong></div>
          <div className="wh-readout"><span>BTZ: 2πr₊ / (4G₃)</span><strong>{btz.bekensteinHawking.toFixed(2)}</strong></div>
          <div className="wh-readout"><span>Horizon radius r₊ / ℓ</span><strong>{btz.radiusOverAdS.toFixed(2)}</strong></div>
          <p className="wh-caption">ℏ = k<sub>B</sub> = 1; E = Mℓ = Δ − c/12, c<sub>L</sub> = c<sub>R</sub> = c, J = 0. Entropy uses natural logarithms. Curves and values omit quantum corrections.</p>
        </div>
      </div>
      <details className="wh-details"><summary>Assumptions, units and range of validity</summary><p>We use c = 3ℓ/(2G₃) and M = r₊²/(8G₃ℓ²), where ℓ is the AdS curvature radius and G₃ the three-dimensional Newton constant. For a two-dimensional CFT with large central charge and a sufficiently sparse low-energy spectrum, the leading Cardy entropy is universal over an extended high-energy regime. The slider uses E/c ≥ 1, on the high-energy side of that discussion. Finite-c values are illustrative; omitted corrections have not been estimated. The negative cosmological constant and boundary conditions of AdS cannot simply be transferred to a de Sitter description of our universe.<a href="#ref-spectrum">[3]</a></p></details>
    </section>

    <section id="ensemble" className="wh-section" aria-labelledby="ensemble-title">
      <div className="wh-section-heading"><span className="wh-number">04</span><div><p className="wh-eyebrow">ENSEMBLES & FACTORISATION</p><h2 id="ensemble-title">Multiply first, or average first?</h2></div></div>
      <p className="wh-lead">Two non-interacting boundary systems should factorise within a fixed theory. If a gravitational calculation includes wormholes connecting the boundaries, their compatibility with this expectation needs explaining. Ensemble averaging offers one interpretation: dependence on a shared parameter can make the average of a product differ from the product of averages.<a href="#ref-jt">[4]</a></p>
      <div className="wh-lab">
        <div className="wh-chart-panel">
          <div className="wh-toolbar" role="group" aria-label="Choose averaging mode">
            <button aria-pressed={!fixed} onClick={() => setFixed(false)}>Ensemble average</button>
            <button aria-pressed={fixed} onClick={() => setFixed(true)}>Fixed α sector</button>
            <span className="wh-tag">Finite teaching ensemble</span>
          </div>
          <div className="wh-sector-picker" role="group" aria-label="Choose fixed sector">
            {ensemble.rows.map((row, i) => <button key={i} disabled={!fixed} aria-pressed={fixed && sector === i} onClick={() => setSector(i)}>α = {row.alpha.toFixed(2)}<small>Energy gap {row.gap.toFixed(2)}</small></button>)}
          </div>
          <div className="wh-comparison">
            <div><span>{fixed ? "Zα(A) Zα(B)" : "〈Z(A)〉〈Z(B)〉"}</span><div className="wh-bar-track"><i style={{ width: `${product / 4 * 100}%` }} /></div><strong>{product.toFixed(5)}</strong></div>
            <div><span>{fixed ? "Zα(A ∪ B)" : "〈Z(A) Z(B)〉"}</span><div className="wh-bar-track"><i style={{ width: `${joint / 4 * 100}%` }} /></div><strong>{joint.toFixed(5)}</strong></div>
          </div>
          <div className="wh-covariance" aria-live="polite"><span>Connected part: the difference</span><strong>{covariance.toFixed(5)}</strong><p>{fixed ? "With α fixed, independent systems factorise exactly." : spread === 0 ? "All three members coincide and the ensemble variance vanishes." : "Both sides share α, producing non-zero covariance after averaging. No signal passes between the sides here."}</p></div>
        </div>
        <div className="wh-experiment">
          <p className="wh-eyebrow">Try it · Reduce the spread to zero</p>
          <Range id="wh-spread" label="Parameter spread s (dimensionless)" min={0} max={0.8} step={0.05} value={spread} onChange={setSpread} display={spread.toFixed(2)} />
          <Range id="wh-beta" label="Boundary B inverse temperature βB" min={0.2} max={3} step={0.1} value={beta} onChange={setBeta} display={beta.toFixed(1)} />
          <div className="wh-equation">Z<sub>α</sub>(β) = 1 + e<sup>−β(1+α)</sup></div>
          <p>The model has only two energy levels: 0 and 1 + α. Choose α ∈ {'{−s, 0, +s}'}, each with weight 1/3; βA = 1. Energies use an arbitrary reference energy ε₀, β uses ε₀⁻¹, and k<sub>B</sub> = 1.</p>
          <p className="wh-caption">The three-member average is calculated exactly, without random sampling noise. s is not derived from a wormhole action; these levels, distributions and values are neither CFT data nor quantum-gravity predictions.</p>
        </div>
      </div>
      <div className="wh-two-columns wh-followup">
        <div><h3>From state counting to interactions</h3><p>OPE coefficients describe how operators combine in a CFT. Appropriate averages of heavy operators admit universal asymptotic formulae in particular limits. Universality constrains statistics; it does not determine every individual coefficient.<a href="#ref-ope">[5]</a></p><p>Further research constructs consistency-constrained ensembles of CFT data, matching some semiclassical three-dimensional gravitational calculations to ensemble averages, including multi-boundary Euclidean wormholes. The three-member model above explains averaging only; it does not implement these OPE formulae.<a href="#ref-ensemble">[6]</a></p></div>
        <div className="wh-callout"><span className="wh-eyebrow">Questions that remain open</span><h3>What exactly are we averaging?</h3><p>For general gravitational theories, the ensemble’s members and measure, factorisation within a fixed theory, and extension to de Sitter each require further arguments. Success in particular models does not establish that all gravity must be an ensemble average.</p></div>
      </div>
    </section>
  </>;
}
