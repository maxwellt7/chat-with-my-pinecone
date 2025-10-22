# 🚀 Deployment Guide

Complete guide to deploy Rapid Launch Agent to production using Vercel (frontend) and Railway (backend).

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- Anthropic API key ([Get one here](https://console.anthropic.com/settings/keys))

---

## 🎯 Quick Deploy

### 1. Fork or Push to GitHub

```bash
# If starting fresh, initialize git
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
git remote add origin https://github.com/yourusername/rapid-launch-agent.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend to Railway

#### Option A: One-Click Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

1. Click "Deploy on Railway"
2. Select "Deploy from GitHub repo"
3. Choose your `rapid-launch-agent` repository
4. Railway will auto-detect the Dockerfile
5. Add environment variables (see below)
6. Deploy!

#### Option B: Manual Deploy

1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Dockerfile and deploy
5. Once deployed, go to **Settings**:
   - **Generate Domain** to get your public URL
   - Copy this URL (e.g., `https://your-app.railway.app`)

#### Environment Variables for Railway

Go to **Variables** tab and add:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key
CLAUDE_MODEL=claude-sonnet-4-20250514
CLAUDE_TEMPERATURE=0.7
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

**Note**: Update `CORS_ORIGIN` after deploying frontend.

### 3. Deploy Frontend to Vercel

#### Option A: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

1. Click "Deploy with Vercel"
2. Import your GitHub repository
3. Configure project:
   - Framework Preset: **Vite**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable:
   - `VITE_API_URL` = `https://your-railway-app.railway.app/api`
5. Deploy!

#### Option B: Manual Deploy

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure as shown above
5. Deploy

#### Update vercel.json

Edit `vercel.json` and replace the placeholder with your Railway URL:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-actual-railway-url.railway.app/api/:path*"
    }
  ],
  "env": {
    "VITE_API_URL": "https://your-actual-railway-url.railway.app/api"
  }
}
```

Commit and push to trigger redeployment.

### 4. Update CORS

Go back to Railway → Variables and update:

```bash
CORS_ORIGIN=https://your-actual-vercel-url.vercel.app
```

Railway will auto-redeploy with new settings.

### 5. Test Deployment

Visit your Vercel URL and test:

1. Create a new project
2. Complete Offer Builder
3. Check if API calls work
4. Verify data saves correctly

---

## 🔐 GitHub Secrets for CI/CD

To enable automated deployments, add these secrets to your GitHub repository:

### Go to: Settings → Secrets and variables → Actions → New repository secret

#### For Vercel Deployment:

```bash
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
VITE_API_URL=https://your-railway-url.railway.app/api
```

**How to get Vercel credentials:**

1. Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
2. Create new token → Copy it
3. For ORG_ID and PROJECT_ID:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   # Copy values from .vercel/project.json
   ```

#### For Railway Deployment:

```bash
RAILWAY_TOKEN=your-railway-token
RAILWAY_SERVICE_ID=your-service-id
RAILWAY_URL=https://your-railway-url.railway.app
```

**How to get Railway credentials:**

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Link project: `railway link`
4. Get token: `railway token`
5. Get service ID from Railway dashboard URL

---

## 🔄 CI/CD Workflows

Three GitHub Actions workflows are configured:

### 1. **CI - Continuous Integration** (`ci.yml`)

- Runs on every push and PR
- Tests frontend build
- Validates backend code
- Runs security scans
- Tests Docker build

### 2. **Deploy Frontend** (`deploy-frontend.yml`)

- Triggers on push to `main` branch
- Runs TypeScript checks
- Builds and deploys to Vercel
- Creates preview deployments for PRs

### 3. **Deploy Backend** (`deploy-backend.yml`)

- Triggers on push to `main` branch
- Tests Docker build
- Deploys to Railway
- Runs health checks

### Manual Deployment Trigger

You can manually trigger deployments from GitHub Actions tab.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────┐
│   Frontend (Vercel)                 │
│   ├── CDN Edge Network              │
│   ├── Automatic SSL                 │
│   └── Static Site Hosting           │
└─────────────┬───────────────────────┘
              │ API Calls
              ↓
┌─────────────────────────────────────┐
│   Backend (Railway)                 │
│   ├── Docker Container              │
│   ├── Auto Scaling                  │
│   ├── Environment Variables         │
│   └── Health Checks                 │
└─────────────┬───────────────────────┘
              │
              ↓
┌─────────────────────────────────────┐
│   Anthropic API                     │
│   └── Claude Sonnet 4.5             │
└─────────────────────────────────────┘
```

---

## 💰 Cost Estimates

### Free Tier Limits

**Vercel (Hobby Plan - FREE)**
- ✅ 100 GB bandwidth/month
- ✅ Unlimited projects
- ✅ Automatic SSL
- ✅ Edge network

**Railway (Free Trial - $5 credit)**
- ✅ $5 free credits (500 hours)
- ✅ After trial: ~$5-10/month for backend

**Anthropic API**
- ✅ $5 free credits on signup
- ✅ ~$4-6 per project completion
- 💡 Pay as you go after credits

### Production Costs

| Service | Monthly Cost |
|---------|--------------|
| Vercel (Hobby) | $0 |
| Railway (Starter) | ~$5-10 |
| Anthropic API | ~$20-50 (varies by usage) |
| **Total** | **~$25-60/month** |

---

## 🔧 Environment Configuration

### Development
```bash
# .env (local)
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514
PORT=5000
```

### Production

**Railway (Backend)**
```bash
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-sonnet-4-20250514
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://your-app.vercel.app
```

**Vercel (Frontend)**
```bash
VITE_API_URL=https://your-backend.railway.app/api
```

---

## 🧪 Testing Production Deployment

### 1. Health Check

```bash
# Test backend
curl https://your-backend.railway.app/api/health

