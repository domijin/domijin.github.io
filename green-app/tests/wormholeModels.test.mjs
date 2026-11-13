import test from "node:test";
import assert from "node:assert/strict";
import { cardyBTZ, ensembleExample, saddleWeight } from "../src/lib/wormholeModels.ts";

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
      // Check the mass-radius relation independently of the entropy formula.
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
