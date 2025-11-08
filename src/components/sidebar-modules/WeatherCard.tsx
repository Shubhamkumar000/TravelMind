import { useState, useEffect } from 'react';
import { fetchWeatherData, WeatherData } from '@/services/weatherService';
import { Loader2 } from 'lucide-react';

interface WeatherCardProps {
  destination?: string;
  departureDate?: Date;
  returnDate?: Date;
}

export const WeatherCard = ({ destination, departureDate, returnDate }: WeatherCardProps) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!destination) {
      setWeatherData(null);
      return;
    }

    const loadWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchWeatherData(destination, departureDate, returnDate);
        if (data) {
          setWeatherData(data);
        } else {
          setError('Weather data not available');
        }
      } catch (err) {
        console.error('Failed to load weather:', err);
        setError('Failed to load weather data');
      } finally {
        setIsLoading(false);
      }
    };

    loadWeather();
  }, [destination, departureDate, returnDate]);

  if (!destination) {
    return (
      <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weather of Destination</h3>
        <p className="text-sm text-muted-foreground">Enter a destination to see weather</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weather of {destination}</h3>
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          <span className="ml-2 text-sm text-muted-foreground">Loading weather...</span>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
        <h3 className="text-sm font-semibold text-foreground mb-3">Weather of {destination}</h3>
        <p className="text-sm text-muted-foreground">{error || 'Weather data not available'}</p>
      </div>
    );
  }

  // Get icon for current weather
  const currentIcon = weatherData.currentIcon || weatherData.forecast[0]?.icon || '⛅';

  return (
    <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Weather of {destination}</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-foreground">{weatherData.temp}</p>
          <p className="text-sm text-muted-foreground">{weatherData.current}</p>
          {weatherData.humidity && (
            <p className="text-xs text-muted-foreground mt-1">Humidity: {weatherData.humidity}</p>
          )}
        </div>
        <div className="text-4xl">{currentIcon}</div>
      </div>

      <div className="flex justify-between text-center">
        {weatherData.forecast.map((day, index) => (
          <div key={index} className="flex flex-col items-center">
            <p className="text-xs text-muted-foreground">{day.day}</p>
            <span className="text-xl my-1">{day.icon}</span>
            <p className="text-xs text-foreground">{day.temp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
