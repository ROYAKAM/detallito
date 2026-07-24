import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import sfx from '../sfx'

// ponytail: simple fade-in, no overlay. The overlay approach kept causing
// brown screen issues on mobile/StrictMode. Content fade is enough.
export default function PageTransition({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    sfx.transition()
    gsap.from(ref.current, { opacity: 0, y: 12, duration: 0.45, ease: 'power2.out' })
  }, [])

  return <div ref={ref}>{children}</div>
}
