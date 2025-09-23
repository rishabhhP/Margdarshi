import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { initializeDatabase } from './services/database'
import ErrorBoundary from './components/ErrorBoundary'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import DecisionLog from './pages/DecisionLog'
import KPIDashboard from './pages/KPIDashboard'
import Simulation from './pages/Simulation'
import './App.css'

function AppRoutes() {
  const { user } = useAuth()

  if (!user) {
    return <LoginPage />
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/decision-log" element={<DecisionLog />} />
      <Route path="/kpi" element={<KPIDashboard />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

function AppContent() {
  const [dbInitialized, setDbInitialized] = useState(false)

  useEffect(() => {
    // Initialize database on app start
    const initDB = async () => {
      try {
        const result = await initializeDatabase()
        if (result.success) {
          console.log('Database initialized successfully')
        } else {
          console.error('Database initialization failed:', result.error)
        }
      } catch (error) {
        console.error('Database initialization error:', error)
      } finally {
        setDbInitialized(true)
      }
    }

    initDB()
  }, [])

  if (!dbInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Initializing MargDarshi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AppRoutes />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