# Expected response:
# {"status":"ok","message":"Rapid Launch Agent API is running"}
```

### 2. CORS Test

```bash
# From browser console on your Vercel site:
fetch('https://your-backend.railway.app/api/health')
  .then(r => r.json())
  .then(console.log)
```

### 3. Full Workflow Test

1. Visit your Vercel URL
2. Create new project
3. Complete Offer Builder
4. Verify AI analysis works
5. Complete full workflow
6. Test export functionality

---

## 🐛 Troubleshooting

### CORS Errors

**Problem**: API calls fail with CORS error

**Solution**:
1. Check Railway `CORS_ORIGIN` matches your Vercel URL exactly
2. Ensure no trailing slashes
3. Redeploy Railway after changing

```bash
# Railway Variables
CORS_ORIGIN=https://your-app.vercel.app  # ✅ Correct
CORS_ORIGIN=https://your-app.vercel.app/ # ❌ Wrong (trailing slash)
```

### API Connection Failed

**Problem**: Frontend can't reach backend

**Solution**:
1. Verify Railway backend is running
2. Check Vercel environment variable `VITE_API_URL`
3. Test backend health endpoint
4. Check Railway logs for errors

```bash
# Railway CLI
railway logs
```

### Build Failures

**Problem**: Vercel build fails

**Solution**:
```bash
# Test locally first
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# View Vercel build logs in dashboard
```

**Problem**: Railway build fails

**Solution**:
```bash
# Test Docker build locally
docker build -t test .
docker run -p 5000:5000 test

# Check Railway build logs in dashboard
```

### Environment Variables Not Working

**Solution**:
1. Verify variables are set in correct service (Vercel vs Railway)
2. Redeploy after adding variables
3. Check variable names match exactly
4. No spaces in variable values

### Rate Limiting / API Errors

**Problem**: Anthropic API errors

**Solution**:
1. Check API key is valid
2. Verify you have credits: [console.anthropic.com](https://console.anthropic.com)
3. Check rate limits aren't exceeded
4. Review Railway logs for error details

---

## 📊 Monitoring

### Vercel Dashboard

- **Analytics**: View traffic and performance
- **Logs**: Real-time deployment and function logs
- **Deployments**: History and rollback options

### Railway Dashboard

- **Metrics**: CPU, memory, network usage
- **Logs**: Real-time application logs
- **Deployments**: Automatic deployment history

### Anthropic Console

- **Usage**: Track API usage and costs
- **Keys**: Manage API keys
- **Billing**: Set up usage limits

---

## 🔒 Security Best Practices

### ✅ Implemented

- ✅ Environment variables for secrets
- ✅ CORS restrictions
- ✅ HTTPS enforced (automatic)
- ✅ Docker containerization

### 🔄 Recommended for Production

- [ ] Rate limiting (add middleware)
- [ ] API authentication
- [ ] Request validation
- [ ] Monitoring alerts
- [ ] Regular security audits
- [ ] API key rotation schedule

---

## 🚀 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

### Add Custom Domain to Railway

1. Go to Settings → Networking
2. Add custom domain
3. Update DNS records
4. Update Vercel `VITE_API_URL` with new domain

---

## 📈 Scaling Considerations

### When Traffic Increases

**Vercel**: Automatically scales with edge network

**Railway**: 
- Starter plan auto-scales
- Upgrade to Pro for better performance
- Consider horizontal scaling for high load

**Anthropic API**:
- Set up usage alerts
- Consider caching responses
- Implement request batching

---

## 🔄 Rollback Procedure

### If Deployment Fails

**Vercel:**
```bash
# Via dashboard
1. Go to Deployments
2. Find last working version
3. Click "..." → "Promote to Production"
```

**Railway:**
```bash
# Via dashboard
1. Go to Deployments tab
2. Find last working version
3. Click "Redeploy"
```

---

## 📝 Post-Deployment Checklist

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] CORS settings updated
- [ ] Health check passes
- [ ] Test project creation works
- [ ] Test AI analysis works
- [ ] Test full workflow
- [ ] Monitor logs for errors
- [ ] Set up usage alerts
- [ ] Update documentation with URLs
- [ ] Test from different devices/browsers

---

## 🎉 Success!

Your Rapid Launch Agent is now live in production!

- 🌐 **Frontend**: https://your-app.vercel.app
- 🔧 **Backend**: https://your-backend.railway.app
- 📊 **Monitor**: Check dashboards regularly
- 💰 **Costs**: Track usage in respective dashboards

---

## 📞 Support Resources

- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)
- **Anthropic Docs**: [docs.anthropic.com](https://docs.anthropic.com)
- **Project Issues**: GitHub Issues

---

**Last Updated**: October 22, 2025
**Status**: ✅ Production Ready

