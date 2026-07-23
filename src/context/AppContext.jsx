import { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext()

const STORAGE_KEY = 'detallito-progress'

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

export function AppProvider({ children }) {
  const saved = loadState()

  const [isAuthenticated, setIsAuthenticated] = useState(saved?.isAuthenticated ?? false)
  const [quizScore, setQuizScore] = useState(saved?.quizScore ?? null)
  const [unlockedCards, setUnlockedCards] = useState(saved?.unlockedCards ?? [])
  const [teAmoCount, setTeAmoCount] = useState(saved?.teAmoCount ?? 0)
  const [musicPlaying, setMusicPlaying] = useState(false)

  // ponytail: sync to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      isAuthenticated, quizScore, unlockedCards, teAmoCount
    }))
  }, [isAuthenticated, quizScore, unlockedCards, teAmoCount])

  return (
    <AppContext.Provider value={{
      isAuthenticated, setIsAuthenticated,
      quizScore, setQuizScore,
      unlockedCards, setUnlockedCards,
      teAmoCount, setTeAmoCount,
      musicPlaying, setMusicPlaying,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
