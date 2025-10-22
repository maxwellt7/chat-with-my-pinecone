# ⚡ Quick Start - 3 Steps to Launch

## Step 1: Setup (2 minutes)

```bash
# Install dependencies
npm install

# Create .env file
cp .env.claude .env

# Edit .env and add your Anthropic API key
# ANTHROPIC_API_KEY=sk-ant-api03-your-key-here
```

**Get API Key**: https://console.anthropic.com/settings/keys

---

## Step 2: Start Servers (30 seconds)

### Option A: Automated (Recommended)
```bash
./start.sh
```

### Option B: Manual (Two Terminals)
```bash
# Terminal 1
npm run server

# Terminal 2  
npm run dev
```

---

## Step 3: Use the App

1. **Open Browser**: http://localhost:3000

2. **Create Project**: Click "Create New Project"

3. **Complete Workflow**:
   - ✅ Offer Builder (5 min)
   - ✅ Avatar Builder (10 min)
   - ✅ Competitor Intelligence (5 min)
   - ✅ AI Manifold (3-5 min AI processing)
   - ✅ Launch Document (2-3 min AI generation)

4. **Export**: Download your 38-section marketing brief

---

## 🎯 What You'll Get

- **Offer Analysis** with 10 strategic improvements
- **Deep Avatar Profile** with psychological insights
- **Competitive Intelligence** with positioning angles
- **14 AI Analysis Nodes** (pain matrix, core wound, hooks, stories, etc.)
- **38-Section Launch Document** ready for implementation

---

## 💰 Cost

~$3-6 per complete project (Claude Sonnet 4.5 API usage)

---

## 🆘 Troubleshooting

**API Error?**
```bash
# Check your .env file has the correct key
cat .env | grep ANTHROPIC_API_KEY
```

**Port in Use?**
```bash
# Change PORT in .env to 5001
# Then restart the server
```

**Modules Missing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Full Documentation

- **README.md** - Complete documentation
- **SETUP.md** - Detailed setup guide
- **COMPLETION_SUMMARY.md** - Technical overview

---

## ✨ Ready to Build Your Launch?

Run `./start.sh` and let's go! 🚀

