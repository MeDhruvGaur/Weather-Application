// config.js
// ------------------------------------------------------------------
// This project uses Open-Meteo (https://open-meteo.com) instead of
// OpenWeatherMap. It returns the same kind of data (current + daily
// forecast) but needs NO API key and NO signup, so the app works the
// moment you open index.html. If you'd rather use OpenWeatherMap,
// see the "Swapping in OpenWeatherMap" section of the README — the
// WeatherService class is written so you only need to change the
// two endpoint builders.
// ------------------------------------------------------------------

const CONFIG = {
  GEOCODE_URL: 'https://geocoding-api.open-meteo.com/v1/search',
  FORECAST_URL: 'https://api.open-meteo.com/v1/forecast',
  CACHE_DURATION_MS: 10 * 60 * 1000, // 10 minutes
  DEFAULT_CITY: 'New Delhi',
  MAX_FAVORITES: 6,
};

// WMO weather codes -> our internal condition categories.
// https://open-meteo.com/en/docs (see "Weather variable documentation")
const WEATHER_CODES = {
  0: { label: 'Clear sky', category: 'clear' },
  1: { label: 'Mostly clear', category: 'clear' },
  2: { label: 'Partly cloudy', category: 'cloudy' },
  3: { label: 'Overcast', category: 'cloudy' },
  45: { label: 'Fog', category: 'fog' },
  48: { label: 'Depositing rime fog', category: 'fog' },
  51: { label: 'Light drizzle', category: 'rain' },
  53: { label: 'Drizzle', category: 'rain' },
  55: { label: 'Dense drizzle', category: 'rain' },
  56: { label: 'Freezing drizzle', category: 'rain' },
  57: { label: 'Dense freezing drizzle', category: 'rain' },
  61: { label: 'Slight rain', category: 'rain' },
  63: { label: 'Rain', category: 'rain' },
  65: { label: 'Heavy rain', category: 'rain' },
  66: { label: 'Freezing rain', category: 'rain' },
  67: { label: 'Heavy freezing rain', category: 'rain' },
  71: { label: 'Slight snow', category: 'snow' },
  73: { label: 'Snow', category: 'snow' },
  75: { label: 'Heavy snow', category: 'snow' },
  77: { label: 'Snow grains', category: 'snow' },
  80: { label: 'Rain showers', category: 'rain' },
  81: { label: 'Heavy rain showers', category: 'rain' },
  82: { label: 'Violent rain showers', category: 'rain' },
  85: { label: 'Snow showers', category: 'snow' },
  86: { label: 'Heavy snow showers', category: 'snow' },
  95: { label: 'Thunderstorm', category: 'storm' },
  96: { label: 'Thunderstorm with hail', category: 'storm' },
  99: { label: 'Severe thunderstorm', category: 'storm' },
};

function describeWeatherCode(code) {
  return WEATHER_CODES[code] || { label: 'Unknown', category: 'cloudy' };
}
