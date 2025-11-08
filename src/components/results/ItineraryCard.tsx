import { DayItinerary } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ItineraryCardProps {
  day: DayItinerary;
}

export const ItineraryCard = ({ day }: ItineraryCardProps) => {
  return (
    <Card className="overflow-hidden border-l-4 border-l-primary">
      <CardHeader className="bg-gradient-subtle">
        <CardTitle className="text-lg">
          Day {day.day}: {day.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {day.activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <span className="text-2xl flex-shrink-0">{activity.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{activity.name}</p>
                <p className="text-sm text-primary">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
