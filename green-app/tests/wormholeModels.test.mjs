import test from "node:test";
import assert from "node:assert/strict";
import {
  cardyBTZ,
  dnegEmbeddingZ,
  dnegRadius,
  dnegRadiusDerivative,
  ensembleExample,
  ensembleOpticalShift,
  saddleWeight,
  shaderRayDirection,
  solveEuclideanBounce,
  traceBtzGeodesic,
  traceWormholeGeodesic,
  wormholeApparentAngle,
} from "../src/lib/wormholeModels.ts";

test("the relative exponential has the reference value and e-fold suppression", () => {
  assert.equal(saddleWeight(0), 1);
  assert.ok(Math.abs(saddleWeight(3) / saddleWeight(2) - Math.exp(-1)) < 1e-14);
  assert.ok(saddleWeight(8) > 0 && saddleWeight(8) < 0.001);
});

test("Cardy and non-rotating BTZ entropy agree throughout the displayed range", () => {
  for (const c of [30, 60, 120]) {
    for (const ratio of [1, 2, 8]) {
      const model = cardyBTZ(c, ratio);
      assert.ok(Math.abs(model.cardy - model.bekensteinHawking) < 1e-10);
      assert.ok(Math.abs(model.radiusOverAdS ** 2 / (8 * (3 / (2 * c))) - model.energy) < 1e-10);
    }
  }
  assert.ok(Math.abs(cardyBTZ(60, 8).cardy / cardyBTZ(60, 2).cardy - 2) < 1e-14);
});

test("a degenerate ensemble factorises at every displayed temperature", () => {
  for (const beta of [0.2, 1, 3]) {
    const model = ensembleExample(0, 1, beta);
    assert.ok(Math.abs(model.covariance) < 1e-14);
    assert.ok(model.rows.every((row) => row.gap === 1));
  }
});

test("shared parameter variation gives covariance; independent draws factorise", () => {
  for (const spread of [0.05, 0.6, 0.8]) {
    for (const beta of [0.2, 1, 3]) {
      const model = ensembleExample(spread, 1, beta);
      assert.ok(model.covariance > 0);
      const independent = model.rows.flatMap((a) => model.rows.map((b) => a.a * b.b)).reduce((a, b) => a + b, 0) / 9;
      assert.ok(Math.abs(independent - model.productOfMeans) < 1e-14);
      assert.ok(model.rows.every((row) => row.gap > 0 && row.a > 1 && row.a < 2 && row.b > 1 && row.b < 2));
      for (const row of model.rows) {
        const combinedLevels = [0, row.gap, row.gap, 2 * row.gap];
        if (beta === 1) {
          const jointPartition = combinedLevels.reduce((sum, e) => sum + Math.exp(-e), 0);
          assert.ok(Math.abs(jointPartition - row.product) < 1e-14);
        }
      }
    }
  }
});

test("at equal temperatures the connected part is the nonnegative variance", () => {
  const model = ensembleExample(0.8, 1, 1);
  const variance = model.rows.reduce((sum, row) => sum + (row.a - model.meanA) ** 2, 0) / 3;
  assert.ok(Math.abs(variance - model.covariance) < 1e-14);
});

test("DNEG smooth wormhole profile is symmetric, minimum at throat, and asymptotically flat", () => {
  const rho = 1.2;
  const a = 0.4;
  const W = 0.8;
  assert.equal(dnegRadius(0, rho, a, W), rho);
  assert.equal(dnegRadius(0.35, rho, a, W), rho);
  assert.ok(Math.abs(dnegRadius(4.2, rho, a, W) - dnegRadius(-4.2, rho, a, W)) < 1e-14);
  assert.ok(Math.abs(dnegRadiusDerivative(0, a, W)) === 0);
  assert.ok(dnegRadiusDerivative(100, a, W) > 0.99);
  assert.ok(dnegRadiusDerivative(-100, a, W) < -0.99);
  // Check numerical derivative agrees with analytic derivative
  const h = 1e-6;
  const numDeriv = (dnegRadius(2.5 + h, rho, a, W) - dnegRadius(2.5 - h, rho, a, W)) / (2 * h);
  assert.ok(Math.abs(numDeriv - dnegRadiusDerivative(2.5, a, W)) < 1e-9);
});

