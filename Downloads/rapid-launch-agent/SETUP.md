# Quick Setup Guide

## 1. Copy Environment Template

```bash
cp .env.template .env
```

## 2. Add Your Anthropic API Key

Edit the `.env` file and replace `your_anthropic_api_key_here` with your actual Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxx
```

Get your API key from: https://console.anthropic.com/settings/keys

## 3. Install Dependencies

```bash
npm install
```

## 4. Start the Application

Open **two terminal windows**:

**Terminal 1 - Backend Server:**
```bash
npm run server
```

You should see:
```
🚀 Rapid Launch Agent server running on port 5000
📝 API available at http://localhost:5000/api
```

**Terminal 2 - Frontend Dev Server:**
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## 5. Open in Browser

Navigate to: **http://localhost:3000**

## That's it! 🎉

You should now see the Rapid Launch Agent landing page.

---

## Quick Test

1. Click "Create New Project"
2. Enter a project name (e.g., "Test Launch")
3. Fill in the Offer Builder form
4. Click "Analyze Offer" to test the OpenAI integration

If the analysis completes successfully, everything is working! ✅

---

## Troubleshooting

**If you see "ANTHROPIC_API_KEY not found":**
- Make sure `.env` file exists in the root directory
- Check that you've replaced `your_anthropic_api_key_here` with your actual key
- Restart the server after adding the key

**If port 5000 is already in use:**
- Change PORT=5000 to PORT=5001 in `.env`
- Update `vite.config.ts` proxy target to match

**If you get module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

