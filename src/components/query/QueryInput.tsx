import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Mic, Send, Lightbulb, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { exampleQueries } from '@/data/mockData';

export interface TripQueryData {
  query: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
}

interface QueryInputProps {
  onSubmit: (data: TripQueryData) => void;
  isProcessing: boolean;
  variant?: 'default' | 'dark';
}

export const QueryInput = ({ onSubmit, isProcessing, variant = 'default' }: QueryInputProps) => {
  const isDark = variant === 'dark';
  const [query, setQuery] = useState('');
  const [departureDate, setDepartureDate] = useState<Date | undefined>(undefined);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [showExamples, setShowExamples] = useState(false);

  const handleSubmit = () => {
    if (query.trim()) {
      onSubmit({
        query: query.trim(),
        departureDate,
        returnDate,
      });
    }
  };

  const calculateDuration = () => {
    if (departureDate && returnDate) {
      const diffTime = Math.abs(returnDate.getTime() - departureDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return null;
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
    setShowExamples(false);
  };

  const duration = calculateDuration();

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          placeholder="Describe your dream trip... (e.g., Bali trip under ₹35,000)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "min-h-32 pr-12 resize-none",
            isDark && "bg-white/90 text-foreground placeholder:text-muted-foreground"
          )}
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

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="departure-date" className={isDark ? "text-primary-foreground" : ""} style={!isDark ? { color: 'rgba(0, 0, 0, 0.6)' } : undefined}>Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="departure-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !departureDate && "text-muted-foreground",
                  isDark && "bg-white/90 border-white/20 hover:bg-white"
                )}
                disabled={isProcessing}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate ? format(departureDate, "PPP") : "Select departure date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={setDepartureDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="return-date" className={isDark ? "text-primary-foreground" : ""} style={!isDark ? { color: 'rgba(0, 0, 0, 0.6)' } : undefined}>Return Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="return-date"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !returnDate && "text-muted-foreground",
                  isDark && "bg-white/90 border-white/20 hover:bg-white"
                )}
                disabled={isProcessing || !departureDate}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {returnDate ? format(returnDate, "PPP") : "Select return date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={returnDate}
                onSelect={setReturnDate}
                disabled={(date) => 
                  !departureDate || date < departureDate || date < new Date()
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {duration && (
        <div className="text-sm text-muted-foreground">
          Trip duration: <span className="font-medium text-foreground">{duration} {duration === 1 ? 'day' : 'days'}</span>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          onClick={handleSubmit}
          disabled={!query.trim() || !departureDate || !returnDate || isProcessing}
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
