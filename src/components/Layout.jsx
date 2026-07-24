import FloatingHearts from './FloatingHearts'
import MusicPlayer from './MusicPlayer'

export default function Layout({ children }) {
  return (
    <div className="relative min-h-dvh">
      <FloatingHearts />
      <main className="relative z-10">
        {children}
      </main>
      <MusicPlayer />
    </div>
  )
}
