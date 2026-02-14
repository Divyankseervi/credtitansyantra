export const config = {
  // ✅ Keep backend only
  USE_MOCK_API: false,

  // ✅ Your backend URL
  API_BASE: "http://localhost:8000",

  // ✅ Safety backend (same for now)
  SAFETY_API_BASE: "http://localhost:8000",

  // ✅ Required API keys structure (to prevent crash)
  API_KEYS: {
    OPENWEATHER_API_KEY: "",  // add key later
    GEMINI_API_KEY: "",       // optional
  },
};
