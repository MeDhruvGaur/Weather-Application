# 🌤️ Weather Application

A modern, responsive Weather Application that fetches real-time weather data from a public API and displays it in a user-friendly interface.

The application allows users to search for cities, view current weather conditions, check a 5-day forecast, switch between Celsius and Fahrenheit, save favorite cities, and cache weather data for improved performance.

---

## 📌 Project Overview

This project was developed as part of **Week 4: Frontend Integration & Final Project**.

The primary purpose of this project is to demonstrate how a frontend application can communicate with an external API and dynamically display data to users.

The Weather Application focuses on important frontend development concepts such as:

* API Integration
* REST APIs
* HTTP Methods
* Fetch API
* JSON Data
* Asynchronous JavaScript
* Promises and Async/Await
* Error Handling
* DOM Manipulation
* LocalStorage
* Responsive Web Design
* Modular JavaScript
* Basic Deployment

---

# 🎯 Project Objectives

The main objectives of this project are:

* Fetch real-time weather information using an external API.
* Allow users to search for weather information by city.
* Display current weather conditions.
* Display a 5-day weather forecast.
* Implement temperature conversion between Celsius and Fahrenheit.
* Handle API and network errors properly.
* Store user preferences using LocalStorage.
* Implement weather data caching.
* Create a responsive design for all devices.
* Display user-friendly loading and error states.
* Organize the project using a modular file structure.

---

# ✨ Features

## 🌡️ Current Weather

The application displays real-time weather information, including:

* City name
* Country
* Current temperature
* Feels-like temperature
* Weather conditions
* Weather description
* Humidity
* Wind speed
* Atmospheric pressure

---

## 📅 5-Day Weather Forecast

The application displays a weather forecast for the upcoming five days.

Each forecast card includes:

* Day name
* Weather icon
* Weather condition
* Maximum temperature
* Minimum temperature

---

## 🔍 City Search

Users can search for weather information by entering the name of a city.

The application fetches weather data dynamically based on the user's search query.

---

## 🔄 Temperature Unit Conversion

Users can switch between:

* Celsius (°C)
* Fahrenheit (°F)

The application automatically converts the displayed temperatures.

### Conversion Formula

```text
°F = (°C × 9/5) + 32
```

---

## ❤️ Favorite Cities

Users can save their favorite cities for quick and easy access.

Favorite cities are stored in the browser using LocalStorage.

---

## 💾 Weather Data Caching

The application temporarily caches weather data to:

* Reduce unnecessary API requests
* Improve application performance
* Provide faster responses

The cache duration is set to approximately 10 minutes.

---

## ⏳ Loading States

A loading message is displayed while the application fetches weather information.

Example:

```text
Loading weather data...
```

---

## ⚠️ Error Handling

The application handles multiple error situations, including:

* Invalid city names
* Network connection failures
* API failures
* Incorrect API keys
* Unexpected server responses

Users are shown clear and user-friendly error messages.

---

## 📱 Responsive Design

The application is designed to work properly on:

* Desktop computers
* Laptops
* Tablets
* Mobile phones

CSS media queries are used to create a responsive layout.

---

## 📍 Location Detection

The application can optionally use the browser's Geolocation API to retrieve weather information based on the user's current location.

---

# 🛠️ Technologies Used

| Technology         | Purpose                                |
| ------------------ | -------------------------------------- |
| HTML5              | Application structure                  |
| CSS3               | Styling and layout                     |
| JavaScript (ES6+)  | Application functionality              |
| Fetch API          | Fetching data from APIs                |
| OpenWeatherMap API | Weather information                    |
| LocalStorage       | Storing user preferences and favorites |
| Git                | Version control                        |
| GitHub             | Repository hosting                     |
| GitHub Pages       | Website deployment                     |

---

# 📂 Project Structure

