import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Question, AnswerResult } from '../types'
import { CodeBlock } from './CodeBlock'
import { DifficultyBadge } from './DifficultyBadge'
import { ExplosionEffect } from './ExplosionEffect'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalCorrect: number
  onAnswer: (answer: string) => Promise<AnswerResult>
  onNext: () => void
}

const TYPE_LABELS: Record<string, string> = {
  multiple_choice: 'Multiple Choice',
  true_false: 'True / False',
  code_snippet: 'Read the Code',
  spot_the_bug: 'Spot the Bug',
}

export function QuestionCard({ question, onAnswer, onNext }: QuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [result, setResult] = useState<AnswerResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setSelected(null)
    setResult(null)
    setRevealed(false)
    setTimeout(() => setRevealed(true), 50)
  }, [question.id])

  const handleSelect = async (option: string) => {
    if (result || loading) return
    setSelected(option)
    setLoading(true)
    try {
      const res = await onAnswer(option)
      setResult(res)
    } catch {
      const isCorrect = option === question.correct_answer
      setResult({
        is_correct: isCorrect,
        explanation: question.explanation,
        correct_answer: question.correct_answer,
      })
    } finally {
      setLoading(false)
    }
  }

  const getOptionState = (option: string) => {
    if (!result) {
      return selected === option ? 'selected' : 'idle'
    }
    if (option === result.correct_answer) return 'correct'
    if (option === selected && !result.is_correct) return 'incorrect'
    return 'dim'
  }

  const optionStyles: Record<string, string> = {
    idle: 'border-border text-[#e8eaed] hover:bg-panel-hover hover:border-[rgba(127,255,95,0.18)] hover:-translate-y-0.5 hover:shadow-[0_2px_12px_rgba(0,0,0,0.4)] cursor-pointer',
    selected: 'border-[rgba(127,255,95,0.3)] text-[#e8eaed] bg-panel-hover cursor-pointer shadow-[0_0_0_1px_rgba(127,255,95,0.1)]',
    correct: 'border-correct/40 text-correct bg-correct-bg shadow-[0_0_16px_rgba(52,168,83,0.15)]',
    incorrect: 'border-incorrect/40 text-incorrect bg-incorrect-bg',
    dim: 'border-border text-muted opacity-50',
  }

  return (
    <div className={`w-full transition-all duration-300 ${revealed ? 'animate-slide-up' : 'opacity-0'}`}>

      {/* Meta row */}
      <div className="flex items-center justify-between mb-4 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{question.certification}</span>
          <span className="text-muted-strong">·</span>
          <span className="text-xs text-muted truncate max-w-[180px]">{question.section}</span>
        </div>
        <div className="flex items-center gap-2">
          <DifficultyBadge difficulty={question.difficulty} />
          <span className="text-xs text-muted">{TYPE_LABELS[question.type]}</span>
        </div>
      </div>

      {/* Question card */}
      <div className="rounded-gemini-lg bg-surface-elevated border border-border p-5 sm:p-6 mb-4 shadow-gemini">
        <p className="font-sans text-[15px] sm:text-base leading-relaxed text-[#e8eaed] mb-4">
          {question.question_text}
        </p>

        {question.code_snippet && <CodeBlock code={question.code_snippet} />}

        <p className="text-sm text-muted mt-4 mb-3">Choose an answer</p>
        <div className="space-y-2">
          {question.options.map((option, i) => {
            const state = getOptionState(option)
            const label = String.fromCharCode(65 + i)
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={!!result || loading}
                className={`w-full text-left rounded-gemini border px-4 py-3 transition-all duration-200 flex items-start gap-3 ${optionStyles[state]}`}
              >
                <span className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-medium mt-0.5
                  ${state === 'correct'  ? 'bg-correct text-[#1e1e2e]' : ''}
                  ${state === 'incorrect' ? 'bg-incorrect text-white' : ''}
                  ${state === 'idle' || state === 'selected' ? 'bg-panel border border-border text-muted' : ''}
                  ${state === 'dim' ? 'bg-transparent border border-border text-muted' : ''}
                `}>
                  {state === 'correct' ? '✓' : state === 'incorrect' ? '✗' : label}
                </span>
                <span className="text-sm text-[#e8eaed] font-normal">{option}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Correct: explosion + inline next */}
      {result?.is_correct && (
        <>
          <ExplosionEffect />
          <button
            onClick={onNext}
            className="font-sans w-full py-3.5 rounded-gemini bg-primary text-[#e8eaed] font-medium text-[15px] hover:bg-primary-hover transition-all duration-200 animate-pop-in"
            style={{ boxShadow: '0 0 20px rgba(127,255,95,0.25)' }}
          >
            Next question →
          </button>
        </>
      )}

      {/* Incorrect: centered modal rendered at document.body via portal */}
      {result && !result.is_correct && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="rounded-gemini-lg border border-border bg-surface-elevated shadow-gemini animate-pop-in"
            style={{ width: '90%', maxWidth: 480, padding: '32px 28px' }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-incorrect" style={{ fontSize: 18, fontWeight: 700 }}>Not quite</span>
            </div>

            <div className="mb-4" style={{ background: 'rgba(52,168,83,0.08)', border: '1px solid rgba(52,168,83,0.25)', borderRadius: 10, padding: '10px 14px' }}>
              <p className="text-xs text-muted mb-1" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Correct answer</p>
              <p className="text-sm text-correct font-medium">{result.correct_answer}</p>
            </div>

            <p className="text-sm leading-relaxed" style={{ color: '#c8cacd', marginBottom: 28 }}>
              {result.explanation}
            </p>

            <button
              onClick={onNext}
              className="font-sans w-full py-3.5 rounded-gemini bg-primary text-[#e8eaed] font-medium text-[15px] hover:bg-primary-hover transition-colors"
            >
              Next question
            </button>
          </div>
        </div>,
        document.body
      )}

      {loading && (
        <div className="flex items-center justify-center gap-2 py-4 text-muted text-sm">
          <span className="inline-block w-2 h-2 rounded-full bg-muted animate-pulse" />
          <span>Checking...</span>
        </div>
      )}
    </div>
  )
}
