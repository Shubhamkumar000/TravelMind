import { personas } from '@/data/mockData';
import { PreferenceMemory } from '../sidebar-modules/PreferenceMemory';
import { TripSummary } from '../sidebar-modules/TripSummary';

interface SidebarProps {
  selectedPersona: string;
  onPersonaSelect: (personaId: string) => void;
  tripData?: {
    destination: string;
    duration: number;
    totalCost: number;
  };
}

export const Sidebar = ({ selectedPersona, onPersonaSelect, tripData }: SidebarProps) => {
  return (
    <div className="w-72 border-r border-border bg-gradient-subtle p-4 space-y-4 overflow-y-auto">
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Travel Personas</h2>
        <div className="space-y-2">
          {personas.map((persona) => (
            <button
              key={persona.id}
              onClick={() => onPersonaSelect(persona.id)}
              className={`w-full p-3 rounded-lg border transition-all duration-300 text-left flex items-center gap-3 ${
                selectedPersona === persona.id
                  ? 'border-primary bg-primary/10 shadow-md'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
              }`}
            >
              <span className="text-2xl">{persona.icon}</span>
              <span className="font-medium text-sm text-foreground">{persona.name}</span>
            </button>
          ))}
        </div>
      </div>

      <PreferenceMemory />
      
      {tripData && <TripSummary tripData={tripData} />}
    </div>
  );
};