```text
week4-weather-app/
│
├── index.html
│
├── css/
│   ├── style.css
│   ├── weather-icons.css
│   └── responsive.css
│
├── js/
│   ├── app.js
│   ├── weatherService.js
│   ├── ui.js
│   ├── storage.js
│   └── config.js
│
├── assets/
│   ├── icons/
│   └── images/
│
├── README.md
├── .env.example
└── .gitignore
```

---

# 📁 File Structure Explanation

## `index.html`

The main HTML file of the application.

It contains the structure for:

* Search input
* Search button
* Current weather section
* Weather forecast section
* Temperature unit toggle
* Loading state
* Error messages
* Favorite cities

---

## `css/style.css`

Contains the main styling of the application.

This includes:

* Application layout
* Weather cards
* Search bar
* Buttons
* Colors
* Gradients
* Shadows
* Animations

---

## `css/weather-icons.css`

Contains weather-related icon styles and configurations.

---

## `css/responsive.css`

Contains media queries for responsive design.

The application layout adjusts based on the device screen size.

---

## `js/app.js`

This is the main JavaScript entry point of the application.

Responsibilities include:

* Initializing the application
* Handling user events
* Managing the application flow
* Connecting API and UI modules

---

## `js/weatherService.js`

This module handles communication with the Weather API.

Responsibilities include:

* Fetching current weather data
* Fetching weather forecast data
* Handling API errors
* Managing weather data caching

---

## `js/ui.js`

This module manages the user interface.

Responsibilities include:

* Displaying current weather
* Displaying weather forecasts
* Showing loading states
* Showing error messages
* Updating temperature units

---

## `js/storage.js`

This module handles browser LocalStorage.

Responsibilities include:

* Saving favorite cities
* Retrieving favorite cities
* Saving user preferences
* Retrieving cached weather information

---

## `js/config.js`

This file stores application configuration information.

Example:

```javascript
const CONFIG = {
    API_KEY: "YOUR_API_KEY",
    BASE_URL: "https://api.openweathermap.org/data/2.5"
};

export default CONFIG;
```

> ⚠️ Never upload your actual API key to a public GitHub repository.

---

# 🔌 API Integration

This project uses the OpenWeatherMap API to retrieve real-time weather information.

The API returns weather data in JSON format.

---

## Current Weather API

### Endpoint

```text
https://api.openweathermap.org/data/2.5/weather
```

### Example Request

```javascript
const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
);
```

---

## Weather Forecast API

### Endpoint

```text
https://api.openweathermap.org/data/2.5/forecast
```

### Example Request

```javascript
const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&appid=${API_KEY}`
);
```

---

# 📡 REST API and HTTP Methods

The Weather Application uses REST API concepts to communicate with the weather service.

The primary HTTP method used in this project is:

## GET

The `GET` method is used to retrieve weather information.

Example:

```javascript
fetch("https://api.example.com/weather");
```

The API sends the requested information as a JSON response.

Example JSON response:

```json
{
    "name": "Delhi",
    "main": {
        "temp": 32,
        "humidity": 65
    },
    "weather": [
        {
            "description": "clear sky"
        }
    ]
}
```

---

# 🔄 Application Data Flow

The application follows the architecture shown below:

```text
User
 │
 ▼
Search City
 │
 ▼
JavaScript Event Handler
 │
 ▼
Weather Service
 │
 ▼
Fetch API Request
 │
 ▼
OpenWeatherMap API
 │
 ▼
JSON Response
 │
 ▼
Data Processing
 │
 ▼
UI Module
 │
 ▼
Display Weather Information
```

---

# 🧩 Component Architecture

```text
Weather Application
│
├── Search Component
│   ├── Search Input
│   └── Search Button
│
├── Current Weather Component
│   ├── City Information
│   ├── Temperature
│   ├── Weather Condition
│   ├── Humidity
│   ├── Wind Speed
│   └── Pressure
│
├── Forecast Component
│   ├── Day
│   ├── Weather Icon
│   ├── Maximum Temperature
│   └── Minimum Temperature
│
├── Unit Toggle Component
│   ├── Celsius
│   └── Fahrenheit
│
└── Storage Component
    ├── Cached Weather Data
    └── Favorite Cities
