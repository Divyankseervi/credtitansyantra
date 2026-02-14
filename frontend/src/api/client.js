import axios from "axios";
import { config } from "../config";

const api = axios.create({
  baseURL: config.API_BASE,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

/**
 * Call backend POST /analyze
 * Sends polygon coordinates array
 */
export async function analyzeLandApi(coordinates) {
  const { data } = await api.post('/analyze', {
    coordinates: coordinates,
  });

  if (!data || typeof data !== 'object') {
    return data;
  }

  const landType = data.land_type ?? data.land_classification?.land_type ?? null;
  const ndviScore = data.ndvi_score ?? data.suitability?.ndvi_like ?? null;
  const soilHealth = data.soil_health ?? data.suitability?.suitability_score ?? null;
  const trustScore = data.trust_score ?? data.suitability?.suitability_score ?? null;
  const changeStatus =
    data.change_detection?.status ??
    data.change_detection ??
    null;
  const oldImageUrl = data.old_image_url ?? data.old_image ?? null;
  const newImageUrl = data.new_image_url ?? data.new_image ?? null;
  const ndviUrl = data.ndvi_url ?? data.ndvi ?? null;

  return {
    land_type: landType,
    ndvi_score: ndviScore,
    soil_health: soilHealth,
    trust_score: trustScore,
    change_detection: changeStatus,
    flood_risk: data.flood_risk ?? null,
    drought_risk: data.drought_risk ?? null,
    polygon_received: data.polygon_received ?? null,
    old_image_url: oldImageUrl,
    new_image_url: newImageUrl,
    ndvi_url: ndviUrl,
    raw: data,
  };
}
