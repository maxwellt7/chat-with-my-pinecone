import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { analyzeOfferRoute } from './routes/offerAnalysis.js';
import { analyzeAvatarRoute } from './routes/avatarAnalysis.js';
import { analyzeCompetitorsRoute } from './routes/competitorAnalysis.js';
import { runManifoldRoute } from './routes/manifoldWorkflow.js';
import { generateLaunchDocRoute } from './routes/launchDocument.js';
import { queryRoute } from './routes/query.js';
import { exportRoute } from './routes/export.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for production
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rapid Launch Agent API is running' });
});

// Routes
app.post('/api/analyze/offer', analyzeOfferRoute);
app.post('/api/analyze/avatar', analyzeAvatarRoute);
app.post('/api/analyze/competitors', analyzeCompetitorsRoute);
app.post('/api/analyze/manifold', runManifoldRoute);
app.post('/api/generate/launch-document', generateLaunchDocRoute);
app.post('/api/query', queryRoute);
app.post('/api/export/:format', exportRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Rapid Launch Agent server running on port ${PORT}`);
  console.log(`📝 API available at http://localhost:${PORT}/api`);
  console.log(`🤖 Using Claude Sonnet 4.5 for AI analysis`);
  
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  WARNING: ANTHROPIC_API_KEY not found in environment variables');
  }
});

