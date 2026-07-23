import { useState, useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import TypewriterText from '../components/TypewriterText'
import EnvelopeReveal from '../components/EnvelopeReveal'
import DialogueBox from '../components/DialogueBox'
import config from '../data/config'
import { questions } from '../data/quiz'
import { cards } from '../data/cards'

const CONFETTI_COLORS = ['#FFD921', '#4CAF50', '#A67C52', '#59C9F1']

// ponytail: replace this letter with the real one before the big day
const LOVE_LETTER = `${config.nombre},

Hoy quiero que sepas lo increiblemente importante que eres para mi. Cada momento a tu lado ha sido un regalo que no merezco pero que agradezco con todo mi corazon.

Desde el dia que te conoci, mi vida cambio para siempre. Tu sonrisa ilumina hasta mis dias mas oscuros, y tu amor me da fuerza para seguir adelante.

Gracias por ser mi mejor amiga, mi confidente, mi todo. Gracias por cada risa, cada abrazo, cada momento que hemos compartido.

Este dia es especial porque tu existes. Porque el mundo es mejor contigo en el. Porque yo soy mejor gracias a ti.

Feliz cumpleanos, mi amor. Espero que este pequeno detalle te haga sonreir tanto como tu me haces sonreir cada dia.

Te amo infinitamente.`

export default function FinalPage() {
  const { quizScore, unlockedCards } = useApp()
  const [dialogueDone, setDialogueDone] = useState(false)
  const [showLetter, setShowLetter] = useState(false)
  const [letterDone, setLetterDone] = useState(false)
  const confettiRef = useRef(null)

  useEffect(() => {
    if (!showLetter) return
    confettiRef.current = setInterval(() => {
      confetti({
        particleCount: 8,
        spread: 60,
        startVelocity: 15,
        gravity: 0.4,
        origin: { x: Math.random(), y: 0 },
        colors: CONFETTI_COLORS,
      })
    }, 800)
    return () => clearInterval(confettiRef.current)
  }, [showLetter])

  if (!dialogueDone) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6">
          <DialogueBox lines={config.dialogues.final} speaker={config.senderName} onComplete={() => setDialogueDone(true)} />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
        {!showLetter ? (
          <div className="space-y-8">
            <h2 className="text-sm font-pixel text-sdvgold-500">
              Tengo algo para ti...
            </h2>
            <EnvelopeReveal onOpen={() => {
              setShowLetter(true)
              confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 }, colors: CONFETTI_COLORS })
            }} />
          </div>
        ) : (
          <div className="max-w-lg w-full space-y-10">
            {/* Letter */}
            <div className="pixel-border bg-sdvcream-100 p-6 sm:p-8 text-left" style={{ boxShadow: 'inset 0 0 20px rgba(107, 55, 16, 0.1)' }}>
              <div className="text-farm-900/80 leading-relaxed whitespace-pre-line font-body text-xl">
                <TypewriterText
                  text={LOVE_LETTER}
                  speed={25}
                  onComplete={() => setLetterDone(true)}
                />
              </div>
            </div>

            {letterDone && (
              <div className="space-y-6">
                {quizScore !== null && (
                  <div className="flex justify-center gap-6">
                    <div className="pixel-border bg-farm-800 px-5 py-3">
                      <p className="text-2xl font-bold text-sdvgold-500 font-body">{quizScore}/{questions.length}</p>
                      <p className="text-xs text-sdvcream-200/50 font-body">Quiz score</p>
                    </div>
                    <div className="pixel-border bg-farm-800 px-5 py-3">
                      <p className="text-2xl font-bold text-sdvgold-500 font-body">{unlockedCards.length}/{cards.length}</p>
                      <p className="text-xs text-sdvcream-200/50 font-body">Items</p>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3
                    className="text-xl sm:text-2xl font-pixel text-transparent bg-clip-text bg-gradient-to-r from-sdvgold-500 via-sdvgreen-500 to-sdvgold-500"
                    style={{ backgroundSize: '200% auto', animation: 'gradient-shift 3s linear infinite' }}
                  >
                    Te amo, {config.nombre}
                  </h3>
                </div>

                <button
                  onClick={() => window.location.href = '/'}
                  className="sdv-button mt-6"
                >
                  Volver al inicio
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
