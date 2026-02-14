/**
 * OpenWeather API Service
 * Fetches real-time weather and environmental data for land verification
 */

import { config } from '../config';

// Use fixed API key from config
let OPENWEATHER_API_KEY = config.API_KEYS.OPENWEATHER_API_KEY || '';

/**
 * Set OpenWeather API key (for backward compatibility)
 */
export function setOpenWeatherAPI(apiKey) {
  OPENWEATHER_API_KEY = apiKey;
}

/**
 * Get stored API key
 */
export function getOpenWeatherAPI() {
  // Use config key if available, otherwise fallback to stored key
  return config.API_KEYS.OPENWEATHER_API_KEY || OPENWEATHER_API_KEY;
}

/**
 * Fetch weather data from OpenWeather API
 */
export async function fetchWeatherData(latitude, longitude, apiKey = null) {
  const key = apiKey || OPENWEATHER_API_KEY;

  if (!key) {
    console.warn('OpenWeather API key not set. Using fallback weather data.');
    return getDefaultWeatherData();
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;

    const response = await fetch(url);

    if (!response.ok) {
      console.warn('Failed to fetch weather from OpenWeather. Using defaults.');
      return getDefaultWeatherData();
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || 0,
      description: data.weather[0]?.description || 'Unknown',
      windSpeed: data.wind?.speed || 0,
      cloudiness: data.clouds?.all || 0,
      visibility: (data.visibility / 1000).toFixed(2), // Convert to km
      pressure: data.main.pressure,
      dewPoint: Math.round(data.main.feels_like),
      sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
      sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
      lastUpdated: new Date().toLocaleTimeString(),
      source: 'OpenWeather API',
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return getDefaultWeatherData();
  }
}

/**
 * Get forecast data (optional)
 */
export async function fetchForecastData(latitude, longitude, apiKey = null) {
  const key = apiKey || OPENWEATHER_API_KEY;

  if (!key) {
    return null;
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data = await response.json();
    return data.list.slice(0, 8).map((f) => ({
      time: new Date(f.dt * 1000).toLocaleTimeString(),
      temp: Math.round(f.main.temp),
      humidity: f.main.humidity,
      description: f.weather[0]?.description,
    }));
  } catch (error) {
    console.error('Error fetching forecast:', error);
    return null;
  }
}

/**
 * Enhanced weather detection with soil type suggestion
 */
export async function analyzeWeatherForLand(latitude, longitude, apiKey = null) {
  const weatherData = await fetchWeatherData(latitude, longitude, apiKey);

  // Estimate soil type based on climate
  let estimatedSoilType = 'loamy';
  if (weatherData.temperature > 35) {
    estimatedSoilType = 'sandy';
  } else if (weatherData.humidity > 80 && weatherData.rainfall > 5) {
    estimatedSoilType = 'alluvial';
  } else if (weatherData.temperature < 10) {
    estimatedSoilType = 'laterite';
  }

  return {
    ...weatherData,
    estimatedSoilType,
    ndviPrediction: predictNDVIFromWeather(weatherData),
  };
}

/**
 * Predict NDVI range based on weather conditions
 */
export function predictNDVIFromWeather(weatherData) {
  const { temperature, humidity, cloudiness, rainfall } = weatherData;

  // Green: high humidity, moderate temp, low clouds, some rain
  if (humidity > 70 && temperature > 15 && temperature < 40 && cloudiness < 70 && rainfall > 0) {
    return { min: 0.5, max: 0.8, prediction: 'High vegetation expected (Agricultural)' };
  }

  // Yellow: moderate humidity and temp
  if (humidity > 50 && humidity <= 70 && temperature > 20 && cloudiness < 50) {
    return { min: 0.2, max: 0.5, prediction: 'Moderate vegetation (Mixed use)' };
  }

  // Red: dry, hot, dusty
  if (humidity < 50 && temperature > 35 && cloudiness < 30) {
    return { min: -0.1, max: 0.2, prediction: 'Low vegetation (Industrial/Built-up)' };
  }

  // Default
  return { min: 0.2, max: 0.6, prediction: 'Check actual satellite data' };
}

/**
 * Default weather data when API is unavailable
 */
function getDefaultWeatherData() {
  return {
    temperature: 25,
    humidity: 60,
    rainfall: 0,
    description: 'Data not available',
    windSpeed: 0,
    cloudiness: 50,
    visibility: '10.00',
    pressure: 1013,
    dewPoint: 15,
    sunrise: 'N/A',
    sunset: 'N/A',
    lastUpdated: new Date().toLocaleTimeString(),
    source: 'Default/Fallback',
  };
}

/**
 * Validate API key format
 */
export function validateAPIKey(apiKey) {
  // OpenWeather API keys are typically 32 hex characters
  return /^[a-f0-9]{32}$/.test(apiKey);
}
