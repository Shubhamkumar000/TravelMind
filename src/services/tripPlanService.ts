// AI-powered Trip Plan Generation Service
import { getApiKey, getGeminiApiKey } from '@/utils/apiKeyStorage';
import { TripPlan, DayItinerary, Activity } from '@/data/mockData';

export interface TripQuery {
  query: string;
  persona?: string;
}

// Generate complete trip plan using OpenAI
export const generateCompleteTripPlan = async (
  query: string,
  persona: string = 'balanced',
  departureDate?: Date,
  returnDate?: Date
): Promise<TripPlan[]> => {
  const openaiKey = getApiKey();
  const geminiKey = getGeminiApiKey();
  
  if (!openaiKey && !geminiKey) {
    throw new Error('API key is required. Please set OpenAI or Gemini API key in Settings or .env file.');
  }

  try {
    console.log('Generating all three trip plans in a single API call...');
    
    // Generate all three plans in one API call to save requests
    const plans = await generateAllThreePlans(query, persona, openaiKey, geminiKey, departureDate, returnDate);
    
    console.log('✅ All three trip plans generated successfully in one API call');
    
    // Return all three plans in order: recommended, cheapest, fastest
    return plans;
  } catch (error: any) {
    console.error('Error generating trip plans:', error);
    throw new Error(error.message || 'Failed to generate trip plans. Please check your API key and network connection.');
  }
};

