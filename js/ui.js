// ui.js — everything that touches the DOM.

class WeatherUI {
  constructor() {
    this.els = {
      form: document.getElementById('searchForm'),
      input: document.getElementById('searchInput'),
      suggestions: document.getElementById('suggestions'),
      locateBtn: document.getElementById('locateBtn'),
      unitToggle: document.getElementById('unitToggle'),
      favoriteBtn: document.getElementById('favoriteBtn'),
      favorites: document.getElementById('favorites'),
      sceneCanvas: document.getElementById('sceneCanvas'),
      cityName: document.getElementById('cityName'),
      cityMeta: document.getElementById('cityMeta'),
      updatedAt: document.getElementById('updatedAt'),
      temp: document.getElementById('temp'),
      condition: document.getElementById('condition'),
      details: document.getElementById('details'),
      forecast: document.getElementById('forecast'),
      panel: document.getElementById('weatherPanel'),
      statusRegion: document.getElementById('statusRegion'),
    };
    this.unit = Storage.getUnit();
    this.currentPlace = null;
    this.lastWeatherC = null; // keep raw Celsius values so unit toggle needs no refetch
    this.sky = new SkyCanvas(this.els.sceneCanvas);
    this.sky.start();
    this._syncUnitLabel();
  }

  // ---------- unit handling ----------
  toCurrentUnit(celsius) {
    if (this.unit === 'celsius') return Math.round(celsius);
    return Math.round((celsius * 9) / 5 + 32);
  }

  unitSymbol() {
    return this.unit === 'celsius' ? '°C' : '°F';
  }

  toggleUnit() {
    this.unit = this.unit === 'celsius' ? 'fahrenheit' : 'celsius';
    Storage.setUnit(this.unit);
    this._syncUnitLabel();
    if (this.lastWeatherC) this.renderWeather(this.lastWeatherC, this.currentPlace);
  }

  _syncUnitLabel() {
    this.els.unitToggle.textContent = this.unit === 'celsius' ? '°C' : '°F';
    this.els.unitToggle.setAttribute(
      'aria-label',
      `Currently showing ${this.unit}. Switch to ${
        this.unit === 'celsius' ? 'Fahrenheit' : 'Celsius'
      }.`
    );
  }

  // ---------- loading / error ----------
  showLoading(label) {
    this.els.panel.setAttribute('aria-busy', 'true');
    this.els.cityName.textContent = label ? `Finding ${label}…` : 'Loading…';
    this.els.condition.textContent = '';
    this.els.temp.textContent = '--°';
    this.els.details.innerHTML = '';
    this.els.forecast.innerHTML = '<div class="forecast-loading">Fetching the forecast…</div>';
    this.announce('Loading weather data');
  }

  showError(message, onRetry) {
    this.els.panel.setAttribute('aria-busy', 'false');
    this.els.cityName.textContent = 'Couldn\u2019t load weather';
    this.els.condition.textContent = '';
    this.els.temp.textContent = '—';
    this.els.details.innerHTML = '';
    this.els.forecast.innerHTML = `
      <div class="error-state">
        <p>${message}</p>
        <button type="button" class="retry-btn">Try again</button>
      </div>`;
    this.els.forecast.querySelector('.retry-btn').addEventListener('click', onRetry);
    this.announce(message);
  }

  announce(message) {
    this.els.statusRegion.textContent = message;
  }

