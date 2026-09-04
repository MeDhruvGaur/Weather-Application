// storage.js — wraps localStorage for two jobs: response caching and favorites.

const Storage = {
  // ---- caching ----
  getCache(key) {
    try {
      const raw = localStorage.getItem(`weather_cache_${key}`);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CONFIG.CACHE_DURATION_MS) {
        localStorage.removeItem(`weather_cache_${key}`);
        return null;
      }
      return data;
    } catch (e) {
      return null;
    }
  },

  setCache(key, data) {
    try {
      localStorage.setItem(
        `weather_cache_${key}`,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      // localStorage full or unavailable — fail silently, caching is an optimization
      console.warn('Could not write cache:', e);
    }
  },

  // ---- favorites ----
  getFavorites() {
    try {
      return JSON.parse(localStorage.getItem('weather_favorites') || '[]');
    } catch (e) {
      return [];
    }
  },

  addFavorite(place) {
    const favorites = this.getFavorites();
    const exists = favorites.some(
      (f) => f.name === place.name && f.country === place.country
    );
    if (exists) return favorites;
    const updated = [place, ...favorites].slice(0, CONFIG.MAX_FAVORITES);
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
    return updated;
  },

  removeFavorite(place) {
    const updated = this.getFavorites().filter(
      (f) => !(f.name === place.name && f.country === place.country)
    );
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
    return updated;
  },

  // ---- unit preference ----
  getUnit() {
    return localStorage.getItem('weather_unit') || 'celsius';
  },

  setUnit(unit) {
    localStorage.setItem('weather_unit', unit);
  },
};
