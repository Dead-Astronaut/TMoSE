import type { Question } from '../types'

const CUSTOM_COLOR = '#F59E0B'

interface CustomQuestionsViewProps {
  questions: Question[]
  onStart: () => void
}

export function CustomQuestionsView({ questions, onStart }: CustomQuestionsViewProps) {
  const certName = questions[0].certification

  return (
    <div className="app-view-scroll">
      <div className="animate-slide-up" style={{
        maxWidth: 580,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-2xl)',
      }}>
        {/* Badge */}
        <div style={{
          width: 120, height: 50,
          borderRadius: 'var(--shape-corner-lg)',
          background: `${CUSTOM_COLOR}0e`,
          border: `1.5px solid ${CUSTOM_COLOR}45`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 18,
          fontFamily: '"JetBrains Mono", monospace',
          fontWeight: 700, fontSize: 18,
          color: CUSTOM_COLOR,
          letterSpacing: '-0.5px',
          animation: 'float 4s ease-in-out infinite, glow-pulse 2.5s ease-in-out infinite',
          boxShadow: `0 0 32px ${CUSTOM_COLOR}20`,
        }}>
          Custom
        </div>

        {/* Title */}
        <h1 className="heading-8 text-app" style={{ marginBottom: 28, textAlign: 'center' }}>
          {certName}
        </h1>

        {/* Stats */}
        <div className="card" style={{ display: 'flex', gap: 32, marginBottom: 28, width: '100%', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--4xl-size)',
              fontWeight: 700,
              color: CUSTOM_COLOR,
              fontFamily: '"JetBrains Mono", monospace',
              lineHeight: 1,
            }}>
              {questions.length}
            </div>
            <div className="small text-app-muted" style={{ marginTop: 4 }}>questions ready</div>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={onStart}
          className="btn-primary"
          style={{ width: '100%', maxWidth: 340, padding: '14px 0', background: CUSTOM_COLOR, color: '#1a1a1a' }}
        >
          Start {certName} Session →
        </button>
      </div>
    </div>
  )
}
