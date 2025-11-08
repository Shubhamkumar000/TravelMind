import { TripPlan } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ItineraryCard } from './ItineraryCard';
import { CostBreakdown } from './CostBreakdown';
import { MapPin, Plane, Hotel, Star, CheckCircle2 } from 'lucide-react';

interface PlanTabProps {
  plan: TripPlan;
  onBookNow: (planId: string) => void;
}

export const PlanTab = ({ plan, onBookNow }: PlanTabProps) => {
  return (
    <div className="space-y-6">
      {/* Destination Summary */}
      <Card className="border-2 border-primary/20 bg-gradient-card shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2 flex items-center gap-2">
                <MapPin className="w-8 h-8 text-primary" />
                {plan.destination}
              </CardTitle>
              <p className="text-muted-foreground">{plan.duration} days of amazing experiences</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">₹{plan.totalCost.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Cost</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/20 border border-secondary">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Flight Details</h4>
              </div>
              <p className="text-sm text-muted-foreground">{plan.flightDetails.departure}</p>
              <p className="text-sm text-muted-foreground">{plan.flightDetails.arrival}</p>
              <p className="text-sm font-medium text-foreground mt-1">
                {plan.flightDetails.airline} • {plan.flightDetails.duration}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-accent/20 border border-accent">
              <div className="flex items-center gap-2 mb-2">
                <Hotel className="w-5 h-5 text-accent" />
                <h4 className="font-semibold text-foreground">Accommodation</h4>
              </div>
              <p className="text-sm font-medium text-foreground">{plan.hotelDetails.name}</p>
              <div className="flex items-center gap-1 my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < plan.hotelDetails.rating ? 'fill-warning text-warning' : 'text-muted'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{plan.hotelDetails.location}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {plan.hotelDetails.amenities.map((amenity, index) => (
                  <span key={index} className="text-xs bg-background px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-success/10 border border-success/30">
            <h4 className="font-semibold text-foreground mb-2">Why This Plan?</h4>
            <div className="space-y-1">
              {plan.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Itinerary */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">Day-by-Day Itinerary</h3>
        <div className="space-y-4">
          {plan.itinerary.map((day) => (
            <ItineraryCard key={day.day} day={day} />
          ))}
        </div>
      </div>

      {/* Cost Breakdown */}
      <CostBreakdown
        flightCost={plan.flightCost}
        hotelCost={plan.hotelCost}
        activityCost={plan.activityCost}
        totalCost={plan.totalCost}
      />

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Interactive map coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Book Now Button */}
      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={() => onBookNow(plan.id)}
          className="bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-glow px-12"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Book This Plan Now
        </Button>
      </div>
    </div>
  );
};
