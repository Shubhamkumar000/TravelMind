import { Agent } from '@/data/mockData';
import { CheckCircle2, Clock, Loader2 } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard = ({ agent }: AgentCardProps) => {
  const getStatusIcon = () => {
    switch (agent.status) {
      case 'done':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    switch (agent.status) {
      case 'done':
        return 'border-success/30 bg-success/5';
      case 'running':
        return 'border-primary/30 bg-primary/5 shadow-glow';
      case 'pending':
        return 'border-border bg-card';
    }
  };

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-300 ${getStatusColor()}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getStatusIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{agent.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
          {agent.status === 'running' && (
            <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary animate-pulse w-3/4"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
