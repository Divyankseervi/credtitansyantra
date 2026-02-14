/**
 * Surroundings-Based Land Use Recommendation Engine
 * Analyzes nearby POIs and recommends optimal land use
 */

/**
 * Recommend land use based on POI analysis
 */
export function recommendLandUse(poiCounts) {
  const total =
    poiCounts.education +
    poiCounts.healthcare +
    poiCounts.residential +
    poiCounts.commercial +
    poiCounts.industrial;

  // No POIs found - rural area
  if (total === 0) {
    return {
      recommendedUse: "🌾 Agricultural/Rural",
      confidence: 95,
      reasoning:
        "No urban infrastructure detected. Area is suitable for agriculture, forestry, or conservation.",
      poiFactors: ["Minimal urban development"],
    };
  }

  // Rule 1: Strong industrial presence
  if (poiCounts.industrial >= 3) {
    return {
      recommendedUse: "🏭 Industrial/Warehouse",
      confidence: 90,
      reasoning:
        "High concentration of industrial zones and factories. Area zoned for heavy manufacturing and storage.",
      poiFactors: [
        `${poiCounts.industrial} industrial facilities`,
        `${poiCounts.infrastructure} major roads for logistics`,
      ],
    };
  }

  // Rule 2: Strong residential/education combination
  if (poiCounts.residential >= 2 && poiCounts.education >= 2) {
    return {
      recommendedUse: "🏘️ Residential/Educational",
      confidence: 92,
      reasoning:
        "Strong residential and educational infrastructure. Ideal for residential development with community services.",
      poiFactors: [
        `${poiCounts.residential} residential areas`,
        `${poiCounts.education} schools/colleges nearby`,
        `${poiCounts.healthcare} healthcare facilities`,
      ],
    };
  }

  // Rule 3: Healthcare + many residential
  if (poiCounts.healthcare >= 1 && poiCounts.residential >= 3) {
    return {
      recommendedUse: "🏥 Medical/Healthcare Complex",
      confidence: 85,
      reasoning:
        "Healthcare facility surrounded by residential areas. Suitable for medical, wellness, and research facilities.",
      poiFactors: [
        `${poiCounts.healthcare} healthcare facilities`,
        `${poiCounts.residential} residential neighborhoods`,
      ],
    };
  }

  // Rule 4: Commercial hub (many shops/malls + infrastructure)
  if (poiCounts.commercial >= 2 && poiCounts.infrastructure >= 2) {
    return {
      recommendedUse: "🛍️ Commercial/Retail",
      confidence: 88,
      reasoning:
        "High commercial activity with good road access. Prime location for retail, malls, and business centers.",
      poiFactors: [
        `${poiCounts.commercial} commercial establishments`,
        `${poiCounts.infrastructure} major highways`,
      ],
    };
  }

  // Rule 5: Primarily residential with some education
  if (poiCounts.residential >= 2 && poiCounts.education >= 1) {
    return {
      recommendedUse: "🏠 Residential",
      confidence: 87,
      reasoning:
        "Established residential neighborhood with educational facilities. Suitable for housing and community development.",
      poiFactors: [
        `${poiCounts.residential} residential areas`,
        `${poiCounts.education} schools nearby`,
      ],
    };
  }

  // Rule 6: Mixed use with commercial + some residential
  if (poiCounts.commercial >= 1 && poiCounts.residential >= 1) {
    return {
      recommendedUse: "🏢 Mixed-Use Development",
      confidence: 80,
      reasoning:
        "Diverse infrastructure supporting both commercial and residential activities. Suitable for mixed-use development.",
      poiFactors: [
        `${poiCounts.commercial} commercial areas`,
        `${poiCounts.residential} residential areas`,
      ],
    };
  }

  // Rule 7: Isolated industrial
  if (poiCounts.industrial >= 1) {
    return {
      recommendedUse: "⚙️ Light Industrial",
      confidence: 75,
      reasoning:
        "Some industrial presence with limited residential proximity. Suitable for light manufacturing and warehousing.",
      poiFactors: [`${poiCounts.industrial} industrial facilities`],
    };
  }

  // Rule 8: Education-focused area
  if (poiCounts.education >= 2) {
    return {
      recommendedUse: "📚 Educational Institution",
      confidence: 84,
      reasoning:
        "Multiple educational facilities indicating institutional zone. Suitable for schools, colleges, and research centers.",
      poiFactors: [`${poiCounts.education} education facilities`],
    };
  }

  // Rule 9: Commercial without strong residential
  if (poiCounts.commercial >= 1) {
    return {
      recommendedUse: "🛍️ Commercial",
      confidence: 78,
      reasoning:
        "Commercial infrastructure present. Suitable for retail, offices, and service businesses.",
      poiFactors: [`${poiCounts.commercial} commercial establishments`],
    };
  }

  // Rule 10: General residential
  if (poiCounts.residential >= 1) {
    return {
      recommendedUse: "🏠 Residential",
      confidence: 72,
      reasoning:
        "Residential infrastructure present. Suitable for housing development.",
      poiFactors: [`${poiCounts.residential} residential areas`],
    };
  }

  // Rule 11: Primarily infrastructure (highways)
  if (poiCounts.infrastructure >= 2) {
    return {
      recommendedUse: "🚚 Logistics/Transport Hub",
      confidence: 76,
      reasoning:
        "Major transportation infrastructure. Suitable for logistics, warehousing, and transportation services.",
      poiFactors: [`${poiCounts.infrastructure} major roads/highways`],
    };
  }

  // Default fallback
  return {
    recommendedUse: "🌐 General Purpose",
    confidence: 50,
    reasoning:
      "Mixed infrastructure with no dominant pattern. Flexible for multiple uses.",
    poiFactors: ["Balanced development pattern"],
  };
}

