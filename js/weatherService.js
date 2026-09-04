// weatherService.js — all network calls live here.

class WeatherService {
  async searchCities(query) {
    if (!query || query.trim().length < 2) return [];
    const url = `${CONFIG.GEOCODE_URL}?name=${encodeURIComponent(
      query.trim()
    )}&count=5&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    const data = await response.json();

    return (data.results || []).map((r) => ({
      name: r.name,
      admin1: r.admin1 || '',
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
    }));
  }

  async getWeather(place) {
    const cacheKey = `${place.latitude.toFixed(2)}_${place.longitude.toFixed(2)}`;
    const cached = Storage.getCache(cacheKey);
    if (cached) return cached;

    const params = new URLSearchParams({
      latitude: place.latitude,
      longitude: place.longitude,
      current:
        'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,surface_pressure',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',
      forecast_days: 6,
    });

    const url = `${CONFIG.FORECAST_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const result = { place, ...data };
    Storage.setCache(cacheKey, result);
    return result;
  }

  async getByCoords(latitude, longitude, label = 'My location') {
    const place = { name: label, admin1: '', country: '', latitude, longitude };
    return this.getWeather(place);
  }
}
