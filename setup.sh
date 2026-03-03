#!/bin/bash
# my.py — First-time setup script
set -e

echo "Setting up my.py..."

# Backend
echo "→ Creating Python virtual environment..."
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt --quiet

echo "→ Backend ready. Run: source .venv/bin/activate && uvicorn api.main:app --reload"

# Frontend
echo "→ Installing frontend dependencies..."
cd frontend
npm install --silent
cd ..

echo ""
echo "✓ Setup complete!"
echo ""
echo "To run the app:"
echo "  Terminal 1:  source .venv/bin/activate && uvicorn api.main:app --reload"
echo "  Terminal 2:  cd frontend && npm run dev"
echo ""
echo "Then open: http://localhost:5173"
