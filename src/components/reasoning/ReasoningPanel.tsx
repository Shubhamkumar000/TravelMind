import { agents } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, CheckCircle2 } from 'lucide-react';

interface ReasoningPanelProps {
  isVisible: boolean;
}

export const ReasoningPanel = ({ isVisible }: ReasoningPanelProps) => {
  if (!isVisible) return null;

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
              Analyzed 127 destinations against your constraints: budget ₹35,000, duration 5 days, 
              vegetarian preferences, morning flights, and cultural interests. Applied multi-objective 
              optimization to balance cost, experience quality, and preference alignment.
            </p>
          </div>

          <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
            <h4 className="font-semibold text-foreground mb-2">Why Bali?</h4>
            <ul className="space-y-1">
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cost efficiency:</strong> Flight + accommodation within budget (₹27,000)
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Cultural match:</strong> Rich temples, traditional arts, spiritual sites
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Food preferences:</strong> Excellent vegetarian cuisine availability (8.5/10 rating)
                </span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Flight timing:</strong> Morning departures available (preferred)
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Agent-by-Agent Reasoning</h4>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div key={agent.id} className="p-3 bg-card rounded-lg border border-border">
                  <h5 className="font-medium text-foreground text-sm mb-1">{agent.name}</h5>
                  <p className="text-xs text-muted-foreground">{agent.reasoning}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
