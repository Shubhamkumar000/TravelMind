import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2 } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  planId: string;
}

const steps = [
  { label: 'Reserving Flight', duration: 1000 },
  { label: 'Holding Hotel', duration: 1500 },
  { label: 'Generating Invoice', duration: 1000 },
  { label: 'Adding to My Trips', duration: 800 },
];

export const BookingModal = ({ isOpen, onClose, planId }: BookingModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(0);
      setIsComplete(false);
      return;
    }

    if (currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, steps[currentStep].duration);

      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  }, [isOpen, currentStep, isComplete, onClose]);

  const progress = ((currentStep / steps.length) * 100);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isComplete ? 'Booking Confirmed! 🎉' : 'Processing Your Booking'}
          </DialogTitle>
          <DialogDescription>
            {isComplete
              ? 'Your trip has been added to My Trips. Get ready for an amazing journey!'
              : 'Please wait while we secure your travel plans...'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />

          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  index < currentStep
                    ? 'bg-success/10 border border-success/30'
                    : index === currentStep
                    ? 'bg-primary/10 border border-primary/30 animate-pulse'
                    : 'bg-muted/30 border border-transparent'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                    index === currentStep ? 'border-primary' : 'border-muted'
                  }`} />
                )}
                <span
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>

          {isComplete && (
            <div className="text-center p-4 bg-success/10 rounded-lg border border-success/30 animate-fade-in">
              <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-2" />
              <p className="font-semibold text-foreground">All set!</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
