import { config } from '../config';

const API_BASE = config.API_BASE || 'http://localhost:8000';

/**
 * Analyze surrounding land within 300m radius
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Surroundings analysis data
 */
export async function analyzeSurroundings(lat, lon) {
  try {
    const url = `${API_BASE}/surroundings`;
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
    });

    const response = await fetch(`${url}?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Surroundings API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing surroundings:', error);
    throw error;
  }
}

/**
 * Get color for land use category
 */
export function getCategoryColor(category) {
  const colors = {
    'Agriculture': '#10b981',
    'Residential': '#3b82f6',
    'Commercial & Retail': '#f59e0b',
    'Industrial': '#6b7280',
    'Nature & Parks': '#22c55e',
    'Institutional': '#8b5cf6',
    'Mixed / Other': '#64748b',
  };
  return colors[category] || '#94a3b8';
}
