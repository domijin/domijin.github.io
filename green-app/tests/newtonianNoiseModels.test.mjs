import test from "node:test";
import assert from "node:assert/strict";
import {
  DETECTOR_PROFILES,
  activeSubtractionSensorCount,
  canonicalSection4InfrasonicASD,
  canonicalSection4ThermalASD,
  effectiveShelterDepth,
  findExceededBandHz,
  infrasonicStrainASD,
  interpolateDetectorASD,
  numericalBoxEffectiveDepth,
  peakedEddySpectrumASD,
  runCycloidal1DSimulation,
  smoothThermalAdvectionASD,
  thermalTurbulentStrainASD,
} from "../src/lib/newtonianNoiseModels.ts";

test("physical Eq. (10) infrasonic ASD agrees closely with Section 4 normalized form", () => {
  for (const depthM of [5, 100, 1000]) {
    for (const armLengthM of [4000, 10000, 40000]) {
      for (const fHz of [0.2, 1.0, 5.0, 15.0]) {
        for (const Q of [Infinity, 1.0]) {
          const phys = infrasonicStrainASD({
            fHz,
            depthM,
            armLengthM,
            qualityFactorQ: Q,
          });
          const canon = canonicalSection4InfrasonicASD(fHz, depthM, armLengthM, Q);
          if (canon < 1e-35 && phys < 1e-35) continue; // deep exponential tail where 54 vs 340/(2*pi) amplifies tiny values
          const ratio = phys / canon;
          assert.ok(
            ratio > 0.85 && ratio < 1.15,
            `mismatch at f=${fHz}, D=${depthM}, L=${armLengthM}, Q=${Q}: ratio=${ratio}`
          );
        }
      }
    }
  }
});

test("incoherent infrasound exceeds coherent infrasound underground due to exp(-pi Q) floor", () => {
  const coherent = infrasonicStrainASD({
    fHz: 5,
    depthM: 200,
    armLengthM: 10000,
    qualityFactorQ: Infinity,
  });
  const incoherent = infrasonicStrainASD({
    fHz: 5,
    depthM: 200,
    armLengthM: 10000,
    qualityFactorQ: 1.0,
  });
  assert.ok(coherent < 1e-26);
  assert.ok(incoherent > coherent * 10);
});

test("physical Eq. (sh-t-final) thermal ASD agrees closely with Section 4 normalized form", () => {
  for (const depthM of [5, 10, 100, 1000]) {
    for (const armLengthM of [10, 4000, 10000, 40000]) {
      for (const fHz of [0.3, 1.0, 4.0, 10.0]) {
        for (const Q of [Infinity, 0.1]) {
          const phys = thermalTurbulentStrainASD({
            fHz,
            depthM,
            armLengthM,
            qualityFactorQ: Q,
          });
          const canon = canonicalSection4ThermalASD(fHz, depthM, armLengthM, Q);
          const ratio = phys / canon;
          assert.ok(
            ratio > 0.82 && ratio < 1.22,
            `thermal mismatch at f=${fHz}, D=${depthM}, L=${armLengthM}, Q=${Q}: ratio=${ratio}`
          );
        }
      }
    }
  }
});

test("cycloidal turbulent advection beats smooth exponential attenuation at high frequency", () => {
  const smooth = smoothThermalAdvectionASD({
    fHz: 5,
    depthM: 10,
    armLengthM: 10000,
    windSpeed: 10,
  });
  const turbulent = thermalTurbulentStrainASD({
    fHz: 5,
    depthM: 10,
    armLengthM: 10000,
    windSpeed: 10,
    qualityFactorQ: 0.1,
  });
  assert.ok(turbulent > smooth * 1e6);
});

test("peaked eddy spectrum touches worst-case locus at peak frequency f = v / (2*pi*R)", () => {
  const fp = 2.0;
  const peakVal = peakedEddySpectrumASD({
    fHz: fp,
    peakFreqHz: fp,
    depthM: 10,
    armLengthM: 4000,
  });
  const locusVal = thermalTurbulentStrainASD({
    fHz: fp,
    depthM: 10,
    armLengthM: 4000,
    qualityFactorQ: Infinity,
  });
  assert.ok(Math.abs(peakVal - locusVal) / locusVal < 1e-12);
});