// Generate all three plan variants in a single API call
const generateAllThreePlans = async (
  query: string,
  persona: string,
  openaiKey: string | null,
  geminiKey: string | null,
  departureDate?: Date,
  returnDate?: Date
): Promise<TripPlan[]> => {
  const personaMap: Record<string, { description: string; instructions: string }> = {
    budget: {
      description: 'Budget Traveler',
      instructions: `STRICT BUDGET FOCUS:
- Prioritize the LOWEST possible costs for flights, hotels, and activities
- Use budget airlines, hostels, guesthouses, or budget hotels (2-3 star)
- Include free activities like walking tours, public parks, free museums
- Suggest local street food and budget restaurants
- Use public transportation instead of private transfers
- Look for deals, discounts, and off-season pricing
- Total cost should be MINIMIZED while maintaining basic safety and comfort
- Flight cost: prioritize cheapest options even if longer layovers
- Hotel cost: budget accommodations (₹500-2000 per night range)
- Activity cost: mostly free or low-cost activities`
    },
    luxury: {
      description: 'Luxury Traveler',
      instructions: `PREMIUM LUXURY FOCUS:
- Prioritize HIGH-QUALITY, premium experiences regardless of cost
- Use premium airlines, business class if available, or best economy options
- 5-star hotels, resorts, or luxury boutique accommodations
- Fine dining restaurants, premium experiences
- Private transfers, concierge services
- Exclusive activities, private tours, VIP experiences
- Spa treatments, luxury wellness experiences
- Total cost can be HIGH - focus on quality and exclusivity
- Flight cost: premium airlines, direct flights preferred
- Hotel cost: luxury hotels (₹5000+ per night range)
- Activity cost: premium experiences, private tours, exclusive access`
    },
    adventure: {
      description: 'Adventure Seeker',
      instructions: `ADVENTURE & ACTIVITY FOCUS:
- Prioritize adventurous activities: hiking, trekking, water sports, extreme sports
- Include outdoor activities, nature experiences, adventure tours
- Accommodations near adventure spots (mountain lodges, adventure camps)
- Active itinerary with physical activities
- Adventure gear rentals, guided adventure tours
- National parks, mountains, beaches for activities
- Flight cost: standard, prioritize destinations with adventure opportunities
- Hotel cost: mid-range, adventure-focused accommodations
- Activity cost: adventure tours, equipment rentals, guided experiences`
    },
    relaxation: {
      description: 'Relaxation & Wellness',
      instructions: `RELAXATION & WELLNESS FOCUS:
- Prioritize peaceful, relaxing experiences
- Beach destinations, spa resorts, wellness retreats
- Spa treatments, massages, yoga sessions, meditation
- Quiet accommodations away from city centers
- Minimal activities, more downtime and relaxation
- Wellness-focused restaurants, healthy dining
- Scenic, peaceful locations
- Avoid crowded tourist spots
- Flight cost: standard, prioritize peaceful destinations
- Hotel cost: wellness resorts, spa hotels, beachfront properties
- Activity cost: spa treatments, wellness activities, gentle experiences`
    },
    photographer: {
      description: 'Photography Enthusiast',
      instructions: `PHOTOGRAPHY & SCENIC FOCUS:
- Prioritize photogenic locations, scenic spots, iconic landmarks
- Golden hour timing for activities (sunrise/sunset)
- Scenic viewpoints, photography tours, iconic locations
- Accommodations with great views
- Include photography-specific locations and tours
- Less focus on cost, more on visual experiences
- Natural beauty, architecture, cultural sites
- Flight cost: standard, prioritize scenic destinations
- Hotel cost: mid-range, locations with good views
- Activity cost: photography tours, scenic spots, iconic locations`
    },
    balanced: {
      description: 'Balanced Traveler',
      instructions: `BALANCED APPROACH:
- Balance cost, quality, and experiences
- Mix of budget and mid-range options
- Good value for money
- Mix of activities: some free, some paid
- Comfortable but not extravagant accommodations
- Standard airlines, good value flights
- Balanced itinerary with culture, relaxation, and activities
- Flight cost: good value, direct when possible
- Hotel cost: mid-range (₹2000-4000 per night range)
- Activity cost: mix of free and paid experiences`
    },
  };

  // Format dates for the prompt
  const formatDate = (date?: Date) => {
    if (!date) return 'Not specified';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const departureDateStr = formatDate(departureDate);
  const returnDateStr = formatDate(returnDate);
  const duration = departureDate && returnDate 
    ? Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const selectedPersona = personaMap[persona] || personaMap['balanced'];
  const personaInstructions = selectedPersona.instructions;

  const systemPrompt = `You are an expert travel planning AI. Generate THREE complete, detailed trip plans in a single response.

CRITICAL: You MUST return ONLY valid JSON as an array with exactly 3 trip plans. Do not include markdown code blocks, explanations, or any text outside the JSON array.

The user query: "${query}"
Travel Persona: ${selectedPersona.description}
Persona Instructions (FOLLOW THESE STRICTLY):
${personaInstructions}

${departureDate ? `Departure Date: ${departureDateStr}` : ''}
${returnDate ? `Return Date: ${returnDateStr}` : ''}
${duration ? `Trip Duration: ${duration} days` : ''}

IMPORTANT: 
1. Use the EXACT departure and return dates provided to calculate accurate flight prices. Flight prices vary significantly based on travel dates, so factor in:
   - Peak season pricing if applicable
   - Weekend vs weekday pricing
   - Advance booking discounts
   - Seasonal demand for the destination
   - CRITICAL: flightCost MUST be for ROUND-TRIP flights (departure flight + return flight combined). Do NOT provide one-way prices.

2. STRICTLY FOLLOW the Persona Instructions above. The persona selection is CRITICAL - it should heavily influence:
   - Flight selection (budget vs premium airlines)
   - Hotel selection (budget vs luxury)
   - Activity selection (adventure vs relaxation vs photography)
   - Overall cost structure
   - Itinerary focus

3. COST CALCULATION RULES:
   - flightCost: ROUND-TRIP flight cost (departure + return) in Indian Rupees
   - hotelCost: Total accommodation cost for entire trip duration in Indian Rupees
   - activityCost: Total cost of all activities for the trip in Indian Rupees
   - totalCost: MUST equal flightCost + hotelCost + activityCost (sum of all three components)
   - All costs should be realistic based on destination, dates, and persona

Generate THREE distinct trip plans with the following variants:
1. RECOMMENDED: A balanced, well-rounded trip plan that offers the best value and experience.
2. CHEAPEST: The most budget-friendly trip plan while maintaining quality and safety.
3. FASTEST: A trip plan optimized for speed and efficiency, minimizing travel time.

Return ONLY a JSON array with exactly 3 objects, nothing else:

[
  {
    "id": "recommended",
    "destination": "Full destination name (e.g., 'Bali, Indonesia')",
    "duration": ${duration || 'number of days'},
    "totalCost": total cost in Indian Rupees (MUST equal flightCost + hotelCost + activityCost),
    "flightCost": ROUND-TRIP flight cost in Indian Rupees (departure + return combined),
    "hotelCost": hotel cost in Indian Rupees,
    "activityCost": activity cost in Indian Rupees,
    "flightDetails": {
      "departure": "Source city (Airport Code) → Destination city (Airport Code)",
      "arrival": "Destination city (Airport Code) → Source city (Airport Code)",
      "airline": "Airline name",
      "duration": "Flight duration (e.g., '5h 30m direct')"
    },
    "hotelDetails": {
      "name": "Hotel name",
      "rating": rating out of 5 (number),
      "location": "Hotel location/area",
      "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"]
    },
    "itinerary": [
      {
        "day": 1,
        "title": "Day title",
        "activities": [
          {
            "name": "Activity name",
            "time": "Time (e.g., '10:00 AM')",
            "icon": "emoji icon"
          }
        ]
      }
    ],
    "highlights": [
      "Highlight 1",
      "Highlight 2",
      "Highlight 3",
      "Highlight 4"
    ]
  },
  {
    "id": "cheapest",
    "destination": "Full destination name (e.g., 'Bali, Indonesia')",
    "duration": ${duration || 'number of days'},
    "totalCost": total cost in Indian Rupees (MUST equal flightCost + hotelCost + activityCost),
    "flightCost": ROUND-TRIP flight cost in Indian Rupees (departure + return combined),
    "hotelCost": hotel cost in Indian Rupees,
    "activityCost": activity cost in Indian Rupees,
    "flightDetails": {
      "departure": "Source city (Airport Code) → Destination city (Airport Code)",
      "arrival": "Destination city (Airport Code) → Source city (Airport Code)",
      "airline": "Airline name",
      "duration": "Flight duration (e.g., '5h 30m direct')"
    },
    "hotelDetails": {
      "name": "Hotel name",
      "rating": rating out of 5 (number),
      "location": "Hotel location/area",
      "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"]
    },
    "itinerary": [
      {
        "day": 1,
        "title": "Day title",
        "activities": [
          {
            "name": "Activity name",
            "time": "Time (e.g., '10:00 AM')",
            "icon": "emoji icon"
          }
        ]
      }
    ],
    "highlights": [
      "Highlight 1",
      "Highlight 2",
      "Highlight 3",
      "Highlight 4"
    ]
  },
  {
    "id": "fastest",
    "destination": "Full destination name (e.g., 'Bali, Indonesia')",
    "duration": ${duration || 'number of days'},
    "totalCost": total cost in Indian Rupees (MUST equal flightCost + hotelCost + activityCost),
    "flightCost": ROUND-TRIP flight cost in Indian Rupees (departure + return combined),
    "hotelCost": hotel cost in Indian Rupees,
    "activityCost": activity cost in Indian Rupees,
    "flightDetails": {
      "departure": "Source city (Airport Code) → Destination city (Airport Code)",
      "arrival": "Destination city (Airport Code) → Source city (Airport Code)",
      "airline": "Airline name",
      "duration": "Flight duration (e.g., '5h 30m direct')"
    },
    "hotelDetails": {
      "name": "Hotel name",
      "rating": rating out of 5 (number),
      "location": "Hotel location/area",
      "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"]
    },
    "itinerary": [
      {
        "day": 1,
        "title": "Day title",
        "activities": [
          {
            "name": "Activity name",
            "time": "Time (e.g., '10:00 AM')",
            "icon": "emoji icon"
          }
        ]
      }
    ],
    "highlights": [
      "Highlight 1",
      "Highlight 2",
      "Highlight 3",
      "Highlight 4"
    ]
  }
]

IMPORTANT:
- Return ONLY valid JSON array with exactly 3 objects, no markdown, no code blocks
- Each plan must be DISTINCTLY different:
  * RECOMMENDED: balanced cost, quality, and experience
  * CHEAPEST: lowest cost while maintaining quality and safety
  * FASTEST: optimized for speed with direct flights and efficient routes
- Generate realistic flight details with actual airport codes
- Create a day-by-day itinerary with 4-6 activities per day for each plan
- Use appropriate emoji icons for activities (✈️, 🏨, 🍽️, 🏛️, 🏖️, etc.)
- Make costs realistic and DIFFERENT for each variant
- Ensure cheapest plan has lowest totalCost, fastest has direct/shortest flights`;

  // Try APIs in order: OpenAI -> Gemini
  const makeRequestWithFallback = async (): Promise<string> => {
    const fullPrompt = `${systemPrompt}\n\nGenerate three trip plans (recommended, cheapest, fastest) for: ${query}`;
    
    // If only Gemini key is available, use it directly
    if (!openaiKey && geminiKey) {
      console.log(`Using Gemini API for all three plans (no OpenAI key)...`);
      return await callGeminiAPI(fullPrompt, geminiKey);
    }
    
    // Try OpenAI first if available
    if (openaiKey) {
      try {
        console.log(`Calling OpenAI API for all three plans...`);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: `Generate three trip plans (recommended, cheapest, fastest) for: ${query}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 4000, // Increased for three plans
          }),
        });

        console.log(`OpenAI API Response status: ${response.status}`);

        // Check for 429/quota errors BEFORE reading response body
        if (response.status === 429) {
          console.log('⚠️ OpenAI rate limited (429). Immediately switching to Gemini...');
          if (geminiKey) {
            return await callGeminiAPI(fullPrompt, geminiKey);
          } else {
            throw new Error('OpenAI rate limited. Please add a Gemini API key as fallback.');
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorCode = errorData.error?.code;
          const errorMessage = errorData.error?.message || '';
          
          // Check for quota/rate limit errors - immediately use Gemini
          if (errorCode === 'insufficient_quota' || errorCode === 'rate_limit_exceeded' || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            console.log('⚠️ OpenAI quota exceeded. Immediately switching to Gemini...');
            if (geminiKey) {
              return await callGeminiAPI(fullPrompt, geminiKey);
            } else {
              throw new Error('OpenAI quota exceeded. Please add a Gemini API key as fallback or check your OpenAI billing.');
            }
          }
          
          // For other errors, try Gemini
          if (geminiKey) {
            console.log('⚠️ OpenAI error. Falling back to Gemini...');
            return await callGeminiAPI(fullPrompt, geminiKey);
          }
          
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorMessage}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
      } catch (error: any) {
        // If OpenAI fails due to quota/network issues, try Gemini
        if (error.message && !error.message.includes('Gemini')) {
          if (geminiKey) {
            console.log('OpenAI request failed. Falling back to Gemini...');
            return await callGeminiAPI(fullPrompt, geminiKey);
          }
        }
        throw error;
      }
    }
    
    // If no OpenAI key, use Gemini
    if (geminiKey) {
      return await callGeminiAPI(fullPrompt, geminiKey);
    }
    
    throw new Error('No API keys available');
  };

  try {
    const content = await makeRequestWithFallback();

    console.log(`Received response for all three plans, content length: ${content?.length || 0}`);

    if (!content) {
      console.error('No content in API response');
      throw new Error('No content in API response. Please try again.');
    }

    // Parse JSON from response (may be wrapped in markdown code blocks)
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    
    // Parse the JSON array
    const plansArray = JSON.parse(jsonContent);
    
    if (!Array.isArray(plansArray) || plansArray.length !== 3) {
      throw new Error(`Expected an array of 3 plans, but got ${Array.isArray(plansArray) ? plansArray.length : 'non-array'} plans`);
    }

    // Validate and extract the three plans
    const recommended = plansArray.find((p: any) => p.id === 'recommended');
    const cheapest = plansArray.find((p: any) => p.id === 'cheapest');
    const fastest = plansArray.find((p: any) => p.id === 'fastest');

    if (!recommended || !cheapest || !fastest) {
      throw new Error('Missing one or more plan variants. Expected: recommended, cheapest, fastest');
    }

    // Return in order: recommended, cheapest, fastest
    return [recommended, cheapest, fastest] as TripPlan[];
  } catch (error: any) {
    console.error('Error parsing trip plans:', error);
    if (error.message?.includes('JSON')) {
      throw new Error(`Failed to parse trip plans. The API response was not valid JSON. Please try again.`);
    }
    throw error;
  }
};

// Call Gemini API via backend proxy (prevents CORS and keeps API key secure)
const callGeminiAPI = async (prompt: string, apiKey: string): Promise<string> => {
  try {
    // DIAGNOSTIC: Log that function was called
    console.log('🔍 [DIAGNOSTIC] callGeminiAPI CALLED!', {
      promptLength: prompt.length,
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      stackTrace: new Error().stack?.split('\n').slice(1, 4).join('\n')
    });
    
    // Call our backend proxy instead of Google directly
    // Backend handles the actual Gemini API call
    // Read backend URL from .env, or try common ports
    let backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    console.log('🚀 Calling Gemini API via backend proxy...');
    console.log(`📝 Prompt length: ${prompt.length} characters`);
    
    // Check if backend is reachable first - try multiple ports if needed
    let workingPort = null;
    const portsToTry = [5000, 5001, 3000];
    
    for (const port of portsToTry) {
      const testUrl = `http://localhost:${port}/api/health`;
      try {
        console.log(`🔍 Checking backend at ${testUrl}...`);
        const healthCheck = await fetch(testUrl, {
          method: 'GET',
          signal: AbortSignal.timeout(2000), // 2 second timeout
        });
        
        if (healthCheck.ok) {
          workingPort = port;
          backendUrl = `http://localhost:${port}`;
          console.log(`✅ Backend server is reachable at port ${port}`);
          if (port !== 5000) {
            console.log(`⚠️ Backend is on port ${port}, not 5000. Consider adding VITE_BACKEND_URL=http://localhost:${port} to .env`);
          }
          break;
        }
      } catch (err) {
        // Try next port
        continue;
      }
    }
    
    if (!workingPort) {
      const errorMsg = `❌ Backend server is NOT running!\n\n` +
        `To fix this:\n` +
        `1. Open terminal in travelmind-ai-view folder\n` +
        `2. Run: npm run dev\n` +
        `3. Wait for: "✅ Gemini API proxy server running"\n` +
        `4. Then try again\n\n` +
        `Tried ports: ${portsToTry.join(', ')}`;
      throw new Error(errorMsg);
    }
    
    const url = `${backendUrl}/api/gemini`;
    console.log(`📍 Using backend URL: ${url}`);
    
    // Try different models in order - using -latest versions for v1 API
    const models = [
      'gemini-1.5-flash-latest',
      'gemini-1.5-pro-latest',
    ];

    let lastError: Error | null = null;

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const isLastModel = i === models.length - 1;
      
      try {
        console.log(`🔄 Trying model: ${model} (${i + 1}/${models.length})`);
        
        // DIAGNOSTIC: Log before fetch
        console.log('🔍 [DIAGNOSTIC] About to call fetch()', {
          url,
          method: 'POST',
          model,
          hasPrompt: !!prompt,
          promptPreview: prompt.substring(0, 100) + '...'
        });
        
            // Add timeout to prevent infinite hanging (60 seconds)
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000);
            
            const response = await fetch(url, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                prompt: prompt,
                model: model,
              }),
              signal: controller.signal,
            });
            
            clearTimeout(timeoutId);

        console.log(`📡 Response status: ${response.status} ${response.statusText}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || `HTTP ${response.status}`;
          
          console.error(`❌ Error from backend:`, errorMessage);
          
          // If model not found (404), try next model
          if (response.status === 404 && !isLastModel) {
            console.log(`⚠️ Model ${model} not found, trying next...`);
            lastError = new Error(`Model ${model} not found: ${errorMessage}`);
            continue;
          }
          
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}. ${errorMessage}`);
        }

        const data = await response.json();
        const content = data.text || '';
        
        console.log(`📦 Response data:`, { hasText: !!content, textLength: content.length });
        
        if (content) {
          console.log(`✅ Successfully used Gemini model: ${model}`);
          return content;
        }
        
        throw new Error('No content in Gemini API response');
      } catch (error: any) {
        console.error(`❌ Error with model ${model}:`, error.message);
        
        // Check for timeout
        if (error.name === 'AbortError' || error.message?.includes('aborted') || error.message?.includes('timeout')) {
          throw new Error(`Request timed out after 60 seconds. The API may be slow or unresponsive. Please try again.`);
        }
        
        // Check if it's a network error (backend not running)
        if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.message?.includes('ERR_CONNECTION_REFUSED')) {
          throw new Error(`Cannot connect to backend server. Make sure it's running:\n1. Run: npm run dev:server\n2. Backend should be at: ${backendUrl}`);
        }
        
        // If it's a 404 and we have more models to try, continue
        if ((error.message?.includes('404') || error.message?.includes('not found')) && !isLastModel) {
          console.log(`⚠️ Model ${model} failed, trying next model...`);
          lastError = error;
          continue;
        }
        // If it's the last model or not a 404, throw the error
        if (isLastModel) {
          throw error;
        }
        lastError = error;
      }
    }

    // If all models failed, throw the last error
    if (lastError) {
      throw new Error(`All Gemini models failed. Last error: ${lastError.message}`);
    }
    throw new Error('All Gemini models failed');
  } catch (error: any) {
    console.error('💥 Gemini API call failed:', error);
    throw error;
  }
};

