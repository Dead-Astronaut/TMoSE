import type { Question } from '../types'

/** Fallback when JSON not yet loaded (keeps PCEP working offline) */
const FALLBACK_QUESTIONS: Question[] = [
  {
    id: 'pcep-001',
    certification: 'PCEP',
    section: '1. Computer Programming',
    objective: '1.1 Understand fundamental terms and definitions',
    type: 'multiple_choice',
    question_text: 'What is the correct term for a set of instructions that a computer can execute?',
    code_snippet: null,
    options: ['Algorithm', 'Program', 'Syntax', 'Variable'],
    correct_answer: 'Program',
    explanation: 'A program is a set of instructions written in a programming language that a computer can execute. An algorithm is the logical steps — the program is the concrete implementation.',
    difficulty: 1,
  },
  {
    id: 'pcep-004',
    certification: 'PCEP',
    section: '2. Data Types and Variables',
    objective: '2.2 Understand Python variables',
    type: 'code_snippet',
    question_text: 'What is printed when this code runs?',
    code_snippet: 'x = 10\ny = 3\nprint(x // y)',
    options: ['3', '3.33', '3.0', '4'],
    correct_answer: '3',
    explanation: 'The // operator is floor division — it divides and rounds down to the nearest integer. 10 / 3 = 3.333..., floor division gives 3. Note: -10 // 3 = -4, not -3.',
    difficulty: 1,
  },
  {
    id: 'pcep-007',
    certification: 'PCEP',
    section: '3. Boolean Values',
    objective: '3.1 Understand Boolean operators',
    type: 'code_snippet',
    question_text: "What does this code print?",
    code_snippet: "print(bool(0), bool(''), bool([]))",
    options: ['True True True', 'False False False', 'False False True', 'True False False'],
    correct_answer: 'False False False',
    explanation: "Falsy values include: 0, '' (empty string), [] (empty list), {} (empty dict), None, and False. All other values are truthy.",
    difficulty: 1,
  },
  {
    id: 'pcep-011',
    certification: 'PCEP',
    section: '4. Control Flow',
    objective: '4.3 Understand break and continue',
    type: 'code_snippet',
    question_text: 'What is the output of this code?',
    code_snippet: 'for i in range(5):\n    if i == 3:\n        break\n    print(i)',
    options: ['0 1 2', '0 1 2 3', '0 1 2 3 4', '1 2 3'],
    correct_answer: '0 1 2',
    explanation: 'break immediately exits the loop. When i reaches 3, break fires before print(i) runs.',
    difficulty: 1,
  },
  {
    id: 'pcep-020',
    certification: 'PCEP',
    section: '8. Input and Output',
    objective: '8.2 Understand type conversion',
    type: 'spot_the_bug',
    question_text: "This code should double a user's number, but it has a bug. What's wrong?",
    code_snippet: "number = input('Enter a number: ')\nresult = number * 2\nprint(result)",
    options: [
      'input() should be int(input())',
      'result should use + not *',
      'print() needs a format string',
      'number needs to be declared first',
    ],
    correct_answer: 'input() should be int(input())',
    explanation: "input() always returns a string. 'number * 2' does string repetition — entering '5' gives '55', not 10.",
    difficulty: 1,
  },
]

let loadedQuestions: Question[] = []

function normalize(raw: unknown): Question[] {
  if (Array.isArray(raw)) return raw as Question[]
  if (raw && typeof raw === 'object' && 'questions' in raw && Array.isArray((raw as { questions: unknown }).questions)) {
    return (raw as { questions: Question[] }).questions
  }
  return []
}

/** Load questions from /questions/pcep.json and /questions/pcap.json (and other certs). */
export async function loadQuestions(): Promise<Question[]> {
  const certs = ['pcep', 'pcap', 'pcpp1', 'pcei']
  const results: Question[] = []
  for (const cert of certs) {
    try {
      const res = await fetch(`/questions/${cert}.json`)
      if (res.ok) {
        const data = await res.json()
        results.push(...normalize(data))
      }
    } catch {
      // ignore; use fallback for this cert
    }
  }
  if (results.length > 0) loadedQuestions = results
  return getLocalQuestions()
}

/** All questions (loaded from JSON or fallback). Use after loadQuestions() for full set. */
export function getLocalQuestions(): Question[] {
  return loadedQuestions.length > 0 ? loadedQuestions : FALLBACK_QUESTIONS
}

/** @deprecated Use getLocalQuestions() for session; kept for backwards compatibility. */
export const LOCAL_QUESTIONS = FALLBACK_QUESTIONS
