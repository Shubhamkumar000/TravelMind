// Test script to verify Gemini API integration
// Run: node test-gemini-api.js

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

console.log('🧪 Testing Gemini API Integration\n');

// Test 1: Health check
async function testHealth() {
  console.log('1️⃣ Testing GET /api/health...');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    
    if (data.status === 'ok') {
      console.log('✅ Health check passed:', data);
      return true;
    } else {
      console.log('❌ Health check failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    console.log('   Make sure backend is running: npm run dev:server');
    return false;
  }
}

// Test 2: Gemini API call
async function testGemini() {
  console.log('\n2️⃣ Testing POST /api/gemini...');
  
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not found in .env');
    return false;
  }
  
  try {
    const response = await fetch(`${BASE_URL}/api/gemini`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: 'Say "Hello, Gemini API is working!" in one sentence.',
        model: 'gemini-1.5-flash-latest'
      }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.text) {
      console.log('✅ Gemini API call successful!');
      console.log('📝 Response:', data.text.substring(0, 100));
      return true;
    } else {
      console.log('❌ Gemini API call failed:', data);
      return false;
    }
  } catch (error) {
    console.log('❌ Gemini API error:', error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  const healthOk = await testHealth();
  
  if (!healthOk) {
    console.log('\n❌ Backend server is not running!');
    console.log('   Start it with: npm run dev:server');
    process.exit(1);
  }
  
  const geminiOk = await testGemini();
  
  if (healthOk && geminiOk) {
    console.log('\n✅ All tests passed! Gemini API integration is working.');
  } else {
    console.log('\n❌ Some tests failed. Check the errors above.');
    process.exit(1);
  }
}

runTests();

