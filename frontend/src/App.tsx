import { useState, useCallback, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { CertOverview } from './components/CertOverview'
import { CustomQuestionsView } from './components/CustomQuestionsView'
import { CreateCustomQuestionsView } from './components/CreateCustomQuestionsView'
import { SessionNavigationHeader } from './components/SessionNavigationHeader'
import { QuestionCard } from './components/QuestionCard'
import { ProgressView } from './components/ProgressView'
import { AboutView } from './components/AboutView'
import { loadQuestions, getLocalQuestions } from './data/questions'
import { recordSession } from './data/progress'
import { getCertById } from './data/certifications'
import type { CertInfo } from './data/certifications'
import type { Question, AnswerResult } from './types'

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

type AppState = 'home' | 'overview' | 'load-custom-view' | 'create-custom-view' | 'session' | 'complete' | 'progress' | 'about'

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
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false)
  const [allQuestions, setAllQuestions] = useState<Question[] | null>(null)
  const [customQuestions, setCustomQuestions] = useState<Question[] | null>(null)
  const [isCustomSession, setIsCustomSession] = useState(false)
  const [answeredMap, setAnsweredMap] = useState<Record<number, { selected: string; result: AnswerResult }>>({})
  const [farthestIndex, setFarthestIndex] = useState(0)
  const [sessionAnsweredCount, setSessionAnsweredCount] = useState(0)

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

  const startSession = useCallback(() => {
    const certQs = questionBank.filter(q => q.certification === selectedCert.id)
    setQuestions(randomSample(certQs.length > 0 ? certQs : questionBank, 36))
    setCurrentIndex(0)
    setTotalCorrect(0)
    setCurrentQuestionAnswered(false)
    setAnsweredMap({})
    setFarthestIndex(0)
    setIsCustomSession(false)
    setAppState('session')
  }, [selectedCert.id, questionBank])

  const startCustomSession = useCallback(() => {
    const qs = customQuestions ?? []
    setQuestions(randomSample(qs, Math.min(36, qs.length)))
    setCurrentIndex(0)
    setTotalCorrect(0)
    setCurrentQuestionAnswered(false)
    setAnsweredMap({})
    setFarthestIndex(0)
    setIsCustomSession(true)
    setAppState('session')
  }, [customQuestions])

  const handleAnswer = useCallback((answer: string): AnswerResult => {
    const q = questions[currentIndex]
    const isCorrect = answer === q.correct_answer
    const result: AnswerResult = { is_correct: isCorrect, explanation: q.explanation, correct_answer: q.correct_answer }
    if (isCorrect) setTotalCorrect(c => c + 1)
    setCurrentQuestionAnswered(true)
    setAnsweredMap(m => ({ ...m, [currentIndex]: { selected: answer, result } }))
    return result
  }, [questions, currentIndex])

  const handleNext = useCallback(() => {
    const sessionCertId = isCustomSession ? (customQuestions?.[0]?.certification ?? selectedCert.id) : selectedCert.id
    if (currentIndex + 1 >= questions.length) {
      recordSession(sessionCertId, totalCorrect, questions.length)
      setSessionAnsweredCount(questions.length)
      setAppState('complete')
    } else {
      const next = currentIndex + 1
      setCurrentIndex(next)
      setCurrentQuestionAnswered(next in answeredMap)
      setFarthestIndex(f => Math.max(f, next))
    }
  }, [currentIndex, questions.length, selectedCert.id, totalCorrect, answeredMap, isCustomSession, customQuestions])

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

  const handleEndSession = useCallback(() => {
    const answeredCount = Object.keys(answeredMap).length
    const sessionCertId = isCustomSession ? (customQuestions?.[0]?.certification ?? selectedCert.id) : selectedCert.id
    if (answeredCount > 0) {
      recordSession(sessionCertId, totalCorrect, answeredCount)
    }
    setSessionAnsweredCount(answeredCount)
    setAppState('complete')
  }, [answeredMap, selectedCert.id, totalCorrect, isCustomSession, customQuestions])

  return (
    <div className="app-root">

      {/* ── Sidebar ─────────────────────────────────── */}
      <Sidebar
        selectedCertId={selectedCert.id}
        onSelectCert={handleSelectCert}
        questionCountByCert={questionCountByCert}
        onShowProgress={() => setAppState('progress')}
        onGoHome={() => setAppState('home')}
        onLoadCustomQuestions={(qs) => { setCustomQuestions(qs); setAppState('load-custom-view') }}
        onCreateCustomQuestionsView={() => setAppState('create-custom-view')}
        onShowAbout={() => setAppState('about')}
        activeView={appState}
      />

      {/* ── Main content ────────────────────────────── */}
      <div className="app-main">

        {/* Session header — only shown during quiz */}
        {appState === 'session' && questions.length > 0 && (
          <SessionNavigationHeader
            questions={questions}
            answeredMap={answeredMap}
            totalCorrect={totalCorrect}
            currentIndex={currentIndex}
            farthestIndex={farthestIndex}
            onGoToQuestion={handleGoToQuestion}
          />
        )}

        {/* Home */}
        {appState === 'home' && (
          <div className="app-view">
            <h2
              className="app-title-gradient"
              style={{
                fontWeight: 700,
                fontSize: 32,
                lineHeight: 1.2,
                marginBottom: 24,
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}
            >
              The Ministry of Silly Examinations
            </h2>
            <img
              src="/media/baner.jpg"
              alt="Python Certification Practice"
              style={{
                width: '100%',
                maxWidth: 800,
                borderRadius: 'var(--shape-corner-lg)',
                marginBottom: 24,
                display: 'block',
              }}
            />
            <h1 className="heading-7 text-app" style={{ marginBottom: 12, textAlign: 'center' }}>
              Python Certification Practice
            </h1>
            <p className="caption text-app-2" style={{ textAlign: 'center', maxWidth: 400, marginBottom: 24, lineHeight: 1.5 }}>
              PCEP · PCAP · PCPP1 · PCEI... or just anything
            </p>
          </div>
        )}

        {/* Overview */}
        {appState === 'overview' && (
          <div className="app-view-scroll">
            <CertOverview cert={selectedCert} onStart={startSession} questionCountByCert={questionCountByCert} />
          </div>
        )}

        {/* Custom overview */}
        {appState === 'load-custom-view' && customQuestions && (
          <CustomQuestionsView questions={customQuestions} onStart={startCustomSession} />
        )}

        {/* Create custom questions */}
        {appState === 'create-custom-view' && (
          <CreateCustomQuestionsView />
        )}

        {/* Progress */}
        {appState === 'progress' && (
          <div className="app-view-scroll">
            <ProgressView />
          </div>
        )}

        {/* About */}
        {appState === 'about' && (
          <AboutView />
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
          const accuracy = sessionAnsweredCount > 0
            ? Math.round((totalCorrect / sessionAnsweredCount) * 100)
            : 0
          const displayCertName = isCustomSession
            ? (customQuestions?.[0]?.certification ?? 'Custom')
            : selectedCert.name
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
                  {displayCertName} · {sessionAnsweredCount} questions
                </p>

                <div className="card" style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="caption text-app-2">Correct</span>
                    <span className="text-success font-mono" style={{ fontWeight: 600 }}>
                      {totalCorrect} / {sessionAnsweredCount}
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
                  <button
                    onClick={isCustomSession ? startCustomSession : startSession}
                    className="btn-primary"
                    style={{ flex: 1, padding: '13px 0' }}
                  >
                    Practice Again
                  </button>
                  <button
                    onClick={() => setAppState(isCustomSession ? 'load-custom-view' : 'overview')}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '13px 0' }}
                  >
                    {isCustomSession ? 'Back' : 'Choose Cert'}
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
