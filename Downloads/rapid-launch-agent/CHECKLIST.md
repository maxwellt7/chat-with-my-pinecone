# ✅ Deployment Checklist

Use this checklist to ensure a smooth deployment to production.

---

## 📋 Pre-Deployment

### Local Development
- [ ] Application runs locally without errors
- [ ] All features tested and working
- [ ] Environment variables configured in `.env`
- [ ] No console errors in browser
- [ ] Database/state persistence works
- [ ] API calls complete successfully

### Code Quality
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Frontend builds: `npm run build`
- [ ] Backend starts: `npm run server`
- [ ] Docker builds: `docker build .`
- [ ] No linter errors
- [ ] Code committed to Git

### Documentation
- [ ] README updated with project details
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Deployment steps clear

---

## 🔐 Accounts & API Keys

### Required Accounts
- [ ] GitHub account (with repository)
- [ ] Vercel account created
- [ ] Railway account created
- [ ] Anthropic API key obtained

### API Keys Ready
- [ ] Anthropic API key copied
- [ ] API key tested locally
- [ ] API key has sufficient credits
- [ ] Key stored securely (password manager)

---

## 🚀 Backend Deployment (Railway)

### Initial Setup
- [ ] Repository connected to Railway
- [ ] Dockerfile detected
- [ ] Initial build successful
- [ ] Service running

### Domain & Networking
- [ ] Public domain generated
- [ ] Domain URL copied (for frontend)
- [ ] Health check accessible: `/api/health`
- [ ] No SSL certificate errors

### Environment Variables
- [ ] `ANTHROPIC_API_KEY` set
- [ ] `CLAUDE_MODEL` set (optional)
- [ ] `NODE_ENV=production` set
- [ ] `PORT=5000` set
- [ ] `CORS_ORIGIN` set (after frontend deployed)

### Testing
- [ ] Health endpoint returns 200
- [ ] Logs show no errors
- [ ] API responds to test requests
- [ ] No memory/CPU issues

---

## 🌐 Frontend Deployment (Vercel)

### Initial Setup
- [ ] Repository connected to Vercel
- [ ] Framework detected as Vite
- [ ] Build command correct: `npm run build`
- [ ] Output directory: `dist`

### Domain & SSL
- [ ] Public domain assigned
- [ ] Domain URL copied
- [ ] SSL certificate active
- [ ] Site loads without warnings

### Environment Variables
- [ ] `VITE_API_URL` set with Railway URL
- [ ] Variable set for all environments
- [ ] No typos in Railway URL
- [ ] Trailing slashes removed

### Testing
- [ ] Site loads successfully
- [ ] No console errors
- [ ] Assets load (images, fonts, etc.)
- [ ] Routing works (no 404s)

---

## 🔗 Integration

### CORS Configuration
- [ ] Railway `CORS_ORIGIN` updated with Vercel URL
- [ ] No trailing slashes in URLs
- [ ] URLs match exactly
- [ ] Railway redeployed after CORS update

### API Connection
- [ ] Frontend can reach backend
- [ ] No CORS errors
- [ ] API calls complete
- [ ] Data persists

### vercel.json Update
- [ ] Railway URL added to rewrites
- [ ] Railway URL added to env
- [ ] File committed and pushed
- [ ] Vercel redeployed

---

## 🧪 End-to-End Testing

### Basic Functionality
- [ ] Homepage loads
- [ ] Can create new project
- [ ] Project name saves
- [ ] Navigation works

### Offer Builder
- [ ] Form loads correctly
- [ ] Can input offer data
- [ ] "Analyze Offer" button works
- [ ] AI analysis returns results
- [ ] Results display correctly
- [ ] Can save and continue

### Avatar Builder
- [ ] Form loads correctly
- [ ] Can input avatar data
- [ ] "Analyze Avatar" button works
- [ ] AI analysis returns results
- [ ] Results display correctly
- [ ] Can save and continue

### Competitor Analysis
- [ ] Form loads correctly
- [ ] Can input competitors
- [ ] "Analyze Competitors" works
- [ ] AI analysis returns results
- [ ] Results display correctly

### Manifold Workflow
- [ ] Workflow starts
- [ ] Progress bar works
- [ ] All 14 nodes process
- [ ] No errors in any node
- [ ] Results display correctly
- [ ] Can continue to launch doc

### Launch Document
- [ ] "Generate" button works
- [ ] All 38 sections generate
- [ ] Content is relevant
- [ ] Navigation works
- [ ] Export button works
- [ ] Markdown downloads correctly

