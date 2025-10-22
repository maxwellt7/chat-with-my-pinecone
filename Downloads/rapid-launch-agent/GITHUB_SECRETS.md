# GitHub Secrets Configuration

This document explains how to set up GitHub Secrets for automated CI/CD deployments.

---

## 📍 Where to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below

---

## 🔑 Required Secrets

### For Vercel Deployment

#### `VERCEL_TOKEN`
Your Vercel authentication token.

**How to get it:**
1. Go to https://vercel.com/account/tokens
2. Click "Create Token"
3. Name it "GitHub Actions" or similar
4. Copy the token
5. Add to GitHub Secrets as `VERCEL_TOKEN`

#### `VERCEL_ORG_ID`
Your Vercel organization ID.

**How to get it:**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link your project
cd /path/to/rapid-launch-agent
vercel link

# The IDs are now in .vercel/project.json
cat .vercel/project.json
```

Copy the `orgId` value to GitHub Secrets as `VERCEL_ORG_ID`

#### `VERCEL_PROJECT_ID`
Your Vercel project ID.

From the same `.vercel/project.json` file, copy the `projectId` value to GitHub Secrets as `VERCEL_PROJECT_ID`

#### `VITE_API_URL`
Your Railway backend URL.

**Example:** `https://your-backend.railway.app/api`

This will be used during the build process. Add to GitHub Secrets as `VITE_API_URL`

---

### For Railway Deployment

#### `RAILWAY_TOKEN`
Your Railway authentication token.

**How to get it:**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Get token
railway token
```

Copy the token to GitHub Secrets as `RAILWAY_TOKEN`

#### `RAILWAY_SERVICE_ID`
Your Railway service ID.

**How to get it:**
1. Go to your Railway project dashboard
2. Click on your service
3. Look at the URL: `https://railway.app/project/{project-id}/service/{service-id}`
4. Copy the service ID

Add to GitHub Secrets as `RAILWAY_SERVICE_ID`

#### `RAILWAY_URL`
Your Railway public URL.

**How to get it:**
1. Go to Railway project → Settings
2. Click "Generate Domain"
3. Copy the generated URL (e.g., `https://your-app.railway.app`)

Add to GitHub Secrets as `RAILWAY_URL`

---

## 📋 Complete Secrets List

Once configured, you should have these 7 secrets:

```
✅ VERCEL_TOKEN
✅ VERCEL_ORG_ID
✅ VERCEL_PROJECT_ID
✅ VITE_API_URL
✅ RAILWAY_TOKEN
✅ RAILWAY_SERVICE_ID
✅ RAILWAY_URL
```

---

## 🔄 Testing Secrets

After adding all secrets, test the workflows:

### Method 1: Push to main
```bash
git add .
git commit -m "Test deployment"
git push origin main
```

### Method 2: Manual trigger
1. Go to **Actions** tab in GitHub
2. Select a workflow (e.g., "Deploy Frontend to Vercel")
3. Click "Run workflow"
4. Select branch: `main`
5. Click "Run workflow"

---

## 🐛 Troubleshooting

### "Secret not found" error

**Solution:** 
- Check secret name matches exactly (case-sensitive)
- Verify secret is set in correct repository
- Wait a few minutes after adding secrets

### Vercel deployment fails

**Solution:**
```bash
# Test locally first
vercel login
vercel --prod

# If successful, the token is valid
# Check VERCEL_ORG_ID and VERCEL_PROJECT_ID match
```

### Railway deployment fails

**Solution:**
```bash
# Test locally first
railway login
railway up

# If successful, the token is valid
# Check RAILWAY_SERVICE_ID is correct
```

---

## 🔒 Security Best Practices

✅ **Never commit secrets to Git**
✅ **Rotate tokens regularly** (every 90 days recommended)
✅ **Use separate tokens for CI/CD** (don't use personal tokens)
✅ **Review token permissions** (minimum required only)
✅ **Monitor token usage** in Vercel/Railway dashboards
✅ **Revoke tokens immediately** if compromised

---

## 🔄 Rotating Secrets

If you need to rotate/update secrets:

1. **Create new token** in Vercel/Railway
2. **Update GitHub Secret** with new value
3. **Revoke old token** in Vercel/Railway
4. **Test deployment** to verify

---

## 📊 Workflow Permissions

The workflows also need these permissions (should be set automatically):

- **Vercel Workflow:** `contents: read`
- **Railway Workflow:** `contents: read`
- **CI Workflow:** `contents: read`, `security-events: write`

---

## 🆘 Need Help?

- **Vercel Docs:** https://vercel.com/docs/concepts/git/vercel-for-github
- **Railway Docs:** https://docs.railway.app/deploy/integrations
- **GitHub Actions:** https://docs.github.com/en/actions/security-guides/encrypted-secrets

---

**Last Updated:** October 22, 2025
**Status:** ✅ Ready to Configure

