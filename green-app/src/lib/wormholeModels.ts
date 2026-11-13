/** Teaching models. No function here solves a gravitational path integral. */
export function saddleWeight(deltaAction: number) {
  return Math.exp(-deltaAction);
}

/** Non-rotating BTZ; hbar = k_B = 1, E = M ell, c_L = c_R = c. */
export function cardyBTZ(c: number, energyOverC: number) {
  const energy = c * energyOverC;
  const radiusOverAdS = Math.sqrt(12 * energyOverC);
  const newtonOverAdS = 3 / (2 * c);
  return {
    energy,
    radiusOverAdS,
    cardy: 2 * Math.PI * Math.sqrt(c * energy / 3),
    bekensteinHawking: 2 * Math.PI * radiusOverAdS / (4 * newtonOverAdS),
  };
}

/** Three equally likely two-level systems, E = {0, 1 + alpha}. */
export function ensembleExample(spread: number, betaA: number, betaB: number) {
  const rows = [-1, 0, 1].map((sector) => {
    const alpha = sector * spread;
    const gap = 1 + alpha;
    const a = 1 + Math.exp(-betaA * gap);
    const b = 1 + Math.exp(-betaB * gap);
    return { alpha, gap, a, b, product: a * b };
  });
  const meanA = rows.reduce((sum, row) => sum + row.a, 0) / rows.length;
  const meanB = rows.reduce((sum, row) => sum + row.b, 0) / rows.length;
  const meanProduct = rows.reduce((sum, row) => sum + row.product, 0) / rows.length;
  return { rows, meanA, meanB, meanProduct, productOfMeans: meanA * meanB, covariance: meanProduct - meanA * meanB };
}