const generatePlanVariant = async (
  query: string,
  persona: string,
  variant: 'recommended' | 'cheapest' | 'fastest',
  openaiKey: string | null,
  geminiKey: string | null,
  departureDate?: Date,
  returnDate?: Date
): Promise<TripPlan> => {
  const variantInstructions = {
    recommended: 'Create a balanced, well-rounded trip plan that offers the best value and experience.',
    cheapest: 'Create the most budget-friendly trip plan while maintaining quality and safety.',
    fastest: 'Create a trip plan optimized for speed and efficiency, minimizing travel time.',
  };

  const personaMap: Record<string, { description: string; instructions: string }> = {
    budget: {
      description: 'Budget Traveler',
      instructions: `STRICT BUDGET FOCUS:
- Prioritize the LOWEST possible costs for flights, hotels, and activities
- Use budget airlines, hostels, guesthouses, or budget hotels (2-3 star)
- Include free activities like walking tours, public parks, free museums
- Suggest local street food and budget restaurants
- Use public transportation instead of private transfers
- Look for deals, discounts, and off-season pricing
- Total cost should be MINIMIZED while maintaining basic safety and comfort
- Flight cost: prioritize cheapest options even if longer layovers
- Hotel cost: budget accommodations (₹500-2000 per night range)
- Activity cost: mostly free or low-cost activities`
    },
    luxury: {
      description: 'Luxury Traveler',
      instructions: `PREMIUM LUXURY FOCUS:
- Prioritize HIGH-QUALITY, premium experiences regardless of cost
- Use premium airlines, business class if available, or best economy options
- 5-star hotels, resorts, or luxury boutique accommodations
- Fine dining restaurants, premium experiences
- Private transfers, concierge services
- Exclusive activities, private tours, VIP experiences
- Spa treatments, luxury wellness experiences
- Total cost can be HIGH - focus on quality and exclusivity
- Flight cost: premium airlines, direct flights preferred
- Hotel cost: luxury hotels (₹5000+ per night range)
- Activity cost: premium experiences, private tours, exclusive access`
    },
    adventure: {
      description: 'Adventure Seeker',
      instructions: `ADVENTURE & ACTIVITY FOCUS:
- Prioritize adventurous activities: hiking, trekking, water sports, extreme sports
- Include outdoor activities, nature experiences, adventure tours
- Accommodations near adventure spots (mountain lodges, adventure camps)
- Active itinerary with physical activities
- Adventure gear rentals, guided adventure tours
- National parks, mountains, beaches for activities
- Less focus on luxury, more on experiences and activities
- Include adrenaline-pumping activities
- Flight cost: standard, prioritize destinations with adventure opportunities
- Hotel cost: mid-range, adventure-focused accommodations
- Activity cost: adventure tours, equipment rentals, guided experiences`
    },
    relaxation: {
      description: 'Relaxation & Wellness',
      instructions: `RELAXATION & WELLNESS FOCUS:
- Prioritize peaceful, relaxing experiences
- Beach destinations, spa resorts, wellness retreats
- Spa treatments, massages, yoga sessions, meditation
- Quiet accommodations away from city centers
- Minimal activities, more downtime and relaxation
- Wellness-focused restaurants, healthy dining
- Scenic, peaceful locations
- Avoid crowded tourist spots
- Flight cost: standard, prioritize peaceful destinations
- Hotel cost: wellness resorts, spa hotels, beachfront properties
- Activity cost: spa treatments, wellness activities, gentle experiences`
    },
    photographer: {
      description: 'Photography Enthusiast',
      instructions: `PHOTOGRAPHY & SCENIC FOCUS:
- Prioritize photogenic locations, scenic spots, iconic landmarks
- Golden hour timing for activities (sunrise/sunset)
- Scenic viewpoints, photography tours, iconic locations
- Accommodations with great views
- Include photography-specific locations and tours
- Less focus on cost, more on visual experiences
- Natural beauty, architecture, cultural sites
- Flight cost: standard, prioritize scenic destinations
- Hotel cost: mid-range, locations with good views
- Activity cost: photography tours, scenic spots, iconic locations`
    },
    balanced: {
      description: 'Balanced Traveler',
      instructions: `BALANCED APPROACH:
- Balance cost, quality, and experiences
- Mix of budget and mid-range options
- Good value for money
- Mix of activities: some free, some paid
- Comfortable but not extravagant accommodations
- Standard airlines, good value flights
- Balanced itinerary with culture, relaxation, and activities
- Flight cost: good value, direct when possible
- Hotel cost: mid-range (₹2000-4000 per night range)
- Activity cost: mix of free and paid experiences`
    },
  };

  // Format dates for the prompt
  const formatDate = (date?: Date) => {
    if (!date) return 'Not specified';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const departureDateStr = formatDate(departureDate);
  const returnDateStr = formatDate(returnDate);
  const duration = departureDate && returnDate 
    ? Math.ceil((returnDate.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const selectedPersona = personaMap[persona] || personaMap['balanced'];
  const personaInstructions = selectedPersona.instructions;

  const systemPrompt = `You are an expert travel planning AI. Generate a complete, detailed trip plan.

CRITICAL: You MUST return ONLY valid JSON. Do not include markdown code blocks, explanations, or any text outside the JSON object.

The user query: "${query}"
Travel Persona: ${selectedPersona.description}
Persona Instructions (FOLLOW THESE STRICTLY):
${personaInstructions}

Variant: ${variantInstructions[variant]}
${departureDate ? `Departure Date: ${departureDateStr}` : ''}
${returnDate ? `Return Date: ${returnDateStr}` : ''}
${duration ? `Trip Duration: ${duration} days` : ''}

IMPORTANT: 
1. Use the EXACT departure and return dates provided to calculate accurate flight prices. Flight prices vary significantly based on travel dates, so factor in:
   - Peak season pricing if applicable
   - Weekend vs weekday pricing
   - Advance booking discounts
   - Seasonal demand for the destination
   - CRITICAL: flightCost MUST be for ROUND-TRIP flights (departure flight + return flight combined). Do NOT provide one-way prices.

2. STRICTLY FOLLOW the Persona Instructions above. The persona selection is CRITICAL - it should heavily influence:
   - Flight selection (budget vs premium airlines)
   - Hotel selection (budget vs luxury)
   - Activity selection (adventure vs relaxation vs photography)
   - Overall cost structure
   - Itinerary focus

3. COST CALCULATION RULES:
   - flightCost: ROUND-TRIP flight cost (departure + return) in Indian Rupees
   - hotelCost: Total accommodation cost for entire trip duration in Indian Rupees
   - activityCost: Total cost of all activities for the trip in Indian Rupees
   - totalCost: MUST equal flightCost + hotelCost + activityCost (sum of all three components)
   - All costs should be realistic based on destination, dates, and persona

Generate a complete trip plan with ALL the following details. Return ONLY the JSON object, nothing else:

{
  "id": "${variant}",
  "destination": "Full destination name (e.g., 'Bali, Indonesia')",
  "duration": ${duration || 'number of days'},
  "totalCost": total cost in Indian Rupees (MUST equal flightCost + hotelCost + activityCost),
  "flightCost": ROUND-TRIP flight cost in Indian Rupees (departure + return combined),
  "hotelCost": hotel cost in Indian Rupees,
  "activityCost": activity cost in Indian Rupees,
  "flightDetails": {
    "departure": "Source city (Airport Code) → Destination city (Airport Code)",
    "arrival": "Destination city (Airport Code) → Source city (Airport Code)",
    "airline": "Airline name",
    "duration": "Flight duration (e.g., '5h 30m direct')"
  },
  "hotelDetails": {
    "name": "Hotel name",
    "rating": rating out of 5 (number),
    "location": "Hotel location/area",
    "amenities": ["amenity1", "amenity2", "amenity3", "amenity4", "amenity5"]
  },
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        {
          "name": "Activity name",
          "time": "Time (e.g., '10:00 AM')",
          "icon": "emoji icon"
        }
      ]
    }
  ],
  "highlights": [
    "Highlight 1",
    "Highlight 2",
    "Highlight 3",
    "Highlight 4"
  ]
}

IMPORTANT:
- Return ONLY valid JSON, no markdown, no code blocks
- Generate realistic flight details with actual airport codes
- Create a day-by-day itinerary with 4-6 activities per day
- Use appropriate emoji icons for activities (✈️, 🏨, 🍽️, 🏛️, 🏖️, etc.)
- Make costs realistic based on the destination and variant
- For cheapest: use budget airlines and accommodations
- For fastest: use direct flights and efficient routes
- For recommended: balance cost, time, and quality`;

  // Try APIs in order: OpenAI -> Gemini
  const makeRequestWithFallback = async (): Promise<string> => {
    const fullPrompt = `${systemPrompt}\n\nGenerate a ${variant} trip plan for: ${query}`;
    
    // If only Gemini key is available, use it directly
    if (!openaiKey && geminiKey) {
      console.log(`Using Gemini API for ${variant} plan (no OpenAI key)...`);
      return await callGeminiAPI(fullPrompt, geminiKey);
    }
    
    // Try OpenAI first if available
    if (openaiKey) {
      try {
        console.log(`Calling OpenAI API for ${variant} plan...`);
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: systemPrompt,
              },
              {
                role: 'user',
                content: `Generate a ${variant} trip plan for: ${query}`,
              },
            ],
            temperature: 0.7,
            max_tokens: 3000,
          }),
        });

        console.log(`OpenAI API Response status: ${response.status}`);

        // Check for 429/quota errors BEFORE reading response body
        if (response.status === 429) {
          console.log('⚠️ OpenAI rate limited (429). Immediately switching to Gemini...');
          console.log('🔍 [DIAGNOSTIC] Checking if Gemini key exists:', {
            hasGeminiKey: !!geminiKey,
            geminiKeyLength: geminiKey?.length || 0
          });
          if (geminiKey) {
            console.log('🔍 [DIAGNOSTIC] Calling callGeminiAPI from 429 handler...');
            return await callGeminiAPI(fullPrompt, geminiKey);
          } else {
            throw new Error('OpenAI rate limited. Please add a Gemini API key as fallback.');
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorCode = errorData.error?.code;
          const errorMessage = errorData.error?.message || '';
          
          // Check for quota/rate limit errors - immediately use Gemini
          if (errorCode === 'insufficient_quota' || errorCode === 'rate_limit_exceeded' || errorMessage.includes('quota') || errorMessage.includes('rate limit')) {
            console.log('⚠️ OpenAI quota exceeded. Immediately switching to Gemini...');
            if (geminiKey) {
              return await callGeminiAPI(fullPrompt, geminiKey);
            } else {
              throw new Error('OpenAI quota exceeded. Please add a Gemini API key as fallback or check your OpenAI billing.');
            }
          }
          
          // For other errors, try Gemini
          if (geminiKey) {
            console.log('⚠️ OpenAI error. Falling back to Gemini...');
            return await callGeminiAPI(fullPrompt, geminiKey);
          }
          
          throw new Error(`OpenAI API error: ${response.status} ${response.statusText}. ${errorMessage}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || '';
      } catch (error: any) {
        // If OpenAI fails due to quota/network issues, try Gemini
        if (error.message && !error.message.includes('Gemini')) {
          if (geminiKey) {
            console.log('OpenAI request failed. Falling back to Gemini...');
            return await callGeminiAPI(fullPrompt, geminiKey);
          }
        }
        throw error;
      }
    }
    
    // If no OpenAI key, use Gemini
    if (geminiKey) {
      return await callGeminiAPI(fullPrompt, geminiKey);
    }
    
    throw new Error('No API keys available');
  };

  try {
    const content = await makeRequestWithFallback();

    console.log(`Received response for ${variant} plan, content length: ${content?.length || 0}`);

    if (!content) {
      console.error('No content in API response');
      throw new Error('No content in API response. Please try again.');
    }

    // Parse JSON response
    let planData: any;
    try {
      // Try direct JSON parse first
      planData = JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
      if (jsonMatch) {
        try {
          planData = JSON.parse(jsonMatch[1]);
        } catch {
          // Try to find JSON object in the text
          const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
          if (jsonObjectMatch) {
            planData = JSON.parse(jsonObjectMatch[0]);
          } else {
            throw new Error('Could not parse JSON from AI response');
          }
        }
      } else {
        // Try to find JSON object in the text
        const jsonObjectMatch = content.match(/\{[\s\S]*\}/);
        if (jsonObjectMatch) {
          planData = JSON.parse(jsonObjectMatch[0]);
        } else {
          throw new Error('Could not parse JSON from AI response');
        }
      }
    }

    // Validate and transform to TripPlan format
    let flightCost = parseInt(planData.flightCost) || 15000;
    let hotelCost = parseInt(planData.hotelCost) || 10000;
    let activityCost = parseInt(planData.activityCost) || 5000;
    let totalCost = parseInt(planData.totalCost) || 30000;
    
    // Validate that totalCost equals sum of components, if not, recalculate
    const calculatedTotal = flightCost + hotelCost + activityCost;
    if (Math.abs(totalCost - calculatedTotal) > 100) {
      // If difference is more than ₹100, use calculated total
      console.warn(`Total cost mismatch: AI provided ${totalCost}, calculated ${calculatedTotal}. Using calculated total.`);
      totalCost = calculatedTotal;
    }
    
    // Ensure flight cost is reasonable for round-trip
    // If flight cost seems too low (less than ₹3000), it might be one-way or incorrectly calculated
    // For round-trip flights, minimum should be around ₹5000-8000 for domestic, ₹15000+ for international
    if (flightCost < 3000 && (departureDate && returnDate)) {
      console.warn(`Flight cost seems too low (${flightCost}). This might be one-way. Doubling to account for round-trip.`);
      flightCost = flightCost * 2;
      totalCost = flightCost + hotelCost + activityCost;
    }
    
    const plan: TripPlan = {
      id: planData.id || variant,
      destination: planData.destination || 'Unknown Destination',
      duration: parseInt(planData.duration) || 5,
      totalCost: totalCost,
      flightCost: flightCost,
      hotelCost: hotelCost,
      activityCost: activityCost,
      flightDetails: {
        departure: planData.flightDetails?.departure || 'Unknown → Unknown',
        arrival: planData.flightDetails?.arrival || 'Unknown → Unknown',
        airline: planData.flightDetails?.airline || 'Multiple Airlines',
        duration: planData.flightDetails?.duration || 'Varies',
      },
      hotelDetails: {
        name: planData.hotelDetails?.name || 'Recommended Hotel',
        rating: parseFloat(planData.hotelDetails?.rating) || 4.0,
        location: planData.hotelDetails?.location || 'City Center',
        amenities: Array.isArray(planData.hotelDetails?.amenities)
          ? planData.hotelDetails.amenities
          : ['Free Wi-Fi', 'Breakfast', 'AC'],
      },
      itinerary: Array.isArray(planData.itinerary)
        ? planData.itinerary.map((day: any, index: number) => ({
            day: day.day || index + 1,
            title: day.title || `Day ${index + 1}`,
            activities: Array.isArray(day.activities)
              ? day.activities.map((act: any) => ({
                  name: act.name || 'Activity',
                  time: act.time || 'TBD',
                  icon: act.icon || '📍',
                }))
              : [],
          }))
        : [],
      highlights: Array.isArray(planData.highlights)
        ? planData.highlights
        : ['Amazing travel experience'],
    };

    return plan;
  } catch (error) {
    console.error(`Error generating ${variant} plan:`, error);
    throw error;
  }
};

// Generate agent reasoning for each agent
export const generateAgentReasoning = async (
  agentId: string,
  query: string,
  context?: any
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) return 'AI analysis requires API key';

  const agentPrompts: Record<string, string> = {
    preferences: `Analyze the user's travel query and identify their preferences, constraints, and requirements.`,
    search: `Search and identify suitable destinations and travel options based on the query.`,
    optimization: `Optimize routes, schedules, and costs for the trip.`,
    itinerary: `Create a detailed day-by-day itinerary with activities and timing.`,
    cost: `Calculate and optimize costs for flights, accommodation, and activities.`,
    route: `Plan optimal travel routes and transportation between locations.`,
    refinement: `Refine and validate the final travel plan for accuracy and feasibility.`,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: agentPrompts[agentId] || 'Analyze the travel query.',
          },
          {
            role: 'user',
            content: `Query: ${query}${context ? `\nContext: ${JSON.stringify(context)}` : ''}`,
          },
        ],
        temperature: 0.5,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Analysis complete';
  } catch (error) {
    console.error('Error generating agent reasoning:', error);
    return 'Analysis in progress...';
  }
};

