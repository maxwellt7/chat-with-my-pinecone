# ⚡ Quick Deploy Guide

Get your Rapid Launch Agent live in **15 minutes**!

---

## 🎯 Prerequisites

- ✅ GitHub account
- ✅ Anthropic API key ([get free $5 credits](https://console.anthropic.com/settings/keys))

---

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub (2 min)

```bash
cd /Users/maxmayes/Downloads/rapid-launch-agent

# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/rapid-launch-agent.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy Backend to Railway (5 min)

1. **Go to [railway.app](https://railway.app)** → Sign in with GitHub

2. **Click "New Project"** → "Deploy from GitHub repo"

3. **Select** `rapid-launch-agent` repository

4. Railway auto-detects Dockerfile and starts building

5. **Generate Domain**:
   - Click on your service
   - Go to **Settings** tab
   - Click **Generate Domain**
   - **Copy the URL** (e.g., `https://rapid-launch-agent-production.up.railway.app`)

6. **Add Environment Variables**:
   - Click **Variables** tab
   - Add these:
     ```
     ANTHROPIC_API_KEY = sk-ant-api03-your-key
     CLAUDE_MODEL = claude-sonnet-4-20250514
     NODE_ENV = production
     PORT = 5000
     ```
   - **Don't set CORS_ORIGIN yet** (we'll do this after deploying frontend)

7. **Wait for deployment** (~2-3 minutes)

8. **Test it**: Visit `https://your-railway-url.railway.app/api/health`
   - You should see: `{"status":"ok","message":"Rapid Launch Agent API is running"}`

---

### Step 3: Deploy Frontend to Vercel (5 min)

1. **Go to [vercel.com](https://vercel.com)** → Sign in with GitHub

2. **Click "Add New..."** → "Project"

3. **Import** `rapid-launch-agent` from GitHub

4. **Configure Project**:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL = https://your-railway-url.railway.app/api
     ```
   - Select: Production, Preview, Development
   - Click "Add"

6. **Click "Deploy"** (~2 minutes)

7. **Copy your Vercel URL** (e.g., `https://rapid-launch-agent.vercel.app`)

---

### Step 4: Update CORS Settings (1 min)

1. **Go back to Railway** → Your project → **Variables**

2. **Add new variable**:
   ```
   CORS_ORIGIN = https://your-vercel-app.vercel.app
   ```

3. Railway will auto-redeploy (~1 minute)

---

### Step 5: Update vercel.json (2 min)

1. **Edit `vercel.json`** in your local project:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-ACTUAL-RAILWAY-URL.railway.app/api/:path*"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://YOUR-ACTUAL-RAILWAY-URL.railway.app/api"
  }
}
```

2. **Replace** `YOUR-ACTUAL-RAILWAY-URL` with your Railway domain

3. **Commit and push**:
```bash
git add vercel.json
git commit -m "Update API URL"
git push origin main
```

4. Vercel will auto-redeploy (~1 minute)

---

## ✅ Test Your Deployment

Visit your Vercel URL and test:

1. ✅ Page loads without errors
2. ✅ Create a new project
3. ✅ Fill out Offer Builder
4. ✅ Click "Analyze Offer" → Should work!
5. ✅ Data persists after refresh

---

## 🎉 You're Live!

Your app is now deployed at:

- 🌐 **Frontend**: `https://your-app.vercel.app`
- 🔧 **Backend**: `https://your-backend.railway.app`

---

## 🔄 Optional: Set Up Auto-Deploy

Want automatic deployments when you push to GitHub?

**See:** `GITHUB_SECRETS.md` for full CI/CD setup

Quick version:

1. Add GitHub Secrets (see GITHUB_SECRETS.md)
2. Workflows in `.github/workflows/` will auto-run
3. Push to `main` → Auto-deploy to production!

---

## 💰 Costs

- **Vercel**: FREE (Hobby plan)
- **Railway**: $5/month (after free trial)
- **Anthropic API**: ~$4-6 per project

**Total**: ~$10-15/month

---

## 🐛 Issues?

### Frontend shows "Network Error"

**Fix:** Check CORS_ORIGIN in Railway matches Vercel URL exactly

### Backend returns 500 errors

**Fix:** Check Railway logs → Ensure ANTHROPIC_API_KEY is set

### Build fails

**Fix:** Run `npm run build` locally first to check for errors

---

## 📚 More Info

- **Full Guide**: See `DEPLOYMENT.md`
- **Environment Variables**: See `ENV_VARIABLES.md`
- **GitHub Secrets**: See `GITHUB_SECRETS.md`

---

**Time to Deploy**: ⏱️ **15 minutes**
**Difficulty**: ⭐⭐ Easy

**Let's ship it! 🚀**

