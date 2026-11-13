"use client";

import { useMemo, useState } from "react";
import {
  DETECTOR_PROFILES,
  activeSubtractionSensorCount,
  effectiveShelterDepth,
  findExceededBandHz,
  infrasonicStrainASD,
  numericalBoxEffectiveDepth,
  peakedEddySpectrumASD,
  runCycloidal1DSimulation,
  smoothThermalAdvectionASD,
  theoreticalPeak1D,
  thermalTurbulentStrainASD,
  type DetectorId,
  type ShelterGeometry,
} from "@/lib/newtonianNoiseModels";
import NewtonianObserver from "./NewtonianObserver";
import type { ObserverRegime } from "./NewtonianModelStage";

function Range({
  id,
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  display?: string;
}) {
  return (
    <div className="wh-range">
      <label htmlFor={id}>
        {label}
        <output htmlFor={id}>{display ?? value}</output>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}

/** Log-log SVG coordinate mapper. */
function makeLogMapper(
  fMin: number,
  fMax: number,
  yExpMin: number,
  yExpMax: number,
  width = 560,
  height = 310
) {
  const pad = { l: 58, r: 18, t: 18, b: 38 };
  const plotW = width - pad.l - pad.r;
  const plotH = height - pad.t - pad.b;
  const lf0 = Math.log10(fMin);
  const lf1 = Math.log10(fMax);

  const toX = (f: number) =>
    pad.l + ((Math.log10(Math.max(fMin * 0.5, f)) - lf0) / (lf1 - lf0)) * plotW;

  const toY = (val: number) => {
    const exp = Math.max(yExpMin - 1.5, Math.min(yExpMax + 0.5, Math.log10(Math.max(1e-40, val))));
    return pad.t + (1 - (exp - yExpMin) / (yExpMax - yExpMin)) * plotH;
  };

  const clampY = (y: number) => Math.max(pad.t - 6, Math.min(pad.t + plotH + 6, y));

  const polyPath = (pts: Array<{ f: number; asd: number }>) =>
    pts
      .filter((p) => p.f >= fMin * 0.99 && p.f <= fMax * 1.01)
      .map((p, idx) => `${idx === 0 ? "M" : "L"}${toX(p.f).toFixed(1)},${clampY(toY(p.asd)).toFixed(1)}`)
      .join(" ");

  return { pad, plotW, plotH, width, height, toX, toY, clampY, polyPath };
}

function logGrid(fMin: number, fMax: number, steps = 64): number[] {
  return Array.from({ length: steps }, (_, i) => fMin * Math.pow(fMax / fMin, i / (steps - 1)));
}

export default function NewtonianNoiseExplorer() {
  // Section 00 shared observer state
  const [regime, setRegime] = useState<ObserverRegime>("thermal");
  const [obsDepthM, setObsDepthM] = useState(10);
  const [obsFreqHz, setObsFreqHz] = useState(3.0);
  const [obsWind, setObsWind] = useState(10);
  const [obsQ, setObsQ] = useState(1.5);
  const [obsEddyR, setObsEddyR] = useState(1.2);
  const [obsArmM, setObsArmM] = useState(10000);
  const [shelterShape, setShelterShape] = useState<ShelterGeometry>("hemisphere");
  const [shelterSizeM, setShelterSizeM] = useState(12);

  // Section 01: Infrasound controls
  const [infraDepthM, setInfraDepthM] = useState(100);
  const [infraArmKm, setInfraArmKm] = useState(10);
  const [infraQ, setInfraQ] = useState(1.0);

  // Section 02: Thermal turbulence + 1D numerical validator controls
  const [thermDepthM, setThermDepthM] = useState(10);
  const [thermWind, setThermWind] = useState(10);
  const [thermPeakFreqHz, setThermPeakFreqHz] = useState(2.5);
  const [mcRadiusM, setMcRadiusM] = useState(0.8);
  const [mcDepthM, setMcDepthM] = useState(5);
  const [mcSeed, setMcSeed] = useState(42);

  // Section 03: Detector comparison controls
  const [detectorId, setDetectorId] = useState<DetectorId>("et");
  const [budgetDepthM, setBudgetDepthM] = useState(100);
  const [budgetWind, setBudgetWind] = useState(10);
  const [showInfraInBudget, setShowInfraInBudget] = useState(true);
  const [showThermalInBudget, setShowThermalInBudget] = useState(true);

  // Section 04: Surface structure & active cancellation
  const [mitShape, setMitShape] = useState<ShelterGeometry>("halfCube");
  const [mitSizeM, setMitSizeM] = useState(12);
  const [mitFreqHz, setMitFreqHz] = useState(1.0);
  const [mitDepthM, setMitDepthM] = useState(100);

  /* ---------------- Section 01 Data ---------------- */
  const infraData = useMemo(() => {
    const freqs = logGrid(0.1, 80, 64);
    const L = infraArmKm * 1000;
    const coherent = freqs.map((f) => ({
      f,
      asd: infrasonicStrainASD({ fHz: f, depthM: infraDepthM, armLengthM: L, qualityFactorQ: Infinity }),
    }));
    const packet = freqs.map((f) => ({
      f,
      asd: infrasonicStrainASD({ fHz: f, depthM: infraDepthM, armLengthM: L, qualityFactorQ: infraQ }),
    }));
    const surface = freqs.map((f) => ({
      f,
      asd: infrasonicStrainASD({ fHz: f, depthM: 3, armLengthM: L, qualityFactorQ: Infinity }),
    }));
    return {
      coherent,
      packet,
      surface,
      at2HzCoherent: infrasonicStrainASD({ fHz: 2, depthM: infraDepthM, armLengthM: L, qualityFactorQ: Infinity }),
      at2HzPacket: infrasonicStrainASD({ fHz: 2, depthM: infraDepthM, armLengthM: L, qualityFactorQ: infraQ }),
    };
  }, [infraDepthM, infraArmKm, infraQ]);

  /* ---------------- Section 02 Data (Analytic + 1D Monte Carlo) ---------------- */
  const thermalCurves = useMemo(() => {
    const freqs = logGrid(0.1, 40, 72);
    const L = 10000;
    const smooth = freqs.map((f) => ({
      f,
      asd: smoothThermalAdvectionASD({ fHz: f, depthM: thermDepthM, armLengthM: L, windSpeed: thermWind }),
    }));
    const broadband = freqs.map((f) => ({
      f,
      asd: thermalTurbulentStrainASD({
        fHz: f,
        depthM: thermDepthM,
        armLengthM: L,
        windSpeed: thermWind,
        qualityFactorQ: 0.1,
      }),
    }));
    const worstLocus = freqs.map((f) => ({
      f,
      asd: thermalTurbulentStrainASD({
        fHz: f,
        depthM: thermDepthM,
        armLengthM: L,
        windSpeed: thermWind,
        qualityFactorQ: Infinity,
      }),
    }));
    const peaked = freqs.map((f) => ({
      f,
      asd: peakedEddySpectrumASD({
        fHz: f,
        peakFreqHz: thermPeakFreqHz,
        depthM: thermDepthM,
        armLengthM: L,
        windSpeed: thermWind,
      }),
    }));
    const bandFill =
      worstLocus.map((p, idx) => ({ f: p.f, asd: p.asd })).concat([...broadband].reverse());
    const eddyR = thermWind / (2 * Math.PI * thermPeakFreqHz);
    return { smooth, broadband, worstLocus, peaked, bandFill, eddyR };
  }, [thermDepthM, thermWind, thermPeakFreqHz]);

  const sim1D = useMemo(
    () =>
      runCycloidal1DSimulation({
        cycloidRadiusM: mcRadiusM,
        windSpeed: 10,
        depthM: mcDepthM,
        armLengthM: 4000,
        thetaDeg: 40,
        seed: mcSeed,
      }),
    [mcRadiusM, mcDepthM, mcSeed]
  );

  const mcLocusCurve = useMemo(() => {
    const freqs = logGrid(0.2, 10, 48);
    return freqs.map((f) => ({
      f,
      asd: theoreticalPeak1D({ fHz: f, depthM: mcDepthM, armLengthM: 4000, windSpeed: 10, thetaDeg: 40 }),
    }));
  }, [mcDepthM]);

  /* ---------------- Section 03 Data (Detector Comparison) ---------------- */
  const budgetData = useMemo(() => {
    const profile = DETECTOR_PROFILES[detectorId];
    const freqs = logGrid(0.1, 1000, 80);
    const L = profile.armLengthM;

    const infraCoh = freqs.map((f) => ({
      f,
      asd: infrasonicStrainASD({ fHz: f, depthM: budgetDepthM, armLengthM: L, qualityFactorQ: Infinity }),
    }));
    const infraQ1 = freqs.map((f) => ({
      f,
      asd: infrasonicStrainASD({ fHz: f, depthM: budgetDepthM, armLengthM: L, qualityFactorQ: 1 }),
    }));
    const thermFloor = freqs.map((f) => ({
      f,
      asd: thermalTurbulentStrainASD({
        fHz: f,
        depthM: budgetDepthM,
        armLengthM: L,
        windSpeed: budgetWind,
        qualityFactorQ: 0.1,
      }),
    }));
    const thermLocus = freqs.map((f) => ({
      f,
      asd: thermalTurbulentStrainASD({
        fHz: f,
        depthM: budgetDepthM,
        armLengthM: L,
        windSpeed: budgetWind,
        qualityFactorQ: Infinity,
      }),
    }));

    const thermalBand = findExceededBandHz(profile, (f) =>
      thermalTurbulentStrainASD({
        fHz: f,
        depthM: budgetDepthM,
        armLengthM: L,
        windSpeed: budgetWind,
        qualityFactorQ: Infinity,
      })
    );
    const infraBand = findExceededBandHz(profile, (f) =>
      infrasonicStrainASD({
        fHz: f,
        depthM: budgetDepthM,
        armLengthM: L,
        qualityFactorQ: 1.0,
      })
    );

    return {
      profile,
      infraCoh,
      infraQ1,
      thermFloor,
      thermLocus,
      thermalBand,
      infraBand,
    };
  }, [detectorId, budgetDepthM, budgetWind]);

  /* ---------------- Section 04 Data (Mitigation & Tomography) ---------------- */
  const mitData = useMemo(() => {
    const deff = effectiveShelterDepth(mitShape, mitSizeM);
    const boxNum =
      mitShape === "halfCube" ? numericalBoxEffectiveDepth(mitSizeM, mitSizeM, mitSizeM, 48, 96) : null;
    const sensors = activeSubtractionSensorCount(mitFreqHz, mitDepthM, 10);
    const shelterThermalAt2Hz = thermalTurbulentStrainASD({
      fHz: 2.0,
      depthM: deff,
      armLengthM: 10000,
      qualityFactorQ: Infinity,
    });
    const deepThermalAt2Hz = thermalTurbulentStrainASD({
      fHz: 2.0,
      depthM: mitDepthM,
      armLengthM: 10000,
      qualityFactorQ: Infinity,
    });
    return {
      deff,
      boxNum,
      sensors,
      shelterThermalAt2Hz,
      deepThermalAt2Hz,
    };
  }, [mitShape, mitSizeM, mitFreqHz, mitDepthM]);

  const selectDetector = (id: DetectorId) => {
    setDetectorId(id);
    setBudgetDepthM(DETECTOR_PROFILES[id].defaultDepthM);
  };

  /* ---------------- Chart Coordinate Mappers ---------------- */
  const map01 = useMemo(() => makeLogMapper(0.1, 80, -26, -15), []);
  const map02 = useMemo(() => makeLogMapper(0.1, 40, -26, -15), []);
  const mapMC = useMemo(() => makeLogMapper(0.2, 10, -25, -17, 540, 260), []);
  const map03 = useMemo(() => makeLogMapper(0.1, 1000, -27, -15), []);

  return (
    <>
      <section id="observer" className="wh-section wh-observer-section" aria-labelledby="observer-title">
        <div className="wh-section-heading">
          <span className="wh-number">00</span>
          <div>
            <p className="wh-eyebrow">DUAL-STAGE ATMOSPHERIC FIELD SIMULATION · SYNCED MODEL</p>
            <h2 id="observer-title">What moves around the test mass, and how the geometry maps to strain</h2>
          </div>
        </div>
        <p className="wh-lead">
          Every temperature fluctuation or pressure wave in the open air pulls gravitationally on a
          detector&apos;s suspended mirrors through Newton&apos;s inverse-square law. Below, the
          rendered 3D scene (bedrock or shelter, vacuum tube, laser arm, moving air parcels) is
          paired side-by-side with the synced geometric model and camera frustum from Wang &amp;
          Creighton (2025).
        </p>
        <NewtonianObserver
          regime={regime}
          onRegimeChange={setRegime}
          depthM={obsDepthM}
          onDepthChange={setObsDepthM}
          freqHz={obsFreqHz}
          onFreqChange={setObsFreqHz}
          windSpeed={obsWind}
          onWindSpeedChange={setObsWind}
          qualityQ={obsQ}
          onQualityQChange={setObsQ}
          eddyRadiusM={obsEddyR}
          onEddyRadiusChange={setObsEddyR}
          armLengthM={obsArmM}
          onArmLengthChange={setObsArmM}
          shelterShape={shelterShape}
          onShelterShapeChange={setShelterShape}
          shelterSizeM={shelterSizeM}
          onShelterSizeChange={setShelterSizeM}
        />
      </section>

      <section id="infrasound" className="wh-section" aria-labelledby="infra-title">
        <div className="wh-section-heading">
          <span className="wh-number">01</span>
          <div>
            <p className="wh-eyebrow">COHERENT VS INCOHERENT ACOUSTIC FIELDS · EQS. (5) &amp; (10)</p>
            <h2 id="infra-title">Infrasonic Newtonian noise and underground wave-packet floors</h2>
          </div>
        </div>
        <p className="wh-lead">
          A perfectly coherent horizontal sound wave at speed{" "}
          <code>v_s = 340 m/s</code> is exponentially suppressed underground as{" "}
          <code>e^(−ωD/v_s)</code>. Real atmospheric wave trains, however, stay spatially
          coherent only over a finite packet length <code>l = Qλ</code>, replacing pure exponential
          decay below <code>e^(−πQ)</code> with a weaker power-law tail.
        </p>
        <div className="wh-lab">
          <div className="wh-chart-panel">
            <div className="wh-chart-heading">
              <span>95th-percentile noon infrasound (√S_P = 0.1 Pa/√Hz · f⁻¹)</span>
              <span>
                D = {infraDepthM} m · L = {infraArmKm} km
              </span>
            </div>
            <svg
              className="wh-chart"
              viewBox={`0 0 ${map01.width} ${map01.height}`}
              role="img"
              aria-label="Log-log strain noise plot comparing surface infrasound, underground coherent plane wave, and finite-Q wave packet"
            >
              {[-25, -23, -21, -19, -17, -15].map((exp) => {
                const y = map01.toY(Math.pow(10, exp));
                return (
                  <g key={exp}>
                    <line
                      x1={map01.pad.l}
                      y1={y}
                      x2={map01.width - map01.pad.r}
                      y2={y}
                      className="wh-grid-line"
                    />
                    <text x={map01.pad.l - 8} y={y + 4} textAnchor="end">
                      10^{exp}
                    </text>
                  </g>
                );
              })}
              {[0.1, 1, 10, 50].map((f) => {
                const x = map01.toX(f);
                return (
                  <g key={f}>
                    <line
                      x1={x}
                      y1={map01.pad.t}
                      x2={x}
                      y2={map01.height - map01.pad.b}
                      className="wh-grid-line"
                    />
                    <text x={x} y={map01.height - 14} textAnchor="middle">
                      {f} Hz
                    </text>
                  </g>
                );
              })}
              <path
                d={map01.polyPath(infraData.surface)}
                fill="none"
                stroke="#466980"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <path
                d={map01.polyPath(infraData.packet)}
                fill="none"
                stroke="#f5b971"
                strokeWidth="2.4"
              />
              <path
                d={map01.polyPath(infraData.coherent)}
                fill="none"
                stroke="#65d9ed"
                strokeWidth="2.2"
              />
            </svg>
            <div className="wh-legend">
              <span>Coherent Q → ∞ (e^(−ωD/v_s))</span>
              <span style={{ color: "#f5b971" }}>Wave packet Q = {infraQ.toFixed(1)}</span>
              <span style={{ color: "#7ba0b8" }}>Dashed: shallow D = 3 m reference</span>
            </div>
          </div>

          <div className="wh-experiment">
            <h3>Explore acoustic shielding</h3>
            <div className="wh-equation">
              √S_h ∝ ω⁻² (1 + ωL/2v_s)⁻¹ (e^(−ωD/v_s) + e^(−πQ))
            </div>
            <Range
              id="infra-depth"
              label="Detector depth D"
              value={infraDepthM}
              min={5}
              max={1000}
              step={5}
              onChange={setInfraDepthM}
              display={`${infraDepthM} m`}
            />
            <Range
              id="infra-q"
              label="Coherence quality factor Q = l / λ"
              value={infraQ}
              min={0.5}
              max={6.0}
              step={0.1}
              onChange={setInfraQ}
              display={infraQ.toFixed(1)}
            />
            <Range
              id="infra-arm"
              label="Arm baseline L"
              value={infraArmKm}
              min={1}
              max={40}
              step={1}
              onChange={setInfraArmKm}
              display={`${infraArmKm} km`}
            />
            <div className="wh-readout">
              <span>2 Hz coherent ASD</span>
              <strong>{infraData.at2HzCoherent.toExponential(2)}</strong>
            </div>
            <div className="wh-readout">
              <span>2 Hz packet ASD (Q={infraQ.toFixed(1)})</span>
              <strong>{infraData.at2HzPacket.toExponential(2)}</strong>
            </div>
            <p className="wh-caption">
              Notice how small <code>Q</code> weakens surface pressure coherence below{" "}
              <code>e^(−πQ)</code> yet <em>raises</em> noise deep underground whenever{" "}
              <code>D/λ &gt; Q/2</code>, because wave packets fail to cancel smoothly over the long
              crossing window <code>D/v_s</code>.
            </p>
          </div>
        </div>
      </section>

      <section id="thermal" className="wh-section" aria-labelledby="thermal-title">
        <div className="wh-section-heading">
          <span className="wh-number">02</span>
          <div>
            <p className="wh-eyebrow">ADVECTED KOLMOGOROV TURBULENCE &amp; 1D MONTE CARLO</p>
            <h2 id="thermal-title">Why turbulent wind turns an exponential cliff into a power law</h2>
          </div>
        </div>
        <p className="wh-lead">
          Smooth uniform wind glides past a mirror over timescale <code>D/v</code>, dying off
          exponentially above <code>f ~ v/(2πD)</code>. Once surface roughness or eddies roll air
          parcels along cycloidal loops of radius <code>R = v/Ω</code>, frozen temperature pockets
          re-accelerate near <code>f = v/(2πR)</code>, lifting a steep <code>f^(−29/6)</code> locus
          into the gravitational-wave band.
        </p>

        <div className="wh-lab">
          <div className="wh-chart-panel">
            <div className="wh-chart-heading">
              <span>Daytime peak thermal turbulence (c_T² = 0.2 K² m⁻²/³, L = 10 km)</span>
              <span>
                D = {thermDepthM} m · v = {thermWind} m/s
              </span>
            </div>
            <svg
              className="wh-chart"
              viewBox={`0 0 ${map02.width} ${map02.height}`}
              role="img"
              aria-label="Smooth uniform flow exponential cutoff compared against cycloidal turbulent band and single-radius eddy peak"
            >
              {[-25, -23, -21, -19, -17, -15].map((exp) => {
                const y = map02.toY(Math.pow(10, exp));
                return (
                  <g key={exp}>
                    <line
                      x1={map02.pad.l}
                      y1={y}
                      x2={map02.width - map02.pad.r}
                      y2={y}
                      className="wh-grid-line"
                    />
                    <text x={map02.pad.l - 8} y={y + 4} textAnchor="end">
                      10^{exp}
                    </text>
                  </g>
                );
              })}
              {[0.1, 0.5, 1, 5, 10, 30].map((f) => {
                const x = map02.toX(f);
                return (
                  <g key={f}>
                    <line
                      x1={x}
                      y1={map02.pad.t}
                      x2={x}
                      y2={map02.height - map02.pad.b}
                      className="wh-grid-line"
                    />
                    <text x={x} y={map02.height - 14} textAnchor="middle">
                      {f} Hz
                    </text>
                  </g>
                );
              })}
              <polygon
                points={thermalCurves.bandFill
                  .map(
                    (p) =>
                      `${map02.toX(p.f).toFixed(1)},${map02.clampY(map02.toY(p.asd)).toFixed(1)}`
                  )
                  .join(" ")}
                fill="rgba(245, 185, 113, 0.14)"
              />
              <path
                d={map02.polyPath(thermalCurves.smooth)}
                fill="none"
                stroke="#65d9ed"
                strokeDasharray="5 4"
                strokeWidth="2"
              />
              <path
                d={map02.polyPath(thermalCurves.broadband)}
                fill="none"
                stroke="#90a8ff"
                strokeWidth="1.9"
              />
              <path
                d={map02.polyPath(thermalCurves.worstLocus)}
                fill="none"
                stroke="#f5b971"
                strokeWidth="2.3"
              />
              <path
                d={map02.polyPath(thermalCurves.peaked)}
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.8"
              />
            </svg>
            <div className="wh-legend">
              <span>Dashed cyan: smooth e^(−ωD/v)</span>
              <span>Blue: broadband floor (Q=0.1)</span>
              <span style={{ color: "#f5b971" }}>Amber: narrow-band locus (Q→∞)</span>
            </div>
          </div>

          <div className="wh-experiment">
            <h3>Appendix A.1 · Live 1D Kolmogorov Monte Carlo</h3>
            <p className="wh-caption">
              Generates a 1,024 m Gaussian parcel ribbon filtered in Fourier space to{" "}
              <code>D_T(Δr) = 0.2 (Δr)^(2/3) K²</code>, orbits parcels on a cycloid of radius{" "}
              <code>R</code> at height <code>D</code>, sums <code>G δm_i x_i/r_i³</code>, and FFTs{" "}
              <code>δg_x(t)</code> in real time.
            </p>
            <Range
              id="therm-depth"
              label="Analytic plot depth D"
              value={thermDepthM}
              min={5}
              max={300}
              step={5}
              onChange={setThermDepthM}
              display={`${thermDepthM} m`}
            />
            <Range
              id="therm-wind"
              label="Analytic wind speed v"
              value={thermWind}
              min={3}
              max={20}
              step={1}
              onChange={setThermWind}
              display={`${thermWind} m/s`}
            />
            <Range
              id="therm-peak"
              label={`Selected eddy frequency (R = ${thermalCurves.eddyR.toFixed(2)} m)`}
              value={thermPeakFreqHz}
              min={0.5}
              max={10}
              step={0.25}
              onChange={setThermPeakFreqHz}
              display={`${thermPeakFreqHz.toFixed(2)} Hz`}
            />
            <hr style={{ borderColor: "#1b384b", margin: "18px 0" }} />
            <Range
              id="mc-radius"
              label="1D simulation cycloid radius R"
              value={mcRadiusM}
              min={0.35}
              max={2.2}
              step={0.05}
              onChange={setMcRadiusM}
              display={`${mcRadiusM.toFixed(2)} m`}
            />
            <Range
              id="mc-depth"
              label="1D streamline standoff D"
              value={mcDepthM}
              min={3}
              max={10}
              step={0.5}
              onChange={setMcDepthM}
              display={`${mcDepthM.toFixed(1)} m`}
            />
            <div className="wh-view-controls" style={{ justifyContent: "flex-start", margin: "10px 0 0" }}>
              <button type="button" onClick={() => setMcSeed((s) => s + 17)}>
                Re-seed random airmass (#{mcSeed})
              </button>
            </div>
          </div>
        </div>

        <div className="wh-two-columns" style={{ marginTop: "26px" }}>
          <div className="wh-callout" style={{ padding: "20px 22px" }}>
            <span className="wh-eyebrow">LIVE FFT SPECTRUM VS ANALYTIC 1D LOCUS EQ. (A.2)</span>
            <svg
              className="wh-chart"
              style={{ margin: "12px 0 6px" }}
              viewBox={`0 0 ${mapMC.width} ${mapMC.height}`}
              role="img"
              aria-label="1D Kolmogorov cycloidal Monte Carlo PSD plotted against Eq. (A.2) analytic peak locus"
            >
              {[-25, -23, -21, -19, -17].map((exp) => {
                const y = mapMC.toY(Math.pow(10, exp));
                return (
                  <g key={exp}>
                    <line
                      x1={mapMC.pad.l}
                      y1={y}
                      x2={mapMC.width - mapMC.pad.r}
                      y2={y}
                      className="wh-grid-line"
                    />
                    <text x={mapMC.pad.l - 8} y={y + 4} textAnchor="end">
                      10^{exp}
                    </text>
                  </g>
                );
              })}
              {[0.2, 0.5, 1, 2, 5, 10].map((f) => {
                const x = mapMC.toX(f);
                return (
                  <g key={f}>
                    <line
                      x1={x}
                      y1={mapMC.pad.t}
                      x2={x}
                      y2={mapMC.height - mapMC.pad.b}
                      className="wh-grid-line"
                    />
                    <text x={x} y={mapMC.height - 14} textAnchor="middle">
                      {f} Hz
                    </text>
                  </g>
                );
              })}
              <path
                d={mapMC.polyPath(mcLocusCurve)}
                fill="none"
                stroke="#f5b971"
                strokeDasharray="5 4"
                strokeWidth="2"
              />
              <path
                d={mapMC.polyPath(sim1D.spectrum)}
                fill="none"
                stroke="#65d9ed"
                strokeWidth="2.1"
              />
              <circle
                cx={mapMC.toX(sim1D.simulatedPeakFreqHz)}
                cy={mapMC.clampY(mapMC.toY(sim1D.simulatedPeakAsd))}
                r="5"
                fill="#ffffff"
                stroke="#f5b971"
                strokeWidth="2"
              />
            </svg>
            <p className="wh-caption">
              Predicted peak <code>f = v/(2πR) = {sim1D.predictedPeakFreqHz.toFixed(2)} Hz</code> ·
              Simulated normalized peak at <code>{sim1D.simulatedPeakFreqHz.toFixed(2)} Hz</code> (
              <code>{sim1D.simulatedPeakAsd.toExponential(2)}</code> vs Eq. A.2{" "}
              <code>{sim1D.analyticPeakAsd.toExponential(2)}</code> Hz⁻¹/², L = 4 km, θ = 40°, δA = 1 m²).
            </p>
          </div>

          <div className="wh-callout" style={{ padding: "20px 22px" }}>
            <span className="wh-eyebrow">STRUCTURE FUNCTION VERIFICATION · D_T(Δr) = 0.2 Δr^(2/3)</span>
            <p style={{ marginBottom: "10px" }}>
              Before computing gravitational pull, the generated 1D airmass is checked across lag
              scales Δr to verify the inertial-range Kolmogorov power law holds without artificial
              fine-tuning of spectral amplitude:
            </p>
            <div style={{ display: "grid", gap: "8px", fontFamily: "ui-monospace, monospace", fontSize: "12px" }}>
              {sim1D.structureCheck.map((row) => (
                <div
                  key={row.dr}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "68px 1fr auto",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span>Δr = {row.dr.toFixed(2)} m</span>
                  <span className="wh-meter">
                    <span
                      style={{
                        width: `${Math.min(100, (row.empirical / 0.65) * 100)}%`,
                        background: "#65d9ed",
                      }}
                    />
                  </span>
                  <span>
                    {row.empirical.toFixed(3)} / {row.theory.toFixed(3)} K²
                  </span>
                </div>
              ))}
            </div>
            <p className="wh-caption" style={{ marginTop: "14px" }}>
              Agreement in the inertial range (Δr ≥ 0.5 m) confirms both the spatial correlation slope
              and absolute temperature variance match Eq. (A.2) assumptions.
            </p>
          </div>
        </div>
      </section>

      <section id="detectors" className="wh-section" aria-labelledby="detectors-title">
        <div className="wh-section-heading">
          <span className="wh-number">03</span>
          <div>
            <p className="wh-eyebrow">SECTION 4 BENCHMARKS · ALIGO, EINSTEIN TELESCOPE, COSMIC EXPLORER, GRADIOMETERS</p>
            <h2 id="detectors-title">Where atmospheric Newtonian noise bites into 2G, 3G and torsion detectors</h2>
          </div>
        </div>
        <p className="wh-lead">
          Select an observatory from Section 4 of Wang &amp; Creighton (2025) to overlay its
          digitized design sensitivity against the canonical 95th-percentile infrasound and daytime
          peak thermal bands at any siting depth <code>D</code>.
        </p>

        <div className="wh-lab">
          <div className="wh-chart-panel">
            <div className="wh-sector-picker" role="group" aria-label="Detector design curve">
              {(Object.keys(DETECTOR_PROFILES) as DetectorId[]).map((id) => {
                const prof = DETECTOR_PROFILES[id];
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={detectorId === id}
                    onClick={() => selectDetector(id)}
                  >
                    {prof.shortName}
                    <small>L = {prof.armLengthM >= 1000 ? `${prof.armLengthM / 1000} km` : `${prof.armLengthM} m`}</small>
                  </button>
                );
              })}
            </div>

            <div className="wh-chart-heading">
              <span>{budgetData.profile.name}</span>
              <span>
                D = {budgetDepthM} m · v = {budgetWind} m/s
              </span>
            </div>

            <svg
              className="wh-chart"
              viewBox={`0 0 ${map03.width} ${map03.height}`}
              role="img"
              aria-label={`Strain noise comparison for ${budgetData.profile.name} at depth ${budgetDepthM} m`}
            >
              {[-27, -25, -23, -21, -19, -17, -15].map((exp) => {
                const y = map03.toY(Math.pow(10, exp));
                return (
                  <g key={exp}>
                    <line
                      x1={map03.pad.l}
                      y1={y}
                      x2={map03.width - map03.pad.r}
                      y2={y}
                      className="wh-grid-line"
                    />
                    <text x={map03.pad.l - 8} y={y + 4} textAnchor="end">
                      10^{exp}
                    </text>
                  </g>
                );
              })}
              {[0.1, 1, 10, 100, 1000].map((f) => {
                const x = map03.toX(f);
                return (
                  <g key={f}>
                    <line
                      x1={x}
                      y1={map03.pad.t}
                      x2={x}
                      y2={map03.height - map03.pad.b}
                      className="wh-grid-line"
                    />
                    <text x={x} y={map03.height - 14} textAnchor="middle">
                      {f}
                    </text>
                  </g>
                );
              })}

              {showInfraInBudget && (
                <>
                  <polygon
                    points={budgetData.infraQ1
                      .concat([...budgetData.infraCoh].reverse())
                      .map(
                        (p) =>
                          `${map03.toX(p.f).toFixed(1)},${map03.clampY(map03.toY(p.asd)).toFixed(1)}`
                      )
                      .join(" ")}
                    fill="rgba(144, 168, 255, 0.16)"
                  />
                  <path
                    d={map03.polyPath(budgetData.infraQ1)}
                    fill="none"
                    stroke="#90a8ff"
                    strokeDasharray="3 3"
                    strokeWidth="1.6"
                  />
                  <path
                    d={map03.polyPath(budgetData.infraCoh)}
                    fill="none"
                    stroke="#90a8ff"
                    strokeWidth="2.1"
                  />
                </>
              )}

              {showThermalInBudget && (
                <>
                  <polygon
                    points={budgetData.thermLocus
                      .concat([...budgetData.thermFloor].reverse())
                      .map(
                        (p) =>
                          `${map03.toX(p.f).toFixed(1)},${map03.clampY(map03.toY(p.asd)).toFixed(1)}`
                      )
                      .join(" ")}
                    fill="rgba(245, 185, 113, 0.18)"
                  />
                  <path
                    d={map03.polyPath(budgetData.thermFloor)}
                    fill="none"
                    stroke="#f5b971"
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                  <path
                    d={map03.polyPath(budgetData.thermLocus)}
                    fill="none"
                    stroke="#f5b971"
                    strokeWidth="2.3"
                  />
                </>
              )}

              <path
                d={map03.polyPath(budgetData.profile.curve)}
                fill="none"
                stroke="#65d9ed"
                strokeWidth="2.6"
              />
            </svg>
            <div className="wh-legend">
              <span>Cyan: {budgetData.profile.shortName} design curve</span>
              <span style={{ color: "#90a8ff" }}>Indigo: Infrasound (Q=1 to Q→∞)</span>
              <span style={{ color: "#f5b971" }}>Amber: Thermal (Q=0.1 to worst locus)</span>
            </div>
          </div>

          <div className="wh-experiment">
            <h3>Siting depth &amp; band budget</h3>
            <div className="wh-view-controls" style={{ justifyContent: "flex-start", margin: "0 0 12px" }}>
              {budgetData.profile.recommendedDepthsM.map((d) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={budgetDepthM === d}
                  onClick={() => setBudgetDepthM(d)}
                >
                  {d >= 1000 ? "1 km cavern" : `${d} m`}
                </button>
              ))}
            </div>
            <Range
              id="budget-depth"
              label="Exclusion depth D"
              value={budgetDepthM}
              min={5}
              max={1000}
              step={5}
              onChange={setBudgetDepthM}
              display={`${budgetDepthM} m`}
            />
            <Range
              id="budget-wind"
              label="Daytime wind speed v"
              value={budgetWind}
              min={3}
              max={20}
              step={1}
              onChange={setBudgetWind}
              display={`${budgetWind} m/s`}
            />
            <div className="wh-view-controls" style={{ justifyContent: "flex-start", margin: "12px 0" }}>
              <button
                type="button"
                aria-pressed={showThermalInBudget}
                onClick={() => setShowThermalInBudget((v) => !v)}
              >
                Thermal NN
              </button>
              <button
                type="button"
                aria-pressed={showInfraInBudget}
                onClick={() => setShowInfraInBudget((v) => !v)}
              >
                Infrasound NN
              </button>
            </div>
            <div className="wh-readout">
              <span>Thermal worst-locus exceedance</span>
              <strong>
                {budgetData.thermalBand.exceeds
                  ? `${budgetData.thermalBand.fMinExceededHz?.toFixed(1)}–${budgetData.thermalBand.fMaxExceededHz?.toFixed(1)} Hz`
                  : "Below target"}
              </strong>
            </div>
            <div className="wh-readout">
              <span>Infrasound (Q=1) exceedance</span>
              <strong>
                {budgetData.infraBand.exceeds
                  ? `${budgetData.infraBand.fMinExceededHz?.toFixed(1)}–${budgetData.infraBand.fMaxExceededHz?.toFixed(1)} Hz`
                  : "Below target"}
              </strong>
            </div>
            <p className="wh-caption">
              {budgetData.profile.note}{" "}
              {budgetData.profile.extrapolatedNote ? budgetData.profile.extrapolatedNote : ""}
            </p>
          </div>
        </div>
      </section>

      <section id="mitigation" className="wh-section" aria-labelledby="mitigation-title">
        <div className="wh-section-heading">
          <span className="wh-number">04</span>
          <div>
            <p className="wh-eyebrow">SURFACE ENCLOSURES D_EFF &amp; VOLUMETRIC TOMOGRAPHY · §§2.3 &amp; 5</p>
            <h2 id="mitigation-title">Building a bigger hall versus mapping every cubic metre of wind</h2>
          </div>
        </div>
        <div className="wh-two-columns">
          <div className="wh-callout">
            <span className="wh-eyebrow">HEURISTIC SURFACE SHELTER STANDOFF D_EFF = ¼⟨r⁻¹⟩⁻¹</span>
            <p>
              Because surface structures surround the test mass on three sides rather than only from
              above, the inverse-distance solid-angle integral compresses effective depth:
            </p>
            <div className="wh-sector-picker" role="group" aria-label="Shelter geometry">
              {(
                [
                  { id: "hemisphere", label: "Hemisphere", ratio: "0.50 R" },
                  { id: "semicylinder", label: "Semicylinder", ratio: "0.64 R" },
                  { id: "halfCube", label: "Half-cube", ratio: "0.55 h" },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mitShape === item.id}
                  onClick={() => setMitShape(item.id)}
                >
                  {item.label}
                  <small>{item.ratio}</small>
                </button>
              ))}
            </div>
            <Range
              id="mit-size"
              label="Structure radius R or half-cube height h"
              value={mitSizeM}
              min={4}
              max={60}
              step={1}
              onChange={setMitSizeM}
              display={`${mitSizeM} m`}
            />
            <div className="wh-readout">
              <span>Paper ratio D_eff</span>
              <strong>{mitData.deff.toFixed(2)} m</strong>
            </div>
            {mitData.boxNum !== null && (
              <div className="wh-readout">
                <span>Uniform upper-hemisphere quadrature</span>
                <strong>{mitData.boxNum.toFixed(2)} m</strong>
              </div>
            )}
            <p className="wh-caption">
              For a hemisphere of radius <code>R = 6 m</code>, <code>D_eff = 3.0 m</code> matches
              the roll-off of Fiorucci et al. (2018). For a half-cube, Wang &amp; Creighton quote{" "}
              <code>0.5480 h</code> whereas uniform upper-hemisphere numerical quadrature evaluates to{" "}
              <code>0.6015 h</code>; either way, achieving <code>D_eff = 100 m</code> via an
              above-ground hangar would require a ~180 m structure, making underground siting far more
              practical (while simultaneously cutting seismic NN).
            </p>
          </div>

          <div className="wh-callout">
            <span className="wh-eyebrow">WHY ACTIVE THERMAL SUBTRACTION IS HARD · N ~ (2πf D / v)³</span>
            <p>
              Coherent seismic and acoustic fields can be predicted from a sparse perimeter array.
              Incoherent thermal eddies have correlation length{" "}
              <code>l_corr ~ v / ω</code> and demand real-time 3D tomography throughout a hemisphere
              of radius <code>D</code>:
            </p>
            <Range
              id="mit-freq"
              label="Target subtraction frequency f"
              value={mitFreqHz}
              min={0.2}
              max={5.0}
              step={0.1}
              onChange={setMitFreqHz}
              display={`${mitFreqHz.toFixed(1)} Hz`}
            />
            <Range
              id="mit-depth"
              label="Equivalent suppression radius D"
              value={mitDepthM}
              min={20}
              max={200}
              step={10}
              onChange={setMitDepthM}
              display={`${mitDepthM} m`}
            />
            <div className="wh-covariance">
              <span>Independent 3D volumetric parcels per snapshot</span>
              <strong>{mitData.sensors.parcelCount.toExponential(2)}</strong>
              <p>
                Eddy correlation scale <code>l = v/(2πf) = {mitData.sensors.eddyLengthScaleM.toFixed(2)} m</code>{" "}
                at <code>v = 10 m/s</code>. Achieving 100 m underground performance on the surface at
                1 Hz requires ~10⁵–10⁶ independent sub-second temperature measurements to millikelvin
                precision—likely achievable only via remote atmospheric lidar or absorption-line
                tomography, placing solar-orbit missions in view for &lt;1 Hz bands.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
