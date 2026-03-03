import { useEffect, useState } from 'react'

const COLORS = ['#7fff5f', '#34A853', '#F9AB00', '#4285F4', '#EA4335', '#E8EAED']
const PARTICLE_COUNT = 48

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + Math.random() * 0.5
    const velocity = 180 + Math.random() * 120
    const size = 6 + Math.random() * 8
    return {
      id: i,
      angle,
      velocity,
      size,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 80,
    }
  })
}

export function ExplosionEffect() {
  const [particles] = useState(createParticles)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1200)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      aria-hidden
    >
      <span
        className="absolute font-sans font-bold text-4xl text-[#7fff5f] animate-explode-text"
        style={{ textShadow: '0 0 24px rgba(127,255,95,0.8)' }}
      >
        my.py
      </span>
      <div className="relative w-4 h-4">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full animate-explode"
            style={{
              left: '50%',
              top: '50%',
              width: p.size,
              height: p.size,
              background: p.color,
              ['--tx' as string]: `${Math.cos(p.angle) * p.velocity}px`,
              ['--ty' as string]: `${Math.sin(p.angle) * p.velocity}px`,
              animationDelay: `${p.delay}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
