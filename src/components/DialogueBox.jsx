import { useState, useEffect, useRef } from 'react'

// ponytail: pixel art character portrait as inline SVG
function PixelPortrait() {
  return (
    <svg viewBox="0 0 32 32" className="w-16 h-16" style={{ imageRendering: 'pixelated' }}>
      {/* Hair */}
      <rect x="10" y="3" width="12" height="3" fill="#4a2800" />
      <rect x="8" y="5" width="16" height="2" fill="#4a2800" />
      <rect x="7" y="7" width="4" height="4" fill="#4a2800" />
      <rect x="21" y="7" width="4" height="4" fill="#4a2800" />
      {/* Face */}
      <rect x="11" y="7" width="10" height="10" fill="#f5c99a" />
      <rect x="9" y="9" width="2" height="6" fill="#f5c99a" />
      <rect x="21" y="9" width="2" height="6" fill="#f5c99a" />
      {/* Eyes */}
      <rect x="13" y="10" width="2" height="2" fill="#2d1b00" />
      <rect x="18" y="10" width="2" height="2" fill="#2d1b00" />
      {/* Mouth */}
      <rect x="14" y="14" width="4" height="1" fill="#d4845a" />
      {/* Shirt */}
      <rect x="10" y="17" width="12" height="6" fill="#e91e63" />
      <rect x="8" y="19" width="2" height="4" fill="#e91e63" />
      <rect x="22" y="19" width="2" height="4" fill="#e91e63" />
      <rect x="14" y="18" width="4" height="1" fill="#ffeb3b" />
      {/* Pants */}
      <rect x="11" y="23" width="4" height="4" fill="#1a237e" />
      <rect x="17" y="23" width="4" height="4" fill="#1a237e" />
      {/* Shoes */}
      <rect x="10" y="27" width="5" height="2" fill="#4a2800" />
      <rect x="17" y="27" width="5" height="2" fill="#4a2800" />
    </svg>
  )
}

export default function DialogueBox({ lines, speaker = 'ROYAKAM', onComplete, speed = 30 }) {
  const [lineIdx, setLineIdx] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const timerRef = useRef(null)

  const line = lines[lineIdx] || ''
  const isRevealed = charCount >= line.length
  const isLast = lineIdx >= lines.length - 1

  // Typing effect
  useEffect(() => {
    setCharCount(0)
    timerRef.current = setInterval(() => {
      setCharCount(c => c + 1)
    }, speed)
    return () => clearInterval(timerRef.current)
  }, [lineIdx, speed])

  // Stop timer when line is fully revealed
  useEffect(() => {
    if (isRevealed) clearInterval(timerRef.current)
  }, [isRevealed])

  function handleClick() {
    if (!isRevealed) {
      // Skip to end of line
      clearInterval(timerRef.current)
      setCharCount(line.length)
    } else if (isLast) {
      onComplete?.()
    } else {
      setLineIdx(i => i + 1)
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      {/* Speaker name tag */}
      <div className="inline-block px-3 py-1 bg-sdvbrown-700 border-2 border-sdvbrown-800 mb-[-2px] ml-4 relative z-10">
        <span className="font-pixel text-sdvgold-500 text-[10px]">{speaker}</span>
      </div>

      {/* Dialogue box */}
      <div className="sdv-dialogue-box p-4 cursor-pointer select-none" onClick={handleClick}>
        <div className="flex gap-4 items-start">
          {/* Portrait */}
          <div className="flex-shrink-0 pixel-border bg-farm-800 p-1">
            <PixelPortrait />
          </div>

          {/* Text area */}
          <div className="flex-1 min-h-[60px] flex flex-col justify-between">
            <p className="font-body text-xl text-farm-900 leading-relaxed">
              {line.slice(0, charCount)}
              {!isRevealed && (
                <span
                  className="inline-block w-0.5 h-[1em] ml-0.5 align-text-bottom"
                  style={{ animation: 'blink-cursor 0.5s infinite', borderRight: '2px solid #1a1a10' }}
                />
              )}
            </p>

            {isRevealed && (
              <div className="text-right mt-2">
                <span
                  className="inline-block text-farm-900/50 font-body text-lg"
                  style={{ animation: 'bounce-indicator 0.8s infinite' }}
                >
                  {isLast ? 'Click para continuar' : '...'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
