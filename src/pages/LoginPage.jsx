import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { Sun, Moon, Globe } from 'lucide-react'

const LoginPage = () => {
  const { login } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const [formData, setFormData] = useState({
    section: '',
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const sections = [
    'Delhi Division',
    'Mumbai Division', 
    'Chennai Division',
    'Kolkata Division',
    'Bangalore Division',
    'Hyderabad Division'
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.section || !formData.username || !formData.password) {
      setError(t('allFieldsRequired'))
      setLoading(false)
      return
    }

    const result = await login(formData)
    if (!result.success) {
      setError(result.error)
    }
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Theme and Language Toggle */}
        <div className="flex justify-end gap-2 mb-6">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
            aria-label={t('toggleTheme')}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow flex items-center gap-1"
            aria-label={t('toggleLanguage')}
          >
            <Globe className="w-5 h-5" />
            <span className="text-sm font-medium">{language.toUpperCase()}</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          {/* Logo and App Title */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.69 2 6 4.69 6 8v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-3.31-2.69-6-6-6zm-2 15c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm4 0c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-7H8V8c0-2.21 1.79-4 4-4s4 1.79 4 4v2z"/>
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-railway-blue dark:text-blue-400 mb-2">
              MargDarshi
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('indianRailwaysTrafficManagementSystem')}
            </p>
          </div>

          {/* Government Branding */}
          <div className="government-branding mb-8">
            <div className="logo-container">
              <div className="logo-placeholder">
                IRCTC
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{t('irctc')}</span>
            </div>
            <div className="logo-container">
              <div className="logo-placeholder">
                IR
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{t('indianRailways')}</span>
            </div>
            <div className="logo-container">
              <div className="logo-placeholder">
                GOI
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">{t('govtOfIndia')}</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('section')}
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">{t('selectSection')}</option>
                {sections.map(section => (
                  <option key={section} value={section}>{section}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('username')}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enterUsername')}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder={t('enterPassword')}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('poweredBy')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