### Data Persistence
- [ ] Refresh page - data persists
- [ ] Switch projects - data correct
- [ ] Create multiple projects
- [ ] Delete project works

---

## 🔒 Security Review

### Environment Variables
- [ ] No secrets in code
- [ ] All secrets in environment variables
- [ ] `.env` in `.gitignore`
- [ ] No API keys in logs

### Access Control
- [ ] CORS properly configured
- [ ] Only allowed origins can access API
- [ ] No open endpoints
- [ ] Rate limiting considered

### SSL/HTTPS
- [ ] All traffic uses HTTPS
- [ ] No mixed content warnings
- [ ] SSL certificates valid
- [ ] Secure cookies (if using)

---

## 📊 Monitoring Setup

### Vercel Dashboard
- [ ] Analytics enabled
- [ ] Logs accessible
- [ ] Build logs reviewed
- [ ] Error tracking noted

### Railway Dashboard
- [ ] Metrics visible
- [ ] Logs accessible
- [ ] Resource usage normal
- [ ] No deployment errors

### Anthropic Console
- [ ] Usage tracking visible
- [ ] Credits/billing confirmed
- [ ] API key active
- [ ] Usage alerts set (optional)

---

## 🔄 CI/CD (Optional)

### GitHub Secrets
- [ ] `VERCEL_TOKEN` added
- [ ] `VERCEL_ORG_ID` added
- [ ] `VERCEL_PROJECT_ID` added
- [ ] `VITE_API_URL` added
- [ ] `RAILWAY_TOKEN` added
- [ ] `RAILWAY_SERVICE_ID` added
- [ ] `RAILWAY_URL` added

### Workflows
- [ ] CI workflow passes
- [ ] Frontend deploy workflow works
- [ ] Backend deploy workflow works
- [ ] Dependabot configured

### Testing
- [ ] Push to main triggers deploy
- [ ] Both services update
- [ ] Health checks pass
- [ ] Production updates successfully

---

## 📝 Documentation Updates

### Project URLs
- [ ] Frontend URL documented
- [ ] Backend URL documented
- [ ] URLs in README.md
- [ ] URLs in DEPLOYMENT.md

### Environment Variables
- [ ] Production values documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide updated

### Deployment Guide
- [ ] Screenshots added (optional)
- [ ] Step-by-step verified
- [ ] Common issues documented
- [ ] Rollback procedure clear

---

## 🎯 Post-Deployment

### Communication
- [ ] Team notified (if applicable)
- [ ] Users informed
- [ ] Status page updated
- [ ] Announcement made

### Monitoring
- [ ] Set up alerts
- [ ] Check logs daily (first week)
- [ ] Monitor API usage
- [ ] Track costs

### Maintenance Plan
- [ ] Update schedule defined
- [ ] Backup strategy planned
- [ ] Incident response plan
- [ ] Support channels established

---

## 🎉 Launch Criteria

All must be ✅ before launch:

- [ ] **Health checks pass** on both services
- [ ] **Full workflow completes** end-to-end
- [ ] **No console errors** in production
- [ ] **API calls succeed** consistently
- [ ] **Data persists** correctly
- [ ] **CORS configured** properly
- [ ] **Environment variables** all set
- [ ] **SSL/HTTPS** working
- [ ] **Monitoring** active
- [ ] **Documentation** updated

---

## 🐛 If Something Goes Wrong

### Immediate Actions
1. Check service status (Vercel/Railway dashboards)
2. Review recent deployments
3. Check logs for errors
4. Test health endpoints
5. Verify environment variables

### Rollback
1. Vercel: Promote previous deployment
2. Railway: Redeploy previous version
3. Test rolled-back version
4. Investigate issue offline
5. Fix and redeploy

### Support
- Vercel Support: support.vercel.com
- Railway Support: help.railway.app
- Anthropic Support: support.anthropic.com
- GitHub Issues: Your repo

---

## 📈 Success Metrics

Track these after deployment:

- [ ] Uptime percentage
- [ ] API response times
- [ ] Error rates
- [ ] User feedback
- [ ] API costs
- [ ] Infrastructure costs

---

**Deployment Status:** 
- [ ] Not Started
- [ ] In Progress
- [ ] Completed ✅
- [ ] Issues (see notes below)

**Notes:**
```
[Add any deployment notes, issues, or special considerations here]
```

**Deployed By:** _____________
**Deployment Date:** _____________
**Version:** 1.0.0

---

**Last Updated:** October 22, 2025

