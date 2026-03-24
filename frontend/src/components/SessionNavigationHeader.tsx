import type { Question, AnswerResult } from '../types'

interface SessionNavigationHeaderProps {
  questions: Question[]
  answeredMap: Record<number, { selected: string; result: AnswerResult }>
  totalCorrect: number
  currentIndex: number
  farthestIndex: number
  onGoToQuestion: (index: number) => void
}

export function SessionNavigationHeader({
  questions,
  answeredMap,
  totalCorrect,
  currentIndex,
  farthestIndex,
  onGoToQuestion,
}: SessionNavigationHeaderProps) {
  const answeredCount = Object.keys(answeredMap).length
  const accuracy = answeredCount > 0
    ? Math.round((totalCorrect / answeredCount) * 100)
    : 0

  return (
    <header className="app-nav">
      <div className="app-nav-brand" />

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
                onClick={() => reachable && onGoToQuestion(i)}
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
    </header>
  )
}
