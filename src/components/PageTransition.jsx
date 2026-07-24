import { useRef, useEffect } from 'react'
import sfx from '../sfx'

// ponytail: no GSAP opacity animation — StrictMode kills it.
// CSS handles the fade, GSAP was the root cause of invisible text.
export default function PageTransition({ children }) {
  const played = useRef(false)

  useEffect(() => {
    if (!played.current) { sfx.transition(); played.current = true }
  }, [])

  return <div style={{ animation: 'sdv-content-in 0.4s ease-out' }}>{children}</div>
}