```

---

# ⚙️ Installation and Setup

Follow the steps below to run the project locally.

## Step 1: Clone the Repository

```bash
git clone https://github.com/MeDhruvGaur/week4-weather-app.git
```

---

## Step 2: Navigate to the Project Directory

```bash
cd week4-weather-app
```

---

## Step 3: Get an API Key

Create an account on OpenWeatherMap and generate a free API key.

After receiving your API key, add it to your configuration file.

Example:

```javascript
const API_KEY = "YOUR_API_KEY";
```

---

## Step 4: Configure Environment Variables

Create a `.env` file based on `.env.example`.

Example `.env.example`:

```env
WEATHER_API_KEY=YOUR_API_KEY
```

> **Important:** Do not push your actual API key to GitHub.

---

## Step 5: Run the Application

You can open the `index.html` file directly in your browser.

For a better development experience, use the **Live Server** extension in Visual Studio Code.

---

# 💻 Core Functionality

## Fetching Current Weather

```javascript
async function getWeather(city) {
    try {
        const response = await fetch(
            `${BASE_URL}/weather?q=${city}&units=metric&appid=${API_KEY}`
        );

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        return data;

    } catch (error) {
        console.error("Error fetching weather data:", error);
        throw error;
    }
}
```

---

# 🌡️ Temperature Conversion

The application can convert temperatures between Celsius and Fahrenheit.

```javascript
function convertTemperature(temp, unit) {
    if (unit === "celsius") {
        return Math.round(temp);
    }

    return Math.round((temp * 9 / 5) + 32);
}
```

---

# 💾 Data Caching

Weather data is cached temporarily to improve application performance.

The caching process works as follows:

```text
User Searches for a City
        │
        ▼
Check Cached Data
        │
        ├── Cache Available
        │       │
        │       ▼
        │   Return Cached Data
        │
        └── Cache Not Available
                │
                ▼
            Call Weather API
                │
                ▼
            Receive Data
                │
                ▼
            Save Data to Cache
                │
                ▼
            Display Weather Data
