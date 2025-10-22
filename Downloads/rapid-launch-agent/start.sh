#!/bin/bash

# Rapid Launch Agent Startup Script

echo "🚀 Starting Rapid Launch Agent..."
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    if [ -f .env.template ]; then
        cp .env.template .env
        echo "✅ .env file created"
        echo "⚠️  Please edit .env and add your OPENAI_API_KEY"
        echo ""
        echo "Get your API key from: https://platform.openai.com/api-keys"
        echo ""
        read -p "Press Enter after you've added your API key to .env..."
    else
        echo "❌ .env.template not found!"
        exit 1
    fi
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if ANTHROPIC_API_KEY is set
source .env
if [ -z "$ANTHROPIC_API_KEY" ] || [ "$ANTHROPIC_API_KEY" = "your_anthropic_api_key_here" ]; then
    echo "❌ ANTHROPIC_API_KEY not set in .env"
    echo "Please edit .env and add your Anthropic API key"
    echo "Get one at: https://console.anthropic.com/settings/keys"
    exit 1
fi

echo "✅ Environment configured"
echo ""
echo "Starting servers..."
echo ""
echo "Backend will run on: http://localhost:5000"
echo "Frontend will run on: http://localhost:3000"
echo ""

# Create a trap to kill both processes on script exit
trap 'kill $BACKEND_PID $FRONTEND_PID 2>/dev/null' EXIT

# Start backend server in background
echo "🔧 Starting backend server..."
npm run server &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "⚛️  Starting frontend server..."
npm run dev

# Wait for both processes
wait

