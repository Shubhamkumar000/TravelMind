import { personas } from '@/data/mockData';
import { PreferenceMemory } from '../sidebar-modules/PreferenceMemory';
import { TripSummary } from '../sidebar-modules/TripSummary';

interface SidebarProps {
  selectedPersona: string;
  onPersonaSelect: (personaId: string) => void;
  isProcessing?: boolean;
  tripData?: {
    destination: string;
    duration: number;
    totalCost: number;
  };
}

export const Sidebar = ({ selectedPersona, onPersonaSelect, isProcessing = false, tripData }: SidebarProps) => {
  return (
    <div className="w-72 border-r border-border bg-gradient-subtle p-4 space-y-4 overflow-y-auto">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Travel Personas</h2>
        <p className="text-xs text-muted-foreground mb-3">
          Click a persona to regenerate your trip plan with that style
        </p>
        <div className="space-y-2">
          {personas.map((persona) => {
            const isSelected = selectedPersona === persona.id;
            const isProcessingThis = isProcessing && isSelected;
            
            return (
              <button
                key={persona.id}
                onClick={() => onPersonaSelect(persona.id)}
                disabled={isProcessing}
                className={`w-full p-3 rounded-lg border transition-all duration-300 text-left flex items-center gap-3 ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
                } ${isProcessing ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
              >
                <span className="text-2xl">{persona.icon}</span>
                <span className="font-medium text-sm text-foreground flex-1">{persona.name}</span>
                {isProcessingThis && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                )}
                {isSelected && !isProcessingThis && (
                  <span className="text-xs text-primary">✓</span>
                )}
              </button>
            );
          })}
        </div>
        {isProcessing && (
          <p className="text-xs text-muted-foreground mt-3 text-center animate-pulse">
            Regenerating plans...
          </p>
        )}
      </div>

      <PreferenceMemory />
      
      {tripData && <TripSummary tripData={tripData} />}
    </div>
  );
};
