/**
 * Overpass API Service
 * Fetches nearby Points of Interest (POIs) from OpenStreetMap
 */

const OVERPASS_API_URL = "https://overpass-api.de/api/interpreter";

/**
 * Build Overpass query for nearby POIs
 */
function buildOverpassQuery(lat, lng, radius) {
  return `[out:json];
(
  node["amenity"="school"](around:${radius},${lat},${lng});
  node["amenity"="university"](around:${radius},${lat},${lng});
  node["amenity"="college"](around:${radius},${lat},${lng});
  node["amenity"="hospital"](around:${radius},${lat},${lng});
  node["amenity"="clinic"](around:${radius},${lat},${lng});
  node["amenity"="apartment"](around:${radius},${lat},${lng});
  node["building"="apartment"](around:${radius},${lat},${lng});
  node["amenity"="shopping_mall"](around:${radius},${lat},${lng});
  node["amenity"="shop"](around:${radius},${lat},${lng});
  node["amenity"="market"](around:${radius},${lat},${lng});
  way["landuse"="industrial"](around:${radius},${lat},${lng});
  way["landuse"="commercial"](around:${radius},${lat},${lng});
  way["highway"="primary"](around:${radius},${lat},${lng});
  way["highway"="secondary"](around:${radius},${lat},${lng});
  way["highway"="tertiary"](around:${radius},${lat},${lng});
  node["amenity"="factory"](around:${radius},${lat},${lng});
  node["amenity"="office"](around:${radius},${lat},${lng});
  way["landuse"="residential"](around:${radius},${lat},${lng});
);
out center;`;
}

/**
 * Fetch nearby POIs from Overpass API
 */
export async function fetchNearbyPOIs(lat, lng, radius = 2000) {
  try {
    const query = buildOverpassQuery(lat, lng, radius);

    const response = await fetch(OVERPASS_API_URL, {
      method: "POST",
      body: query,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      console.warn("Overpass API error:", response.statusText);
      return { elements: [] };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching POIs from Overpass:", error);
    return { elements: [] };
  }
}

/**
 * Extract POI information
 */
export function extractPOIInfo(element) {
  const tags = element.tags || {};
  const amenity = tags.amenity || "";
  const landuse = tags.landuse || "";
  const highway = tags.highway || "";
  const building = tags.building || "";

  let category = null;
  let name = tags.name || "Unknown";

  // Education
  if (amenity === "school" || amenity === "university" || amenity === "college") {
    category = "education";
  }
  // Healthcare
  else if (amenity === "hospital" || amenity === "clinic") {
    category = "healthcare";
  }
  // Residential
  else if (amenity === "apartment" || building === "apartment" || landuse === "residential") {
    category = "residential";
  }
  // Commercial
  else if (
    amenity === "shopping_mall" ||
    amenity === "shop" ||
    amenity === "market" ||
    amenity === "office" ||
    landuse === "commercial"
  ) {
    category = "commercial";
  }
  // Industrial
  else if (landuse === "industrial" || amenity === "factory") {
    category = "industrial";
  }
  // Infrastructure
  else if (highway === "primary" || highway === "secondary" || highway === "tertiary") {
    category = "infrastructure";
  }

  return { category, name };
}

/**
 * Categorize all POIs
 */
export function categorizePOIs(osmData) {
  const categories = {
    education: [],
    healthcare: [],
    residential: [],
    commercial: [],
    industrial: [],
    infrastructure: [],
  };

  const elements = osmData.elements || [];

  elements.forEach((element) => {
    const { category, name } = extractPOIInfo(element);
    if (category && categories[category]) {
      categories[category].push(name);
    }
  });

  // Return counts
  return {
    education: categories.education.length,
    healthcare: categories.healthcare.length,
    residential: categories.residential.length,
    commercial: categories.commercial.length,
    industrial: categories.industrial.length,
    infrastructure: categories.infrastructure.length,
    details: categories,
  };
}

/**
 * Get POI summary string
 */
export function getPOISummary(poiCounts) {
  const summary = [];

  if (poiCounts.education > 0) {
    summary.push(`📚 ${poiCounts.education} Education facilities`);
  }
  if (poiCounts.healthcare > 0) {
    summary.push(`🏥 ${poiCounts.healthcare} Healthcare facilities`);
  }
  if (poiCounts.residential > 0) {
    summary.push(`🏘️ ${poiCounts.residential} Residential areas`);
  }
  if (poiCounts.commercial > 0) {
    summary.push(`🛍️ ${poiCounts.commercial} Commercial areas`);
  }
  if (poiCounts.industrial > 0) {
    summary.push(`🏭 ${poiCounts.industrial} Industrial areas`);
  }
  if (poiCounts.infrastructure > 0) {
    summary.push(`🛣️ ${poiCounts.infrastructure} Major roads`);
  }

  if (summary.length === 0) {
    summary.push("🌾 Minimal urban infrastructure");
  }

  return summary;
}
