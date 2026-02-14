import { config } from '../config';
import { mockAnalyzeLand } from './mock';
import { analyzeLandApi } from './client';

/**
 * Analyze land by polygon coordinates.
 * Uses mock or real API based on config.USE_MOCK_API
 */
export async function analyzeLand(coordinates) {
  if (config.USE_MOCK_API) {
    // Extract centroid from polygon coordinates for mock API
    let lat = 20.5937;
    let lon = 78.9629;
    
    if (Array.isArray(coordinates) && coordinates.length > 0) {
      const first = coordinates[0];
      if (Array.isArray(first)) {
        lat = first[0];
        lon = first[1];
      } else if (first.latitude && first.longitude) {
        lat = first.latitude;
        lon = first.longitude;
      }
    }
    
    return mockAnalyzeLand(lat, lon);
  }
  return analyzeLandApi(coordinates);
}
