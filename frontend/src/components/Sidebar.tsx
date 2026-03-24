import { useState, useEffect } from 'react'
import { TRACKS } from '../data/certifications'
import type { CertInfo } from '../data/certifications'

interface SidebarProps {
  selectedCertId: string
  onSelectCert: (cert: CertInfo) => void
  questionCountByCert?: Record<string, number>
  onShowProgress?: () => void
  onShowSetUp?: () => void
  onShowOnramp?: () => void
  onShowZen?: () => void
  onGoHome?: () => void
  activeView?: 'home' | 'setUp' | 'onramp' | 'overview' | 'progress' | 'session' | 'complete'
}

const W_OPEN = 256
const W_CLOSED = 112

export function Sidebar({ selectedCertId, onSelectCert, questionCountByCert = {}, onShowProgress, onShowSetUp, onShowOnramp, onShowZen, onGoHome, activeView }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const [expandedTracks, setExpandedTracks] = useState<Set<string>>(
    new Set(TRACKS.map(t => t.id))
  )

  useEffect(() => {
    if (window.innerWidth < 768) setOpen(false)
  }, [])

  const toggleTrack = (trackId: string) => {
    setExpandedTracks(prev => {
      const next = new Set(prev)
      next.has(trackId) ? next.delete(trackId) : next.add(trackId)
      return next
    })
  }

  return (
    <aside
      className="app-sidebar"
      style={{ width: open ? W_OPEN : W_CLOSED, minWidth: open ? W_OPEN : W_CLOSED }}
    >
      {/* Header */}
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', gap: 6, overflow: 'hidden' }}>
        <button
          className="sidebar-hamburger"
          onClick={() => setOpen(o => !o)}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
          style={{ flexShrink: 0 }}
        >
          <span /><span /><span />
        </button>
        {open ? (
          <span
            onClick={onGoHome}
            style={{
              fontWeight: 700,
              fontSize: 11,
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #7fff5f 0%, #4fffbf 45%, #7fff5f 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: onGoHome ? 'pointer' : 'default',
            }}
          >
            The Ministry of Silly Examinations
          </span>
        ) : (
          <span
            onClick={onGoHome}
            style={{
              fontWeight: 700,
              fontSize: 11,
              whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #7fff5f 0%, #4fffbf 45%, #7fff5f 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              cursor: onGoHome ? 'pointer' : 'default',
            }}
          >
            TMoSE
          </span>
        )}
      </div>

      {/* Section label */}
      {open && <div className="sidebar-section-label">Certifications</div>}

      {/* Cert list */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        {TRACKS.map(track => (
          <div key={track.id}>

            {/* Track header */}
            <button
              className="sidebar-track-btn"
              onClick={() => open && toggleTrack(track.id)}
              style={{
                cursor: open ? 'pointer' : 'default',
                padding: open ? '10px 14px' : '8px 10px',
                justifyContent: 'flex-start',
                gap: open ? 'var(--space-sm)' : 4,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: track.color, flexShrink: 0 }} />
              {open && (
                <>
                  <span style={{
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: track.color,
                    textTransform: 'uppercase',
                    flex: 1,
                    whiteSpace: 'nowrap',
                  }}>
                    {track.name}
                  </span>
                  <span style={{
                    color: 'var(--app-text-dim)',
                    transition: 'transform 0.18s',
                    transform: expandedTracks.has(track.id) ? 'rotate(90deg)' : 'none',
                    display: 'inline-block',
                  }}>▶</span>
                </>
              )}
              {!open && (
                <span style={{
                  fontWeight: 700,
                  fontSize: 10,
                  color: track.color,
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                }}>
                  {track.name}
                </span>
              )}
            </button>

            {/* Expanded cert list */}
            {open && expandedTracks.has(track.id) && (
              <div style={{ marginBottom: 4 }}>
                {track.certs.map(cert => {
                  const isSelected = cert.id === selectedCertId && (activeView === 'overview' || activeView === 'session' || activeView === 'complete')
                  const count = questionCountByCert[cert.id] ?? cert.questionCount
                  const isLocked = count === 0
                  return (
                    <button
                      key={cert.id}
                      onClick={() => !isLocked && onSelectCert(cert)}
                      title={cert.fullName}
                      className={`sidebar-cert-btn${isSelected ? ' sidebar-cert-btn--active' : ''}`}
                      style={{ opacity: isLocked ? 0.35 : 1 }}
                    >
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: track.color, flexShrink: 0,
                        opacity: isSelected ? 1 : 0.6,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: isSelected ? 600 : 400,
                          color: isSelected ? 'var(--app-text)' : 'var(--app-text-2)',
                          whiteSpace: 'nowrap',
                        }}>
                          {cert.name}
                        </div>
                        <div className="text-app-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: 1 }}>
                          {cert.code}
                        </div>
                      </div>
                      <span style={{ color: isLocked ? 'var(--app-text-dim)' : count > 0 ? 'var(--app-accent)' : 'var(--app-text-dim)', flexShrink: 0 }}>
                        {isLocked ? '🔒' : `${count}q`}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Collapsed: tree-style cert list */}
            {!open && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 4, paddingLeft: 10 }}>
                {track.certs.map((cert, i) => {
                  const isSelected = cert.id === selectedCertId && (activeView === 'overview' || activeView === 'session' || activeView === 'complete')
                  const isLast = i === track.certs.length - 1
                  return (
                    <div key={cert.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--app-text-dim)', fontSize: 10, flexShrink: 0, userSelect: 'none' }}>
                        {isLast ? '└' : '├'}
                      </span>
                      <button
                        onClick={() => onSelectCert(cert)}
                        title={cert.fullName}
                        style={{
                          height: 22,
                          padding: '0 5px',
                          borderRadius: 'var(--shape-corner-sm)',
                          background: isSelected ? 'rgba(127,255,95,0.1)' : 'none',
                          border: isSelected ? '1px solid rgba(127,255,95,0.4)' : '1px solid transparent',
                          cursor: 'pointer',
                          display: 'flex', alignItems: 'center',
                          fontWeight: 700,
                          fontSize: 10,
                          color: isSelected ? 'var(--app-accent)' : 'var(--app-text-muted)',
                          transition: 'all 0.12s',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {cert.name.replace('™', '')}
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Footer */}
      {onShowProgress && (
        <div className="sidebar-footer" style={{ padding: open ? undefined : '6px 8px' }}>
          <button
            type="button"
            onClick={onShowProgress}
            className={`sidebar-nav-btn${activeView === 'progress' ? ' sidebar-nav-btn--active' : ''}`}
            style={{ width: '100%', display: 'flex', paddingLeft: '10px', alignItems: 'center', justifyContent: open ? 'flex-start' : 'center', fontSize: open ? undefined : 11, whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            🏆 Progress
          </button>
        </div>
      )}
    </aside>
  )
}
