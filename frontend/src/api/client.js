import axios from 'axios';
import { config } from '../config';

const api = axios.create({
  baseURL: config.API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Real API client - call backend POST /analyze
 * Used when USE_MOCK_API is false.
 */
export async function analyzeLandApi(lat, lon) {
  const { data } = await api.post('/analyze', { lat, lon });
  return data;
}
