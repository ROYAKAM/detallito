import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import config, { CONFETTI_COLORS } from '../data/config'
import sfx from '../sfx'

export default function LoginPage() {
  const navigate = useNavigate()
  const { isAuthenticated, setIsAuthenticated } = useApp()
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [hintIdx, setHintIdx] = useState(-1)
  const [error, setError] = useState(false)
  const cardRef = useRef(null)

  // ponytail: useEffect to avoid calling navigate during render
  useEffect(() => {
    if (isAuthenticated) navigate('/rewind', { replace: true })
  }, [isAuthenticated, navigate])
  if (isAuthenticated) return null

  function handleSubmit(e) {
    e.preventDefault()
    if (password.toLowerCase() === config.password.toLowerCase()) {
      sfx.loginSuccess()
      setIsAuthenticated(true)
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: CONFETTI_COLORS })
      setTimeout(() => navigate('/rewind'), 600)
    } else {
      sfx.wrong()
      setError(true)
      gsap.to(cardRef.current, { x: [-12, 12, -8, 8, 0], duration: 0.4, ease: 'power2.out' })
      setTimeout(() => setError(false), 1500)
    }
  }

  return (
    <PageTransition>
      <div className="min-h-dvh flex items-center justify-center px-4 sm:px-6">
        <div ref={cardRef} className="w-full max-w-sm pixel-border bg-farm-800 p-5 sm:p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🗝️</div>
            <h2 className="text-sm font-pixel text-sdvgold-500 leading-relaxed">Ingresa el codigo secreto</h2>
            <p className="text-lg text-sdvcream-200/50 mt-2 font-body">Solo tu sabes la respuesta...</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Tu secreto..."
                className={`w-full bg-farm-900 border-2 ${error ? 'border-red-500' : 'border-sdvbrown-700'} px-4 py-3 pr-16 text-sdvcream-100 placeholder-sdvcream-200/30 focus:outline-none focus:border-sdvgold-500 transition-colors font-body text-xl`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sdvcream-200/50 hover:text-sdvgold-500 font-body text-lg transition-colors"
              >
                {showPw ? 'Ocultar' : 'Ver'}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-lg text-center font-body">Hmm, ese no es... intenta de nuevo</p>
            )}

            <button type="submit" className="sdv-button w-full py-3">
              Abrir
            </button>
          </form>

          <button
            onClick={() => { sfx.hint(); setHintIdx(i => (i + 1) % config.hints.length) }}
            className="w-full mt-4 text-sdvcream-200/50 hover:text-sdvgold-400 font-body text-lg transition-colors"
          >
            {hintIdx >= 0 ? 'Otra pista' : 'Necesito una pista'}
          </button>

          {hintIdx >= 0 && (
            <div className="mt-3 pixel-border bg-farm-700 p-3">
              <p className="text-center text-sdvcream-100/80 font-body text-lg italic">
                {config.hints[hintIdx]}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
