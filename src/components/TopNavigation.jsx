import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  Sun, 
  Moon, 
  Globe,
  Menu,
  X,
  Clock,
  BarChart3,
  FileText,
  Zap
} from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import logo1 from '../assets/logo1.png';


const TopNavigation = forwardRef((props, ref) => {
  const { user, logout } = useAuth()
  const { language, toggleLanguage, t } = useLanguage()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  // Expose method to open notifications from external components
  useImperativeHandle(ref, () => ({
    openNotifications: () => {
      setShowNotifications(true)
    }
  }))

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const menuItems = [
    { path: '/dashboard', label: t('dashboard'), icon: BarChart3 },
    { path: '/decision-log', label: t('decisionLog'), icon: FileText },
    { path: '/kpi', label: t('kpiDashboard'), icon: BarChart3 },
    { path: '/simulation', label: t('simulation'), icon: Zap }
  ]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {/* Logo Section */}
              <div className="logo-container mr-4">
                <div className="logo-container mr-4">
                  <img src={logo1} alt="Logo" className="h-12 w-12 object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-30" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-railway-blue dark:text-blue-400">
                  MargDarshi
                </h1>
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {user?.section}
                </span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1 ml-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`nav-item flex items-center gap-2 ${
                      isActive 
                        ? 'bg-railway-blue text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Center Section - Live Clock */}
          <div className="hidden md:flex items-center space-x-2 live-clock">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <div className="text-center">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {formatDate(currentTime)}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle language"
            >
              <div className="flex items-center gap-1">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">{language.toUpperCase()}</span>
              </div>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative notification-bell"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
              </button>
              {showNotifications && (
                <NotificationDropdown onClose={() => setShowNotifications(false)} />
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="hidden md:block text-sm font-medium">
                  {user?.name}
                </span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      // Navigate to settings if implemented
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    {t('logout')}
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-2">
            <div className="flex flex-col space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path)
                      setShowMobileMenu(false)
                    }}
                    className={`nav-item flex items-center gap-2 ${
                      isActive 
                        ? 'bg-railway-blue text-white' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </div>
            
            {/* Mobile Clock */}
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-2 live-clock">
                <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {formatTime(currentTime)}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {formatDate(currentTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
})

TopNavigation.displayName = 'TopNavigation'

export default TopNavigation