/**
 * Get risk assessment based on surroundings
 */
export function getRiskAssessment(poiCounts) {
  // High risk: adjacent to industrial
  if (poiCounts.industrial >= 2) {
    return {
      riskLevel: "⚠️ HIGH",
      riskType: "Industrial Pollution",
      mitigation:
        "Ensure proper environmental buffer zones and pollution monitoring systems.",
    };
  }

  // Medium risk: highway proximity
  if (poiCounts.infrastructure >= 3) {
    return {
      riskLevel: "⚡ MEDIUM",
      riskType: "Traffic & Noise",
      mitigation:
        "Install sound barriers and implement traffic management policies.",
    };
  }

  // Medium risk: industrial + residential mix
  if (poiCounts.industrial >= 1 && poiCounts.residential >= 2) {
    return {
      riskLevel: "⚡ MEDIUM",
      riskType: "Mixed Use Conflict",
      mitigation:
        "Establish clear zoning boundaries and environmental standards.",
    };
  }

  // Low risk: primarily residential/education
  if (poiCounts.residential >= 2 || poiCounts.education >= 2) {
    return {
      riskLevel: "✅ LOW",
      riskType: "Established Community",
      mitigation: "Standard residential development practices apply.",
    };
  }

  // Low risk: rural
  if (
    poiCounts.education +
      poiCounts.healthcare +
      poiCounts.residential +
      poiCounts.commercial +
      poiCounts.industrial ===
    0
  ) {
    return {
      riskLevel: "✅ LOW",
      riskType: "Rural Area",
      mitigation: "Environmental impact assessment recommended.",
    };
  }

  // Default medium risk
  return {
    riskLevel: "⚡ MEDIUM",
    riskType: "Mixed Infrastructure",
    mitigation:
      "Comprehensive environmental and social impact assessment recommended.",
  };
}

/**
 * Get optimization tips
 */
export function getOptimizationTips(poiCounts, recommendedUse) {
  const tips = [];

  // Infrastructure gap analysis
  if (poiCounts.healthcare === 0 && poiCounts.residential >= 1) {
    tips.push("🏥 Limited healthcare access - consider proximity to medical services");
  }

  if (poiCounts.education === 0 && poiCounts.residential >= 1) {
    tips.push("📚 Limited educational facilities - valuable for school development");
  }

  if (poiCounts.infrastructure === 0 && poiCounts.commercial >= 1) {
    tips.push("🛣️ Limited road access - improve connectivity for commerce");
  }

  if (poiCounts.industrial === 0 && poiCounts.commercial >= 2) {
    tips.push(
      "🏭 No industrial presence - preserve for commercial/retail growth"
    );
  }

  // Saturation analysis
  if (poiCounts.residential >= 5) {
    tips.push(
      "🏘️ Highly developed residential area - focus on density optimization"
    );
  }

  if (poiCounts.commercial >= 3) {
    tips.push("🛍️ Commercial saturation - consider niche retail opportunities");
  }

  // Growth potential
  if (poiCounts.residential >= 1 && poiCounts.healthcare <= 1) {
    tips.push("💡 Growth opportunity: Medical services and wellness centers");
  }

  if (poiCounts.education >= 1 && poiCounts.commercial <= 1) {
    tips.push("💡 Growth opportunity: Educationally-focused retail");
  }

  // Default tips
  if (tips.length === 0) {
    tips.push("✅ Infrastructure well-distributed - good for planned development");
  }

  return tips;
}