  // ---------- main render ----------
  renderWeather(weatherData, place) {
    this.lastWeatherC = weatherData;
    this.currentPlace = place;
    this.els.panel.setAttribute('aria-busy', 'false');

    const current = weatherData.current;
    const { label, category } = describeWeatherCode(current.weather_code);
    const isDay = !!current.is_day;

    this.sky.setCondition(category, isDay);

    const locationLabel = [place.name, place.admin1, place.country]
      .filter(Boolean)
      .join(', ');
    this.els.cityName.textContent = place.name;
    this.els.cityMeta.textContent = [place.admin1, place.country].filter(Boolean).join(', ');
    this.els.temp.textContent = `${this.toCurrentUnit(current.temperature_2m)}°`;
    this.els.condition.textContent = label;

    const now = new Date();
    this.els.updatedAt.textContent = `Updated ${now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })}`;

    this.els.details.innerHTML = `
      ${this._detailItem('Feels like', `${this.toCurrentUnit(current.apparent_temperature)}${this.unitSymbol()}`)}
      ${this._detailItem('Humidity', `${current.relative_humidity_2m}%`)}
      ${this._detailItem('Wind', `${Math.round(current.wind_speed_10m)} km/h`)}
      ${this._detailItem('Pressure', `${Math.round(current.surface_pressure)} hPa`)}
    `;

    this.renderForecast(weatherData.daily);
    this.announce(`${locationLabel}: ${label}, ${this.toCurrentUnit(current.temperature_2m)} degrees`);
    this._updateFavoriteButton(place);
  }

  _detailItem(label, value) {
    return `
      <div class="detail">
        <span class="detail-label">${label}</span>
        <span class="detail-value">${value}</span>
      </div>`;
  }

  renderForecast(daily) {
    const days = daily.time.slice(1, 6); // skip today, show next 5
    const html = days
      .map((dateStr, i) => {
        const idx = i + 1;
        const date = new Date(dateStr);
        const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
        const { label, category } = describeWeatherCode(daily.weather_code[idx]);
        const hi = this.toCurrentUnit(daily.temperature_2m_max[idx]);
        const lo = this.toCurrentUnit(daily.temperature_2m_min[idx]);
        return `
          <div class="forecast-day" data-category="${category}">
            <div class="forecast-dayname">${dayName}</div>
            <div class="forecast-icon" aria-hidden="true">${this._miniIcon(category)}</div>
            <div class="forecast-temps">
              <span class="hi">${hi}°</span>
              <span class="lo">${lo}°</span>
            </div>
            <div class="forecast-label">${label}</div>
          </div>`;
      })
      .join('');
    this.els.forecast.innerHTML = html;
  }

  _miniIcon(category) {
    const icons = {
      clear: '☀️',
      cloudy: '⛅',
      fog: '🌫️',
      rain: '🌧️',
      snow: '❄️',
      storm: '⛈️',
    };
    return icons[category] || '⛅';
  }

  // ---------- favorites ----------
  renderFavorites(activePlace) {
    const favorites = Storage.getFavorites();
    if (favorites.length === 0) {
      this.els.favorites.innerHTML = '<span class="favorites-empty">No saved cities yet</span>';
      return;
    }
    this.els.favorites.innerHTML = favorites
      .map((f) => {
        const active =
          activePlace && f.name === activePlace.name && f.country === activePlace.country;
        return `<button type="button" class="chip${active ? ' chip-active' : ''}" data-name="${f.name}" data-lat="${f.latitude}" data-lon="${f.longitude}">${f.name}</button>`;
      })
      .join('');
  }

  _updateFavoriteButton(place) {
    const favorites = Storage.getFavorites();
    const isFav = favorites.some((f) => f.name === place.name && f.country === place.country);
    this.els.favoriteBtn.setAttribute('aria-pressed', String(isFav));
    this.els.favoriteBtn.textContent = isFav ? '★ Saved' : '☆ Save city';
  }

  // ---------- autocomplete ----------
  renderSuggestions(results, onPick) {
    if (!results.length) {
      this.hideSuggestions();
      return;
    }
    this.els.suggestions.innerHTML = results
      .map(
        (r, i) => `
        <li role="option" id="opt-${i}">
          <button type="button" data-index="${i}">
            <span class="opt-name">${r.name}</span>
            <span class="opt-meta">${[r.admin1, r.country].filter(Boolean).join(', ')}</span>
          </button>
        </li>`
      )
      .join('');
    this.els.suggestions.hidden = false;
    this.els.suggestions.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => onPick(results[Number(btn.dataset.index)]));
    });
  }

  hideSuggestions() {
    this.els.suggestions.hidden = true;
    this.els.suggestions.innerHTML = '';
  }
}
