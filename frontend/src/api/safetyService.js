/**
 * Safety Score API Service
 * Fetches safety score data from the Safety Intelligence backend
 */

import { config } from '../config';

const SAFETY_API_BASE = config.SAFETY_API_BASE || 'http://localhost:8000';

/**
 * Fetch safety score for a given location
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} Safety score data
 */
export async function fetchSafetyScore(lat, lon) {
  try {
    const url = `${SAFETY_API_BASE}/safety`;
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
      throw new Error(`Safety API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching safety score:', error);
    throw error;
  }
}

/**
 * Get safety score color based on risk level
 */
export function getSafetyColor(riskLevel) {
  const colors = {
    'Safe': 'green',
    'Moderate': 'yellow',
    'Caution': 'orange',
    'High Risk': 'red',
  };
  return colors[riskLevel] || 'gray';
}

/**
 * Get safety score badge style
 */
export function getSafetyBadgeStyle(riskLevel) {
  const styles = {
    'Safe': 'bg-green-100 text-green-800 border-green-300',
    'Moderate': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Caution': 'bg-orange-100 text-orange-800 border-orange-300',
    'High Risk': 'bg-red-100 text-red-800 border-red-300',
  };
  return styles[riskLevel] || 'bg-gray-100 text-gray-800 border-gray-300';
}
