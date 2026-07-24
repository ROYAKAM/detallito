import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import sfx from '../sfx'

// ponytail: overlay uses CSS animation as primary (works even if GSAP fails),
// GSAP only handles content slide-in
export default function PageTransition({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    sfx.transition()
    gsap.from(ref.current, { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out', delay: 0.3 })
  }, [])

  return (
    <div className="relative">
      {/* CSS-driven overlay — guaranteed to fade out even if JS fails */}
      <div
        className="fixed inset-0 bg-farm-900 z-[100] pointer-events-none"
        style={{ animation: 'sdv-fade-in 0.5s ease-out forwards' }}
      />
      <div ref={ref}>{children}</div>
    </div>
  )
}
