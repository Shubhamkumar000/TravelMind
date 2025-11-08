// AI Service for Trip Planning
// Supports OpenAI API and free alternatives

export interface TripQuery {
  query: string;
  preferences?: {
    budget?: string;
    duration?: number;
    interests?: string[];
    dietary?: string[];
  };
}

export interface AITripPlan {
  destination: string;
  duration: number;
  summary: string;
  highlights: string[];
  estimatedCost: number;
  recommendations: string[];
}

// Free AI alternative using Hugging Face Inference API (no key required for basic use)
const useFreeAI = async (query: string): Promise<AITripPlan | null> => {
  try {
    // For now, return null and use mock data
    // In production, you could integrate with free AI services
    return null;
  } catch (error) {
    console.error('Free AI service error:', error);
    return null;
  }
};

// OpenAI API integration
export const generateTripPlan = async (
  tripQuery: TripQuery,
  apiKey?: string
): Promise<AITripPlan | null> => {
  if (!apiKey) {
    console.warn('No API key provided, using free alternatives or mock data');
    return useFreeAI(tripQuery.query);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert travel planner AI. Analyze trip queries and provide detailed travel plans with:
- Destination name
- Recommended duration in days
- A brief summary
- Top 3-5 highlights
- Estimated total cost in Indian Rupees (₹)
- 3-5 personalized recommendations

Format your response as JSON with these exact fields: destination, duration, summary, highlights (array), estimatedCost, recommendations (array).`,
          },
          {
            role: 'user',
            content: `Plan a trip: ${tripQuery.query}. ${
              tripQuery.preferences
                ? `Preferences: ${JSON.stringify(tripQuery.preferences)}`
                : ''
            }`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in API response');
    }

    // Try to parse JSON from the response
    try {
      const plan = JSON.parse(content);
      return plan as AITripPlan;
    } catch {
      // If not JSON, try to extract structured data
      return {
        destination: extractDestination(content),
        duration: extractDuration(content),
        summary: content.substring(0, 200),
        highlights: extractHighlights(content),
        estimatedCost: extractCost(content),
        recommendations: extractRecommendations(content),
      };
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    return useFreeAI(tripQuery.query);
  }
};

// Helper functions to extract data from text responses
const extractDestination = (text: string): string => {
  const match = text.match(/destination[:\s]+([A-Za-z\s,]+)/i);
  return match ? match[1].trim() : 'Unknown';
};

const extractDuration = (text: string): number => {
  const match = text.match(/(\d+)\s*(?:day|days)/i);
  return match ? parseInt(match[1]) : 5;
};

const extractHighlights = (text: string): string[] => {
  const highlights: string[] = [];
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.match(/[-•*]\s*.+/i) || line.match(/\d+\.\s*.+/)) {
      highlights.push(line.replace(/[-•*\d.]\s*/, '').trim());
      if (highlights.length >= 5) break;
    }
  }
  return highlights.length > 0 ? highlights : ['Amazing experiences await'];
};

const extractCost = (text: string): number => {
  const match = text.match(/₹?(\d{1,3}(?:,\d{3})*)/);
  return match ? parseInt(match[1].replace(/,/g, '')) : 30000;
};

const extractRecommendations = (text: string): string[] => {
  return extractHighlights(text).slice(0, 3);
};

// Enhanced trip analysis using AI
export const analyzeTripPreferences = async (
  query: string,
  apiKey?: string
): Promise<{
  budget: string;
  interests: string[];
  dietary: string[];
  travelStyle: string;
}> => {
  if (!apiKey) {
    // Return default preferences
    return {
      budget: 'moderate',
      interests: ['culture', 'nature'],
      dietary: [],
      travelStyle: 'balanced',
    };
  }

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
            content:
              'Extract travel preferences from user queries. Return JSON with: budget (budget/moderate/luxury), interests (array), dietary (array), travelStyle (adventure/relaxation/culture/photography/balanced).',
          },
          {
            role: 'user',
            content: query,
          },
        ],
        temperature: 0.3,
        max_tokens: 200,
      }),
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    return JSON.parse(content || '{}');
  } catch (error) {
    console.error('Preference analysis error:', error);
    return {
      budget: 'moderate',
      interests: ['culture', 'nature'],
      dietary: [],
      travelStyle: 'balanced',
    };
  }
};

