# The Ministry of Silly Examinations — Python Certification Practice

Active recall practice for Python Institute certifications. Built with a Gemini-inspired dark UI.

---

## Live webpage: [TMoSE](https://tmose.vercel.app/)

## Certifications

| Cert | Full Title | Exam |
|------|-----------|------|
| PCEP™ | Certified Entry-Level Python Programmer | PCEP-30-02 |
| PCAP™ | Certified Associate in Python Programming | PCAP-31-03 |
| PCPP1™ | Certified Professional in Python Programming 1 | PCPP-32-10x |
| PCEI™ | Certified Entry-Level AI Specialist | PCEI-30-01 |

---

## Features

- **Multiple question types** — multiple choice, true/false, code snippets, spot the bug
- **Session tracking** — accuracy history stored locally
- **Explosion effect** — confetti on correct answers
- **Gemini-inspired UI** — dark theme, gradient animations, smooth micro-interactions

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Fonts | Inter (variable) + JetBrains Mono |

---

## Quick Start

### 1. First-time setup
```bash
chmod +x setup.sh && ./setup.sh
```

### 2. Run the frontend
```bash
cd frontend
npm run dev
# App running at http://localhost:5173
```

---

## Project Structure

```
my.py/
├── frontend/
│   ├── src/
│   │   ├── App.tsx       # Main state machine (home → session → complete)
│   │   ├── components/   # UI components
│   │   └── data/         # Certifications, questions, progress (local)
│   └── public/
│       └── questions/          # Local question bank (offline fallback)
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

After adding questions, copy the updated JSON into `frontend/public/questions/`.

---

## Licence

MIT

Based on the oakesdl's [mypy](https://github.com/oakesdl/mypy).
