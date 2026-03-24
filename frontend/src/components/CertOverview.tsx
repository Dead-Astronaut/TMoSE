import { getTrackForCert, LEVEL_LABEL } from '../data/certifications'
import type { CertInfo } from '../data/certifications'

interface CertOverviewProps {
  cert: CertInfo
  onStart: () => void
  questionCountByCert?: Record<string, number>
}

export function CertOverview({ cert, onStart, questionCountByCert = {} }: CertOverviewProps) {
  const track = getTrackForCert(cert.id)
  const color = track?.color ?? '#7fff5f'
  const questionCount = questionCountByCert[cert.id] ?? cert.questionCount
  const isAvailable = questionCount > 0

  return (
    <div
      className="animate-slide-up"
      style={{
        maxWidth: 580,
        margin: '0 auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-2xl)',
      }}
    >
      {/* Badge */}
      <div style={{
        width: 120, height: 50,
        borderRadius: 'var(--shape-corner-lg)',
        background: `${color}0e`,
        border: `1.5px solid ${color}45`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 18,
        fontFamily: '"JetBrains Mono", monospace',
        fontWeight: 700, fontSize: 18,
        color: color,
        letterSpacing: '-0.5px',
        animation: 'float 4s ease-in-out infinite, glow-pulse 2.5s ease-in-out infinite',
        boxShadow: `0 0 32px ${color}20`,
      }}>
        {cert.name}
      </div>

      {/* Level pill */}
      <div style={{
        fontSize: 'var(--xs-size)',
        fontWeight: 500,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: color,
        background: `${color}12`,
        padding: '3px var(--space-sm)',
        borderRadius: 'var(--shape-corner-rounded)',
        marginBottom: 14,
        border: `1px solid ${color}30`,
      }}>
        {LEVEL_LABEL[cert.level]} · {cert.code}
      </div>

      {/* Title */}
      <h1 className="heading-8 text-app" style={{ marginBottom: 10, textAlign: 'center' }}>
        {cert.fullName}
      </h1>

      {/* Description */}
      <p className="caption text-app-2" style={{ textAlign: 'center', lineHeight: 1.75, marginBottom: 28, maxWidth: 440 }}>
        {cert.description}
      </p>

      {/* Topics */}
      <div className="card" style={{ width: '100%', marginBottom: 28 }}>
        <div className="label-caps" style={{ marginBottom: 12 }}>Topics covered</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '6px 20px' }}>
          {cert.topics.map(topic => (
            <div key={topic} className="caption text-app-2" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: color, fontSize: 7 }}>◆</span>
              {topic}
            </div>
          ))}
        </div>
      </div>

      {/* Stats row */}
      {isAvailable && (
        <div className="card" style={{ display: 'flex', gap: 32, marginBottom: 28, width: '100%', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--4xl-size)',
              fontWeight: 700,
              color: color,
              fontFamily: '"JetBrains Mono", monospace',
              lineHeight: 1,
            }}>
              {questionCount}
            </div>
            <div className="small text-app-muted" style={{ marginTop: 4 }}>questions ready</div>
          </div>
        </div>
      )}

      {/* CTA */}
      {isAvailable ? (
        <button
          onClick={onStart}
          className="btn-primary"
          style={{ width: '100%', maxWidth: 340, padding: '14px 0' }}
        >
          Start {cert.name} Session →
        </button>
      ) : (
        <div className="card" style={{ textAlign: 'center', width: '100%', maxWidth: 340, padding: '14px 0' }}>
          <span className="caption text-app-muted">🔒 Questions coming soon</span>
        </div>
      )}
    </div>
  )
}
