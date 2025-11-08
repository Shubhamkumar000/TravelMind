// Weather Service - Fetches real weather data from OpenWeatherMap API

export interface WeatherData {
  current: string;
  temp: string;
  humidity?: string;
  currentIcon?: string;
  forecast: {
    day: string;
    icon: string;
    temp: string;
  }[];
}

// Get weather icon based on weather condition code
const getWeatherIcon = (conditionCode: number): string => {
  // OpenWeatherMap condition codes
  if (conditionCode >= 200 && conditionCode < 300) return '⛈️'; // Thunderstorm
  if (conditionCode >= 300 && conditionCode < 400) return '🌧️'; // Drizzle
  if (conditionCode >= 500 && conditionCode < 600) return '🌧️'; // Rain
  if (conditionCode >= 600 && conditionCode < 700) return '❄️'; // Snow
  if (conditionCode >= 700 && conditionCode < 800) return '🌫️'; // Atmosphere (fog, mist)
  if (conditionCode === 800) return '☀️'; // Clear sky
  if (conditionCode >= 801 && conditionCode < 810) return '⛅'; // Clouds
  return '⛅'; // Default
};

// Get weather description from condition code
const getWeatherDescription = (conditionCode: number): string => {
  if (conditionCode >= 200 && conditionCode < 300) return 'Thunderstorm';
  if (conditionCode >= 300 && conditionCode < 400) return 'Drizzle';
  if (conditionCode >= 500 && conditionCode < 600) return 'Rain';
  if (conditionCode >= 600 && conditionCode < 700) return 'Snow';
  if (conditionCode >= 700 && conditionCode < 800) return 'Foggy';
  if (conditionCode === 800) return 'Clear';
  if (conditionCode >= 801 && conditionCode < 810) return 'Cloudy';
  return 'Partly Cloudy';
};

// Extract city name from destination string (e.g., "Bali, Indonesia" -> "Bali")
const extractCityName = (destination: string): string => {
  // Remove common suffixes like ", Country" or "City, Country"
  const parts = destination.split(',');
  return parts[0].trim();
};

// Fetch weather data from OpenWeatherMap API
export const fetchWeatherData = async (
  destination: string,
  departureDate?: Date,
  returnDate?: Date
): Promise<WeatherData | null> => {
  try {
    const cityName = extractCityName(destination);
    
    // Using OpenWeatherMap free API (no key required for basic usage, but limited)
    // For production, you'd want to use an API key from https://openweathermap.org/api
    // For now, we'll use a free alternative: Open-Meteo API which doesn't require an API key
    
    // Try to get coordinates for the city first using a geocoding service
    // Using Open-Meteo Geocoding API (free, no key required)
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=en&format=json`;
    
    const geocodeResponse = await fetch(geocodeUrl);
    if (!geocodeResponse.ok) {
      throw new Error('Failed to geocode city');
    }
    
    const geocodeData = await geocodeResponse.json();
    
    if (!geocodeData.results || geocodeData.results.length === 0) {
      console.warn(`Could not find coordinates for: ${cityName}`);
      return null;
    }
    
    const { latitude, longitude } = geocodeData.results[0];
    
    // Fetch current weather and forecast from Open-Meteo (free, no API key required)
    const today = new Date();
    const forecastDays = 5;
    
    // Get forecast dates
    const forecastDates: Date[] = [];
    for (let i = 0; i < forecastDays; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      forecastDates.push(date);
    }
    
    // Fetch current weather
    const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&timezone=auto`;
    
    const currentResponse = await fetch(currentWeatherUrl);
    if (!currentResponse.ok) {
      throw new Error('Failed to fetch current weather');
    }
    
    const currentData = await currentResponse.json();
    
    // Fetch forecast
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=${forecastDays}`;
    
    const forecastResponse = await fetch(forecastUrl);
    if (!forecastResponse.ok) {
      throw new Error('Failed to fetch forecast');
    }
    
    const forecastData = await forecastResponse.json();
    
    // Process current weather
    const currentTemp = Math.round(currentData.current.temperature_2m);
    const currentHumidity = Math.round(currentData.current.relative_humidity_2m);
    const currentCondition = currentData.current.weather_code;
    
    // Process forecast
    const forecast = forecastData.daily.time.slice(0, forecastDays).map((dateStr: string, index: number) => {
      const date = new Date(dateStr);
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayName = dayNames[date.getDay()];
      const maxTemp = Math.round(forecastData.daily.temperature_2m_max[index]);
      const conditionCode = forecastData.daily.weather_code[index];
      
      return {
        day: dayName,
        icon: getWeatherIcon(conditionCode),
        temp: `${maxTemp}°C`,
      };
    });
    
    return {
      current: getWeatherDescription(currentCondition),
      temp: `${currentTemp}°C`,
      humidity: `${currentHumidity}%`,
      currentIcon: getWeatherIcon(currentCondition),
      forecast: forecast,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

