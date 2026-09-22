const rawUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000";

export const API_BASE_URL = rawUrl.replace(/\/+$/, "");

export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/health`,
  predictDisease: `${API_BASE_URL}/predict-disease`,
  recommendCrop: `${API_BASE_URL}/recommend-crop`,
  predictRainfall: `${API_BASE_URL}/predict-rainfall`,
  weather: `${API_BASE_URL}/weather`,
  askKrishak: `${API_BASE_URL}/ask-krishak`,
};