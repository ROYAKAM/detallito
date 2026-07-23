import { useState, useEffect } from 'react'

export default function TypewriterText({ text, speed = 50, onComplete, className = '' }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index >= text.length) {
      onComplete?.()
      return
    }
    const timer = setTimeout(() => setIndex(i => i + 1), speed)
    return () => clearTimeout(timer)
  }, [index, text, speed, onComplete])

  return (
    <span className={className}>
      {text.slice(0, index)}
      {index < text.length && (
        <span
          className="inline-block w-0.5 h-[1em] ml-0.5 align-text-bottom"
          style={{ animation: 'blink-cursor 0.8s infinite', borderRight: '2px solid #FFD921' }}
        />
      )}
    </span>
  )
}
