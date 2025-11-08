// Utility to store and retrieve API keys from localStorage or environment variables

const OPENAI_API_KEY_STORAGE_KEY = 'travelmind_openai_api_key';
const GEMINI_API_KEY_STORAGE_KEY = 'travelmind_gemini_api_key';

export const getApiKey = (): string | null => {
  // First check environment variable (for Vite: import.meta.env)
  const envKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }

  // Fallback to localStorage
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY);
};

export const setApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, key);
};

export const getGeminiApiKey = (): string | null => {
  // First check environment variable
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && typeof envKey === 'string' && envKey.trim() !== '') {
    return envKey.trim();
  }

  // Fallback to localStorage
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(GEMINI_API_KEY_STORAGE_KEY);
};

export const setGeminiApiKey = (key: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GEMINI_API_KEY_STORAGE_KEY, key);
};

export const removeApiKey = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
  localStorage.removeItem(GEMINI_API_KEY_STORAGE_KEY);
};

export const hasApiKey = (): boolean => {
  const openaiKey = getApiKey();
  const geminiKey = getGeminiApiKey();
  return (openaiKey !== null && openaiKey.trim() !== '') || 
         (geminiKey !== null && geminiKey.trim() !== '');
};

