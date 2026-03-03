import { useState, useCallback, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { CertOverview } from './components/CertOverview'
import { QuestionCard } from './components/QuestionCard'
import { ProgressView } from './components/ProgressView'
import { OnrampContent } from './components/OnrampContent'
import { loadQuestions, getLocalQuestions } from './data/questions'
import { recordSession } from './data/progress'
import { getCertById } from './data/certifications'
import type { CertInfo } from './data/certifications'
import type { Question, AnswerResult } from './types'

const API_BASE = '/api'
const STORAGE_KEY = 'mypy_selected_cert'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

type AppState = 'home' | 'onramp' | 'overview' | 'session' | 'complete' | 'progress'

export default function App() {
  const savedCertId = localStorage.getItem(STORAGE_KEY) ?? 'PCEP'
  const [selectedCert, setSelectedCert] = useState<CertInfo>(
    () => getCertById(savedCertId) ?? getCertById('PCEP')!
  )
  const [appState, setAppState] = useState<AppState>(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=onramp')) return 'onramp'
    return 'home'
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [allQuestions, setAllQuestions] = useState<Question[] | null>(null)

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
    setQuestions(shuffle(certQs.length > 0 ? certQs : questionBank))
    setCurrentIndex(0)
    setTotalCorrect(0)
    setAppState('session')
  }, [selectedCert.id, questionBank])

  const handleAnswer = useCallback(async (answer: string): Promise<AnswerResult> => {
    const q = questions[currentIndex]
    try {
      const res = await fetch(`${API_BASE}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: q.id, session_id: sessionId ?? 'local', user_answer: answer }),
      })
      if (res.ok) {
        const result: AnswerResult = await res.json()
        if (result.is_correct) setTotalCorrect(c => c + 1)
        return result
      }
    } catch { /* offline */ }
    const isCorrect = answer === q.correct_answer
    if (isCorrect) setTotalCorrect(c => c + 1)
    return { is_correct: isCorrect, explanation: q.explanation, correct_answer: q.correct_answer }
  }, [questions, currentIndex, sessionId])

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= questions.length) {
      recordSession(selectedCert.id, totalCorrect, questions.length)
      setAppState('complete')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }, [currentIndex, questions.length, selectedCert.id, totalCorrect])

  const handleEndSession = useCallback(async () => {
    if (sessionId) {
      try { await fetch(`${API_BASE}/sessions/${sessionId}`, { method: 'PATCH' }) } catch { /* silent */ }
    }
    setAppState('overview')
  }, [sessionId])

  return (
    <div className="app-root">

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar
        selectedCertId={selectedCert.id}
        onSelectCert={handleSelectCert}
        questionCountByCert={questionCountByCert}
        onShowProgress={() => setAppState('progress')}
        onShowSetUp={() => { window.location.href = '/setup.html' }}
        onShowOnramp={() => setAppState('onramp')}
        onShowZen={() => { window.location.href = '/setup-step4.html' }}
        activeView={appState}
      />

      {/* ── Main content ────────────────────────────── */}
      <div className="app-main">

        {/* Persistent header */}
        <header className="app-nav">
          <div className="app-nav-brand">
            <span className="app-logo">my.py</span>
            {(appState === 'overview' || appState === 'progress' || appState === 'onramp') && (
              <button
                type="button"
                onClick={() => setAppState('home')}
                className="btn-ghost caption text-app-muted"
                style={{ padding: '4px 0' }}
              >
                Home
              </button>
            )}
            {appState === 'session' && (
              <>
                <span className="text-app-dim small">/</span>
                <span className="caption text-app-muted">{selectedCert.id}</span>
              </>
            )}
          </div>

          {appState === 'session' && questions.length > 0 && (() => {
            const accuracy = currentIndex + 1 > 1
              ? Math.round((totalCorrect / currentIndex) * 100)
              : 0
            return (
              <div className="nav-stats">
                <span className="nav-stat-label">
                  Q<span className="text-app" style={{ fontWeight: 600 }}>{currentIndex + 1}</span>
                </span>
                {currentIndex + 1 > 1 && (
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
                <div style={{ display: 'flex', gap: 4 }}>
                  {[1,2,3,4,5].map(i => {
                    const filled = i <= (totalCorrect % 5 || (totalCorrect > 0 && totalCorrect % 5 === 0 ? 5 : 0))
                    return (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: filled ? 'var(--app-accent)' : 'var(--app-border)',
                      }} />
                    )
                  })}
                </div>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
              {[
                'Set Up', 'Onramp', 'Zen of Python', 'Choose cert',
              ].map((label, i, arr) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                      border: '1.5px solid rgba(127,255,95,0.35)',
                      background: 'rgba(127,255,95,0.07)',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#7fff5f',
                    }}>{i + 1}</span>
                    <span className="small text-app-muted">{label}</span>
                  </span>
                  {i < arr.length - 1 && <span className="small text-app-dim">→</span>}
                </span>
              ))}
            </div>
            <a href="/setup.html" className="btn-primary">
              Get started
            </a>
          </div>
        )}

{/* 2. Onramp */}
        {appState === 'onramp' && (
          <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: 'var(--space-lg) var(--space-2xl)' }}>
              <OnrampContent />
            </div>
            <div className="section-footer">
              <button onClick={goToCertifications} className="btn-primary">
                Choose certification →
              </button>
            </div>
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
              />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  onClick={handleEndSession}
                  className="btn-ghost small text-app-muted"
                  style={{ letterSpacing: '0.02em' }}
                >
                  ← End session
                </button>
              </div>
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
