import { useState } from 'react'

const SECTIONS = [
  {
    title: 'The Environment: How Python Speaks',
    bullets: [
      { label: 'Interpreted vs. Compiled', text: 'Python is an interpreted language, meaning an interpreter executes your code line-by-line rather than translating the whole thing at once.' },
      { label: 'The Rules', text: 'Lexis (the allowed vocabulary), Syntax (the grammar/arrangement), and Semantics (the actual logic/meaning).' },
    ],
  },
  {
    title: 'The Nouns: Data Types & Literals',
    bullets: [
      { label: 'Integers (int)', text: 'Whole numbers (e.g., 5, -10).' },
      { label: 'Floats (float)', text: 'Numbers with decimals (e.g., 3.14).' },
      { label: 'Strings (str)', text: 'Text wrapped in quotes (e.g., "Hello").' },
      { label: 'Booleans (bool)', text: 'Logic values, either True or False.' },
    ],
  },
  {
    title: 'The Containers: Variables & Collections',
    bullets: [
      { label: 'Variables', text: 'Named slots in memory used to store data. They follow specific naming conventions and PEP-8 style rules.' },
      { label: 'Lists', text: 'Ordered collections that can be changed (mutable).' },
      { label: 'Tuples', text: 'Ordered collections that cannot be changed (immutable).' },
      { label: 'Dictionaries', text: 'Key-value pairs used to organize labeled data.' },
    ],
  },
  {
    title: 'The Verbs: Operators & Control Flow',
    bullets: [
      { label: 'Operators', text: 'Tools for math (+, -, *, /), comparison (==, !=, >, <), and logic (and, or, not).' },
      { label: 'Control Flow', text: 'The "decision-making" parts of code. Using if/else blocks to branch paths and for/while loops to repeat tasks.' },
    ],
  },
]

function Accordion({ title, bullets }: { title: string; bullets: { label: string; text: string }[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ borderBottom: '1px solid #2A2B2C' }}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          gap: 12,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: '#E8EAED', lineHeight: 1.4 }}>{title}</span>
        <span style={{
          color: '#5F6368',
          fontSize: 20,
          fontWeight: 300,
          flexShrink: 0,
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          display: 'inline-block',
          lineHeight: 1,
        }}>+</span>
      </button>
      {open && (
        <div style={{ paddingBottom: 16 }}>
          <ul style={{ fontSize: 14, color: '#9AA0A6', lineHeight: 1.7, paddingLeft: 20 }}>
            {bullets.map(b => (
              <li key={b.label}>
                <strong style={{ color: '#E8EAED' }}>{b.label}:</strong> {b.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export function OnrampContent() {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <span style={{ fontSize: 13, color: '#7fff5f', marginBottom: 8, fontWeight: 500, display: 'block' }}>
        Step 2
      </span>
      <h1 className="heading-7 text-app" style={{ marginBottom: 8 }}>
        The On-Ramp
      </h1>
      <p className="caption text-app-2" style={{ marginBottom: 28, lineHeight: 1.6 }}>
        This defines the conceptual &quot;mental model&quot; for a PCEP candidate.
      </p>

      <div>
        {SECTIONS.map(s => (
          <Accordion key={s.title} title={s.title} bullets={s.bullets} />
        ))}
      </div>
    </div>
  )
}
