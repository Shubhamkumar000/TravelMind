// Mock data for TravelMind AI

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'running' | 'done';
  reasoning?: string;
}

export interface Activity {
  name: string;
  time: string;
  icon: string;
}

export interface DayItinerary {
  day: number;
  title: string;
  activities: Activity[];
}

export interface TripPlan {
  id: string;
  destination: string;
  duration: number;
  totalCost: number;
  flightCost: number;
  hotelCost: number;
  activityCost: number;
  flightDetails: {
    departure: string;
    arrival: string;
    airline: string;
    duration: string;
  };
  hotelDetails: {
    name: string;
    rating: number;
    location: string;
    amenities: string[];
  };
  itinerary: DayItinerary[];
  highlights: string[];
}

export const personas = [
  { id: 'budget', name: 'Budget', icon: '💰', color: 'bg-warning' },
  { id: 'luxury', name: 'Luxury', icon: '✨', color: 'bg-primary' },
  { id: 'adventure', name: 'Adventure', icon: '🏔️', color: 'bg-success' },
  { id: 'relaxation', name: 'Relaxation', icon: '🏖️', color: 'bg-accent' },
  { id: 'photographer', name: 'Photographer', icon: '📸', color: 'bg-destructive' },
  { id: 'balanced', name: 'Balanced', icon: '⚖️', color: 'bg-muted' },
];

export const agents: Agent[] = [
  {
    id: 'preferences',
    name: 'Preferences Agent',
    description: 'Analyzing user preferences and constraints',
    status: 'pending',
    reasoning: 'Identified user preferences: moderate budget, prefers morning flights, vegetarian food options, dislikes hostels.'
  },
  {
    id: 'search',
    name: 'Search Agent',
    description: 'Searching destinations and options',
    status: 'pending',
    reasoning: 'Found 127 destination matches. Top candidates: Bali (Indonesia), Chiang Mai (Thailand), Lisbon (Portugal).'
  },
  {
    id: 'optimization',
    name: 'Optimization Agent',
    description: 'Optimizing routes and schedules',
    status: 'pending',
    reasoning: 'Calculated optimal flight paths. Identified cost-saving opportunities by adjusting departure date by 2 days.'
  },
  {
    id: 'itinerary',
    name: 'Itinerary Agent',
    description: 'Building day-by-day plans',
    status: 'pending',
    reasoning: 'Generated 3 itinerary variants balancing activities, rest, and travel time. Prioritized cultural experiences.'
  },
  {
    id: 'cost',
    name: 'Cost Agent',
    description: 'Calculating expenses and budgets',
    status: 'pending',
    reasoning: 'Analyzed 45 accommodation options. Selected mid-range hotels with good reviews. Total cost: ₹34,800.'
  },
  {
    id: 'route',
    name: 'Route Agent',
    description: 'Planning optimal travel routes',
    status: 'pending',
    reasoning: 'Optimized inter-city routes. Suggested rental scooter for Ubud region to save on transport costs.'
  },
  {
    id: 'refinement',
    name: 'Refinement Agent',
    description: 'Finalizing and validating plan',
    status: 'pending',
    reasoning: 'Validated all bookings available. Adjusted Day 3 timing for sunset at Tanah Lot temple.'
  }
];

export const exampleQueries = [
  'Plan a 5-day Bali trip under ₹35,000',
  'Budget-friendly Europe backpacking for 10 days',
  'Luxury honeymoon in Maldives for a week',
  'Weekend adventure trip near Mumbai',
  'Photography tour of Ladakh in June'
];

