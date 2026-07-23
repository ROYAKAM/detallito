import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import DialogueBox from '../components/DialogueBox'
import { cards } from '../data/cards'
import config from '../data/config'

const CONFETTI_COLORS = ['#FFD921', '#4CAF50', '#A67C52', '#59C9F1']
const RARITY_BORDER = { common: 'border-sdvcream-200/40', rare: 'border-sdvpurple-400', legendary: 'border-sdvgold-500' }
const RARITY_GLOW = { common: 'none', rare: 'glow 3s infinite', legendary: 'glow 2s infinite' }

export default function CardsPage() {
  const navigate = useNavigate()
  const { unlockedCards, quizScore } = useApp()
  const [dialogueDone, setDialogueDone] = useState(false)
  const [flipped, setFlipped] = useState(new Set())
  const gridRef = useRef(null)

  const isUnlocked = (card) => card.unlockAt === null || unlockedCards.includes(card.id)
  const unlockedCount = cards.filter(isUnlocked).length

  useEffect(() => {
    if (gridRef.current && dialogueDone) {
      gsap.from(gridRef.current.children, { y: 40, opacity: 0, stagger: 0.1, duration: 0.4, ease: 'power2.out' })
    }
  }, [dialogueDone])

  function handleFlip(card) {
    if (!isUnlocked(card)) return
    setFlipped(prev => {
      const next = new Set(prev)
      if (next.has(card.id)) next.delete(card.id)
      else {
        next.add(card.id)
        confetti({ particleCount: 20, spread: 40, origin: { y: 0.7 }, colors: CONFETTI_COLORS })
      }
      return next
    })
  }

  if (!dialogueDone) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6">
          <DialogueBox lines={config.dialogues.cards} speaker={config.senderName} onComplete={() => setDialogueDone(true)} />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen px-4 py-12 sm:px-8">
        <div className="text-center mb-8">
          <h2 className="text-sm sm:text-base font-pixel text-sdvgold-500">Inventario</h2>
          <p className="text-sdvcream-200/50 mt-2 font-body text-xl">{unlockedCount} de {cards.length} items encontrados</p>
          {quizScore === null && (
            <button
              onClick={() => navigate('/quiz')}
              className="mt-3 text-lg text-sdvgold-400 hover:text-sdvgold-300 underline transition-colors font-body"
            >
              Completa el quiz para desbloquear mas
            </button>
          )}
        </div>

        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-md mx-auto">
          {cards.map(card => {
            const unlocked = isUnlocked(card)
            const isFlipped = flipped.has(card.id)
            const rarityBorder = unlocked ? RARITY_BORDER[card.rarity] : 'border-farm-600'

            return (
              <div key={card.id} onClick={() => handleFlip(card)} className="cursor-pointer" style={{ perspective: '800px' }}>
                <div
                  className="relative w-full aspect-square transition-transform duration-500"
                  style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)' }}
                >
                  {/* Front - Inventory slot */}
                  <div
                    className={`absolute inset-0 bg-[#2a3a5c] border-4 ${rarityBorder} flex flex-col items-center justify-center gap-2`}
                    style={{ backfaceVisibility: 'hidden', animation: unlocked ? RARITY_GLOW[card.rarity] : 'none' }}
                  >
                    <span className="text-4xl">{unlocked ? card.emoji : '❓'}</span>
                    <p className="text-xs font-body text-sdvcream-100/70 px-2 text-center">
                      {unlocked ? card.itemName : 'Bloqueado'}
                    </p>
                  </div>

                  {/* Back - Message */}
                  <div
                    className="absolute inset-0 sdv-dialogue-box p-3 flex flex-col justify-center items-center text-center"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                  >
                    <p className="text-xs font-pixel text-farm-900 mb-1">{card.title}</p>
                    <p className="text-farm-900/80 text-sm font-body leading-relaxed">{card.backText}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => navigate(quizScore === null ? '/quiz' : '/final')}
            className="sdv-button"
          >
            {quizScore === null ? 'Ir al quiz' : 'Ver mensaje final'}
          </button>
        </div>
      </div>
    </PageTransition>
  )
}
