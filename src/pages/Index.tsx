import { useState, useEffect } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { BottomBar } from '@/components/layout/BottomBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { ActivityLog } from '@/components/layout/ActivityLog';
import { QueryInput } from '@/components/query/QueryInput';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { BookingModal } from '@/components/booking/BookingModal';
import { ReasoningPanel } from '@/components/reasoning/ReasoningPanel';
import { WeatherCard } from '@/components/sidebar-modules/WeatherCard';
import { agents as initialAgents, recommendedPlan } from '@/data/mockData';
import { Agent } from '@/data/mockData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState('balanced');
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);

  const handleQuerySubmit = (query: string) => {
    setIsProcessing(true);
    setShowResults(false);
    setAgents(initialAgents.map(a => ({ ...a, status: 'pending' as const })));

    // Simulate agent execution
    const agentSequence = agents.map((_, index) => {
      return setTimeout(() => {
        setAgents(prev => 
          prev.map((agent, i) => {
            if (i === index) return { ...agent, status: 'running' as const };
            if (i < index) return { ...agent, status: 'done' as const };
            return agent;
          })
        );

        // After last agent completes
        if (index === agents.length - 1) {
          setTimeout(() => {
            setAgents(prev => prev.map(a => ({ ...a, status: 'done' as const })));
            setIsProcessing(false);
            setShowResults(true);
          }, 1000);
        }
      }, (index + 1) * 1500);
    });

    return () => agentSequence.forEach(clearTimeout);
  };

  const handleBookNow = (planId: string) => {
    setSelectedPlanId(planId);
    setShowBookingModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedPersona={selectedPersona}
          onPersonaSelect={setSelectedPersona}
          tripData={showResults ? {
            destination: recommendedPlan.destination,
            duration: recommendedPlan.duration,
            totalCost: recommendedPlan.totalCost
          } : undefined}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {!showResults ? (
              <>
                <Card className="p-6 bg-gradient-card shadow-lg">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Where would you like to go?
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Describe your dream trip and let our AI agents plan everything for you
                  </p>
                  <QueryInput onSubmit={handleQuerySubmit} isProcessing={isProcessing} />
                </Card>

                {isProcessing && (
                  <div className="text-center p-8 animate-fade-in">
                    <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium text-foreground">
                      Our AI agents are crafting your perfect trip...
                    </p>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="reasoning"
                      checked={showReasoning}
                      onCheckedChange={setShowReasoning}
                    />
                    <Label htmlFor="reasoning" className="cursor-pointer">
                      Show AI Reasoning
                    </Label>
                  </div>
                </div>

                {showReasoning && <ReasoningPanel isVisible={showReasoning} />}
                
                <ResultsDashboard onBookNow={handleBookNow} />

                <div className="pt-4">
                  <WeatherCard />
                </div>
              </>
            )}
          </div>
        </main>

        {(isProcessing || showResults) && <ActivityLog agents={agents} />}
      </div>

      <BottomBar />

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        planId={selectedPlanId}
      />
    </div>
  );
};

export default Index;
