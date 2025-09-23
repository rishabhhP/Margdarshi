import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useLanguage } from '../contexts/LanguageContext'
import TopNavigation from '../components/TopNavigation'
import TrainList from '../components/TrainList'
import RailwayMap from '../components/RailwayMap'
import AIRecommendations from '../components/AIRecommendations'
import BlockOccupancy from '../components/BlockOccupancy'
import { mockRecommendations } from '../data/mockData'
import { getTrains, getBlocks, saveDecision } from '../services/database'

const Dashboard = () => {
  const { user } = useAuth()
  const { t } = useLanguage()
  const topNavRef = useRef()
  const [trains, setTrains] = useState([])
  const [recommendations, setRecommendations] = useState(mockRecommendations)
  const [blocks, setBlocks] = useState([])
  const [decisionLog, setDecisionLog] = useState([])
  const [loading, setLoading] = useState(true)

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load trains and blocks from database (with fallback to mock data)
        const [trainsData, blocksData] = await Promise.all([
          getTrains(),
          getBlocks()
        ])
        
        setTrains(trainsData)
        setBlocks(blocksData)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        // Data will fallback to mock data in the service functions
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Simulate real-time updates
  useEffect(() => {
    if (trains.length === 0) return

    const interval = setInterval(() => {
      setTrains(prevTrains => 
        prevTrains.map(train => ({
          ...train,
          currentSpeed: Math.max(0, train.currentSpeed + (Math.random() - 0.5) * 10),
          delay: Math.max(0, train.delay + (Math.random() - 0.5) * 2)
        }))
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [trains])

  const handleAcceptRecommendation = async (id, decision) => {
    console.log('Accepted recommendation:', id, decision)
    
    // Save to decision log
    try {
      const savedDecision = await saveDecision(decision)
      if (savedDecision) {
        setDecisionLog(prev => [savedDecision, ...prev])
      }
    } catch (error) {
      console.error('Error saving decision:', error)
    }
    
    // Update local decision log for immediate feedback
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...decision
    }
    setDecisionLog(prev => [logEntry, ...prev])
  }

  const handleOverrideRecommendation = async (id, reason, decision) => {
    console.log('Override recommendation:', id, 'Reason:', reason, decision)
    
    // Save to decision log
    try {
      const savedDecision = await saveDecision(decision)
      if (savedDecision) {
        setDecisionLog(prev => [savedDecision, ...prev])
      }
    } catch (error) {
      console.error('Error saving decision:', error)
    }
    
    // Update local decision log for immediate feedback
    const logEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...decision
    }
    setDecisionLog(prev => [logEntry, ...prev])
  }

  const handlePushNotification = (recommendationId) => {
    // Trigger the notification dropdown in the top navigation
    if (topNavRef.current && topNavRef.current.openNotifications) {
      topNavRef.current.openNotifications()
    }
    
    // Show a brief success message
    const successMessage = document.createElement('div')
    successMessage.className = 'fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce'
    successMessage.textContent = 'Opening notification panel...'
    document.body.appendChild(successMessage)
    
    setTimeout(() => {
      if (document.body.contains(successMessage)) {
        document.body.removeChild(successMessage)
      }
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TopNavigation ref={topNavRef} />
        <div className="pt-16 p-4 main-content">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation ref={topNavRef} />
      
      <div className="pt-16 p-4 main-content">
        {/* Main Dashboard - Three Panels with Fixed Height and Proper Spacing */}
        <div className="dashboard-main-container">
          {/* Left Panel - Train List */}
          <div className="dashboard-left-panel">
            <div className="card dashboard-panel">
              <div className="dashboard-panel-header">
                <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {t('liveTrains')}
                </h2>
              </div>
              <div className="dashboard-panel-content">
                <TrainList trains={trains} />
              </div>
            </div>
          </div>

          {/* Center Panel - Railway Map */}
          <div className="dashboard-center-panel">
            <div className="card dashboard-panel">
              <div className="dashboard-panel-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('railwayMap')}
                </h2>
              </div>
              <div className="dashboard-panel-content">
                <RailwayMap trains={trains} />
              </div>
            </div>
          </div>

          {/* Right Panel - AI Recommendations */}
          <div className="dashboard-right-panel">
            <div className="card dashboard-panel">
              <div className="dashboard-panel-header">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {t('aiRecommendations')}
                </h2>
              </div>
              <div className="dashboard-panel-content">
                <AIRecommendations 
                  recommendations={recommendations}
                  onAccept={handleAcceptRecommendation}
                  onOverride={handleOverrideRecommendation}
                  onPushNotification={handlePushNotification}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Block Occupancy Timeline - Completely Separate Section */}
        <div className="dashboard-block-section">
          <div className="card p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {t('blockOccupancy')} - {t('next60Minutes')}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {t('realTimeBlockOccupancy')}
              </p>
            </div>
            <div className="block-occupancy-wrapper">
              <BlockOccupancy blocks={blocks} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
