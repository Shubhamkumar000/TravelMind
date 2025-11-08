import { userPreferences } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';

export const PreferenceMemory = () => {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h3 className="text-sm font-semibold text-foreground mb-3">Preference Memory</h3>
      <div className="flex flex-wrap gap-2">
        {userPreferences.map((pref, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            <span className="mr-1">{pref.icon}</span>
            {pref.tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
