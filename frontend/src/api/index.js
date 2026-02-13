import { config } from '../config';
import { mockAnalyzeLand } from './mock';
import { analyzeLandApi } from './client';

/**
 * Analyze land by centroid coordinates.
 * Uses mock or real API based on config.USE_MOCK_API
 */
export async function analyzeLand(lat, lon) {
  if (config.USE_MOCK_API) {
    return mockAnalyzeLand(lat, lon);
  }
  return analyzeLandApi(lat, lon);
}
