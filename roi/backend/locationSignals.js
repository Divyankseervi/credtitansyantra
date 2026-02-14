const axios = require("axios");

const RADIUS_M = 1000; // 1km
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

/**
 * Fetches nearby infrastructure from OpenStreetMap via Overpass API.
 * Base infra: schools, hospitals, transport, roads, shops (max 60).
 * + Connectivity (motorway/trunk/primary), commercial density, development pressure.
 * Returns { infraScore, hasDevelopmentPressure, hasHighConnectivity }. Clamp infraScore 0–100.
 */
async function getLocationSignals(lat, lon) {
  const query = `
[out:json][timeout:25];
(
  node["amenity"="school"](around:${RADIUS_M},${lat},${lon});
  node["amenity"="hospital"](around:${RADIUS_M},${lat},${lon});
  node["shop"](around:${RADIUS_M},${lat},${lon});
  way["highway"](around:${RADIUS_M},${lat},${lon});
  node["public_transport"](around:${RADIUS_M},${lat},${lon});
  way["highway"~"motorway|trunk|primary"](around:${RADIUS_M},${lat},${lon});
  node["amenity"~"marketplace|bank|restaurant|college"](around:${RADIUS_M},${lat},${lon});
  way["landuse"="construction"](around:${RADIUS_M},${lat},${lon});
  node["building"="apartments"](around:${RADIUS_M},${lat},${lon});
);
out body;
`;

  try {
    const response = await axios.post(OVERPASS_URL, query, {
      headers: { "Content-Type": "text/plain" },
      timeout: 15000,
    });

    const elements = response.data?.elements ?? [];
    let hasSchools = false;
    let hasHospitals = false;
    let hasShops = false;
    let hasRoads = false;
    let hasTransport = false;
    let connectivity = 0; // motorway +15, trunk +10, primary +5 (take max)
    let commercialCount = 0;
    let hasDevelopmentPressure = false;

    for (const el of elements) {
      const t = el.tags || {};
      if (t.amenity === "school") hasSchools = true;
      if (t.amenity === "hospital") hasHospitals = true;
      if (t.shop) hasShops = true;
      if (el.type === "way" && t.highway) hasRoads = true;
      if (t.public_transport) hasTransport = true;

      const h = t.highway || "";
      if (h === "motorway" || h === "motorway_link") connectivity = Math.max(connectivity, 15);
      else if (h === "trunk" || h === "trunk_link") connectivity = Math.max(connectivity, 10);
      else if (h === "primary" || h === "primary_link") connectivity = Math.max(connectivity, 5);

      if (["marketplace", "bank", "restaurant", "college"].includes(t.amenity)) commercialCount += 1;

      if (t.landuse === "construction" || t.building === "apartments") hasDevelopmentPressure = true;
    }

    let baseInfra = 0;
    if (hasSchools) baseInfra += 10;
    if (hasHospitals) baseInfra += 10;
    if (hasTransport) baseInfra += 15;
    if (hasRoads) baseInfra += 15;
    if (hasShops) baseInfra += 10;

    let commercialDensity = 0;
    if (commercialCount >= 3) commercialDensity = 15;
    else if (commercialCount >= 1) commercialDensity = 8;

    const developmentPressure = hasDevelopmentPressure ? 20 : 0;

    const infraScore = Math.min(100, Math.max(0,
      baseInfra + connectivity + commercialDensity + developmentPressure
    ));

    const hasHighConnectivity = connectivity >= 10;

    return {
      infraScore,
      hasDevelopmentPressure,
      hasHighConnectivity,
    };
  } catch (error) {
    console.log("Location signal fallback used:", error.message);
    return { infraScore: 20, hasDevelopmentPressure: false, hasHighConnectivity: false };
  }
}

module.exports = { getLocationSignals };
