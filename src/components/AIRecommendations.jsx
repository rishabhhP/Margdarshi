import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { CheckCircle, RotateCcw, XCircle, AlertTriangle, Clock, TrendingUp, Bell } from 'lucide-react'

const AIRecommendations = ({ recommendations, onAccept, onOverride, onPushNotification }) => {
  const { t } = useLanguage()
  const [overrideReason, setOverrideReason] = useState('')
  const [showOverrideModal, setShowOverrideModal] = useState(null)
  const [recommendationStates, setRecommendationStates] = useState(new Map())
  const [showNotificationButtons, setShowNotificationButtons] = useState(new Set())
  const [rethinkInput, setRethinkInput] = useState('')
  const [showRethinkModal, setShowRethinkModal] = useState(null)
  const [scenarioInput, setScenarioInput] = useState('')

  const handleAccept = (id) => {
    // Update recommendation state
    setRecommendationStates(prev => new Map(prev.set(id, { status: 'accepted', timestamp: new Date() })))
    setShowNotificationButtons(prev => new Set([...prev, id]))
    
    // Log decision
    const decision = {
      trainId: recommendations.find(r => r.id === id)?.trainId,
      planSummary: recommendations.find(r => r.id === id)?.description,
      action: 'Accept',
      reason: '',
      delayReduction: recommendations.find(r => r.id === id)?.metrics?.delayReduction || 0,
      throughputGain: recommendations.find(r => r.id === id)?.metrics?.throughputGain || 0,
      confidence: recommendations.find(r => r.id === id)?.confidence || 0
    }
    
    // Call parent handler
    onAccept(id, decision)
    
    // Show success message
    showSuccessMessage(t('recommendationAcceptedSuccessfully'))
  }

  const handleRethink = (id) => {
    setShowRethinkModal(id)
  }

  const submitRethink = (id) => {
    if (!rethinkInput.trim()) {
      alert('Please provide input for betterment')
      return
    }

    // Update recommendation state to show processing
    setRecommendationStates(prev => new Map(prev.set(id, { 
      status: 'processing', 
      timestamp: new Date(),
      message: 'Processing section controller input...',
      input: rethinkInput,
      scenario: scenarioInput
    })))
    
    // Log decision - CHANGED: Now properly calling onOverride to save to decision log
    const decision = {
      trainId: recommendations.find(r => r.id === id)?.trainId,
      planSummary: recommendations.find(r => r.id === id)?.description,
      action: 'Rethink',
      reason: `Section controller input: ${rethinkInput}${scenarioInput ? ` | Scenario: ${scenarioInput}` : ''}`,
      delayReduction: 0,
      throughputGain: 0,
      confidence: recommendations.find(r => r.id === id)?.confidence || 0
    }
    
    // Call parent handler to save decision
    onOverride(id, `Section controller input: ${rethinkInput}${scenarioInput ? ` | Scenario: ${scenarioInput}` : ''}`, decision)
    
    // Close modal and reset
    setShowRethinkModal(null)
    setRethinkInput('')
    setScenarioInput('')
    
    // Simulate AI processing and generate new suggestion
    setTimeout(() => {
      const newSuggestion = generateRevisedSuggestion(id, rethinkInput, scenarioInput)
      setRecommendationStates(prev => new Map(prev.set(id, { 
        status: 'revised', 
        timestamp: new Date(),
        newSuggestion: newSuggestion,
        message: 'AI has generated an improved suggestion based on your input:',
        originalInput: rethinkInput,
        originalScenario: scenarioInput
      })))
    }, 3000) // 3 second processing time
    
    showSuccessMessage('Input sent to AI optimizer!')
  }

  const handleAcceptRevised = (id) => {
    // CHANGED: Added decision logging for revised recommendation acceptance
    const decision = {
      trainId: recommendations.find(r => r.id === id)?.trainId,
      planSummary: `Revised: ${recommendationStates.get(id)?.newSuggestion || 'AI-improved recommendation'}`,
      action: 'Accept',
      reason: `Accepted revised recommendation based on input: ${recommendationStates.get(id)?.originalInput}`,
      delayReduction: recommendations.find(r => r.id === id)?.metrics?.delayReduction || 0,
      throughputGain: recommendations.find(r => r.id === id)?.metrics?.throughputGain || 0,
      confidence: recommendations.find(r => r.id === id)?.confidence || 0
    }
    
    // Call parent handler to save decision
    onAccept(id, decision)
    
    // Remove the recommendation from dashboard after accepting revised suggestion
    setRecommendationStates(prev => new Map(prev.set(id, { 
      status: 'removed', 
      timestamp: new Date(),
      reason: 'Revised recommendation accepted and notification sent'
    })))
    
    // Show push notification button briefly then remove
    setShowNotificationButtons(prev => new Set([...prev, id]))
    
    // Auto-trigger push notification after brief delay
    setTimeout(() => {
      handlePushNotification(id)
      // Remove from dashboard completely
      setRecommendationStates(prev => new Map(prev.set(id, { status: 'removed' })))
    }, 1000)
    
    showSuccessMessage('Revised recommendation accepted! Notification sent.')
  }

  const handleOverride = (id) => {
    if (!overrideReason.trim()) {
      alert(t('pleaseProvideReason'))
      return
    }

    // Remove the recommendation completely
    setRecommendationStates(prev => new Map(prev.set(id, { 
      status: 'removed', 
      timestamp: new Date(),
      reason: overrideReason 
    })))
    
    // Log decision
    const decision = {
      trainId: recommendations.find(r => r.id === id)?.trainId,
      planSummary: recommendations.find(r => r.id === id)?.description,
      action: 'Override',
      reason: overrideReason,
      delayReduction: 0,
      throughputGain: 0,
      confidence: recommendations.find(r => r.id === id)?.confidence || 0
    }
    
    // Call parent handler
    onOverride(id, overrideReason, decision)
    
    // Close modal and reset
    setShowOverrideModal(null)
    setOverrideReason('')
    
    showSuccessMessage('Recommendation overridden and removed!')
  }

  const handlePushNotification = (id) => {
    // CHANGED: Added decision logging for push notification action
    const decision = {
      trainId: recommendations.find(r => r.id === id)?.trainId,
      planSummary: 'Push notification sent to relevant personnel',
      action: 'Notify',
      reason: 'Notification sent after recommendation acceptance',
      delayReduction: 0,
      throughputGain: 0,
      confidence: 100
    }
    
    // Call parent handler to save notification decision
    onAccept(id, decision)
    
    // Call the parent component's push notification handler
    if (onPushNotification) {
      onPushNotification(id)
    }
    
    // After push notification, remove the recommendation from dashboard
    setTimeout(() => {
      setRecommendationStates(prev => new Map(prev.set(id, { status: 'removed' })))
    }, 2000)
  }

  const generateRevisedSuggestion = (id, input, scenario) => {
    // Generate contextual suggestions based on input and scenario
    const inputLower = input.toLowerCase()
    const scenarioLower = scenario ? scenario.toLowerCase() : ''
    
    // If scenario is provided, prioritize scenario-based suggestions
    if (scenarioLower.includes('emergency') || scenarioLower.includes('medical')) {
      return 'Emergency protocol: Immediate priority clearance with medical assistance coordination. All conflicting trains held, emergency services notified at destination station.'
    } else if (scenarioLower.includes('weather') || scenarioLower.includes('fog') || scenarioLower.includes('rain')) {
      return 'Weather-adapted strategy: Reduced speed limits (60 km/h), increased following distance, enhanced signal visibility protocols, and passenger safety announcements.'
    } else if (scenarioLower.includes('vip') || scenarioLower.includes('special')) {
      return 'VIP protocol: Priority corridor established, security coordination activated, platform clearance ensured, and backup route prepared for contingency.'
    } else if (scenarioLower.includes('maintenance') || scenarioLower.includes('repair')) {
      return 'Maintenance coordination: Work window optimized, alternate routing via parallel tracks, minimal passenger impact with coordinated announcements.'
    } else if (inputLower.includes('delay') || inputLower.includes('time')) {
      return 'Optimized timing: Hold train for 2 minutes instead of 3, with coordinated signal clearance to minimize passenger impact while maintaining network efficiency.'
    } else if (inputLower.includes('route') || inputLower.includes('track')) {
      return 'Enhanced routing: Use parallel track with dynamic switching at Junction B12, reducing delay by additional 3 minutes and improving passenger comfort.'
    } else if (inputLower.includes('speed') || inputLower.includes('slow')) {
      return 'Speed optimization: Implement gradual deceleration over 8km instead of sudden braking, maintaining 85km/h average while ensuring safety protocols.'
    } else if (inputLower.includes('passenger') || inputLower.includes('comfort')) {
      return 'Passenger-centric approach: Coordinate with station announcements and provide real-time updates, while optimizing platform allocation for seamless transfers.'
    } else {
      return 'Improved strategy: Enhanced coordination with adjacent control centers, implementing predictive conflict resolution with 15% better efficiency than original plan.'
    }
  }

  const showSuccessMessage = (message) => {
    const successDiv = document.createElement('div')
    successDiv.className = 'success-message'
    successDiv.textContent = message
    document.body.appendChild(successDiv)
    
    setTimeout(() => {
      if (document.body.contains(successDiv)) {
        document.body.removeChild(successDiv)
      }
    }, 3000)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'text-green-600 dark:text-green-400'
    if (confidence >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'high':
        return <TrendingUp className="w-3 h-3 text-green-500 flex-shrink-0" />
      case 'medium':
        return <Clock className="w-3 h-3 text-yellow-500 flex-shrink-0" />
      case 'low':
        return <AlertTriangle className="w-3 h-3 text-orange-500 flex-shrink-0" />
      default:
        return <AlertTriangle className="w-3 h-3 text-gray-500 flex-shrink-0" />
    }
  }

  const getRecommendationCardClass = (id) => {
    const state = recommendationStates.get(id)
    if (!state) return 'bg-white dark:bg-gray-800'
    
    switch (state.status) {
      case 'accepted':
        return 'recommendation-status-accepted'
      case 'processing':
        return 'recommendation-status-rethinking animate-pulse-glow'
      case 'revised':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
      case 'removed':
        return 'hidden' // Hide the card completely
      default:
        return 'bg-white dark:bg-gray-800'
    }
  }

  return (
    <div className="p-3">
      <div className="space-y-3">
        {recommendations.map((rec) => {
          const state = recommendationStates.get(rec.id)
          const isProcessed = state && ['accepted', 'removed'].includes(state.status)
          const isRemoved = state && state.status === 'removed'
          
          // Don't render removed recommendations
          if (isRemoved) return null
          
          return (
            <div 
              key={rec.id} 
              className={`rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 border-l-4 border-l-railway-orange p-3 transition-all duration-300 hover:shadow-md ${getRecommendationCardClass(rec.id)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1 min-w-0">
                  {getImpactIcon(rec.impact)}
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate">
                    {t('trainId')} {rec.trainId}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className={`text-xs font-bold ${getConfidenceColor(rec.confidence)}`}>
                    {rec.confidence}%
                  </span>
                </div>
              </div>

              {/* Processing message */}
              {state?.status === 'processing' && (
                <div className="processing-message">
                  <div className="spinner"></div>
                  <span>{state.message}</span>
                </div>
              )}

              {/* Show revised suggestion if available */}
              {state?.status === 'revised' && state.newSuggestion && (
                <div className="mb-2 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-l-4 border-blue-500">
                  <p className="text-xs font-medium text-blue-800 dark:text-blue-200 mb-2">
                    🤖 {state.message}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {state.newSuggestion}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 italic">
                    Based on your input: "{state.originalInput}"
                    {state.originalScenario && (
                      <span> | Scenario: "{state.originalScenario}"</span>
                    )}
                  </p>
                  
                  {/* Accept revised suggestion button */}
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleAcceptRevised(rec.id)}
                      className="btn-accept flex-1"
                    >
                      <CheckCircle className="w-3 h-3" />
                      Accept Improved
                    </button>
                  </div>
                </div>
              )}

              <p className="text-gray-900 dark:text-gray-100 mb-2 text-xs leading-relaxed">
                {rec.description}
              </p>

              {/* Status indicator */}
              {state && state.status !== 'processing' && state.status !== 'revised' && (
                <div className="mb-2 text-xs">
                  {state.status === 'accepted' && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ✅ {t('accepted')} - {state.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}

              <div className="grid grid-cols-3 gap-1 mb-3 text-xs">
                <div className="text-center p-1 bg-green-50 dark:bg-green-900/20 rounded">
                  <div className="font-semibold text-green-700 dark:text-green-400 text-xs">
                    +{rec.metrics.throughputGain}
                  </div>
                  <div className="text-green-600 dark:text-green-500 text-xs">{t('trainsPerHour')}</div>
                </div>
                <div className="text-center p-1 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <div className="font-semibold text-blue-700 dark:text-blue-400 text-xs">
                    -{rec.metrics.delayReduction}
                  </div>
                  <div className="text-blue-600 dark:text-blue-500 text-xs">{t('min')}</div>
                </div>
                <div className="text-center p-1 bg-purple-50 dark:bg-purple-900/20 rounded">
                  <div className="font-semibold text-purple-700 dark:text-purple-400 text-xs">
                    {rec.metrics.efficiency}%
                  </div>
                  <div className="text-purple-600 dark:text-purple-500 text-xs">{t('efficiency')}</div>
                </div>
              </div>

              {/* Action Buttons - HORIZONTAL LAYOUT - Only show for original recommendations */}
              {!isProcessed && state?.status !== 'processing' && state?.status !== 'revised' && (
                <div className="ai-action-buttons">
                  <button
                    onClick={() => handleAccept(rec.id)}
                    className="btn-accept"
                  >
                    <CheckCircle className="w-3 h-3" />
                    {t('accept')}
                  </button>
                  <button
                    onClick={() => handleRethink(rec.id)}
                    className="btn-rethink"
                  >
                    <RotateCcw className="w-3 h-3" />
                    {t('rethink')}
                  </button>
                  <button
                    onClick={() => setShowOverrideModal(rec.id)}
                    className="btn-override"
                  >
                    <XCircle className="w-3 h-3" />
                    Override
                  </button>
                </div>
              )}

              {/* Show notification button for accepted recommendations */}
              {state?.status === 'accepted' && showNotificationButtons.has(rec.id) && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handlePushNotification(rec.id)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 animate-fadeIn"
                  >
                    <Bell className="w-4 h-4 animate-pulse" />
                    {t('notifications')}
                  </button>
                </div>
              )}

              {/* Alternative Plans */}
              {rec.alternatives && rec.alternatives.length > 0 && !isProcessed && state?.status !== 'processing' && state?.status !== 'revised' && (
                <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {t('alternatives')}:
                  </p>
                  <div className="space-y-1">
                    {rec.alternatives.slice(0, 2).map((alt, index) => (
                      <div key={index} className="text-xs text-gray-700 dark:text-gray-300 p-1 bg-gray-50 dark:bg-gray-700 rounded">
                        {alt.length > 60 ? `${alt.substring(0, 60)}...` : alt}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {recommendations.filter(rec => {
          const state = recommendationStates.get(rec.id)
          return !state || state.status !== 'removed'
        }).length === 0 && (
          <div className="text-center py-6">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t('noRecommendations')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {t('allSystemsOptimal')}
            </p>
          </div>
        )}
      </div>

      {/* Rethink Modal */}
      {showRethinkModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                🤔 Rethink Recommendation
              </h3>
              <p className="modal-description">
                Please provide your input on how this recommendation can be improved. Optionally, describe a specific scenario to consider.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Input for Betterment (Required)
                </label>
                <textarea
                  value={rethinkInput}
                  onChange={(e) => setRethinkInput(e.target.value)}
                  className="modal-textarea"
                  placeholder="e.g., Consider passenger comfort, reduce delay time, use alternate route, coordinate with adjacent stations..."
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Scenario (Optional)
                </label>
                <textarea
                  value={scenarioInput}
                  onChange={(e) => setScenarioInput(e.target.value)}
                  className="modal-textarea h-20"
                  placeholder="e.g., Emergency medical situation, VIP train priority, weather conditions, maintenance work, peak hour traffic..."
                />
              </div>
            </div>
            
            <div className="modal-actions">
              <button
                onClick={() => submitRethink(showRethinkModal)}
                className="btn-modal-primary bg-orange-600 hover:bg-orange-700"
              >
                Submit for AI Analysis
              </button>
              <button
                onClick={() => {
                  setShowRethinkModal(null)
                  setRethinkInput('')
                  setScenarioInput('')
                }}
                className="btn-modal-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Override Modal */}
      {showOverrideModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                ❌ Override Recommendation
              </h3>
              <p className="modal-description">
                Please provide a reason for overriding this recommendation. This will remove the suggestion and log your decision.
              </p>
            </div>
            <textarea
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="modal-textarea"
              placeholder="e.g., Manual intervention required, emergency situation, or operational constraints..."
              autoFocus
            />
            <div className="modal-actions">
              <button
                onClick={() => handleOverride(showOverrideModal)}
                className="btn-modal-primary bg-red-600 hover:bg-red-700"
              >
                Confirm Override
              </button>
              <button
                onClick={() => {
                  setShowOverrideModal(null)
                  setOverrideReason('')
                }}
                className="btn-modal-secondary"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AIRecommendations
