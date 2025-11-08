import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Hotel, Ticket } from 'lucide-react';

interface CostBreakdownProps {
  flightCost: number;
  hotelCost: number;
  activityCost: number;
  totalCost: number;
}

export const CostBreakdown = ({ flightCost, hotelCost, activityCost, totalCost }: CostBreakdownProps) => {
  const items = [
    { label: 'Flights', amount: flightCost, icon: Plane, color: 'text-primary' },
    { label: 'Accommodation', amount: hotelCost, icon: Hotel, color: 'text-accent' },
    { label: 'Activities', amount: activityCost, icon: Ticket, color: 'text-success' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, index) => {
            const Icon = item.icon;
            const percentage = ((item.amount / totalCost) * 100).toFixed(0);
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">₹{item.amount.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color.replace('text', 'bg')}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
          
          <div className="pt-3 border-t border-border">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-xl font-bold text-primary">₹{totalCost.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
