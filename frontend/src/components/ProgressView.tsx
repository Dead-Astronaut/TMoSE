import { getSessionHistory, getProgressByCert } from '../data/progress'

const CERT_ORDER = ['PCEP', 'PCAP', 'PCPP1', 'PCEI']

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return `Today ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function ProgressView() {
  const history = getSessionHistory()
  const byCert = getProgressByCert()

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-lg) var(--space-lg)',
      maxWidth: 560,
      margin: '0 auto',
      width: '100%',
    }}>
      <h1 className="heading-8 text-app" style={{ marginBottom: 8 }}>Your progress</h1>
      <p className="caption text-app-2" style={{ marginBottom: 24 }}>
        Session results are saved locally in your browser.
      </p>

      {/* Per-cert summary */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="label-caps" style={{ marginBottom: 14 }}>By certification</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {CERT_ORDER.map((certId) => {
            const p = byCert[certId]
            if (!p || p.sessions === 0) return null
            return (
              <div key={certId} className="card-sm" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-app font-mono" style={{ fontWeight: 600 }}>{certId}</span>
                <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
                  <span className="small text-app-2">
                    {p.sessions} session{p.sessions !== 1 ? 's' : ''}
                  </span>
                  <span className="small text-app-2">
                    {p.correct} / {p.totalQuestions} correct
                  </span>
                  <span className="small font-mono" style={{
                    fontWeight: 600,
                    color: p.avgAccuracy >= 70 ? 'var(--app-success)' : p.avgAccuracy >= 50 ? 'var(--app-warning)' : 'var(--app-error)',
                  }}>
                    {p.avgAccuracy}% avg
                  </span>
                </div>
              </div>
            )
          })}
        </div>
        {CERT_ORDER.every((id) => !byCert[id] || byCert[id].sessions === 0) && (
          <p className="caption text-app-muted">Complete a session to see progress here.</p>
        )}
      </div>

      {/* Recent sessions */}
      <div className="label-caps" style={{ marginBottom: 10 }}>Recent sessions</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
        {history.slice(0, 15).map((r, i) => (
          <div
            key={`${r.timestamp}-${i}`}
            className="card-sm"
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <span className="caption text-app font-mono" style={{ fontWeight: 600 }}>{r.certId}</span>
              <span className="small text-app-muted" style={{ marginLeft: 8 }}>{formatDate(r.timestamp)}</span>
            </div>
            <span className="small font-mono" style={{
              fontWeight: 600,
              color: r.accuracy >= 70 ? 'var(--app-success)' : r.accuracy >= 50 ? 'var(--app-warning)' : 'var(--app-error)',
            }}>
              {r.correct}/{r.total} · {r.accuracy}%
            </span>
          </div>
        ))}
      </div>
      {history.length === 0 && (
        <p className="caption text-app-muted" style={{ marginTop: 8 }}>No sessions yet.</p>
      )}
    </div>
  )
}
