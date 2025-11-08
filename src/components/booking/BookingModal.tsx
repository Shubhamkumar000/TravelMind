import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TripPlan } from '@/data/mockData';
import { 
  Download, 
  Share2, 
  Calendar, 
  Copy, 
  ExternalLink, 
  FileText,
  CheckCircle2,
  Plane,
  Hotel,
  MapPin
} from 'lucide-react';
import { toast } from 'sonner';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
  plan?: TripPlan;
}

export const BookingModal = ({ isOpen, onClose, planId, plan }: BookingModalProps) => {
  const [copied, setCopied] = useState(false);

  if (!plan) {
    return null;
  }

  // Extract airport codes from flight details
  const extractAirportCode = (route: string): string => {
    const match = route.match(/\(([A-Z]{3})\)/);
    return match ? match[1] : '';
  };

  const departureCode = extractAirportCode(plan.flightDetails.departure);
  const arrivalCode = extractAirportCode(plan.flightDetails.arrival);

  // Generate booking links
  const getFlightBookingLink = () => {
    if (departureCode && arrivalCode) {
      return `https://www.google.com/travel/flights?q=Flights%20${departureCode}%20to%20${arrivalCode}`;
    }
    return `https://www.google.com/travel/flights?q=Flights%20to%20${plan.destination}`;
  };

  const getHotelBookingLink = () => {
    return `https://www.google.com/travel/hotels?q=Hotels%20in%20${plan.destination}`;
  };

  // Copy plan details to clipboard
  const copyPlanDetails = () => {
    const planText = `
Trip Plan: ${plan.destination}
Duration: ${plan.duration} days
Total Cost: ₹${plan.totalCost.toLocaleString()}

Flight Details:
- ${plan.flightDetails.departure}
- ${plan.flightDetails.arrival}
- Airline: ${plan.flightDetails.airline}
- Duration: ${plan.flightDetails.duration}

Hotel: ${plan.hotelDetails.name}
Location: ${plan.hotelDetails.location}
Rating: ${plan.hotelDetails.rating}/5

Highlights:
${plan.highlights.map(h => `- ${h}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(planText);
    setCopied(true);
    toast.success('Plan details copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Share plan
  const sharePlan = async () => {
    const shareData = {
      title: `Trip Plan: ${plan.destination}`,
      text: `Check out this amazing ${plan.duration}-day trip to ${plan.destination}! Total cost: ₹${plan.totalCost.toLocaleString()}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Plan shared successfully!');
      } else {
        copyPlanDetails();
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Export to calendar (ICS format)
  const exportToCalendar = () => {
    // Get dates from the plan (we'll use today as start date for demo)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + plan.duration);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//TravelMind AI//Trip Plan//EN
BEGIN:VEVENT
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:Trip to ${plan.destination}
DESCRIPTION:${plan.duration}-day trip to ${plan.destination}\\nTotal Cost: ₹${plan.totalCost.toLocaleString()}\\n\\nHighlights:\\n${plan.highlights.join('\\n')}
LOCATION:${plan.destination}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-plan-${plan.destination.replace(/\s+/g, '-')}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Calendar event exported!');
  };

  // Export to PDF (simple text format)
  const exportToPDF = () => {
    const content = `
TRIP PLAN: ${plan.destination}
Duration: ${plan.duration} days
Total Cost: ₹${plan.totalCost.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLIGHT DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Departure: ${plan.flightDetails.departure}
Return: ${plan.flightDetails.arrival}
Airline: ${plan.flightDetails.airline}
Duration: ${plan.flightDetails.duration}
Cost: ₹${plan.flightCost.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOTEL DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: ${plan.hotelDetails.name}
Location: ${plan.hotelDetails.location}
Rating: ${plan.hotelDetails.rating}/5
Amenities: ${plan.hotelDetails.amenities.join(', ')}
Cost: ₹${plan.hotelCost.toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ITINERARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${plan.itinerary.map(day => `
Day ${day.day}: ${day.title}
${day.activities.map(act => `  ${act.time} - ${act.icon} ${act.name}`).join('\n')}
`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIGHLIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${plan.highlights.map(h => `• ${h}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

COST BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Flight: ₹${plan.flightCost.toLocaleString()}
Hotel: ₹${plan.hotelCost.toLocaleString()}
Activities: ₹${plan.activityCost.toLocaleString()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: ₹${plan.totalCost.toLocaleString()}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `trip-plan-${plan.destination.replace(/\s+/g, '-')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Plan exported as text file!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Plan Your Trip to {plan.destination}</DialogTitle>
          <DialogDescription>
            Use these tools to help you book and organize your {plan.duration}-day trip
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={copyPlanDetails}
                variant="outline"
                className="w-full justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy Plan Details'}
              </Button>
              
              <Button
                onClick={sharePlan}
                variant="outline"
                className="w-full justify-start"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Plan
              </Button>
              
              <Button
                onClick={exportToCalendar}
                variant="outline"
                className="w-full justify-start"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="w-full justify-start"
              >
                <Download className="w-4 h-4 mr-2" />
                Export as Text
              </Button>
            </div>
          </div>

          {/* Booking Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">Book Your Trip</h3>
            <div className="space-y-3">
              <a
                href={getFlightBookingLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Book Flights</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.flightDetails.airline} • {plan.flightDetails.duration}
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>

              <a
                href={getHotelBookingLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-gradient-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Hotel className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">Book Hotel</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.hotelDetails.name} • {plan.hotelDetails.rating}/5 ⭐
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>
          </div>

          {/* Plan Summary */}
          <div className="p-4 rounded-lg border border-border bg-gradient-card">
            <h3 className="text-lg font-semibold text-foreground mb-3">Plan Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-medium text-foreground">{plan.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium text-foreground">{plan.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Cost:</span>
                <span className="font-bold text-primary">₹{plan.totalCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Flight Cost:</span>
                <span className="font-medium text-foreground">₹{plan.flightCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Hotel Cost:</span>
                <span className="font-medium text-foreground">₹{plan.hotelCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activity Cost:</span>
                <span className="font-medium text-foreground">₹{plan.activityCost.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground mb-1">Booking Tips</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Book flights 2-3 months in advance for better prices</li>
                  <li>• Compare prices across multiple booking sites</li>
                  <li>• Check hotel cancellation policies before booking</li>
                  <li>• Save this plan for easy reference during your trip</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <Button
            onClick={onClose}
            className="w-full bg-gradient-primary text-primary-foreground"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
