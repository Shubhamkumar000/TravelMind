import { MapPin, Calendar, DollarSign } from 'lucide-react';

interface TripSummaryProps {
  tripData: {
    destination: string;
    duration: number;
    totalCost: number;
  };
}

export const TripSummary = ({ tripData }: TripSummaryProps) => {
  return (
    <div className="p-4 rounded-lg border border-border bg-gradient-card shadow-md">
      <h3 className="text-sm font-semibold text-foreground mb-3">Trip Summary</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-foreground">{tripData.destination}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-accent" />
          <span className="text-foreground">{tripData.duration} days</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="w-4 h-4 text-success" />
          <span className="text-foreground">₹{tripData.totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};