export const recommendedPlan: TripPlan = {
  id: 'recommended',
  destination: 'Bali, Indonesia',
  duration: 5,
  totalCost: 34800,
  flightCost: 15000,
  hotelCost: 12000,
  activityCost: 7800,
  flightDetails: {
    departure: 'Mumbai (BOM) → Denpasar (DPS)',
    arrival: 'Denpasar (DPS) → Mumbai (BOM)',
    airline: 'Air India Express',
    duration: '5h 30m direct'
  },
  hotelDetails: {
    name: 'Ubud Valley Boutique Hotel',
    rating: 4.5,
    location: 'Central Ubud',
    amenities: ['Pool', 'Free Wi-Fi', 'Breakfast', 'Spa', 'Garden View']
  },
  highlights: [
    'Perfect balance of culture, nature, and relaxation',
    'Vegetarian-friendly restaurants included',
    'Morning flight as preferred',
    'Mid-range accommodation with excellent reviews'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Ubud Exploration',
      activities: [
        { name: 'Arrive at Ngurah Rai Airport', time: '10:00 AM', icon: '✈️' },
        { name: 'Check-in at hotel & lunch', time: '12:00 PM', icon: '🏨' },
        { name: 'Sacred Monkey Forest visit', time: '3:00 PM', icon: '🐒' },
        { name: 'Ubud Market shopping', time: '5:00 PM', icon: '🛍️' },
        { name: 'Dinner at vegetarian restaurant', time: '7:00 PM', icon: '🍽️' }
      ]
    },
    {
      day: 2,
      title: 'Rice Terraces & Temples',
      activities: [
        { name: 'Breakfast at hotel', time: '8:00 AM', icon: '🥐' },
        { name: 'Tegallalang Rice Terraces', time: '9:30 AM', icon: '🌾' },
        { name: 'Coffee plantation tour', time: '11:30 AM', icon: '☕' },
        { name: 'Lunch with valley view', time: '1:00 PM', icon: '🍜' },
        { name: 'Tirta Empul Temple visit', time: '3:00 PM', icon: '🛕' },
        { name: 'Traditional Balinese dinner', time: '7:00 PM', icon: '🍛' }
      ]
    },
    {
      day: 3,
      title: 'Tanah Lot & Beach Day',
      activities: [
        { name: 'Early breakfast', time: '7:00 AM', icon: '🥐' },
        { name: 'Drive to Tanah Lot Temple', time: '8:30 AM', icon: '🚗' },
        { name: 'Explore temple & coastal views', time: '10:00 AM', icon: '🏯' },
        { name: 'Beachside lunch at Seminyak', time: '1:00 PM', icon: '🏖️' },
        { name: 'Relax at Seminyak Beach', time: '3:00 PM', icon: '🌊' },
        { name: 'Sunset viewing', time: '6:00 PM', icon: '🌅' },
        { name: 'Seafood dinner (vegetarian options)', time: '8:00 PM', icon: '🦞' }
      ]
    },
    {
      day: 4,
      title: 'Adventure & Wellness',
      activities: [
        { name: 'Sunrise yoga session', time: '6:00 AM', icon: '🧘' },
        { name: 'Breakfast at hotel', time: '8:00 AM', icon: '🍳' },
        { name: 'Tegenungan Waterfall trek', time: '10:00 AM', icon: '💦' },
        { name: 'Lunch at organic café', time: '1:00 PM', icon: '🥗' },
        { name: 'Balinese spa & massage', time: '3:00 PM', icon: '💆' },
        { name: 'Farewell dinner & cultural show', time: '7:00 PM', icon: '🎭' }
      ]
    },
    {
      day: 5,
      title: 'Departure Day',
      activities: [
        { name: 'Breakfast & hotel checkout', time: '8:00 AM', icon: '🥐' },
        { name: 'Last-minute shopping at Kuta', time: '10:00 AM', icon: '🛍️' },
        { name: 'Lunch near airport', time: '12:00 PM', icon: '🍽️' },
        { name: 'Depart for airport', time: '2:00 PM', icon: '🚕' },
        { name: 'Flight back to Mumbai', time: '4:30 PM', icon: '✈️' }
      ]
    }
  ]
};

export const cheapestPlan: TripPlan = {
  id: 'cheapest',
  destination: 'Bali, Indonesia',
  duration: 5,
  totalCost: 28500,
  flightCost: 12000,
  hotelCost: 9500,
  activityCost: 7000,
  flightDetails: {
    departure: 'Mumbai (BOM) → Denpasar (DPS)',
    arrival: 'Denpasar (DPS) → Mumbai (BOM)',
    airline: 'IndiGo (1 stop)',
    duration: '8h 45m via Kuala Lumpur'
  },
  hotelDetails: {
    name: 'Kuta Budget Inn',
    rating: 4.0,
    location: 'Kuta Beach Area',
    amenities: ['Free Wi-Fi', 'Breakfast', 'AC', 'Beach Access']
  },
  highlights: [
    'Lowest cost option with quality maintained',
    'Budget accommodation near beach',
    'Free activities prioritized',
    'Local food experiences'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Beach Relaxation',
      activities: [
        { name: 'Arrive & check-in', time: '2:00 PM', icon: '✈️' },
        { name: 'Kuta Beach sunset', time: '5:30 PM', icon: '🌅' },
        { name: 'Street food dinner', time: '7:00 PM', icon: '🍜' }
      ]
    },
    {
      day: 2,
      title: 'Free Cultural Tour',
      activities: [
        { name: 'Free walking tour of Ubud', time: '9:00 AM', icon: '🚶' },
        { name: 'Local warung lunch', time: '1:00 PM', icon: '🍛' },
        { name: 'Traditional market visit', time: '3:00 PM', icon: '🛍️' }
      ]
    },
    {
      day: 3,
      title: 'Temple Day',
      activities: [
        { name: 'Public bus to temples', time: '8:00 AM', icon: '🚌' },
        { name: 'Besakih Temple', time: '10:00 AM', icon: '🛕' },
        { name: 'Packed lunch', time: '12:00 PM', icon: '🥪' },
        { name: 'Tirta Gangga Water Palace', time: '2:00 PM', icon: '⛲' }
      ]
    },
    {
      day: 4,
      title: 'Beach & Surf',
      activities: [
        { name: 'Morning surf lesson (budget)', time: '8:00 AM', icon: '🏄' },
        { name: 'Beach lunch', time: '12:00 PM', icon: '🌮' },
        { name: 'Free beach time', time: '2:00 PM', icon: '🏖️' },
        { name: 'Sunset at beach bar', time: '6:00 PM', icon: '🍹' }
      ]
    },
    {
      day: 5,
      title: 'Departure',
      activities: [
        { name: 'Breakfast & checkout', time: '10:00 AM', icon: '🥐' },
        { name: 'Last shopping', time: '11:00 AM', icon: '🛍️' },
        { name: 'Airport departure', time: '1:00 PM', icon: '✈️' }
      ]
    }
  ]
};

