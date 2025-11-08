import { Plane, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface TopNavProps {
  onSettingsClick: () => void;
  onHomeClick?: () => void;
}

export const TopNav = ({ onSettingsClick, onHomeClick }: TopNavProps) => {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 shadow-sm">
      <button
        onClick={onHomeClick}
        disabled={!onHomeClick}
        className={`flex items-center gap-3 transition-opacity ${
          onHomeClick ? 'hover:opacity-80 cursor-pointer' : 'cursor-default'
        }`}
        title={onHomeClick ? "Go to home" : undefined}
      >
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow">
          <Plane className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">TravelMind AI</h1>
          <p className="text-xs text-muted-foreground">Multi-Agent Travel Planner</p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="relative"
          title="Settings & API Key"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};
