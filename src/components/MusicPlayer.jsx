import { useRef, useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

// ponytail: minimal player, just a button + audio element
export default function MusicPlayer() {
  const audioRef = useRef(null)
  const { musicPlaying, setMusicPlaying, isAuthenticated } = useApp()
  const [hasAudio, setHasAudio] = useState(false)

  useEffect(() => {
    // Check if audio file exists
    fetch('/music/song.mp3', { method: 'HEAD' })
      .then(r => { if (r.ok) setHasAudio(true) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!audioRef.current || !hasAudio) return
    if (musicPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [musicPlaying, hasAudio])

  // Auto-play when authenticated
  useEffect(() => {
    if (isAuthenticated && hasAudio && !musicPlaying) {
      setMusicPlaying(true)
    }
  }, [isAuthenticated, hasAudio])

  if (!hasAudio) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src="/music/song.mp3" loop />
      <button
        onClick={() => setMusicPlaying(!musicPlaying)}
        className="w-10 h-10 pixel-border bg-sdvbrown-700 text-sdvgold-500 flex items-center justify-center hover:brightness-110 transition-all"
        style={{ animation: musicPlaying ? 'gentle-pulse 2s infinite' : 'none' }}
      >
        {musicPlaying ? '♫' : '♪'}
      </button>
    </div>
  )
}
