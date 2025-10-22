# GitHub Actions Workflows

This directory contains automated CI/CD workflows for the Rapid Launch Agent.

---

## 📋 Workflows

### 1. **ci.yml** - Continuous Integration
**Triggers:** All pushes and pull requests

**What it does:**
- ✅ Tests frontend TypeScript compilation
- ✅ Tests frontend build
- ✅ Validates backend JavaScript syntax
- ✅ Tests Docker build
- ✅ Runs security audit
- ✅ Scans for secrets in code

**Purpose:** Catch issues before they reach production

---

### 2. **deploy-frontend.yml** - Frontend Deployment
**Triggers:** Push to `main` branch (when frontend files change)

**What it does:**
- ✅ Runs type checks
- ✅ Builds production bundle
- ✅ Deploys to Vercel production
- ✅ Creates preview deployments for PRs

**Requirements:**
- `VERCEL_TOKEN` secret
- `VERCEL_ORG_ID` secret
- `VERCEL_PROJECT_ID` secret
- `VITE_API_URL` secret

---

### 3. **deploy-backend.yml** - Backend Deployment
**Triggers:** Push to `main` branch (when backend files change)

**What it does:**
- ✅ Validates server code
- ✅ Tests Docker build
- ✅ Deploys to Railway
- ✅ Runs health check

**Requirements:**
- `RAILWAY_TOKEN` secret
- `RAILWAY_SERVICE_ID` secret
- `RAILWAY_URL` secret

---

## 🔐 Required Secrets

See `GITHUB_SECRETS.md` in the root directory for detailed setup instructions.

Quick list:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_URL`
- `RAILWAY_TOKEN`
- `RAILWAY_SERVICE_ID`
- `RAILWAY_URL`

---

## 🚀 Usage

### Automatic Deployment

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Workflows automatically run:
# 1. CI checks everything
# 2. If CI passes, deploy workflows run
# 3. Both frontend and backend deploy in parallel
```

### Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select a workflow
3. Click **Run workflow**
4. Choose branch: `main`
5. Click **Run workflow**

---

## 📊 Workflow Status

Check workflow status:
- Badge: See README.md for status badges
- Actions tab: View all workflow runs
- Email: GitHub sends notifications on failures

---

## 🐛 Troubleshooting

### Workflow Fails

1. Check the **Actions** tab for detailed logs
2. Click on the failed workflow run
3. Expand the failed step
4. Read error messages
5. Fix the issue locally
6. Push again

### Common Issues

**"Secret not found"**
- Add missing secrets in Settings → Secrets → Actions

**"Build failed"**
- Test locally: `npm run build`
- Fix TypeScript errors
- Push fixes

**"Docker build failed"**
- Test locally: `docker build .`
- Check Dockerfile syntax
- Verify dependencies

---

## ⚙️ Customization

### Change Trigger Branches

Edit workflow files to change which branches trigger deployments:

```yaml
on:
  push:
    branches:
      - main
      - production  # Add more branches
```

### Add More Tests

Add steps to `ci.yml`:

```yaml
- name: Run unit tests
  run: npm test

- name: Run E2E tests
  run: npm run test:e2e
```

### Change Schedule

For scheduled workflows (like dependabot):

```yaml
schedule:
  - cron: '0 9 * * 1'  # Every Monday at 9 AM
```

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git/vercel-for-github)
- [Railway GitHub Integration](https://docs.railway.app/deploy/integrations)

---

**Last Updated:** October 22, 2025

