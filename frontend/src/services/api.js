import axios from "axios";

const API_BASE = "http://localhost:5000";

export async function analyzeROI(data) {
  try {
    const response = await axios.post(`${API_BASE}/analyze-roi`, data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

