interface DifficultyBadgeProps {
  difficulty: 1 | 2 | 3
}

const labels = { 1: 'Beginner', 2: 'Intermediate', 3: 'Advanced' }
const colors = {
  1: 'text-correct bg-correct-bg border-correct/20',
  2: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  3: 'text-incorrect bg-incorrect-bg border-incorrect/20',
}

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-md border ${colors[difficulty]}`}>
      {labels[difficulty]}
    </span>
  )
}
