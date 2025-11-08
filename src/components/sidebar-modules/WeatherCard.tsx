import { weatherData } from '@/data/mockData';

export const WeatherCard = () => {
  return (
    <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Weather Snapshot</h3>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-2xl font-bold text-foreground">{weatherData.temp}</p>
          <p className="text-sm text-muted-foreground">{weatherData.current}</p>
        </div>
        <div className="text-4xl">⛅</div>
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
