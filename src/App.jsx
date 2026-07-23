import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from './context/AppContext'
import Layout from './components/Layout'
import IntroPage from './pages/IntroPage'
import LoginPage from './pages/LoginPage'
import RewindPage from './pages/RewindPage'
import CardsPage from './pages/CardsPage'
import QuizPage from './pages/QuizPage'
import FinalPage from './pages/FinalPage'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useApp()
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/rewind" element={<ProtectedRoute><RewindPage /></ProtectedRoute>} />
        <Route path="/cartas" element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/final" element={<ProtectedRoute><FinalPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}
