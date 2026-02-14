import { config } from '../config';

const ROI_API_BASE = config.ROI_API_BASE || 'http://localhost:5000';

function buildErrorMessage(response, payload) {
  if (payload && typeof payload === 'object') {
    return payload.message || payload.error || response.statusText;
  }
  return response.statusText;
}

export async function analyzeRoi({ lat, lon, ndvi, change, landType }) {
  const response = await fetch(`${ROI_API_BASE}/analyze-roi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lat,
      lon,
      ndvi,
      change,
      landType,
    }),
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    throw new Error(buildErrorMessage(response, payload));
  }

  return payload;
}
