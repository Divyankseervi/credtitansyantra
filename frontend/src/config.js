/**
 * App configuration.
 * Set USE_MOCK_API to false when backend is ready.
 */
export const config = {
  // Use mock data (no backend). Set to false when API is available.
  USE_MOCK_API: true,

  // Backend base URL (used when USE_MOCK_API is false)
  API_BASE: import.meta.env.VITE_API_URL || '/api',

  // Mock delay in ms (simulates network latency)
  MOCK_DELAY_MS: 1800,
};