test("RK4 wormhole null geodesics preserve null invariant and separate transmitted vs reflected rays", () => {
  const ell0 = 6.0;
  const rho = 1.0;
  const a = 0.2;
  const W = 0.7;
  const critAngle = wormholeApparentAngle(ell0, rho, a, W);

  // Head-on ray crosses straight through with zero deflection
  const headOn = traceWormholeGeodesic({ ell0, angleFromPlusEll: Math.PI, rho, throatHalfLen: a, lensingWidth: W });
  assert.equal(headOn.crossed, true);
  assert.ok(headOn.deltaPhi < 1e-12);
  assert.ok(headOn.invariantError < 1e-10);

  // Ray well inside the throat angle crosses to Universe B
  const inside = traceWormholeGeodesic({
    ell0,
    angleFromPlusEll: Math.PI - 0.5 * critAngle,
    rho,
    throatHalfLen: a,
    lensingWidth: W,
  });
  assert.equal(inside.crossed, true);
  assert.ok(inside.impactParameter < rho);
  assert.ok(inside.invariantError < 1e-5);

  // Ray outside the throat angle deflects back into Universe A
  const outside = traceWormholeGeodesic({
    ell0,
    angleFromPlusEll: Math.PI - 1.6 * critAngle,
    rho,
    throatHalfLen: a,
    lensingWidth: W,
  });
  assert.equal(outside.crossed, false);
  assert.ok(outside.impactParameter > rho);
  assert.ok(outside.invariantError < 1e-5);
});

test("Simpson WKB bounce quadrature matches analytic action for quartic barrier", () => {
  const V0 = 2.0;
  const q0 = 1.5;
  const analytic = (4 / 3) * q0 * Math.sqrt(2 * V0);
  const res = solveEuclideanBounce(V0, q0, 64);
  assert.ok(Math.abs(res.action - analytic) < 1e-12);
  assert.ok(Math.abs(res.weight - Math.exp(-analytic)) < 1e-12);
});

test("BTZ AdS-box geodesics capture inward rays and reflect escaping rays off the boundary", () => {
  const rPlus = 2.0;
  const r0 = 4.0;
  const boxRadius = 10.0;

  // Looking straight inward hits horizon
  const inward = traceBtzGeodesic({ r0, thetaFromOutward: Math.PI, rPlus, boxRadius });
  assert.equal(inward.captured, true);
  assert.equal(inward.boundaryReflections, 0);

  // Looking straight outward reaches the reflective AdS boundary box
  const outward = traceBtzGeodesic({ r0, thetaFromOutward: 0, rPlus, boxRadius });
  assert.equal(outward.captured, false);
  assert.ok(outward.boundaryReflections >= 1);

  // Large central charge suppresses ensemble optical shift
  const lowC = ensembleOpticalShift(0.6, 30, 2);
  const highC = ensembleOpticalShift(0.6, 120, 2);
  assert.ok(Math.abs(highC.effectiveShift) < Math.abs(lowC.effectiveShift));
});

test("Isometric Flamm embedding height is antisymmetric, strictly monotonic, and satisfies dz^2 + dr^2 = d(ell)^2", () => {
  const rho = 1.15;
  const a = 0.25;
  const W = 0.75;
  assert.equal(dnegEmbeddingZ(0, a, W), 0);
  const zPos = dnegEmbeddingZ(4.2, a, W);
  const zNeg = dnegEmbeddingZ(-4.2, a, W);
  assert.ok(zPos > 0);
  assert.ok(Math.abs(zPos + zNeg) < 1e-12);

  // Finite difference check along the curve: (dz)^2 + (dr)^2 === (d ell)^2
  const eps = 1e-4;
  const ell = 2.4;
  const dz = dnegEmbeddingZ(ell + eps, a, W, 64) - dnegEmbeddingZ(ell - eps, a, W, 64);
  const dr = dnegRadius(ell + eps, rho, a, W) - dnegRadius(ell - eps, rho, a, W);
  const dsRatio = Math.hypot(dz, dr) / (2 * eps);
  assert.ok(Math.abs(dsRatio - 1) < 1e-4);
});

test("shaderRayDirection produces unit vectors aligned with GLSL camera convention and signed geodesics", () => {
  const center = shaderRayDirection(0, 0, 0, 0);
  assert.ok(Math.abs(center.pPhi) < 1e-12);
  assert.ok(Math.abs(center.pTheta) < 1e-12);
  assert.ok(Math.abs(center.pEll + 1) < 1e-12);

  const turned = shaderRayDirection(0.4, -0.25, 0.3, 0.2);
  const norm = Math.hypot(turned.pPhi, turned.pTheta, turned.pEll);
  assert.ok(Math.abs(norm - 1) < 1e-12);

  const leftRay = traceWormholeGeodesic({
    ell0: 4.6,
    angleFromPlusEll: Math.PI - 0.3,
    phiSign: -1,
  });
  const rightRay = traceWormholeGeodesic({
    ell0: 4.6,
    angleFromPlusEll: Math.PI - 0.3,
    phiSign: 1,
  });
  assert.ok(Math.abs(leftRay.deltaPhi + rightRay.deltaPhi) < 1e-12);
  assert.ok(leftRay.deltaPhi < 0 && rightRay.deltaPhi > 0);
});
