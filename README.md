# my.py — Python Certification Practice

Active recall practice for Python Institute certifications. Built with a Gemini-inspired dark UI, adaptive difficulty, and an offline-first architecture.

---

## Certifications

| Cert | Full Title | Exam |
|------|-----------|------|
| PCEP™ | Certified Entry-Level Python Programmer | PCEP-30-02 |
| PCAP™ | Certified Associate in Python Programming | PCAP-31-03 |
| PCPP1™ | Certified Professional in Python Programming 1 | PCPP-32-10x |
| PCEI™ | Certified Entry-Level AI Specialist | — |

---

## Features

- **Guided onboarding** — Setup Guide → Checklist → On-Ramp → Zen of Python
- **Multiple question types** — multiple choice, true/false, code snippets, spot the bug
- **Adaptive difficulty** — questions scale based on your accuracy per section
- **Offline-first** — works without the backend; falls back to local question bank
- **Session tracking** — accuracy history stored locally and in SQLite
- **Explosion effect** — confetti on correct answers
- **Gemini-inspired UI** — dark theme, gradient animations, smooth micro-interactions

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | FastAPI + SQLite |
| Fonts | Inter (variable) + JetBrains Mono |

---

## Quick Start

### 1. First-time setup
```bash
chmod +x setup.sh && ./setup.sh
cp .env.example .env
```

### 2. Run the backend
```bash
source .venv/bin/activate
uvicorn api.main:app --reload
# API running at http://localhost:8000
# Docs at http://localhost:8000/docs
```

### 3. Run the frontend
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

> The frontend works fully offline — the backend adds session persistence and server-side answer validation.

---

## Project Structure

```
my.py/
├── api/                  # FastAPI backend
│   ├── main.py           # App entry point + router registration
│   ├── models/           # Database schema + Pydantic schemas
│   ├── routes/           # questions, sessions, answers, progress
│   └── services/         # Adaptive difficulty + progress logic
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Main state machine (home → session → complete)
│   │   ├── components/   # UI components
│   │   └── data/         # Certifications, questions, progress (local)
│   └── public/
│       ├── setup.html          # Step 1: Setup Guide
│       ├── setup-step2.html    # Step 1: Checklist (interactive)
│       ├── setup-step3.html    # Step 2: On-Ramp (accordions)
│       ├── setup-step4.html    # Step 3: Zen of Python (accordions)
│       └── questions/          # Local question bank (offline fallback)
├── questions/            # Source question bank (JSON)
│   ├── pcep.json
│   ├── pcap.json
│   ├── pcpp1.json
│   └── pcei.json
└── docs/
    └── llm-question-prompt.md  # Prompt template for generating questions
```

---

## Adding Questions

Questions live in `questions/*.json`. Each question follows this schema:

```json
{
  "id": "pcep_001",
  "certification": "PCEP",
  "section": "Section name",
  "objective": "Specific learning objective",
  "type": "multiple_choice",
  "question_text": "What does this code do?",
  "code_snippet": "print('hello')",
  "options": ["A", "B", "C", "D"],
  "correct_answer": "A",
  "explanation": "Because...",
  "difficulty": 1
}
```

See [`docs/llm-question-prompt.md`](docs/llm-question-prompt.md) for a prompt template to generate new questions with an LLM.

After adding questions, copy the updated JSON into `frontend/public/questions/` for offline support.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/sessions` | Start a new session |
| PATCH | `/api/sessions/{id}` | Close a session |
| POST | `/api/answers` | Submit an answer |
| GET | `/api/questions/next` | Get next question |
| GET | `/api/progress` | Get aggregate progress |

Interactive docs: `http://localhost:8000/docs`

---

## Licence

MIT
