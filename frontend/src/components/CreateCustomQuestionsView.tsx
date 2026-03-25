const SCHEMA_EXAMPLE = `[
  {
    "id": "pcep-001",
    "certification": "PCEP",
    "section": "1",
    "objective": "1.1",
    "type": "multiple_choice",
    "question_text": "Clear question text",
    "code_snippet": "Python code here, or null",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct_answer": "Option B",
    "explanation": "Plain-English explanation.",
    "difficulty": 1
  }
]`

const PROMPT_TEMPLATE = `Generate [NUMBER] Python exam questions for the [CERTIFICATION] certification,
targeting section [SECTION], objective [OBJECTIVE].

Follow this exact JSON schema:

{
  "id": "[cert-lowercase]-[3-digit-number]",
  "certification": "[CERTIFICATION]",
  "section": "[section number as string]",
  "objective": "[objective number as string]",
  "type": "[multiple_choice|true_false|spot_the_bug|code_snippet]",
  "question_text": "Clear question text",
  "code_snippet": "Python code here, or null",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_answer": "Exact match to one of the options",
  "explanation": "Plain-English explanation.",
  "difficulty": 1
}

Rules:
- difficulty: 1=beginner, 2=intermediate, 3=advanced
- correct_answer must be an EXACT string match to one option
- code_snippet must be valid Python 3.11+
- true_false: exactly 2 options ["True", "False"]
- Output only JSON array, no markdown fences`

export function CreateCustomQuestionsView() {
  return (
    <div className="app-view-scroll">
      <div style={{ maxWidth: 720, width: '100%', padding: '36px 24px', margin: '0 auto' }}>

        {/* Title */}
        <h2 className="heading-7 text-app" style={{ marginBottom: 8 }}>
          How to create custom questions
        </h2>
        <p className="caption text-app-2" style={{ marginBottom: 32, lineHeight: 1.6 }}>
          You can load your own question sets into the app using a JSON file. The easiest way to generate
          questions is to use an AI assistant (ChatGPT, Gemini, Claude, etc.) with the prompt template below.
          Once you have a JSON file, use the <strong style={{ color: 'var(--app-text)' }}>Load custom questions</strong> entry
          in the sidebar to import it.
        </p>

        {/* JSON schema */}
        <h3 className="heading-9 text-app" style={{ marginBottom: 10 }}>
          JSON format
        </h3>
        <p className="caption text-app-2" style={{ marginBottom: 10, lineHeight: 1.6 }}>
          Each file must be a JSON array of question objects. Every object must follow this schema exactly:
        </p>
        <CodeBlock code={SCHEMA_EXAMPLE} language="json" />

        {/* Field reference */}
        <div style={{ marginTop: 20, marginBottom: 32 }}>
          {[
            { field: 'id', desc: 'Unique identifier, e.g. pcep-001' },
            { field: 'certification', desc: 'Name/code of the certification, e.g. PCEP' },
            { field: 'section / objective', desc: 'Section and objective numbers as strings' },
            { field: 'type', desc: 'multiple_choice · true_false · spot_the_bug · code_snippet' },
            { field: 'options', desc: 'Array of 2–4 answer strings; true_false must be ["True","False"]' },
            { field: 'correct_answer', desc: 'Must be an exact string match to one of the options' },
            { field: 'code_snippet', desc: 'Valid Python 3.11+ string, or null' },
            { field: 'difficulty', desc: '1 = beginner · 2 = intermediate · 3 = advanced' },
          ].map(({ field, desc }) => (
            <div key={field} style={{
              display: 'flex', gap: 12, padding: '7px 0',
              borderBottom: '1px solid var(--app-border)',
            }}>
              <span style={{
                fontFamily: 'monospace', fontSize: 12, color: 'var(--app-accent)',
                flexShrink: 0, minWidth: 160,
              }}>
                {field}
              </span>
              <span className="caption text-app-2" style={{ lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* AI prompt section */}
        <h3 className="heading-9 text-app" style={{ marginBottom: 10 }}>
          AI prompt template
        </h3>
        <p className="caption text-app-2" style={{ marginBottom: 10, lineHeight: 1.6 }}>
          Copy the prompt below into any AI assistant, fill in the placeholders, and paste the output
          JSON directly into a <code style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--app-accent)' }}>.json</code> file.
        </p>
        <CodeBlock code={PROMPT_TEMPLATE} language="text" />
        <div style={{ height: 30 }} />
      </div>
    </div>
  )
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  return (
    <div style={{
      borderRadius: 'var(--shape-corner-md)',
      overflow: 'hidden',
      border: '1px solid var(--app-border)',
      background: 'var(--app-panel)',
      marginBottom: 4,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '7px 12px',
        borderBottom: '1px solid var(--app-border)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(234,67,53,0.7)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(249,171,0,0.7)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(52,168,83,0.7)' }} />
        <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--app-text-muted)', fontFamily: 'monospace' }}>
          {language}
        </span>
      </div>
      <pre style={{
        margin: 0,
        padding: '16px',
        fontSize: 12,
        lineHeight: 1.65,
        overflowX: 'auto',
        color: 'var(--app-text-2)',
        fontFamily: 'monospace',
        whiteSpace: 'pre',
      }}>
        <code>{code}</code>
      </pre>
    </div>
  )
}
