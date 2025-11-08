import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Send, Lightbulb } from 'lucide-react';
import { exampleQueries } from '@/data/mockData';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isProcessing: boolean;
}

export const QueryInput = ({ onSubmit, isProcessing }: QueryInputProps) => {
  const [query, setQuery] = useState('');
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe your dream trip... (e.g., 5-day Bali trip under ₹35,000)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-32 pr-12 resize-none"
          disabled={isProcessing}
        />
        <Button
          size="icon"
          variant="ghost"
          className="absolute bottom-3 right-3"
          disabled={isProcessing}
        >
          <Mic className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!query.trim() || isProcessing}
          className="flex-1 bg-gradient-primary text-primary-foreground shadow-lg hover:shadow-glow"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Planning...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Plan My Trip
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={() => setShowExamples(!showExamples)}
          disabled={isProcessing}
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Examples
        </Button>
      </div>

      {showExamples && (
        <div className="space-y-2 p-4 border border-border rounded-lg bg-card animate-fade-in">
          <p className="text-sm font-medium text-foreground mb-2">Try these examples:</p>
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="w-full text-left p-2 rounded hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

function Loader2(props: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