test("surface structure effective depth matches analytic formulas and uniform spherical quadrature", () => {
  assert.equal(effectiveShelterDepth("hemisphere", 10), 5);
  assert.ok(Math.abs(effectiveShelterDepth("semicylinder", 10) - 20 / Math.PI) < 1e-12);
  assert.ok(Math.abs(effectiveShelterDepth("halfCube", 10) - 5.48) < 1e-12);

  // Uniform upper-hemisphere quadrature on [-h, h]^2 x [0, h] must exceed inscribed hemisphere 0.5*h
  const boxDeff = numericalBoxEffectiveDepth(10, 10, 10, 96, 192);
  assert.ok(boxDeff > 5.0 && boxDeff < 7.0);
  assert.ok(Math.abs(boxDeff - 6.015) < 0.05);
});

test("detector curves interpolate cleanly and predict underground depth benefit for ET & CE", () => {
  const etAt10 = interpolateDetectorASD(DETECTOR_PROFILES.et, 10);
  assert.ok(etAt10 && etAt10 > 5e-25 && etAt10 < 5e-24);

  const etBand10 = findExceededBandHz(DETECTOR_PROFILES.et, (f) =>
    thermalTurbulentStrainASD({ fHz: f, depthM: 10, armLengthM: 10000, qualityFactorQ: Infinity })
  );
  const etBand100 = findExceededBandHz(DETECTOR_PROFILES.et, (f) =>
    thermalTurbulentStrainASD({ fHz: f, depthM: 100, armLengthM: 10000, qualityFactorQ: Infinity })
  );
  const etBand1000 = findExceededBandHz(DETECTOR_PROFILES.et, (f) =>
    thermalTurbulentStrainASD({ fHz: f, depthM: 1000, armLengthM: 10000, qualityFactorQ: Infinity })
  );
  assert.ok(etBand10.exceeds && etBand10.fMaxExceededHz !== null && etBand10.fMaxExceededHz > 15);
  assert.ok(
    !etBand100.exceeds ||
      (etBand100.fMaxExceededHz !== null && etBand100.fMaxExceededHz < etBand10.fMaxExceededHz)
  );
  assert.equal(etBand1000.exceeds, false);
});

test("active atmospheric subtraction benchmark reproduces Section 5 order of magnitude (~10^5-10^6 sensors at 100 m)", () => {
  const est = activeSubtractionSensorCount(1.0, 100, 10);
  assert.ok(est.eddyLengthScaleM > 1.4 && est.eddyLengthScaleM < 1.8);
  assert.ok(est.parcelCount > 1e5 && est.parcelCount < 1e6);
});

test("Appendix A 1D Kolmogorov + cycloidal simulation matches analytic peak frequency and peak locus scaling", () => {
  const radii = [1.2, 0.7, 0.4]; // R/D <= 0.24; f_peak ≈ 1.33 Hz, 2.27 Hz, 3.98 Hz
  for (const R of radii) {
    const sim = runCycloidal1DSimulation({
      cycloidRadiusM: R,
      windSpeed: 10,
      depthM: 5,
      armLengthM: 4000,
      thetaDeg: 40,
      seed: 42,
    });
    // Check structure function follows p=2/3 scaling across lags (Nyquist lag within 35%, inertial lags >=0.5m within 15%)
    for (const pt of sim.structureCheck) {
      const tol = pt.dr < 0.4 ? 0.35 : 0.15;
      assert.ok(
        Math.abs(pt.empirical / pt.theory - 1) < tol,
        `dr=${pt.dr}: empirical D_T=${pt.empirical} vs theory=${pt.theory}`
      );
    }

    // Peak frequency tracks v / (2*pi*R) cleanly (with Doppler/finite-duration width)
    const freqRatio = sim.simulatedPeakFreqHz / sim.predictedPeakFreqHz;
    assert.ok(
      freqRatio > 0.75 && freqRatio < 1.75,
      `R=${R}: sim f_peak=${sim.simulatedPeakFreqHz}, pred=${sim.predictedPeakFreqHz}`
    );

    // Simulated peak ASD matches Eq. (eq:sh-peak-1d) within factor ~3 with no amplitude tuning
    const ampRatio = sim.simulatedPeakAsd / sim.analyticPeakAsd;
    assert.ok(
      ampRatio > 0.3 && ampRatio < 3.5,
      `R=${R}: simAsd=${sim.simulatedPeakAsd.toExponential(2)}, analytic=${sim.analyticPeakAsd.toExponential(2)}, ratio=${ampRatio}`
    );
  }
});
