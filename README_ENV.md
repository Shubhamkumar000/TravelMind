# Environment Variables Setup

## Where to Put .env File

Place the `.env` file in the **root of the `travelmind-ai-view` directory** (same level as `package.json`):

```
travelmind-ai-view/
├── .env              ← Put it here
├── package.json
├── vite.config.ts
├── src/
└── ...
```

## How to Use

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your OpenAI API key:**
   ```env
   VITE_OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Important Notes:**
   - In Vite, environment variables must be prefixed with `VITE_` to be accessible in the browser
   - The `.env` file is already in `.gitignore` and won't be committed to git
   - You can also set the API key through the UI (Settings button in top-right)
   - Environment variables take priority over localStorage

## Priority Order

The app checks for API keys in this order:
1. **Environment variable** (`VITE_OPENAI_API_KEY` in `.env`)
2. **localStorage** (set via UI Settings dialog)

## Getting an OpenAI API Key

1. Visit https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy it to your `.env` file or paste it in the Settings dialog

## Security

- Never commit your `.env` file to git
- The `.env` file is already in `.gitignore`
- API keys are stored locally and never shared

