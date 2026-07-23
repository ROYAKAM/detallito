import { useRef, useEffect } from 'react'
import gsap from 'gsap'

export default function PageTransition({ children }) {
  const ref = useRef(null)

  useEffect(() => {
    gsap.from(ref.current, { opacity: 0, y: 30, duration: 0.6, ease: 'power2.out' })
  }, [])

  return <div ref={ref}>{children}</div>
}