```

Example:

```javascript
saveToCache(key, data) {
    this.cache.set(key, {
        data: data,
        timestamp: Date.now()
    });
}
```

---

# 🗄️ LocalStorage

LocalStorage is used to store persistent user data.

The application can store:

* Favorite cities
* User preferences
* Last searched city
* Cached weather information

### Saving Data

```javascript
localStorage.setItem(
    "favoriteCities",
    JSON.stringify(favoriteCities)
);
```

### Retrieving Data

```javascript
const favorites = JSON.parse(
    localStorage.getItem("favoriteCities")
);
```

---

# ⚠️ Error Handling

The application handles errors gracefully and provides meaningful feedback to users.

## Invalid City

```text
City not found. Please enter a valid city name.
```

## Network Error

```text
Unable to connect to the weather service.
Please check your internet connection.
```

## API Error

```text
Unable to fetch weather information.
Please try again later.
```

Example implementation:

```javascript
try {
    const weatherData = await getWeather(city);
    displayWeather(weatherData);

} catch (error) {
    showError(error.message);
}
```

---

# ⏳ Loading States

A loading state is displayed while the application is fetching weather data.

Example:

```javascript
function showLoading() {
    weatherContainer.innerHTML =
        "<p>Loading weather data...</p>";
}
```

---

# 📱 Responsive Design

The Weather Application is designed for multiple screen sizes.

## Desktop

```text
Width: 1024px and above
```

## Tablet

```text
Width: 768px to 1023px
```

## Mobile

```text
Width: Below 768px
```

Example media query:

```css
@media screen and (max-width: 768px) {
    .weather-container {
        grid-template-columns: 1fr;
    }
}
```

---

# 🧪 Testing

The following test cases should be performed to ensure that the application works correctly.

| Test Case              | Expected Result                                 |
| ---------------------- | ----------------------------------------------- |
| Search a valid city    | Weather data should be displayed                |
| Search an invalid city | An appropriate error message should appear      |
| Turn off the internet  | A network error should be displayed             |
| Switch to Fahrenheit   | Temperature should convert correctly            |
| Switch back to Celsius | Temperature should display correctly            |
| Refresh the page       | Saved preferences should remain                 |
| Resize the browser     | Layout should remain responsive                 |
| API failure            | A user-friendly error message should appear     |
| Search a favorite city | Weather data should load successfully           |
| Cached data available  | Application should reduce unnecessary API calls |

---

# 📸 Screenshots

Add screenshots of your completed application in this section.

## Home Page

```md
![Home Page](./assets/images/home.png)
```

## City Search

```md
![City Search](./assets/images/search.png)
```

## 5-Day Forecast

```md
![Weather Forecast](./assets/images/forecast.png)
```

## Mobile Responsive Design

```md
![Mobile View](./assets/images/mobile.png)
```

---

# 🚀 Deployment

This project can be deployed using GitHub Pages.

## Steps to Deploy on GitHub Pages

1. Push the project to your GitHub repository.
2. Open your repository on GitHub.
3. Go to **Settings**.
4. Navigate to **Pages**.
5. Select the branch containing your project.
6. Select the root folder.
7. Save the settings.
8. GitHub will generate a live deployment URL.

---

# 🔮 Future Improvements

The following features can be added in future versions of the application:

* Weather map integration
* Severe weather alerts
* Hourly weather forecast
* Air quality information
* Sunrise and sunset information
* Multiple language support
* Voice-based city search
* Advanced city autocomplete
* Weather comparison between multiple cities
* Progressive Web App (PWA) support
* Push notifications
* Manual dark and light mode
* Improved location tracking

---

# 📚 Concepts Learned

This project demonstrates the following frontend development concepts:

* REST APIs
* HTTP Requests
* Fetch API
* GET Requests
* JSON Data Parsing
* Async/Await
* JavaScript Promises
* Error Handling
* DOM Manipulation
* ES6 Classes
* LocalStorage
* Data Caching
* Responsive Web Design
* Modular JavaScript
* API Integration
* Project Organization

---

# 🏗️ Technical Architecture

```text
┌─────────────────────┐
│      User Input     │
│   City / Location   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     Application     │
│       app.js        │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Weather Service   │
│ weatherService.js   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   OpenWeatherMap    │
│        API          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│    JSON Response    │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│     UI Module       │
│       ui.js         │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Weather Display   │
└─────────────────────┘
```

---

# 🔐 Security Considerations

When working with APIs, it is important to protect sensitive information.

### Recommendations

* Do not upload API keys directly to public repositories.
* Add sensitive files to `.gitignore`.
* Use environment variables when possible.
* Use a backend server for sensitive API keys in production applications.

Example `.gitignore`:

```text
.env
config.local.js
node_modules/
```

---

# 🤝 Contributing

Contributions are welcome.

If you would like to improve this project:

1. Fork the repository.
2. Create a new branch.
3. Make your changes.
4. Commit your changes.
5. Push the branch.
6. Create a Pull Request.

---

# 👨‍💻 Author

**Dhruv Kumar**

### Connect With Me

* GitHub: https://github.com/MeDhruvGaur
* LinkedIn: https://www.linkedin.com/in/dhruvkumargaur/
* Portfolio: https://medhruvgaur.vercel.app/

---

# 📄 License

This project was created for educational and learning purposes.

You are free to use, modify, and improve this project for personal learning.

---

# 🙏 Acknowledgments

Special thanks to:

* OpenWeatherMap for providing weather data APIs.
* GitHub for repository hosting.
* The developer community for helpful learning resources and documentation.

---

# ⭐ Show Your Support

If you found this project helpful, please consider giving the repository a **star ⭐** on GitHub.

---

## 🌤️ Happy Coding!

Made with ❤️ by **Dhruv Kumar**
