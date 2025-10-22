# Environment Variables Configuration

## Frontend (Vercel)

Set these in Vercel Dashboard → Settings → Environment Variables:

```bash
# API URL pointing to your Railway backend
VITE_API_URL=https://your-railway-backend.railway.app/api
```

### How to Set in Vercel:
1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add `VITE_API_URL` with your Railway backend URL
4. Set for Production, Preview, and Development environments
5. Redeploy to apply changes

---

## Backend (Railway)

Set these in Railway Dashboard → Variables tab:

```bash
# Required: Your Anthropic API key
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here

# Optional: Model configuration
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_TEMPERATURE=0.7

# Port (Railway auto-assigns, but default is 5000)
PORT=5000

# Node environment
NODE_ENV=production

# CORS origins (your Vercel frontend URL)
CORS_ORIGIN=https://your-vercel-app.vercel.app

# Rate limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### How to Set in Railway:
1. Create a new project in Railway
2. Connect your GitHub repository
3. Go to Variables tab
4. Add each environment variable
5. Railway will auto-deploy when variables are set

---

## Local Development

Keep using your existing `.env` file:

```bash
# For local development
ANTHROPIC_API_KEY=sk-ant-api03-your-key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_TEMPERATURE=0.7
PORT=5000
```

---

## Security Notes

⚠️ **Never commit API keys to Git**
✅ **Always use environment variables for secrets**
✅ **Different keys for dev/production recommended**
✅ **Rotate keys regularly**
✅ **Monitor API usage at console.anthropic.com**

---

## After Deployment

1. **Update Vercel `VITE_API_URL`** with actual Railway URL
2. **Update Railway `CORS_ORIGIN`** with actual Vercel URL
3. **Test API connection** between frontend and backend
4. **Monitor logs** in both Vercel and Railway dashboards

