# Rapid Launch Agent

An AI-powered marketing automation system that guides you through creating comprehensive launch strategies using Todd Brown's E5 VSL methodology, Fletcher's frameworks, and advanced avatar/offer analysis.

## Features

- **Offer Builder**: Analyze and optimize your offer using the Irresistible Offer Equation
- **Avatar Builder**: Deep avatar research using WEB Analysis (Wants, Emotions, Beliefs)
- **Competitor Intelligence**: Forensic market analysis and strategic positioning
- **AI Avatar Manifold**: 14-node workflow generating deep psychological insights
- **Launch Document Generator**: Comprehensive 38+ section marketing brief
- **AI Query Interface**: Ask questions and generate copy from your launch document

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- React Router (navigation)
- Zustand (state management)
- Tailwind CSS (styling)
- Lucide React (icons)

### Backend
- Node.js + Express
- OpenAI API integration
- RESTful API architecture

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Installation

1. **Clone the repository**
   ```bash
   cd rapid-launch-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   GPT_MODEL=gpt-4-turbo-preview
   GPT_TEMPERATURE=0.7
   PORT=5000
   ```

## Running the Application

### Development Mode

You need to run both the frontend and backend:

1. **Start the backend server** (Terminal 1):
   ```bash
   npm run server
   ```
   Server will run on http://localhost:5000

2. **Start the frontend dev server** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

```bash
# Build the frontend
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
rapid-launch-agent/
├── src/                      # Frontend source code
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── services/           # API service layer
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main app component
├── server/                  # Backend source code
│   ├── config/             # Configuration files
│   ├── routes/             # API route handlers
│   └── index.js            # Express server entry point
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## Usage Guide

### 1. Create a New Project
- Click "Create New Project" on the landing page
- Enter a project name

### 2. Complete the Workflow

**Step 1: Offer Builder**
- Enter your target market details
- Describe the pressing problem
- Detail your product/service
- Add proof elements, pricing, and guarantee
- Click "Analyze Offer" for AI insights
- Save and continue

**Step 2: Avatar Builder**
- Fill in demographics
- Complete WEB Analysis (Wants, Emotions, Beliefs)
- Map the empathy map
- Define goals grid
- Identify primary currency
- Craft your Million Dollar Message
- Save and continue

**Step 3: Competitor Intelligence**
- Enter your industry/niche
- Add 5-7 competitor URLs
- Click "Analyze Competitors"
- Review positioning angles and insights
- Save and continue

**Step 4: AI Avatar Manifold**
- Review your inputs
- Click "Run Workflow"
- Wait for all 14 nodes to process (2-5 minutes)
- Review each analysis node
- Continue to launch document

**Step 5: Launch Document**
- Click "Generate Launch Document"
- Wait for generation (2-3 minutes)
- Navigate through 38 sections
- Export as needed (MD, DOCX, PDF)

### 3. Use the Dashboard
- Query your launch document
- Generate ad copy, email sequences, VSL scripts
- Get recommendations and insights

## API Endpoints

```
POST /api/analyze/offer              # Analyze offer data
POST /api/analyze/avatar             # Analyze avatar data  
POST /api/analyze/competitors        # Analyze competitors
POST /api/analyze/manifold           # Run 14-node manifold workflow
POST /api/generate/launch-document   # Generate 38+ section document
POST /api/query                      # Query launch document with AI
POST /api/export/:format             # Export document (md/docx/pdf)
GET  /api/health                     # Health check
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | Required |
| `GPT_MODEL` | OpenAI model to use | gpt-4-turbo-preview |
| `GPT_TEMPERATURE` | AI temperature (0-1) | 0.7 |
| `PORT` | Backend server port | 5000 |
| `VITE_API_URL` | API URL for frontend | /api |

## Cost Considerations

This application uses OpenAI's API which has associated costs:

- **Offer Analysis**: ~$0.10-0.20 per analysis
- **Avatar Analysis**: ~$0.05-0.10 per analysis
- **Competitor Analysis**: ~$0.10-0.20 per analysis
- **Manifold Workflow**: ~$1.50-3.00 per run (14 nodes)
- **Launch Document**: ~$2.00-4.00 per generation (38 sections)

**Estimated total per project**: $4-8

Monitor your usage at: https://platform.openai.com/usage

## Troubleshooting

### API Key Issues
```
Error: OpenAI API call failed
```
- Verify your API key in `.env` is correct
- Check you have credits in your OpenAI account
- Ensure no extra spaces in the API key

### Port Already in Use
```
Error: Port 5000 already in use
```
- Change the PORT in `.env` to another port (e.g., 5001)
- Kill the process using the port: `lsof -ti:5000 | xargs kill`

### Module Not Found
```
Error: Cannot find module
```
- Run `npm install` again
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### CORS Errors
- Ensure both frontend (port 3000) and backend (port 5000) are running
- Check the proxy configuration in `vite.config.ts`

## Development

### Adding New Features

1. **Frontend**: Add components in `src/components/` or pages in `src/pages/`
2. **Backend**: Add new routes in `server/routes/`
3. **API Types**: Update `src/types/index.ts`
4. **State**: Update Zustand store in `src/store/useProjectStore.ts`

### Code Style

- Frontend uses TypeScript with React
- Backend uses ES modules (not CommonJS)
- Use functional components with hooks
- Follow existing naming conventions

## Contributing

This is a private project. Contact the maintainer for contribution guidelines.

## License

Proprietary - All rights reserved

## Support

For issues, questions, or feature requests, please contact the project maintainer.

---

**Built with ❤️ using React, TypeScript, Node.js, and OpenAI**

