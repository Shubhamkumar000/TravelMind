import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Key, Sparkles } from 'lucide-react';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (openaiKey: string, geminiKey?: string) => void;
  currentOpenaiKey?: string;
  currentGeminiKey?: string;
}

export const ApiKeyDialog = ({
  isOpen,
  onClose,
  onSave,
  currentOpenaiKey,
  currentGeminiKey,
}: ApiKeyDialogProps) => {
  const [openaiKey, setOpenaiKey] = useState(currentOpenaiKey || '');
  const [geminiKey, setGeminiKey] = useState(currentGeminiKey || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!openaiKey.trim() && !geminiKey.trim()) {
      setError('Please enter at least one API key (OpenAI or Gemini)');
      return;
    }

    // Basic validation - OpenAI keys start with sk-
    if (openaiKey && !openaiKey.startsWith('sk-') && openaiKey.length > 10) {
      setError('Invalid OpenAI API key format. OpenAI keys typically start with "sk-"');
      return;
    }

    // Gemini keys are typically longer alphanumeric strings
    if (geminiKey && geminiKey.length < 20) {
      setError('Invalid Gemini API key format. Please check your key.');
      return;
    }

    onSave(openaiKey, geminiKey);
    setError('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            API Key Configuration
          </DialogTitle>
          <DialogDescription>
            Enter your OpenAI and/or Gemini API keys. Gemini will be used as fallback when OpenAI hits rate limits. Your keys are stored locally and never shared.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              <strong>Why do we need this?</strong>
              <br />
              With API keys, we can provide:
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Intelligent trip recommendations</li>
                <li>Personalized itinerary generation</li>
                <li>Smart budget optimization</li>
                <li>Context-aware travel suggestions</li>
              </ul>
              <br />
              <strong>Fallback System:</strong> If OpenAI hits rate limits, the app automatically uses Gemini API as a fallback.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openaiKey">OpenAI API Key (Primary)</Label>
              <Input
                id="openaiKey"
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setError('');
                }}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Get your key at{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="geminiKey">Gemini API Key (Fallback)</Label>
              <Input
                id="geminiKey"
                type="password"
                placeholder="AIza..."
                value={geminiKey}
                onChange={(e) => {
                  setGeminiKey(e.target.value);
                  setError('');
                }}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                Get your key at{' '}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  aistudio.google.com/app/apikey
                </a>
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-gradient-primary">
            <Sparkles className="w-4 h-4 mr-2" />
            Save & Enable AI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

