// app.js — wires the UI to the WeatherService.

(function () {
  const service = new WeatherService();
  const ui = new WeatherUI();
  let debounceTimer = null;
  let activeSuggestionIndex = -1;

  async function loadPlace(place) {
    ui.showLoading(place.name);
    try {
      const weather = await service.getWeather(place);
      ui.renderWeather(weather, place);
      ui.renderFavorites(place);
    } catch (err) {
      console.error(err);
      ui.showError(
        'We couldn\u2019t reach the weather service. Check your connection and try again.',
        () => loadPlace(place)
      );
    }
  }

  async function loadCoords(lat, lon, label) {
    ui.showLoading(label);
    try {
      const weather = await service.getByCoords(lat, lon, label);
      const place = { name: label, admin1: '', country: '', latitude: lat, longitude: lon };
      ui.renderWeather(weather, place);
      ui.renderFavorites(place);
    } catch (err) {
      console.error(err);
      ui.showError('We couldn\u2019t load weather for your location.', () =>
        loadCoords(lat, lon, label)
      );
    }
  }

  async function loadDefault() {
    ui.showLoading(CONFIG.DEFAULT_CITY);
    try {
      const results = await service.searchCities(CONFIG.DEFAULT_CITY);
      if (results.length) {
        await loadPlace(results[0]);
      } else {
        ui.showError('Couldn\u2019t find a starting city.', loadDefault);
      }
    } catch (err) {
      console.error(err);
      ui.showError(
        'We couldn\u2019t reach the weather service. Check your connection and try again.',
        loadDefault
      );
    }
  }

  // ---- search + autocomplete ----
  ui.els.input.addEventListener('input', () => {
    const query = ui.els.input.value;
    clearTimeout(debounceTimer);
    activeSuggestionIndex = -1;
    if (query.trim().length < 2) {
      ui.hideSuggestions();
      return;
    }
    debounceTimer = setTimeout(async () => {
      try {
        const results = await service.searchCities(query);
        ui.renderSuggestions(results, (place) => {
          ui.els.input.value = place.name;
          ui.hideSuggestions();
          loadPlace(place);
        });
      } catch (err) {
        ui.hideSuggestions();
      }
    }, 300);
  });

  ui.els.input.addEventListener('keydown', (e) => {
    const items = ui.els.suggestions.querySelectorAll('button');
    if (ui.els.suggestions.hidden || !items.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, items.length - 1);
      items[activeSuggestionIndex].focus();
    } else if (e.key === 'Escape') {
      ui.hideSuggestions();
    }
  });

  document.addEventListener('click', (e) => {
    if (!ui.els.form.contains(e.target)) ui.hideSuggestions();
  });

  ui.els.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const query = ui.els.input.value.trim();
    if (!query) return;
    ui.showLoading(query);
    try {
      const results = await service.searchCities(query);
      if (results.length === 0) {
        ui.showError(`No city found matching "${query}".`, () => ui.els.form.requestSubmit());
        return;
      }
      ui.hideSuggestions();
      await loadPlace(results[0]);
    } catch (err) {
      console.error(err);
      ui.showError(
        'We couldn\u2019t reach the weather service. Check your connection and try again.',
        () => ui.els.form.requestSubmit()
      );
    }
  });

  // ---- geolocation ----
  ui.els.locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      ui.showError('Geolocation isn\u2019t supported in this browser.', () => {});
      return;
    }
    ui.showLoading('your location');
    navigator.geolocation.getCurrentPosition(
      (pos) => loadCoords(pos.coords.latitude, pos.coords.longitude, 'My location'),
      () => ui.showError('Location access was denied.', () => ui.els.locateBtn.click())
    );
  });

  // ---- unit toggle ----
  ui.els.unitToggle.addEventListener('click', () => ui.toggleUnit());

  // ---- favorites ----
  ui.els.favoriteBtn.addEventListener('click', () => {
    if (!ui.currentPlace) return;
    const favorites = Storage.getFavorites();
    const isFav = favorites.some(
      (f) => f.name === ui.currentPlace.name && f.country === ui.currentPlace.country
    );
    if (isFav) {
      Storage.removeFavorite(ui.currentPlace);
    } else {
      Storage.addFavorite(ui.currentPlace);
    }
    ui.renderFavorites(ui.currentPlace);
    ui._updateFavoriteButton(ui.currentPlace);
  });

  ui.els.favorites.addEventListener('click', (e) => {
    const chip = e.target.closest('.chip');
    if (!chip) return;
    loadPlace({
      name: chip.dataset.name,
      admin1: '',
      country: '',
      latitude: parseFloat(chip.dataset.lat),
      longitude: parseFloat(chip.dataset.lon),
    });
  });

  // ---- boot ----
  ui.renderFavorites(null);
  loadDefault();
})();