export const fastestPlan: TripPlan = {
  id: 'fastest',
  destination: 'Bali, Indonesia',
  duration: 5,
  totalCost: 42000,
  flightCost: 22000,
  hotelCost: 13000,
  activityCost: 7000,
  flightDetails: {
    departure: 'Mumbai (BOM) → Denpasar (DPS)',
    arrival: 'Denpasar (DPS) → Mumbai (BOM)',
    airline: 'Singapore Airlines',
    duration: '5h 15m direct'
  },
  hotelDetails: {
    name: 'Sanur Beach Resort',
    rating: 4.7,
    location: 'Sanur Beach',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'Concierge']
  },
  highlights: [
    'Fastest direct flights',
    'Centrally located hotel for quick access',
    'Pre-arranged transport for time efficiency',
    'Priority bookings at all attractions'
  ],
  itinerary: [
    {
      day: 1,
      title: 'Quick Arrival & Highlights',
      activities: [
        { name: 'Direct flight arrival', time: '10:00 AM', icon: '✈️' },
        { name: 'Fast-track check-in', time: '11:00 AM', icon: '🏨' },
        { name: 'Express temple tour (3 temples)', time: '2:00 PM', icon: '🛕' },
        { name: 'Sunset dinner cruise', time: '6:00 PM', icon: '🚢' }
      ]
    },
    {
      day: 2,
      title: 'Maximum Coverage',
      activities: [
        { name: 'Early breakfast', time: '6:30 AM', icon: '🥐' },
        { name: 'Helicopter tour of island', time: '8:00 AM', icon: '🚁' },
        { name: 'Quick lunch', time: '11:00 AM', icon: '🍽️' },
        { name: 'Speed boat to Nusa Penida', time: '12:00 PM', icon: '🚤' },
        { name: 'Island highlights tour', time: '2:00 PM', icon: '🏝️' },
        { name: 'Return & dinner', time: '7:00 PM', icon: '🍛' }
      ]
    },
    {
      day: 3,
      title: 'Efficient Exploration',
      activities: [
        { name: 'Private car tour start', time: '7:00 AM', icon: '🚗' },
        { name: 'Rice terraces & waterfall', time: '8:00 AM', icon: '🌾' },
        { name: 'Lunch at scenic spot', time: '12:00 PM', icon: '🍜' },
        { name: 'Tanah Lot express visit', time: '2:00 PM', icon: '🏯' },
        { name: 'Shopping at modern mall', time: '4:00 PM', icon: '🛍️' }
      ]
    },
    {
      day: 4,
      title: 'Beach & Spa Day',
      activities: [
        { name: 'Resort breakfast', time: '8:00 AM', icon: '🥐' },
        { name: 'Private beach time', time: '9:00 AM', icon: '🏖️' },
        { name: 'In-house spa treatment', time: '2:00 PM', icon: '💆' },
        { name: 'Fine dining dinner', time: '7:00 PM', icon: '🍽️' }
      ]
    },
    {
      day: 5,
      title: 'Fast Departure',
      activities: [
        { name: 'Late checkout (1 PM)', time: '10:00 AM', icon: '🏨' },
        { name: 'Direct airport transfer', time: '1:30 PM', icon: '🚕' },
        { name: 'Express flight home', time: '4:00 PM', icon: '✈️' }
      ]
    }
  ]
};

export const userPreferences = [
  { tag: 'Vegetarian', icon: '🥗' },
  { tag: 'Hates Hostels', icon: '🚫🏠' },
  { tag: 'Morning Flights', icon: '🌅✈️' },
  { tag: 'Moderate Budget', icon: '💰' },
  { tag: 'Cultural Sites', icon: '🏛️' },
  { tag: 'Nature Lover', icon: '🌿' }
];

export const weatherData = {
  current: 'Partly Cloudy',
  temp: '28°C',
  humidity: '75%',
  forecast: [
    { day: 'Mon', icon: '⛅', temp: '28°C' },
    { day: 'Tue', icon: '🌧️', temp: '26°C' },
    { day: 'Wed', icon: '☀️', temp: '30°C' },
    { day: 'Thu', icon: '⛅', temp: '29°C' },
    { day: 'Fri', icon: '☀️', temp: '31°C' }
  ]
};
