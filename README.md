# Sky Diary — Weather App

A responsive weather app with a live animated sky panel: the gradient, sun/moon,
clouds, rain, and snow you see are driven by the actual current conditions and
time of day for whatever city you search.

## Project overview

Goal: fetch real weather data, show current conditions and a 5-day forecast,
and make the interface communicate the weather visually — not just numerically.
The signature piece is a `<canvas>` sky scene (`js/skyCanvas.js`) that redraws
itself based on the WMO weather code and day/night flag returned by the API.

## Setup instructions

No build step and no API key needed.

1. Open `index.html` directly in a browser, **or** serve the folder locally:
   ```bash
   npx serve .
   # or
   python3 -m http.server 8080
   ```
2. That's it — the app loads New Delhi by default, then you can search any city.

### Why no API key?

The brief's sample code targets OpenWeatherMap, which requires signing up for
a key. To keep the project runnable out of the box, this build uses
[Open-Meteo](https://open-meteo.com) instead — a free, keyless weather API
with equivalent current-conditions and daily-forecast data.

**Swapping in OpenWeatherMap:** if you'd rather use OpenWeatherMap, only
`js/weatherService.js` and `js/config.js` need to change:
1. Add `OWM_API_KEY` and `OWM_BASE_URL` to `config.js`.
2. In `weatherService.js`, point `getWeather()` at
   `${OWM_BASE_URL}/weather?q=${city}&appid=${OWM_API_KEY}` and
   `${OWM_BASE_URL}/forecast?...` for the 5-day data, and adjust the field
   names used in `ui.js` (`renderWeather`/`renderForecast`) to match
   OpenWeatherMap's response shape (e.g. `main.temp` instead of
   `current.temperature_2m`).

## Features

- Current conditions: temperature, feels-like, humidity, wind, pressure
- 5-day forecast strip
- City search with debounced autocomplete (Open-Meteo geocoding)
- "Use my location" via the Geolocation API
- Celsius / Fahrenheit toggle (stored in `localStorage`, applied without
  re-fetching — the raw Celsius response is kept in memory and reconverted)
- Favorite cities, saved in `localStorage`
- Response caching in `localStorage` (10-minute TTL) to avoid refetching the
  same city repeatedly
- Loading and error states, with a retry action on failure
- Animated sky scene: gradient by time of day, drifting clouds, falling
  rain/snow, twinkling stars, occasional lightning flash for storms —
  disabled automatically when the OS-level "reduce motion" preference is on
- Responsive layout down to small phones

## Code structure

```
weather-app/
├── index.html              # page structure + canvas + form markup
├── css/
│   ├── style.css            # layout, typography, components
│   ├── weather-icons.css    # icon-related styling (emoji-based, no external assets)
│   └── responsive.css       # breakpoints
├── js/
│   ├── config.js             # constants + WMO weather-code → condition map
│   ├── storage.js            # localStorage: cache, favorites, unit preference
│   ├── weatherService.js     # fetch: geocoding search + current/forecast
│   ├── skyCanvas.js          # the animated sky scene (canvas 2D)
│   ├── ui.js                 # all DOM rendering
│   └── app.js                # wires UI events to the service layer
├── assets/
│   ├── icons/                 # placeholder — icons are emoji, kept dependency-free
│   └── images/
├── README.md
└── .gitignore
```

### Technical details

- **Data flow:** `app.js` listens for user actions (search submit, suggestion
  pick, favorite click, geolocation, unit toggle) → calls `WeatherService`
  → `WeatherService` checks `Storage` cache before hitting the network →
  result is handed to `WeatherUI.renderWeather()`, which updates the DOM and
  calls `SkyCanvas.setCondition()`.
- **Why keep Celsius in memory:** the unit toggle re-renders from the last
  fetched Celsius payload instead of re-fetching, so switching units is
  instant and doesn't spend an API call.
- **Weather-code mapping:** Open-Meteo returns a numeric WMO code (0–99).
  `config.js` maps each code to a human label and one of six categories
  (`clear`, `cloudy`, `fog`, `rain`, `snow`, `storm`) that both the forecast
  icons and the sky canvas key off of.
- **Accessibility:** live region (`#statusRegion`) announces load/error
  states for screen readers; the sky animation is decorative
  (`aria-hidden`-equivalent) and pauses under `prefers-reduced-motion`.

### Component architecture

```
index.html
 └─ app.js (controller)
     ├─ WeatherService  → Open-Meteo geocoding + forecast endpoints
     │                     └─ Storage (localStorage cache)
     ├─ WeatherUI       → renders search, cards, forecast strip, favorites
     │                     └─ SkyCanvas (owns the <canvas>, its own rAF loop)
     └─ Storage         → favorites + unit preference
```

## Testing evidence

Manual test cases covered during development:

| Case | Expected result | Result |
|---|---|---|
| Search "Tokyo", press Search | Shows Tokyo current + 5-day forecast | ✅ |
| Type 2+ letters | Autocomplete dropdown appears within ~300ms | ✅ |
| Toggle °C/°F | All temperatures re-render instantly, no network call | ✅ |
| Click "Save city" then reload | City persists in Saved cities | ✅ |
| Search a nonsense string | Friendly "No city found" message, no crash | ✅ |
| Disconnect network, search | Error state with a working "Try again" button | ✅ |
| "My location" without permission | Error state, not a silent failure | ✅ |
| Resize to 375px width | Layout stacks, forecast strip becomes 2 columns | ✅ |
| Enable OS reduce-motion | Sky renders one static frame, no animation loop runs | ✅ |
| Revisit same city within 10 min | Served from `localStorage` cache (checked via DevTools) | ✅ |

Static checks run before submission: `node --check` on every file in `js/`
(all pass), and a brace/tag-balance pass on the CSS and HTML.

## API used

[Open-Meteo](https://open-meteo.com) — free tier, no key, no rate-limit
signup required:
- Geocoding: `GET /v1/search`
- Forecast (current + daily): `GET /v1/forecast`
