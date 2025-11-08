import { Plane } from 'lucide-react';

export const TopNav = () => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Plane className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">TravelMind AI</h1>
          <p className="text-xs text-muted-foreground">Multi-Agent Travel Planner</p>
        </div>
      </div>
    </header>
  );
};
