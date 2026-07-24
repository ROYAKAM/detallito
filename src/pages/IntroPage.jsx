import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { useApp } from '../context/AppContext'
import TypewriterText from '../components/TypewriterText'
import PageTransition from '../components/PageTransition'
import config, { CONFETTI_COLORS } from '../data/config'
import sfx from '../sfx'

function Countdown({ target }) {
  const [diff, setDiff] = useState(getTimeDiff(target))

  useEffect(() => {
    const id = setInterval(() => setDiff(getTimeDiff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  if (diff.passed) return null

  return (
    <div className="flex gap-2 sm:gap-3 justify-center text-center">
      {[
        ['dias', diff.days],
        ['hrs', diff.hours],
        ['min', diff.minutes],
        ['seg', diff.seconds],
      ].map(([label, val]) => (
        <div key={label} className="pixel-border bg-farm-800 px-2 sm:px-3 py-2 min-w-[55px] sm:min-w-[65px]">
          <div className="text-xl sm:text-3xl font-bold text-sdvgold-500 font-body">{String(val).padStart(2, '0')}</div>
          <div className="text-[10px] sm:text-xs text-sdvcream-200/80 uppercase tracking-wider font-body">{label}</div>
        </div>
      ))}
    </div>
  )
}

function getTimeDiff(target) {
  const ms = new Date(target) - new Date()
  if (ms <= 0) return { passed: true, days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    passed: false,
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms % 86400000) / 3600000),
    minutes: Math.floor((ms % 3600000) / 60000),
    seconds: Math.floor((ms % 60000) / 1000),
  }
}

export default function IntroPage() {
  const navigate = useNavigate()
  const { teAmoCount, setTeAmoCount } = useApp()
  const [showMessage, setShowMessage] = useState(false)
  const [isBirthday, setIsBirthday] = useState(false)

  useEffect(() => {
    const now = new Date()
    const target = new Date(config.fechaCumple)
    if (now >= target) {
      setIsBirthday(true)
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 }, colors: CONFETTI_COLORS })
    }
  }, [])

  const handleTeAmo = useCallback(() => {
    sfx.pop()
    const next = teAmoCount + 1
    setTeAmoCount(next)
    if (next % 50 === 0) {
      sfx.celebration()
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 }, colors: CONFETTI_COLORS })
    }
  }, [teAmoCount, setTeAmoCount])

  return (
    <PageTransition>
      <div className="min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center gap-6 sm:gap-8">
        {isBirthday && (
          <div className="text-2xl sm:text-3xl font-pixel text-sdvgold-500 animate-bounce">
            Feliz Cumple!
          </div>
        )}

        <h1 className="text-xl sm:text-2xl font-pixel text-sdvgold-400 leading-relaxed">
          <TypewriterText
            text={`Para ${config.nombre}`}
            speed={80}
            onComplete={() => setShowMessage(true)}
          />
        </h1>

        {showMessage && (
          <div className="max-w-md text-sdvcream-100 text-xl font-body leading-relaxed">
            <TypewriterText
              text="Prepare algo muy especial para ti. Toca el boton cuando estes lista para comenzar esta aventura..."
              speed={35}
            />
          </div>
        )}

        {!isBirthday && (
          <div className="mt-4">
            <p className="text-sm text-sdvcream-200 mb-3 font-body">Cuenta regresiva para tu dia</p>
            <Countdown target={config.fechaCumple} />
          </div>
        )}

        <button
          onClick={handleTeAmo}
          className="mt-2 pixel-border bg-farm-800 text-sdvgold-500 px-5 py-2 text-lg font-body hover:brightness-110 transition-all cursor-pointer"
        >
          Te amo x{teAmoCount}
        </button>

        <button
          onClick={() => { sfx.click(); navigate('/login') }}
          className="sdv-button mt-4 text-lg px-10 py-3"
          style={{ animation: 'gentle-pulse 2.5s infinite' }}
        >
          Iniciar Aventura
        </button>

        <p className="text-xs text-sdvcream-200/60 mt-8 font-body">
          Proyecto iniciado el {config.fechaInicio}
        </p>
      </div>
    </PageTransition>
  )
}
