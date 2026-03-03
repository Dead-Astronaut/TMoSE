const STORAGE_KEY = 'mypy_progress'

export interface SessionRecord {
  certId: string
  timestamp: number
  correct: number
  total: number
  accuracy: number
}

const MAX_RECORDS = 200

function load(): SessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionRecord[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(records: SessionRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(-MAX_RECORDS)))
  } catch {
    // ignore
  }
}

/** Record a completed session. Call when the user finishes a session (e.g. last question). */
export function recordSession(certId: string, correct: number, total: number): void {
  if (total <= 0) return
  const accuracy = Math.round((correct / total) * 100)
  const records = load()
  records.push({
    certId,
    timestamp: Date.now(),
    correct,
    total,
    accuracy,
  })
  save(records)
}

/** Full session history, newest first. */
export function getSessionHistory(): SessionRecord[] {
  return load().slice().reverse()
}

/** Per-cert summary: session count, total questions, average accuracy. */
export function getProgressByCert(): Record<
  string,
  { sessions: number; totalQuestions: number; correct: number; avgAccuracy: number }
> {
  const records = load()
  const byCert: Record<
    string,
    { sessions: number; totalQuestions: number; correct: number; sumAccuracy: number }
  > = {}
  for (const r of records) {
    if (!byCert[r.certId]) {
      byCert[r.certId] = { sessions: 0, totalQuestions: 0, correct: 0, sumAccuracy: 0 }
    }
    byCert[r.certId].sessions += 1
    byCert[r.certId].totalQuestions += r.total
    byCert[r.certId].correct += r.correct
    byCert[r.certId].sumAccuracy += r.accuracy
  }
  const result: Record<
    string,
    { sessions: number; totalQuestions: number; correct: number; avgAccuracy: number }
  > = {}
  for (const [cert, data] of Object.entries(byCert)) {
    result[cert] = {
      sessions: data.sessions,
      totalQuestions: data.totalQuestions,
      correct: data.correct,
      avgAccuracy:
        data.sessions > 0 ? Math.round(data.sumAccuracy / data.sessions) : 0,
    }
  }
  return result
}
