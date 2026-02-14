import { config } from '../config';

const DEMO_RESPONSES = [
  {
    land_type: 'Agricultural - Crop Land',
    ndvi_score: 0.72,
    flood_risk: 'Low (12%)',
    drought_risk: 'Medium (45%)',
    soil_health: 78,
    change_detection: 'Stable vegetation cover over past 6 months',
    trust_score: 87,
  },
  {
    land_type: 'Mixed Use - Rural',
    ndvi_score: 0.58,
    flood_risk: 'Medium (38%)',
    drought_risk: 'Low (22%)',
    soil_health: 65,
    change_detection: 'Moderate forest clearance detected in Q3',
    trust_score: 72,
  },
  {
    land_type: 'Barren / Fallow',
    ndvi_score: 0.21,
    flood_risk: 'Low (8%)',
    drought_risk: 'High (78%)',
    soil_health: 42,
    change_detection: 'Land use change from agricultural to fallow',
    trust_score: 54,
  },
  {
    land_type: 'Forest / Vegetation',
    ndvi_score: 0.89,
    flood_risk: 'Medium (41%)',
    drought_risk: 'Low (15%)',
    soil_health: 91,
    change_detection: 'No significant change in canopy cover',
    trust_score: 94,
  },
];

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Mock analyze - returns demo data with simulated delay.
 * Accepts lat/lon for future API compatibility.
 */
export async function mockAnalyzeLand(lat, lon) {
  await delay(config.MOCK_DELAY_MS);

  // Pick varied response based on coordinates (deterministic)
  const idx = Math.floor(Math.abs(lat * 10 + lon) % DEMO_RESPONSES.length);
  return { ...DEMO_RESPONSES[idx] };
}
