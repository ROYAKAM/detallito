import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import PageTransition from '../components/PageTransition'
import DialogueBox from '../components/DialogueBox'
import { photos } from '../data/photos'
import config from '../data/config'

export default function RewindPage() {
  const navigate = useNavigate()
  const [dialogueDone, setDialogueDone] = useState(false)
  const [current, setCurrent] = useState(0)
  const [showDetails, setShowDetails] = useState(false)
  const imgRef = useRef(null)
  const autoRef = useRef(null)
  const isLast = current === photos.length - 1

  const goTo = useCallback((idx) => {
    const next = Math.max(0, Math.min(photos.length - 1, idx))
    if (next === current) return
    gsap.to(imgRef.current, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrent(next)
        gsap.to(imgRef.current, { opacity: 1, duration: 0.3 })
      }
    })
  }, [current])

  useEffect(() => {
    if (!imgRef.current || !dialogueDone) return
    gsap.fromTo(imgRef.current, { scale: 1 }, { scale: 1.08, duration: 6, ease: 'none' })
  }, [current, dialogueDone])

  useEffect(() => {
    if (!dialogueDone || isLast) return
    autoRef.current = setTimeout(() => goTo(current + 1), 5000)
    return () => clearTimeout(autoRef.current)
  }, [current, isLast, goTo, dialogueDone])

  function handleClick(e) {
    clearTimeout(autoRef.current)
    const x = e.clientX ?? e.touches?.[0]?.clientX
    if (x < window.innerWidth / 2) goTo(current - 1)
    else goTo(current + 1)
  }

  useEffect(() => {
    if (!dialogueDone) return
    function onKey(e) {
      if (e.key === 'ArrowLeft') goTo(current - 1)
      if (e.key === 'ArrowRight') goTo(current + 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, goTo, dialogueDone])

  if (!dialogueDone) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6">
          <DialogueBox lines={config.dialogues.rewind} speaker={config.senderName} onComplete={() => setDialogueDone(true)} />
        </div>
      </PageTransition>
    )
  }

  const photo = photos[current]

  return (
    <PageTransition>
      <div className="fixed inset-0 bg-farm-900 cursor-pointer select-none" onClick={handleClick}>
        {/* Progress bar - Stardew energy bar style */}
        <div className="absolute top-0 left-0 right-0 z-20 p-2">
          <div className="pixel-border bg-farm-800 p-1 flex gap-1">
            {photos.map((_, i) => (
              <div key={i} className="flex-1 h-2 bg-farm-900">
                <div
                  className="h-full bg-sdvgreen-500 transition-all duration-300"
                  style={{ width: i <= current ? '100%' : '0%' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="absolute inset-0 overflow-hidden">
          <img ref={imgRef} src={photo.src} alt={photo.caption} className="w-full h-full object-cover" />
        </div>

        {/* Caption overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-farm-900/90 to-transparent p-6 pt-20">
          <p className="text-sdvcream-100 text-xl font-body">{photo.caption}</p>
          <p className="text-sdvcream-200/50 text-lg font-body mt-1">{photo.date}{photo.location ? ` - ${photo.location}` : ''}</p>

          {isLast && (
            <button
              onClick={(e) => { e.stopPropagation(); navigate('/cartas') }}
              className="sdv-button mt-4"
            >
              Continuar
            </button>
          )}
        </div>

        {/* Details panel */}
        {showDetails && (
          <div className="absolute inset-0 z-30 bg-farm-900/95 flex items-center justify-center p-8" onClick={(e) => { e.stopPropagation(); setShowDetails(false) }}>
            <div className="text-center">
              <img src={photo.src} alt="" className="max-h-[50vh] mx-auto mb-4 pixel-border" />
              <p className="text-xl font-body text-sdvcream-100">{photo.caption}</p>
              <p className="text-sdvcream-200/50 font-body mt-2">{photo.date}</p>
              {photo.location && <p className="text-sdvcream-200/30 font-body mt-1">{photo.location}</p>}
            </div>
          </div>
        )}

        {/* Tap hint */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 text-sdvcream-200/30 text-sm font-body">
          {current === 0 ? 'Toca para avanzar' : `${current + 1} / ${photos.length}`}
        </div>
      </div>
    </PageTransition>
  )
}
