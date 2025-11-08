# Diagnostic: callGeminiAPI Execution Flow

## Where callGeminiAPI is Called

**File:** `src/services/tripPlanService.ts`

**Called from `makeRequestWithFallback()` function at these locations:**

1. **Line 380** - When only Gemini key is available (no OpenAI key)
   ```typescript
   if (!openaiKey && geminiKey) {
     return await callGeminiAPI(fullPrompt, geminiKey);
   }
   ```

2. **Line 416** - When OpenAI returns 429 (rate limit)
   ```typescript
   if (response.status === 429) {
     if (geminiKey) {
       return await callGeminiAPI(fullPrompt, geminiKey);
     }
   }
   ```

3. **Line 431** - When OpenAI quota exceeded
   ```typescript
   if (errorCode === 'insufficient_quota' || ...) {
     if (geminiKey) {
       return await callGeminiAPI(fullPrompt, geminiKey);
     }
   }
   ```

4. **Line 440** - When OpenAI has other errors
   ```typescript
   if (geminiKey) {
     return await callGeminiAPI(fullPrompt, geminiKey);
   }
   ```

5. **Line 453** - When OpenAI request fails in catch block
   ```typescript
   catch (error: any) {
     if (geminiKey) {
       return await callGeminiAPI(fullPrompt, geminiKey);
     }
   }
   ```

6. **Line 462** - When no OpenAI key but Gemini key exists
   ```typescript
   if (geminiKey) {
     return await callGeminiAPI(fullPrompt, geminiKey);
   }
   ```

## callGeminiAPI Function Flow

**Location:** `src/services/tripPlanService.ts` line 39

**Key execution points:**

1. **Line 43** - Backend URL setup
   ```typescript
   const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
   const url = `${backendUrl}/api/gemini`;
   ```

2. **Line 52-66** - Health check (checks if backend is reachable)
   ```typescript
   const healthCheck = await fetch(`${backendUrl}/api/health`, {
     method: 'GET',
     signal: AbortSignal.timeout(3000),
   });
   ```

3. **Line 86** - Actual fetch() call to backend
   ```typescript
   const response = await fetch(url, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ prompt, model }),
   });
   ```

## CORS & Network Configuration

### Backend Server (server.js)
- **Port:** 5000
- **CORS:** ✅ Enabled (`app.use(cors())`)
- **Endpoint:** `POST /api/gemini`
- **Health Check:** `GET /api/health`

### Frontend (Vite)
- **Port:** 8080
- **Proxy:** ❌ NOT configured in vite.config.ts
- **Direct call:** `http://localhost:5000/api/gemini`

### Potential Issues

1. **Backend not running** - If backend isn't running, fetch will fail
2. **CORS should work** - Backend has `cors()` enabled, so cross-origin should be fine
3. **URL is correct** - `http://localhost:5000/api/gemini` is the correct endpoint

## How to Debug

### Check Console Logs
Look for these logs in browser console:
- `🚀 Calling Gemini API via backend proxy...`
- `📍 Backend URL: http://localhost:5000/api/gemini`
- `✅ Backend server is reachable` OR error message
- `🔄 Trying model: gemini-1.5-flash-latest`
- `📡 Response status: 200` or error

### Check Network Tab
Look for:
- Request to `http://localhost:5000/api/health` (health check)
- Request to `http://localhost:5000/api/gemini` (actual API call)

### Check if callGeminiAPI is being called
Add this at the start of callGeminiAPI:
```typescript
console.log('🔍 callGeminiAPI CALLED!', { promptLength: prompt.length, hasApiKey: !!apiKey });
```

### Check if fetch() executes
Add this before the fetch:
```typescript
console.log('🔍 About to call fetch()', { url, model });
```

