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
  activeView?: 'home' | 'setUp' | 'onramp' | 'overview' | 'progress' | 'session' | 'complete'
}

const LEVEL_LABEL: Record<string, string> = {
  entry: 'Entry',
  associate: 'Assoc.',
  professional: 'Prof.',
}

const W_OPEN = 256
const W_CLOSED = 52

export function Sidebar({ selectedCertId, onSelectCert, questionCountByCert = {}, onShowProgress, onShowSetUp, onShowOnramp, onShowZen, activeView }: SidebarProps) {
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
      <div className="sidebar-header">
        <button
          className="sidebar-hamburger"
          onClick={() => setOpen(o => !o)}
          title={open ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Set Up / Onramp */}
      {open && (onShowSetUp ?? onShowOnramp) && (
        <div className="sidebar-nav-section">
          {onShowSetUp && (
            <button
              type="button"
              onClick={onShowSetUp}
              className={`sidebar-nav-btn${activeView === 'setUp' ? ' sidebar-nav-btn--active' : ''}`}
            >
              1. Set Up
            </button>
          )}
          {onShowOnramp && (
            <button
              type="button"
              onClick={onShowOnramp}
              className={`sidebar-nav-btn${activeView === 'onramp' ? ' sidebar-nav-btn--active' : ''}`}
            >
              2. Onramp
            </button>
          )}
          {onShowZen && (
            <button
              type="button"
              onClick={onShowZen}
              className="sidebar-nav-btn"
            >
              3. Zen of Python
            </button>
          )}
        </div>
      )}

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
                padding: open ? '10px 14px' : '10px 0',
                justifyContent: open ? 'flex-start' : 'center',
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
            </button>

            {/* Expanded cert list */}
            {open && expandedTracks.has(track.id) && (
              <div style={{ marginBottom: 4 }}>
                {track.certs.map(cert => {
                  const isSelected = cert.id === selectedCertId
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
                          {LEVEL_LABEL[cert.level]} · {cert.code}
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

            {/* Collapsed: icon buttons */}
            {!open && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, paddingBottom: 8 }}>
                {track.certs.map(cert => (
                  <button
                    key={cert.id}
                    onClick={() => onSelectCert(cert)}
                    title={cert.fullName}
                    style={{
                      width: 30, height: 30,
                      borderRadius: 'var(--shape-corner-sm)',
                      background: cert.id === selectedCertId ? 'rgba(127,255,95,0.1)' : 'none',
                      border: cert.id === selectedCertId ? '1px solid rgba(127,255,95,0.4)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700,
                      color: cert.id === selectedCertId ? 'var(--app-accent)' : 'var(--app-text-muted)',
                      transition: 'all 0.12s',
                    }}
                  >
                    {cert.name.slice(0, 2)}
                  </button>
                ))}
              </div>
            )}

          </div>
        ))}
      </div>

      {/* Progress */}
      {open && onShowProgress && (
        <div style={{ margin: '0 var(--space-sm) var(--space-sm)' }}>
          <button
            type="button"
            onClick={onShowProgress}
            className={`sidebar-nav-btn${activeView === 'progress' ? ' sidebar-nav-btn--active' : ''}`}
            style={{ width: '100%' }}
          >
            Progress
          </button>
        </div>
      )}

      {/* Footer */}
      {open && (
        <div className="sidebar-footer">
          🔒 = questions coming soon
        </div>
      )}
    </aside>
  )
}
