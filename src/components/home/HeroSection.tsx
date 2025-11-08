import { useState, useEffect, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QueryInput, TripQueryData } from '@/components/query/QueryInput';

interface HeroSectionProps {
  onSubmit: (data: TripQueryData) => void;
  isProcessing: boolean;
}

const travelImages = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop',
    alt: 'Tropical beach at sunset',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
    alt: 'Mountain landscape',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    alt: 'City skyline',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
    alt: 'Desert landscape',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=600&fit=crop',
    alt: 'Forest trail',
  },
];

export const HeroSection = ({ onSubmit, isProcessing }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % travelImages.length);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset the timer when manually changing slides
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % travelImages.length);
      }, 3000);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden mb-6 shadow-2xl">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {travelImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative flex flex-col lg:flex-row gap-8 p-8 lg:p-12 min-h-[500px] lg:min-h-[600px]">
        {/* Left Section - Call to Action */}
        <div className="flex flex-col justify-center z-10 lg:w-2/5">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Find things to do for everything you're into
          </h2>
          <p className="text-xl md:text-2xl text-white/90 mb-8">
            Browse 400,000+ experiences and book with us.
          </p>
        </div>

        {/* Right Section - Query Input Form */}
        <div className="flex flex-col justify-center z-10 lg:w-3/5 lg:max-w-2xl">
          <div className="bg-gradient-to-br from-amber-50/95 via-orange-50/95 to-amber-100/95 backdrop-blur-md rounded-xl p-8 lg:p-10 shadow-2xl w-full border border-amber-200/30">
            <QueryInput onSubmit={onSubmit} isProcessing={isProcessing} />
          </div>
        </div>
      </div>

      {/* Controls Overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-20">
        {/* Carousel Indicators */}
        <div className="flex gap-2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          {travelImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Pause/Play Control */}
        <button
          onClick={handlePauseToggle}
          className="bg-white/90 hover:bg-white text-foreground rounded-full p-3 transition-colors shadow-lg"
          aria-label={isPaused ? 'Play carousel' : 'Pause carousel'}
        >
          {isPaused ? (
            <Play className="w-5 h-5" />
          ) : (
            <Pause className="w-5 h-5" />
          )}
        </button>
      </div>

    </div>
  );
};

