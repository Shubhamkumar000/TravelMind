import { Agent, TripPlan } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle2 } from 'lucide-react';

interface ReasoningPanelProps {
  isVisible: boolean;
  agents: Agent[];
  tripPlans?: TripPlan[];
  query?: string;
  selectedPersona?: string;
}

export const ReasoningPanel = ({ isVisible, agents, tripPlans, query, selectedPersona }: ReasoningPanelProps) => {
  if (!isVisible) return null;

  // Get the recommended plan (first plan) for destination info
  const recommendedPlan = tripPlans && tripPlans.length > 0 ? tripPlans[0] : null;
  const destination = recommendedPlan?.destination || 'the selected destination';
  const totalCost = recommendedPlan?.totalCost || 0;
  const duration = recommendedPlan?.duration || 0;
  
  // Generate dynamic reasoning based on actual data
  const getConstraintSummary = () => {
    if (!recommendedPlan) {
      return 'Analyzing destinations against your constraints and preferences. Applied multi-objective optimization to balance cost, experience quality, and preference alignment.';
    }
    
    const constraints = [];
    if (totalCost > 0) constraints.push(`budget ₹${totalCost.toLocaleString()}`);
    if (duration > 0) constraints.push(`duration ${duration} days`);
    if (query) constraints.push(`destination preferences: ${query}`);
    if (selectedPersona) constraints.push(`${selectedPersona} travel style`);
    
    const constraintsText = constraints.length > 0 
      ? constraints.join(', ')
      : 'your preferences and constraints';
    
    return `Analyzed multiple destinations against your constraints: ${constraintsText}. Applied multi-objective optimization to balance cost, experience quality, and preference alignment.`;
  };

  const getDestinationReasons = () => {
    if (!recommendedPlan) return [];
    
    const reasons = [];
    
    // Cost efficiency
    if (recommendedPlan.flightCost && recommendedPlan.hotelCost) {
      const flightHotelTotal = recommendedPlan.flightCost + recommendedPlan.hotelCost;
      reasons.push({
        label: 'Cost efficiency',
        text: `Flight + accommodation within budget (₹${flightHotelTotal.toLocaleString()})`
      });
    }
    
    // Highlights from the plan
    if (recommendedPlan.highlights && recommendedPlan.highlights.length > 0) {
      const topHighlight = recommendedPlan.highlights[0];
      reasons.push({
        label: 'Key attraction',
        text: topHighlight
      });
    }
    
    // Hotel quality
    if (recommendedPlan.hotelDetails?.rating) {
      reasons.push({
        label: 'Accommodation quality',
        text: `${recommendedPlan.hotelDetails.rating}/5 star hotel in ${recommendedPlan.hotelDetails.location}`
      });
    }
    
    // Flight details
    if (recommendedPlan.flightDetails?.airline) {
      reasons.push({
        label: 'Travel convenience',
        text: `${recommendedPlan.flightDetails.airline} flights available (${recommendedPlan.flightDetails.duration})`
      });
    }
    
    return reasons;
  };

  const destinationReasons = getDestinationReasons();

  return (
    <div className="animate-fade-in space-y-4">
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            Explainable AI Reasoning
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <h4 className="font-semibold text-foreground mb-2">Constraint Solving Summary</h4>
            <p className="text-sm text-muted-foreground">
              {getConstraintSummary()}
            </p>
          </div>

          {destinationReasons.length > 0 && (
            <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
              <h4 className="font-semibold text-foreground mb-2">Why {destination}?</h4>
              <ul className="space-y-1">
                {destinationReasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{reason.label}:</strong> {reason.text}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-foreground mb-3">Agent-by-Agent Reasoning</h4>
            <div className="space-y-3">
              {agents.map((agent) => {
                // Generate dynamic reasoning if not provided
                const getAgentReasoning = () => {
                  if (agent.reasoning) return agent.reasoning;
                  
                  // Generate default reasoning based on agent type and plan data
                  if (agent.status === 'done' && recommendedPlan) {
                    switch (agent.id) {
                      case 'preferences':
                        return `Analyzed user preferences and constraints. Identified ${selectedPersona || 'balanced'} travel style preferences.`;
                      case 'search':
                        return `Searched and evaluated multiple destinations. Selected ${destination} as the optimal match.`;
                      case 'optimization':
                        return `Optimized routes and schedules. Calculated optimal flight paths and travel arrangements.`;
                      case 'itinerary':
                        return `Created a detailed ${duration}-day itinerary with ${recommendedPlan.itinerary?.length || 0} days of planned activities.`;
                      case 'cost':
                        return `Calculated total trip cost: ₹${totalCost.toLocaleString()} (Flights: ₹${recommendedPlan.flightCost.toLocaleString()}, Hotels: ₹${recommendedPlan.hotelCost.toLocaleString()}, Activities: ₹${recommendedPlan.activityCost.toLocaleString()}).`;
                      case 'route':
                        return `Planned optimal travel routes. ${recommendedPlan.flightDetails?.airline ? `Selected ${recommendedPlan.flightDetails.airline} flights.` : 'Optimized flight connections.'}`;
                      case 'refinement':
                        return `Validated and refined the final travel plan. Ensured all components align with user preferences.`;
                      default:
                        return agent.description;
                    }
                  }
                  
                  return agent.status === 'running' 
                    ? `${agent.description}...` 
                    : agent.description;
                };

                return (
                  <div key={agent.id} className="p-3 bg-card rounded-lg border border-border">
                    <h5 className="font-medium text-foreground text-sm mb-1">{agent.name}</h5>
                    <p className="text-xs text-muted-foreground">{getAgentReasoning()}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
