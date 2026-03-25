export function AboutView() {
  return (
    <div className="app-view-scroll">
      <div style={{ maxWidth: 640, width: '100%', padding: '36px 24px', margin: '0 auto' }}>

        {/* Title */}
        <h2 className="heading-7 text-app" style={{ marginBottom: 20 }}>
          About
        </h2>

        {/* What it is */}
        <p className="caption text-app-2" style={{ marginBottom: 16, lineHeight: 1.7 }}>
          <strong className="app-title-gradient" style={{ fontWeight: 700 }}>The Ministry of Silly Examinations</strong> is a
          lightweight, browser-based practice tool for Python certification exams - covering{' '}
          <strong style={{ color: 'var(--app-text)' }}>PCEP, PCAP, PCPP1, and PCEI</strong>.
          It follows an active-recall approach: draw a random set of questions, answer them, and get
          instant feedback with explanations.
        </p>

        <p className="caption text-app-2" style={{ marginBottom: 16, lineHeight: 1.7 }}>
          The built-in question bank is just a starting point. You can extend it with{' '}
          <strong style={{ color: 'var(--app-text)' }}>any topic you like</strong> by creating a custom
          JSON question set (see <strong style={{ color: 'var(--app-text)' }}>Create custom questions</strong> in the sidebar) and loading it via{' '}
          <strong style={{ color: 'var(--app-text)' }}>Load custom questions</strong>. This makes it useful far beyond Python certs - study anything
          that can be expressed as multiple-choice questions.
        </p>

        {/* The name */}
        <div style={{
          margin: '24px 0',
          padding: '14px 18px',
          borderRadius: 'var(--shape-corner-md)',
          background: 'rgba(127,255,95,0.05)',
          border: '1px solid rgba(127,255,95,0.15)',
        }}>
          <p className="caption text-app-2" style={{ lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--app-accent)' }}>Why the name?</strong> Python, the programming
            language, was named after <em>Monty Python's Flying Circus</em>. It felt only right to honour
            that tradition - hence the Ministry, the silliness, and the examinations.
          </p>
        </div>

        {/* Origin */}
        <p className="caption text-app-2" style={{ marginBottom: 16, lineHeight: 1.7 }}>
          This is a small side project built with{' '}
          <strong style={{ color: 'var(--app-text)' }}>Claude</strong> as a coding companion.
          It started as a personal study tool and grew from there.
        </p>

        {/* GitHub */}
        <p className="caption text-app-2" style={{ marginBottom: 32, lineHeight: 1.7 }}>
          If you find it useful, want to report an issue, or feel like contributing questions or features,
          the source code is on GitHub:
        </p>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <a
            href="https://github.com/Dead-Astronaut/TMoSE"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 'var(--shape-corner-md)',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--app-border)',
              color: 'var(--app-text)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'background 0.15s, border-color 0.15s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.10)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.25)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.06)'
              ;(e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--app-border)'
            }}
          >
            <span style={{ fontSize: 16 }}>⭐</span>
            github.com/Dead-Astronaut/TMoSE
          </a>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}
