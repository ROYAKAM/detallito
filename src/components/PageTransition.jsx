import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import sfx from '../sfx'

// ponytail: Stardew-style fade through black overlay on page enter
export default function PageTransition({ children }) {
  const ref = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    sfx.transition()
    const tl = gsap.timeline()
    // Black overlay fades out, revealing content
    tl.fromTo(overlayRef.current, { opacity: 1 }, { opacity: 0, duration: 0.5, ease: 'power2.out' })
    // Content slides up slightly
    tl.from(ref.current, { y: 15, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
  }, [])

  return (
    <div className="relative">
      {/* Black overlay - Stardew area transition */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-farm-900 z-[100] pointer-events-none"
      />
      <div ref={ref}>{children}</div>
    </div>
  )
}
