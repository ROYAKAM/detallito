import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import PageTransition from '../components/PageTransition'
import DialogueBox from '../components/DialogueBox'
import { questions } from '../data/quiz'
import { cards } from '../data/cards'
import config, { CONFETTI_COLORS } from '../data/config'
import sfx from '../sfx'

// ponytail: hearts for score display, with stagger pop-in
function Hearts({ filled, total, animate = false }) {
  return (
    <span className="text-lg">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className="inline-block"
          style={animate ? { animation: 'pop-in 0.3s ease-out both', animationDelay: `${i * 0.1}s` } : {}}
        >
          {i < filled ? '❤️' : '🤍'}
        </span>
      ))}
    </span>
  )
}

export default function QuizPage() {
  const navigate = useNavigate()
  const { quizScore, setQuizScore, setUnlockedCards } = useApp()
  const [dialogueDone, setDialogueDone] = useState(false)
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [done, setDone] = useState(false)
  const optionsRef = useRef(null)

  useEffect(() => {
    if (quizScore !== null) { setDone(true); setDialogueDone(true) }
  }, [])

  const q = questions[qIdx]

  function handleSelect(idx) {
    if (selected !== null) return
    setSelected(idx)
    setShowFeedback(true)
    const correct = idx === q.correctIndex
    if (correct) {
      sfx.correct()
      setScore(s => s + 1)
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 }, colors: CONFETTI_COLORS })
      const el = optionsRef.current?.children[idx]
      if (el) el.style.animation = 'correct-pulse 0.4s ease-out'
    } else {
      sfx.wrong()
      const el = optionsRef.current?.children[idx]
      if (el) el.style.animation = 'shake 0.4s'
    }

    setTimeout(() => {
      if (qIdx < questions.length - 1) {
        setSelected(null)
        setShowFeedback(false)
        setQIdx(i => i + 1)
        if (optionsRef.current) {
          gsap.from(optionsRef.current.children, { x: 30, opacity: 0, stagger: 0.08, duration: 0.3 })
        }
      } else {
        finishQuiz(correct ? score + 1 : score)
      }
    }, 2000)
  }

  function finishQuiz(finalScore) {
    setQuizScore(finalScore)
    const unlocked = cards.filter(c => c.unlockAt === null || c.unlockAt <= finalScore).map(c => c.id)
    setUnlockedCards(unlocked)
    setDone(true)
    if (finalScore >= questions.length * 0.7) {
      sfx.celebration()
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: CONFETTI_COLORS })
    }
  }

  if (!dialogueDone) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center px-6">
          <DialogueBox lines={config.dialogues.quiz} speaker={config.senderName} onComplete={() => setDialogueDone(true)} />
        </div>
      </PageTransition>
    )
  }

  if (done) {
    const finalScore = quizScore ?? score
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-6">
          <div className="text-6xl mb-2" style={{ animation: 'pop-in 0.5s ease-out' }}>
            {finalScore >= questions.length * 0.7 ? '⭐' : '💜'}
          </div>
          <h2 className="text-sm font-pixel text-sdvgold-500">Quiz completado!</h2>
          <div className="pixel-border bg-farm-800 p-6">
            <Hearts filled={finalScore} total={questions.length} animate />
            <p className="text-sdvcream-200/50 mt-2 font-body text-lg">
              {finalScore} de {questions.length} correctas
            </p>
          </div>
          <p className="text-sdvcream-100/70 max-w-sm font-body text-xl">
            {finalScore >= questions.length * 0.7
              ? 'Me conoces muy bien! Desbloqueaste items secretos.'
              : 'Cada respuesta es un recuerdo nuestro.'}
          </p>
          <div className="flex gap-4">
            <button onClick={() => { sfx.click(); navigate('/cartas') }} className="sdv-button">
              Ver inventario
            </button>
            <button onClick={() => { sfx.click(); navigate('/final') }} className="sdv-button">
              Mensaje final
            </button>
          </div>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* Progress */}
        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between text-lg text-sdvcream-200/50 mb-2 font-body">
            <span>Pregunta {qIdx + 1} de {questions.length}</span>
            <span><Hearts filled={score} total={questions.length} /></span>
          </div>
          <div className="pixel-border bg-farm-800 p-1">
            <div className="h-3 bg-farm-900">
              <div
                className="h-full bg-sdvgreen-500 transition-all duration-500"
                style={{ width: `${((qIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Question */}
        <h2 className="text-xs sm:text-sm font-pixel text-sdvgold-400 text-center mb-8 max-w-md leading-relaxed">
          {q.question}
        </h2>

        {/* Options - game menu style */}
        <div ref={optionsRef} className="w-full max-w-md space-y-3">
          {q.options.map((opt, i) => {
            let style = 'pixel-border bg-farm-800 hover:bg-farm-700 border-sdvbrown-700'
            if (showFeedback) {
              if (i === q.correctIndex) style = 'pixel-border bg-sdvgreen-700/50 border-sdvgreen-500'
              else if (i === selected && i !== q.correctIndex) style = 'pixel-border bg-red-900/50 border-red-500'
            }
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={selected !== null}
                className={`w-full text-left px-5 py-3 text-sdvcream-100 font-body text-xl transition-all ${style} ${selected === null ? 'active:scale-[0.98] group' : ''}`}
              >
                <span className="text-sdvgold-500 mr-2 opacity-0 group-hover:opacity-100 transition-opacity">▶</span>
                {opt}
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className="mt-6 pixel-border bg-farm-700 p-3 max-w-md">
            <p className="text-sdvcream-100/80 text-center font-body text-lg italic">
              {q.explanation}
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
