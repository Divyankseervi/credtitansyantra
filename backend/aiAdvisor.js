const DEFAULT_ADVICE = {
  summary: "Unable to generate advice.",
  riskLevel: "unknown",
  growthOutlook: "—",
  recommendation: "—",
};

/**
 * Decision-intelligence engine: development stage, investment profile, horizon, risk, recommendation.
 * @param {Object} context - { ndvi, change, landType, growthScore, futureValue, roi5yr, roi10yr, infraScore }
 * @returns {{ summary, riskLevel, growthOutlook, recommendation }}
 */
function generateInvestmentAdvice(context) {
  try {
    // Step 1 — Normalize inputs
    const ctx = context || {};
    const change = String(ctx.change ?? "").toLowerCase();
    const ndvi = Number(ctx.ndvi);
    const infraScore = Number(ctx.infraScore) || 0;
    const growthScore = Number(ctx.growthScore) || 0;

    // Step 2 — Determine Development Stage (infrastructure + vegetation + trend)
    let developmentStage = "nascent";
    if (infraScore >= 40 && ndvi < 0.5 && change === "improving") {
      developmentStage = "emerging";
    } else if (infraScore >= 30) {
      developmentStage = "active";
    } else if (infraScore >= 20) {
      developmentStage = "transitional";
    }

    // Step 3 — Determine Investment Profile
    let investmentType = "speculative";
    if (growthScore > 50 && infraScore > 35) {
      investmentType = "stable growth";
    } else if (growthScore > 30) {
      investmentType = "balanced";
    } else if (growthScore < 20) {
      investmentType = "high risk";
    }

    // Step 4 — Determine Time Horizon
    let timeHorizon = "long-term";
    if (change === "improving" && infraScore > 35) {
      timeHorizon = "medium-term";
    }
    if (growthScore > 60) {
      timeHorizon = "short-to-medium";
    }

    // Step 5 — Risk Level
    let riskLevel = "moderate";
    if (growthScore < 20 || infraScore < 15) {
      riskLevel = "high";
    } else if (growthScore > 50 && infraScore > 30) {
      riskLevel = "low";
    }

    // Step 6 — Growth Outlook
    let growthOutlook = "Limited growth expected.";
    if (developmentStage === "emerging") {
      growthOutlook = "Strong appreciation likely as infrastructure expands.";
    } else if (developmentStage === "active") {
      growthOutlook = "Steady value growth expected.";
    } else if (developmentStage === "nascent") {
      growthOutlook = "Dependent on future infrastructure push.";
    }

    // Step 7 — Recommendation Logic
    let recommendation = "Cautious entry advised.";
    if (developmentStage === "emerging" && investmentType === "speculative") {
      recommendation = "Early-stage high upside opportunity.";
    } else if (investmentType === "stable growth") {
      recommendation = "Suitable for portfolio stability.";
    } else if (riskLevel === "high") {
      recommendation = "High volatility zone — invest selectively.";
    }

    // Step 8 — Summary (single sentence)
    const summary = `Area is in ${developmentStage} development stage. Investment profile is ${investmentType}. Growth potential is ${growthOutlook} Recommended horizon: ${timeHorizon}.`;

    // Step 9 — Always return valid object
    return {
      summary,
      riskLevel,
      growthOutlook,
      recommendation,
    };
  } catch (_) {
    return DEFAULT_ADVICE;
  }
}

module.exports = {
  generateInvestmentAdvice,
  DEFAULT_ADVICE,
};
