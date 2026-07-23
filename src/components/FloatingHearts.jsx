import { useMemo } from 'react'

// ponytail: pixel stars/fireflies instead of hearts, pure CSS
const PARTICLES = ['✦', '✧', '·', '✦', '·', '✧', '⭐', '·', '✦', '·', '✧', '·']

export default function FloatingHearts({ count = 12 }) {
  const stars = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      char: PARTICLES[i % PARTICLES.length],
      left: `${Math.random() * 100}%`,
      size: 10 + Math.random() * 12,
      delay: `${Math.random() * 15}s`,
      duration: `${15 + Math.random() * 20}s`,
      opacity: 0.1 + Math.random() * 0.2,
      color: Math.random() > 0.6 ? '#FFD921' : '#A3E2F8',
    })),
  [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {stars.map(s => (
        <span
          key={s.id}
          className="absolute bottom-0 select-none"
          style={{
            left: s.left,
            fontSize: s.size,
            color: s.color,
            animationName: 'float-star',
            animationDuration: s.duration,
            animationDelay: s.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            opacity: s.opacity,
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  )
}
