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
  try {
    const { data } = await api.post('/analyze', {
      coordinates: coordinates,
    });
    return data;
  } catch (error) {
    // Provide better error messages
    if (error.message === 'Network Error') {
      throw new Error('Network error: Backend server is not running. Using mock data...');
    }
    if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid request format');
    }
    if (error.response?.status === 500) {
      throw new Error('Backend server error: Please try again later');
    }
    throw error;
  }
}
