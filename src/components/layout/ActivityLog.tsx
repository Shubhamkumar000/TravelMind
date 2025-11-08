import { Agent } from '@/data/mockData';
import { AgentCard } from '../agents/AgentCard';

interface ActivityLogProps {
  agents: Agent[];
}

export const ActivityLog = ({ agents }: ActivityLogProps) => {
  return (
    <div className="w-80 border-l border-border bg-gradient-subtle p-4 overflow-y-auto">
      <h2 className="text-sm font-semibold text-foreground mb-4 sticky top-0 bg-gradient-subtle pb-2">
        Agent Activity Log
      </h2>
      <div className="space-y-3">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
};
