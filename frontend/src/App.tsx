import { useState, useCallback, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { CertOverview } from './components/CertOverview'
import { QuestionCard } from './components/QuestionCard'
import { ProgressView } from './components/ProgressView'
import { loadQuestions, getLocalQuestions } from './data/questions'
import { recordSession } from './data/progress'
import { getCertById } from './data/certifications'
import type { CertInfo } from './data/certifications'
import type { Question, AnswerResult } from './types'

const API_BASE = '/api'
const STORAGE_KEY = 'tmose_selected_cert'

function randomSample<T>(arr: T[], n: number): T[] {
  const pool = [...arr]
  const result: T[] = []
  while (result.length < n && pool.length > 0) {
    const idx = Math.floor(Math.random() * pool.length)
    result.push(pool.splice(idx, 1)[0])
  }
  return result
}

type AppState = 'home' | 'overview' | 'session' | 'complete' | 'progress'

export default function App() {
  const savedCertId = localStorage.getItem(STORAGE_KEY) ?? 'PCEP'
  const [selectedCert, setSelectedCert] = useState<CertInfo>(
    () => getCertById(savedCertId) ?? getCertById('PCEP')!
  )
  const [appState, setAppState] = useState<AppState>(() => {
    return 'home'
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false)
  const [allQuestions, setAllQuestions] = useState<Question[] | null>(null)
  const [customQuestions, setCustomQuestions] = useState<Question[] | null>(null)
  const [answeredMap, setAnsweredMap] = useState<Record<number, { selected: string; result: AnswerResult }>>({})
  const [farthestIndex, setFarthestIndex] = useState(0)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, selectedCert.id)
  }, [selectedCert.id])

  useEffect(() => {
    loadQuestions().then((q) => setAllQuestions(q))
  }, [])

  const questionBank = allQuestions ?? getLocalQuestions()
  const questionCountByCert = questionBank.reduce<Record<string, number>>((acc, q) => {
    acc[q.certification] = (acc[q.certification] ?? 0) + 1
    return acc
  }, {})

  const handleSelectCert = (cert: CertInfo) => {
    setSelectedCert(cert)
    setAppState('overview')
  }

  const goToCertifications = () => setAppState('overview')

  const startSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certification: selectedCert.id }),
      })
      if (res.ok) {
        const data = await res.json()
        setSessionId(data.session_id ?? data.id)
      }
    } catch { /* offline */ }

    const certQs = questionBank.filter(q => q.certification === selectedCert.id)
    setQuestions(randomSample(certQs.length > 0 ? certQs : questionBank, 36))
    setCurrentIndex(0)
    setTotalCorrect(0)
    setCurrentQuestionAnswered(false)
    setAnsweredMap({})
    setFarthestIndex(0)
    setAppState('session')
  }, [selectedCert.id, questionBank])

  const handleAnswer = useCallback(async (answer: string): Promise<AnswerResult> => {
    const q = questions[currentIndex]
    let finalResult: AnswerResult | null = null
    try {
      const res = await fetch(`${API_BASE}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: q.id, session_id: sessionId ?? 'local', user_answer: answer }),
      })
      if (res.ok) finalResult = await res.json()
    } catch { /* offline */ }
    if (!finalResult) {
      const isCorrect = answer === q.correct_answer
      finalResult = { is_correct: isCorrect, explanation: q.explanation, correct_answer: q.correct_answer }
    }
    if (finalResult.is_correct) setTotalCorrect(c => c + 1)
    setCurrentQuestionAnswered(true)
    setAnsweredMap(m => ({ ...m, [currentIndex]: { selected: answer, result: finalResult! } }))
    return finalResult
  }, [questions, currentIndex, sessionId])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      recordSession(selectedCert.id, totalCorrect, questions.length)
      setAppState('complete')
    } else {
      const next = currentIndex + 1
      setCurrentIndex(next)
      setCurrentQuestionAnswered(next in answeredMap)
      setFarthestIndex(f => Math.max(f, next))
    }
  }, [currentIndex, questions.length, selectedCert.id, totalCorrect, answeredMap])

  const handleGoToQuestion = useCallback((index: number) => {
    if (index <= farthestIndex) {
      setCurrentIndex(index)
      setCurrentQuestionAnswered(index in answeredMap)
    }
  }, [farthestIndex, answeredMap])

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const prev = currentIndex - 1
      setCurrentIndex(prev)
      setCurrentQuestionAnswered(prev in answeredMap)
    }
  }, [currentIndex, answeredMap])

  const handleEndSession = useCallback(async () => {
    if (sessionId) {
      try { await fetch(`${API_BASE}/sessions/${sessionId}`, { method: 'PATCH' }) } catch { /* silent */ }
    }
    const answeredCount = Object.keys(answeredMap).length
    if (answeredCount > 0) {
      recordSession(selectedCert.id, totalCorrect, answeredCount)
    }
    setAppState('overview')
  }, [sessionId, answeredMap, selectedCert.id, totalCorrect])

  return (
    <div className="app-root">

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar
        selectedCertId={selectedCert.id}
        onSelectCert={handleSelectCert}
        questionCountByCert={questionCountByCert}
        onShowProgress={() => setAppState('progress')}
        onGoHome={() => setAppState('home')}
        onLoadCustomQuestions={(qs) => setCustomQuestions(qs)}
        activeView={appState}
      />

      {/* ── Main content ────────────────────────────── */}
      <div className="app-main">

        {/* Persistent header */}
        <header className="app-nav">
          <div className="app-nav-brand" />

          {appState === 'session' && questions.length > 0 && (() => {
            const answeredCount = Object.keys(answeredMap).length
            const accuracy = answeredCount > 0
              ? Math.round((totalCorrect / answeredCount) * 100)
              : 0
            return (
              <div className="nav-stats" style={{ flex: 1, minWidth: 0 }}>
                {/* Dots navigator */}
                <div style={{ display: 'flex', gap: 5, overflowX: 'auto', overflowY: 'hidden', flex: 1, minWidth: 0, padding: '4px 6px' }}>
                  {questions.map((_, i) => {
                    const answered = answeredMap[i]
                    const isCorrect = answered?.result?.is_correct
                    const reachable = i <= farthestIndex
                    const isCurrent = i === currentIndex
                    const dotColor = !answered
                      ? 'var(--app-border)'
                      : isCorrect ? '#34a853' : '#ea4335'
                    return (
                      <div
                        key={i}
                        onClick={() => reachable && handleGoToQuestion(i)}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          cursor: reachable ? 'pointer' : 'default',
                          opacity: reachable ? 1 : 0.3,
                          flexShrink: 0,
                        }}
                      >
                        <div style={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          background: dotColor,
                          outline: isCurrent ? `2px solid ${dotColor === 'var(--app-border)' ? 'var(--app-text-muted)' : dotColor}` : 'none',
                          outlineOffset: 2,
                        }} />
                        <span style={{ fontSize: 8, color: isCurrent ? 'var(--app-text)' : 'var(--app-text-muted)', fontWeight: isCurrent ? 700 : 400, lineHeight: 1 }}>
                          {i + 1}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {answeredCount > 0 && (
                  <span className="nav-stat-label">
                    <span style={{
                      color: accuracy >= 70 ? 'var(--app-success)' : accuracy >= 40 ? 'var(--app-warning)' : 'var(--app-error)',
                      fontWeight: 600,
                    }}>
                      {accuracy}%
                    </span>
                    {' '}correct
                  </span>
                )}
                <span className="nav-stat-label">
                  Q<span className="text-app" style={{ fontWeight: 600 }}>{currentIndex + 1}</span>
                </span>
              </div>
            )
          })()}
        </header>

        {/* Home */}
        {appState === 'home' && (
          <div className="app-view">
            <h1 className="heading-7 text-app" style={{ marginBottom: 12, textAlign: 'center' }}>
              Python Certification Practice
            </h1>
            <p className="caption text-app-2" style={{ textAlign: 'center', maxWidth: 400, marginBottom: 24, lineHeight: 1.5 }}>
              PCEP · PCAP · PCPP1 · PCEI. Active recall, real code.
            </p>
          </div>
        )}

        {/* Overview */}
        {appState === 'overview' && (
          <div className="app-view-scroll">
            <CertOverview cert={selectedCert} onStart={startSession} questionCountByCert={questionCountByCert} />
          </div>
        )}

        {/* Progress */}
        {appState === 'progress' && (
          <div className="app-view-scroll">
            <ProgressView />
          </div>
        )}

        {/* Session */}
        {appState === 'session' && questions.length > 0 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, overflowY: 'auto', padding: '28px 16px' }}>
              <QuestionCard
                key={questions[currentIndex].id + currentIndex}
                question={questions[currentIndex]}
                questionNumber={currentIndex + 1}
                totalCorrect={totalCorrect}
                onAnswer={handleAnswer}
                onNext={handleNext}
                initialAnswerState={answeredMap[currentIndex]}
              />
            </div>
            <div style={{ padding: '12px 16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Left: End session */}
              <button
                onClick={handleEndSession}
                style={{
                  background: 'rgba(234,67,53,0.15)',
                  border: '1px solid rgba(234,67,53,0.4)',
                  color: '#ea4335',
                  borderRadius: 8,
                  padding: '8px 18px',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                End session
              </button>

              {/* Center: Previous / Next */}
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  style={{
                    background: currentIndex === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: currentIndex === 0 ? 'rgba(255,255,255,0.25)' : '#e8eaed',
                    borderRadius: 8,
                    padding: '8px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    width: 110,
                  }}
                >
                  ← Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={!currentQuestionAnswered}
                  style={{
                    background: currentQuestionAnswered ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: currentQuestionAnswered ? '#e8eaed' : 'rgba(255,255,255,0.25)',
                    borderRadius: 8,
                    padding: '8px 0',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: currentQuestionAnswered ? 'pointer' : 'not-allowed',
                    width: 110,
                  }}
                >
                  Next →
                </button>
              </div>

              {/* Right: spacer to balance layout */}
              <div style={{ width: 110 }} />
            </div>
          </div>
        )}

        {/* Complete */}
        {appState === 'complete' && (() => {
          const accuracy = questions.length > 0
            ? Math.round((totalCorrect / questions.length) * 100)
            : 0
          return (
            <div className="app-view animate-slide-up">
              <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: 54, marginBottom: 14 }}>
                  {accuracy >= 80 ? '🏆' : accuracy >= 60 ? '💪' : '📚'}
                </div>
                <h2 className="heading-7 text-app" style={{ marginBottom: 6 }}>
                  Session Complete
                </h2>
                <p className="caption text-app-2" style={{ marginBottom: 28 }}>
                  {selectedCert.name} · {questions.length} questions
                </p>

                <div className="card" style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="caption text-app-2">Correct</span>
                    <span className="text-success font-mono" style={{ fontWeight: 600 }}>
                      {totalCorrect} / {questions.length}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="caption text-app-2">Accuracy</span>
                    <span className="font-mono" style={{
                      color: accuracy >= 70 ? 'var(--app-success)' : 'var(--app-warning)',
                      fontWeight: 600,
                    }}>
                      {accuracy}%
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={startSession} className="btn-primary" style={{ flex: 1, padding: '13px 0' }}>
                    Practice Again
                  </button>
                  <button onClick={() => setAppState('overview')} className="btn-secondary" style={{ flex: 1, padding: '13px 0' }}>
                    Choose Cert
                  </button>
                </div>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
