import { useRef, useState } from 'react'
import gsap from 'gsap'
import sfx from '../sfx'

// ponytail: restyled as Stardew Valley parchment letter
export default function EnvelopeReveal({ onOpen }) {
  const [opened, setOpened] = useState(false)
  const flapRef = useRef(null)
  const letterRef = useRef(null)
  const envelopeRef = useRef(null)

  function handleOpen() {
    if (opened) return
    setOpened(true)
    sfx.envelopeOpen()

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(envelopeRef.current, { opacity: 0, scale: 0.8, duration: 0.4, delay: 0.2, onComplete: onOpen })
      }
    })

    tl.to(flapRef.current, { rotateX: -180, duration: 0.6, ease: 'power2.inOut' })
    tl.to(letterRef.current, { y: -60, duration: 0.5, ease: 'power2.out' }, '-=0.2')
    tl.to(letterRef.current, { scale: 1.1, duration: 0.3 })
  }

  return (
    <div
      ref={envelopeRef}
      onClick={handleOpen}
      className="cursor-pointer select-none mx-auto w-full max-w-[240px]"
      style={{ height: 180, perspective: 600, pointerEvents: opened ? 'none' : 'auto' }}
    >
      <div className="relative w-full h-full">
        {/* Back */}
        <div className="absolute inset-0 bg-gradient-to-br from-sdvbrown-600 to-sdvbrown-700 pixel-border" />

        {/* Letter inside */}
        <div
          ref={letterRef}
          className="absolute left-3 right-3 top-4 bottom-4 bg-sdvcream-100 flex items-center justify-center"
          style={{ boxShadow: 'inset 0 0 10px rgba(107, 55, 16, 0.2)' }}
        >
          <span className="text-sdvbrown-700 font-body text-2xl">Para ti...</span>
        </div>

        {/* Front of envelope (bottom half) */}
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-sdvbrown-700 to-sdvbrown-600 z-10" />

        {/* Flap */}
        <div
          ref={flapRef}
          className="absolute top-0 left-0 right-0 z-20"
          style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        >
          <svg viewBox="0 0 240 90" className="w-full">
            <path d="M0,0 L120,90 L240,0 Z" fill="#6B3710" />
          </svg>
        </div>
      </div>

      {!opened && (
        <p className="text-center text-sdvcream-200/50 font-body text-lg mt-4" style={{ animation: 'gentle-pulse 2s infinite' }}>
          Toca para abrir
        </p>
      )}
    </div>
  )
}
