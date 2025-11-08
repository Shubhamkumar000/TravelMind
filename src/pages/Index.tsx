import { useState, useEffect, useRef } from 'react';
import { TopNav } from '@/components/layout/TopNav';
import { BottomBar } from '@/components/layout/BottomBar';
import { Sidebar } from '@/components/layout/Sidebar';
import { QueryInput, TripQueryData } from '@/components/query/QueryInput';
import { HeroSection } from '@/components/home/HeroSection';
import { ResultsDashboard } from '@/components/results/ResultsDashboard';
import { BookingModal } from '@/components/booking/BookingModal';
import { ReasoningPanel } from '@/components/reasoning/ReasoningPanel';
import { WeatherCard } from '@/components/sidebar-modules/WeatherCard';
import { ApiKeyDialog } from '@/components/settings/ApiKeyDialog';
import { TripPlan } from '@/data/mockData';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getApiKey, setApiKey, getGeminiApiKey, setGeminiApiKey } from '@/utils/apiKeyStorage';
import { generateCompleteTripPlan } from '@/services/tripPlanService';
import { AlertCircle } from 'lucide-react';

const Index = () => {
  const [selectedPersona, setSelectedPersona] = useState('balanced');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [showReasoning, setShowReasoning] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const [tripPlans, setTripPlans] = useState<TripPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [lastQueryData, setLastQueryData] = useState<TripQueryData | null>(null);
  const isProcessingRef = useRef(false);

  const handleQuerySubmit = async (queryData: TripQueryData) => {
    // Prevent multiple simultaneous calls
    if (isProcessingRef.current) {
      console.log('API call already in progress, ignoring duplicate request');
      return;
    }

    setCurrentQuery(queryData.query);
    setLastQueryData(queryData); // Store query data for persona regeneration
    setIsProcessing(true);
    isProcessingRef.current = true;
    setShowResults(false);
    setError(null);
    setTripPlans([]);
    
    // Validate dates
    if (!queryData.departureDate || !queryData.returnDate) {
      setError('Please select both departure and return dates.');
      setIsProcessing(false);
      isProcessingRef.current = false;
      return;
    }

    if (queryData.returnDate <= queryData.departureDate) {
      setError('Return date must be after departure date.');
      setIsProcessing(false);
      isProcessingRef.current = false;
      return;
    }
    

    const openaiKey = getApiKey();
    const geminiKey = getGeminiApiKey();
    
    if ((!openaiKey || openaiKey.trim() === '') && (!geminiKey || geminiKey.trim() === '')) {
      setError('API key is required. Please set OpenAI or Gemini API key in Settings or .env file.');
      setIsProcessing(false);
      isProcessingRef.current = false;
      setShowApiKeyDialog(true);
      return;
    }

    // Basic API key format validation (only if OpenAI key is provided)
    if (openaiKey && !openaiKey.startsWith('sk-') && openaiKey.length < 20) {
      setError('Invalid OpenAI API key format. OpenAI keys typically start with "sk-". Please check your API key.');
      setIsProcessing(false);
      isProcessingRef.current = false;
      setShowApiKeyDialog(true);
      return;
    }

    try {
      console.log('Starting trip plan generation...', { 
        query: queryData.query, 
        departureDate: queryData.departureDate,
        returnDate: queryData.returnDate,
        persona: selectedPersona, 
        openaiKey: openaiKey ? 'Set' : 'Missing',
        geminiKey: geminiKey ? 'Set' : 'Missing'
      });

      console.log('Generating trip plan...');
      
      // Generate trip plan (single API call)
      const plans = await generateCompleteTripPlan(
        queryData.query, 
        selectedPersona,
        queryData.departureDate,
        queryData.returnDate
      );
      console.log('Trip plan generated:', plans);
      
      if (!plans || plans.length === 0) {
        throw new Error('No plans were generated. Please try again.');
      }

      setTripPlans(plans);
      setShowResults(true);
      console.log('Results displayed');
    } catch (err: any) {
      console.error('Error generating trip plans:', err);
      const errorMessage = err.message || 'Failed to generate trip plans. Please check your API key and try again.';
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
      isProcessingRef.current = false;
    }
  };

  const handleBookNow = (planId: string) => {
    setSelectedPlanId(planId);
    setShowBookingModal(true);
  };

  // Get the selected plan for the booking modal
  const selectedPlan = tripPlans.find(p => p.id === selectedPlanId);

  const handleApiKeySave = (apiKey: string) => {
    setApiKey(apiKey);
    setShowApiKeyDialog(false);
  };

  // Handle going back to home page
  const handleGoHome = () => {
    setShowResults(false);
    setTripPlans([]);
    setError(null);
    setCurrentQuery('');
    setSelectedPlanId('');
    setShowBookingModal(false);
    setShowReasoning(false);
    // Keep the selected persona and lastQueryData so user can regenerate if needed
  };

  // Handle persona change - regenerate plans if results are already shown
  const handlePersonaChange = async (newPersona: string) => {
    // Update persona immediately for UI feedback
    setSelectedPersona(newPersona);
    
    // If we have results and previous query data, regenerate with new persona
    if (showResults && tripPlans.length > 0 && lastQueryData) {
      // Prevent multiple simultaneous calls
      if (isProcessingRef.current) {
        console.log('API call already in progress, ignoring duplicate request');
        return;
      }

      setIsProcessing(true);
      isProcessingRef.current = true;
      setError(null);
      setShowResults(false); // Hide old results while generating new ones
      
      const openaiKey = getApiKey();
      const geminiKey = getGeminiApiKey();
      
      if ((!openaiKey || openaiKey.trim() === '') && (!geminiKey || geminiKey.trim() === '')) {
        setError('API key is required. Please set OpenAI or Gemini API key.');
        setIsProcessing(false);
        isProcessingRef.current = false;
        setShowResults(true); // Show old results again
        return;
      }

      try {
        console.log('🔄 Regenerating plan with new persona:', newPersona);
        console.log('📝 Using query:', lastQueryData.query);
        console.log('📅 Dates:', lastQueryData.departureDate, lastQueryData.returnDate);
        
        // Regenerate plan with new persona (single API call)
        const plans = await generateCompleteTripPlan(
          lastQueryData.query,
          newPersona,
          lastQueryData.departureDate,
          lastQueryData.returnDate
        );

        console.log('✅ Plans regenerated with persona:', newPersona);
        setTripPlans(plans);
        setShowResults(true);
      } catch (err: any) {
        console.error('❌ Error regenerating plans:', err);
        const errorMessage = err.message || 'Failed to regenerate plans. Please try again.';
        setError(errorMessage);
        setShowResults(true); // Show old results on error
      } finally {
        setIsProcessing(false);
        isProcessingRef.current = false;
      }
    } else if (!lastQueryData) {
      // If no query has been submitted yet, just update the persona
      // It will be used when the user submits their first query
      console.log('Persona updated to:', newPersona, '- will be used for next query');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <TopNav 
        onSettingsClick={() => setShowApiKeyDialog(true)}
        onHomeClick={handleGoHome}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          selectedPersona={selectedPersona}
          onPersonaSelect={handlePersonaChange}
          isProcessing={isProcessing}
          tripData={showResults && tripPlans.length > 0 ? {
            destination: tripPlans[0].destination,
            duration: tripPlans[0].duration,
            totalCost: tripPlans[0].totalCost
          } : undefined}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {!showResults ? (
              <>
                <HeroSection 
                  onSubmit={handleQuerySubmit} 
                  isProcessing={isProcessing} 
                />

                {isProcessing && (
                  <div className="text-center p-8 animate-fade-in">
                    <div className="inline-block w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Generating your perfect trip plan...
                    </p>
                    <p className="text-sm text-muted-foreground">
                      This may take 30-60 seconds. Please wait...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      If you see rate limit errors, the app will automatically retry with delays.
                    </p>
                    {error && (
                      <Alert variant="destructive" className="mt-4 max-w-md mx-auto">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
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

                {showReasoning && (
                  <ReasoningPanel 
                    isVisible={showReasoning} 
                    agents={[]}
                    tripPlans={tripPlans}
                    query={currentQuery}
                    selectedPersona={selectedPersona}
                  />
                )}
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {tripPlans.length > 0 ? (
                  <ResultsDashboard plans={tripPlans} onBookNow={handleBookNow} />
                ) : showResults ? (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No plans generated. Please try again.</p>
                  </div>
                ) : null}

                <div className="pt-4">
                  <WeatherCard 
                    destination={tripPlans.length > 0 ? tripPlans[0].destination : undefined}
                    departureDate={lastQueryData?.departureDate}
                    returnDate={lastQueryData?.returnDate}
                  />
                </div>
              </>
            )}
          </div>
        </main>

      </div>

      <BottomBar />

      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        planId={selectedPlanId}
        plan={selectedPlan}
      />

      <ApiKeyDialog
        isOpen={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSave={handleApiKeySave}
        currentOpenaiKey={getApiKey() || undefined}
        currentGeminiKey={getGeminiApiKey() || undefined}
      />
    </div>
  );
};

export default Index;
