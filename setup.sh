#!/bin/bash
# The Ministry of Silly Examinations — First-time setup script
set -e

echo "Setting up The Ministry of Silly Examinations..."

# Frontend
echo "→ Installing frontend dependencies..."
cd frontend
npm install --silent
cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To run the app:"
echo "  Terminal 1:  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
