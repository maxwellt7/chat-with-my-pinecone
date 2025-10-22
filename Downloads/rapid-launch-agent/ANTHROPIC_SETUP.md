# 🚀 Quick Setup with Claude Sonnet 4.5

## 1. Get Your API Key (2 minutes)

### Step-by-Step:

1. **Visit Anthropic Console**  
   👉 https://console.anthropic.com/

2. **Sign Up or Log In**
   - Use your email
   - Or sign in with Google/GitHub

3. **Navigate to API Keys**  
   👉 https://console.anthropic.com/settings/keys

4. **Create New Key**
   - Click "Create Key"
   - Give it a name (e.g., "Rapid Launch Agent")
   - Copy the key immediately (you won't see it again!)

5. **Your Key Format**
   ```
   sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

## 2. Add Credits to Your Account

### Free Tier
Anthropic gives you **$5 free credits** when you sign up!

This is enough for approximately **1-2 complete projects**.

### Add More Credits
1. Go to: https://console.anthropic.com/settings/billing
2. Click "Add Credits"
3. Add $10-20 to start (enough for ~5-10 projects)

### Pricing
- **Input**: $3.00 per million tokens
- **Output**: $15.00 per million tokens
- **Per project**: ~$3-6

## 3. Configure Your Project

### Copy the Template
```bash
cd /Users/maxmayes/Downloads/rapid-launch-agent
cp .env.claude .env
```

### Edit .env File
Open `.env` in your text editor and update:

```bash
# Replace this line:
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# With your actual key:
ANTHROPIC_API_KEY=sk-ant-api03-your-actual-key-here
```

### Verify Configuration
```bash
cat .env | grep ANTHROPIC_API_KEY
```

You should see your key (not `your_anthropic_api_key_here`).

## 4. Install & Start

### Install Dependencies
```bash
npm install
```

This installs `@anthropic-ai/sdk` and all other dependencies.

### Start the Application

**Option A: Automated (Recommended)**
```bash
./start.sh
```

**Option B: Manual (Two Terminals)**
```bash
# Terminal 1 - Backend
npm run server

# You should see:
# 🚀 Rapid Launch Agent server running on port 5000
# 📝 API available at http://localhost:5000/api
# 🤖 Using Claude Sonnet 4.5 for AI analysis

# Terminal 2 - Frontend
npm run dev
```

### Open in Browser
```
http://localhost:3000
```

## 5. Test Your Setup

### Quick Test:
1. Click "Create New Project"
2. Name it "Test Project"
3. Fill in the Offer Builder:
   - Target Market: "B2B SaaS founders"
   - Problem: "Can't scale their marketing"
   - Product: "AI-powered marketing automation"
4. Click "Analyze Offer"

### Expected Result:
You should see:
- ✅ Loading spinner
- ✅ Analysis completes in 10-20 seconds
- ✅ Green success box with scores
- ✅ 10 strategic recommendations

### If It Works:
🎉 **Success!** Your setup is complete!

### If It Fails:
Check the error message:
- "Invalid API key" → Check your key in `.env`
- "Rate limit" → Wait a minute and try again
- "Network error" → Check your internet connection

## 6. Monitor Your Usage

### Check Usage Dashboard
👉 https://console.anthropic.com/settings/usage

You can see:
- Total tokens used
- Cost per request
- Remaining credits
- Daily usage graphs

### Set Usage Limits
👉 https://console.anthropic.com/settings/limits

Recommended:
- **Daily limit**: $10 (prevents accidents)
- **Monthly limit**: $50 (for regular use)
- Get email alerts at 80% usage

## 7. Understanding Costs

### Per Request Estimates:

| Module | Tokens In | Tokens Out | Cost |
|--------|-----------|------------|------|
| Offer Analysis | ~800 | ~1,200 | $0.12 |
| Avatar Analysis | ~600 | ~800 | $0.06 |
| Competitor Analysis | ~1,000 | ~1,500 | $0.15 |
| Manifold (14 nodes) | ~10,000 | ~15,000 | $1.75 |
| Launch Doc (38 sections) | ~15,000 | ~20,000 | $2.50 |

**Total per complete project**: ~$4.55

### Cost Control Tips:
1. **Test with one module first** before running full workflow
2. **Use the analysis results** - don't regenerate unnecessarily  
3. **Export your documents** - keep local copies
4. **Set daily limits** in Anthropic console

## 8. Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"
```bash
npm install
```

### "ANTHROPIC_API_KEY not found"
```bash
# Make sure .env exists
ls -la .env

# Check the key is there (should NOT say "your_anthropic_api_key_here")
cat .env | grep ANTHROPIC_API_KEY

# Restart the server
# Ctrl+C in Terminal 1, then: npm run server
```

### "Invalid API key"
- Key must start with `sk-ant-api03-`
- Copy from console.anthropic.com/settings/keys
- No extra spaces before or after the key
- Don't include quotes around the key in `.env`

### "Rate limit exceeded"
You've hit your tier limit:
- **Wait 60 seconds** and try again
- Or **upgrade your tier** at console.anthropic.com
- Free tier: ~100 requests per minute

### "Insufficient credits"
```bash
# Check your balance
# Go to: https://console.anthropic.com/settings/billing

# Add more credits if needed
```

## 9. Ready to Go!

You're all set! 🎉

**Next Steps:**
1. Create your first real project
2. Complete all 5 modules
3. Generate your launch document
4. Export and use for your business

**Need Help?**
- Check `CLAUDE_MIGRATION.md` for detailed info
- Check `README.md` for full documentation  
- Check `QUICK_START.md` for workflow guide

---

**Happy Launching!** 🚀

