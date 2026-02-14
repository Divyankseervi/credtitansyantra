import { config } from '../config';
import { analyzeLandApi } from './client';

/**
 * Analyze land by polygon coordinates.
 * Uses mock or real API based on config.USE_MOCK_API
 */
export async function analyzeLand(coordinates) {
  if (config.USE_MOCK_API) {
    return mockAnalyzeLand(coordinates);
  }
  return analyzeLandApi(coordinates);
}
