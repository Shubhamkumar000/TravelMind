# 🔧 QUICK FIX - Follow These Steps

## ✅ Step 1: Make sure .env file exists

Create `travelmind-ai-view/.env`:
```
PORT=5000
GEMINI_API_KEY=your_key_here
```

## ✅ Step 2: Install dependencies

```bash
cd travelmind-ai-view
npm install
```

## ✅ Step 3: Test if server can start

```bash
node test-server.js
```

If you see "✅ Test server running", the server works!

Press Ctrl+C to stop, then:

## ✅ Step 4: Start everything

```bash
npm run dev
```

This starts BOTH backend (port 5000) and frontend (port 8080).

## 🎯 What to check:

1. **Terminal shows:** `✅ Gemini API proxy server running on http://localhost:5000`
2. **Browser:** Open http://localhost:8080 (frontend)
3. **Test backend:** Open http://localhost:5000/api/health (should show JSON)

## ❌ If still not working:

**Check browser console (F12):**
- Look for error messages
- Check Network tab for failed requests

**Check terminal:**
- Look for error messages
- Make sure you see "server running" message

**Common issues:**
- Port 5000 in use → Change PORT in .env to 5001
- Missing dependencies → Run `npm install`
- No .env file → Create it with GEMINI_API_KEY

