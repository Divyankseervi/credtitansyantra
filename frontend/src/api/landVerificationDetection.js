/**
 * Advanced land detection based on multiple factors:
 * - NDVI (vegetation)
 * - Weather patterns
 * - Building density
 * - Soil type
 * - Seasonal changes
 */

/**
 * Analyze land based on NDVI and weather
 */
export function analyzeLandCharacteristics(ndvi, weatherData = {}) {
  const {
    temperature = 25,
    humidity = 60,
    rainfall = 0,
    soilType = "loamy",
    elevation = 100,
  } = weatherData;

  let characteristics = {
    vegetation: classifyVegetation(ndvi),
    moisture: classifyMoisture(humidity, rainfall),
    climate: classifyClimate(temperature, humidity),
    soilFertility: estimateSoilFertility(ndvi, soilType),
    buildingDensity: estimateBuildingDensity(ndvi),
    seasonality: analyzeSeasonality(ndvi, temperature),
  };

  return characteristics;
}

/**
 * Classify vegetation based on NDVI
 */
export function classifyVegetation(ndvi) {
  if (ndvi > 0.7) return { level: "Very Dense", type: "Forest/Plantation" };
  if (ndvi > 0.5) return { level: "Dense", type: "Cultivated Crops" };
  if (ndvi > 0.3) return { level: "Moderate", type: "Grassland/Sparse Trees" };
  if (ndvi > 0.1) return { level: "Sparse", type: "Shrubland/Mixed Use" };
  return { level: "None/Minimal", type: "Barren/Built-up" };
}

/**
 * Classify moisture levels
 */
export function classifyMoisture(humidity, rainfall) {
  const moistureIndex = humidity * 0.4 + (rainfall / 100) * 0.6;
  if (moistureIndex > 70) return "Very Wet";
  if (moistureIndex > 50) return "Wet";
  if (moistureIndex > 30) return "Moderate";
  if (moistureIndex > 10) return "Dry";
  return "Very Dry";
}

/**
 * Classify climate zone
 */
export function classifyClimate(temperature, humidity) {
  if (temperature > 30 && humidity > 70) return "Tropical";
  if (temperature > 20 && humidity > 60) return "Subtropical";
  if (temperature > 15 && temperature < 25) return "Temperate";
  if (temperature < 10) return "Cold";
  return "Arid";
}

/**
 * Estimate soil fertility based on NDVI and soil type
 */
export function estimateSoilFertility(ndvi, soilType) {
  let baseFertility = ndvi * 100;

  const soilAdjustments = {
    loamy: 1.2,
    clayey: 0.9,
    sandy: 0.7,
    alluvial: 1.3,
    laterite: 0.8,
  };

  const adjustment = soilAdjustments[soilType] || 1.0;
  return Math.min(100, baseFertility * adjustment);
}

/**
 * Estimate building density from NDVI
 */
export function estimateBuildingDensity(ndvi) {
  const density = Math.max(0, (1 - ndvi) * 100);
  if (density > 70) return { level: "Very High", density };
  if (density > 50) return { level: "High", density };
  if (density > 30) return { level: "Medium", density };
  if (density > 10) return { level: "Low", density };
  return { level: "Minimal", density };
}

/**
 * Analyze seasonality
 */
export function analyzeSeasonality(ndvi, temperature) {
  let season = "Unknown";
  if (temperature > 30) season = "Summer";
  else if (temperature > 20) season = "Monsoon";
  else if (temperature > 10) season = "Winter";
  else season = "Cold Season";

  let seasonalEffect = "Normal";
  if (ndvi < 0.2 && (season === "Summer" || season === "Cold Season"))
    seasonalEffect = "Low due to season";
  if (ndvi > 0.6 && (season === "Monsoon"))
    seasonalEffect = "High due to monsoon";

  return { season, effect: seasonalEffect };
}

/**
 * Detect actual land use from characteristics
 */
export function detectActualLandUse(characteristics) {
  const { vegetation, buildingDensity, moisture, soilFertility, climate } =
    characteristics;

  // Industrial detection
  if (buildingDensity.level === "Very High" && vegetation.level === "None/Minimal") {
    return "Industrial";
  }

  // Residential detection
  if (
    buildingDensity.level === "High" &&
    (vegetation.level === "Sparse" || vegetation.level === "Moderate")
  ) {
    return "Residential";
  }

  // Agricultural detection
  if (
    (vegetation.level === "Dense" || vegetation.level === "Moderate") &&
    (soilFertility > 50 || moisture === "Wet" || moisture === "Moderate")
  ) {
    return "Agricultural";
  }

  // Commercial detection (mix of both)
  if (buildingDensity.level === "Medium" && vegetation.level === "Moderate") {
    return "Commercial";
  }

  // Mixed use
  if (
    buildingDensity.level === "Low" &&
    vegetation.level === "Moderate"
  ) {
    return "Mixed Use";
  }

  // Forest/Natural
  if (vegetation.level === "Very Dense" || vegetation.level === "Dense") {
    return "Forest/Plantation";
  }

  // Barren
  if (vegetation.level === "None/Minimal" && buildingDensity.level === "Minimal") {
    return "Barren/Fallow";
  }

  return "Unable to determine";
}

/**
 * Compare declared vs detected land use
 */
export function compareDetectedVsDeclared(declaredUse, detectedUse) {
  const match = declaredUse === detectedUse;
  
  const compatibility = {
    "Agricultural-Residential": 0.3,
    "Agricultural-Commercial": 0.2,
    "Agricultural-Industrial": 0.1,
    "Residential-Commercial": 0.6,
    "Residential-Industrial": 0.1,
    "Commercial-Industrial": 0.7,
    "Mixed Use-Agricultural": 0.5,
    "Mixed Use-Residential": 0.7,
    "Mixed Use-Commercial": 0.8,
  };

  const key = `${declaredUse}-${detectedUse}`;
  const reverseKey = `${detectedUse}-${declaredUse}`;
  const score =
    compatibility[key] || compatibility[reverseKey] || (match ? 1 : 0);

  return {
    match,
    compatibilityScore: score,
    message: match
      ? "Land use matches declaration"
      : score > 0.5
      ? "Land uses are somewhat compatible"
      : "Land uses are incompatible - requires investigation",
  };
}

/**
 * Perform full land verification
 */
export async function performLandVerification(verificationData) {
  const {
    declaredUse,
    coordinates = { latitude: 13.0827, longitude: 80.2707 },
    ndvi = 0.5,
    weatherData = {},
  } = verificationData;

  // Analyze land characteristics
  const characteristics = analyzeLandCharacteristics(ndvi, weatherData);

  // Detect actual land use
  const detectedUse = detectActualLandUse(characteristics);

  // Compare
  const comparison = compareDetectedVsDeclared(declaredUse, detectedUse);

  // Risk assessment
  const riskLevel =
    comparison.compatibilityScore < 0.3
      ? "High"
      : comparison.compatibilityScore < 0.7
      ? "Medium"
      : "Low";

  // Ensure coordinates have the right structure
  const normalizedCoordinates = {
    latitude: coordinates.latitude || 13.0827,
    longitude: coordinates.longitude || 80.2707,
  };

  return {
    declaredUse,
    detectedUse,
    characteristics,
    comparison,
    riskLevel,
    coordinates: normalizedCoordinates,
    timestamp: new Date().toISOString(),
  };
}
