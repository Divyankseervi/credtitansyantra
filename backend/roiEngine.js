/**
 * ROI Engine - Land ROI calculation using internal scoring
 */

const { getLocationSignals } = require("./locationSignals");

async function calculateROI(data) {
  const { lat, lon, ndvi, change } = data;

  // ---------------------------
  // STEP 1 — Infrastructure Signals
  // ---------------------------
  let infraScore = 20;
  let hasDevelopmentPressure = false;
  let hasHighConnectivity = false;

  try {
    const val = await getLocationSignals(lat, lon);

    if (typeof val === "number") {
      infraScore = val;
    } else if (val && typeof val === "object") {
      infraScore = val.infraScore ?? infraScore;
      hasDevelopmentPressure = Boolean(val.hasDevelopmentPressure);
      hasHighConnectivity = Boolean(val.hasHighConnectivity);
    }
  } catch (e) {
    console.log("Location signal fallback used");
  }

  const changeLower = (change || "").toLowerCase();

  // ---------------------------
  // STEP 2 — Derived Investment Signals
  // ---------------------------

  let urbanizationSignal = 5;
  if (infraScore >= 40 && ndvi < 0.5 && changeLower.includes("improv")) {
    urbanizationSignal = 25;
  } else if (infraScore >= 30) {
    urbanizationSignal = 15;
  }

  let liquiditySignal = 5;
  if (infraScore >= 40) liquiditySignal = 20;
  else if (infraScore >= 25) liquiditySignal = 10;

  let appreciationPotential = -10;
  if (changeLower.includes("improv") && ndvi < 0.5) appreciationPotential = 25;
  else if (changeLower.includes("stable")) appreciationPotential = 10;

  // Market momentum
  let marketMomentum = 5;
  if (hasDevelopmentPressure) marketMomentum = 25;
  else if (hasHighConnectivity && changeLower.includes("improv")) marketMomentum = 20;

  // Livability
  let livabilityScore = 0;
  if (ndvi > 0.7) livabilityScore = 20;
  else if (ndvi >= 0.5) livabilityScore = 10;
  else if (ndvi < 0.3) livabilityScore = -10;

  // Risk
  let riskScore = infraScore < 30 ? 10 : 0;

  // ---------------------------
  // STEP 3 — Growth Score
  // ---------------------------
  let growthScore =
    urbanizationSignal * 0.25 +
    liquiditySignal * 0.2 +
    appreciationPotential * 0.2 +
    marketMomentum * 0.2 +
    livabilityScore * 0.1 -
    riskScore * 0.05;

  growthScore = Math.max(0, Math.min(100, growthScore));

  // ---------------------------
  // STEP 4 — ROI Calculation
  // ---------------------------
  const roi5yr = Math.round(growthScore * 0.7 * 100) / 100;
  const roi10yr = Math.round(growthScore * 1.6 * 100) / 100;

  // ---------------------------
  // STEP 5 — Future Value
  // (5-year projected land value)
  // ---------------------------
  const basePrice = 800000;
  const futureValue = Math.round(basePrice * (1 + roi5yr / 100));

  // ---------------------------
  // STEP 6 — Return Clean Data
  // ---------------------------
  return {
    growthScore: Number(growthScore),
    futureValue: Number(futureValue),
    roi5yr: Number(roi5yr),
    roi10yr: Number(roi10yr),
    infraScore: Number(infraScore),
    marketMomentum: Number(marketMomentum),
  };
}

module.exports = { calculateROI };
