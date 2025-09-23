import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import TopNavigation from '../components/TopNavigation'
import { Play, RotateCcw, Settings, BarChart3, Clock, Zap, MapPin } from 'lucide-react'

const Simulation = () => {
  const { t } = useLanguage()
  const [scenario, setScenario] = useState('')
  const [parameters, setParameters] = useState({
    // Hold train parameters
    holdDuration: 5,
    selectedTrain: '',
    priorityOverride: false,
    
    // Speed adjust parameters
    speedDelta: 0,
    selectedTrains: [],
    horizon: 10,
    
    // Reroute parameters
    alternateRoute: '',
    showMapPreview: false
  })
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState(null)

  // Updated scenarios with the three specific cases
  const scenarios = [
    { 
      id: 'hold', 
      name: 'Hold Train', 
      description: 'Evaluate holding strategies and platform allocations',
      icon: Clock
    },
    { 
      id: 'speed', 
      name: 'Speed Adjust', 
      description: 'Analyze speed modifications and acceleration/deceleration limits',
      icon: Zap
    },
    { 
      id: 'reroute', 
      name: 'Reroute', 
      description: 'Explore alternative routing options and network topology',
      icon: MapPin
    }
  ]

  // Mock data for dropdowns
  const availableTrains = [
    { id: '12432', name: 'Rajdhani Express', currentSpeed: 120, eta: '10:32' },
    { id: '12951', name: 'Mumbai Rajdhani', currentSpeed: 110, eta: '11:15' },
    { id: '18448', name: 'Hirakud Express', currentSpeed: 85, eta: '12:45' },
    { id: '16032', name: 'Andaman Express', currentSpeed: 95, eta: '13:20' }
  ]

  const alternateRoutes = [
    { id: 'route1', name: 'Via Agra-Mathura (Primary)', distance: '245 km', time: '3h 15m' },
    { id: 'route2', name: 'Via Gwalior-Jhansi (Alternate)', distance: '267 km', time: '3h 45m' },
    { id: 'route3', name: 'Via Kanpur-Lucknow (Backup)', distance: '289 km', time: '4h 10m' }
  ]

  const runSimulation = async () => {
    setIsRunning(true)
    
    // Simulate API call with scenario-specific processing
    setTimeout(() => {
      let scenarioResults = {}
      
      switch (scenario) {
        case 'hold':
          scenarioResults = {
            scenario: 'Hold Train Strategy',
            action: `Hold ${parameters.selectedTrain || 'selected train'} for ${parameters.holdDuration} minutes`,
            conflictDetection: parameters.priorityOverride ? 'Priority override applied' : 'Standard conflict resolution',
            originalMetrics: { avgDelay: 12.5, throughput: 45, conflicts: 3 },
            simulatedMetrics: { avgDelay: 14.2, throughput: 43, conflicts: 1 },
            recommendations: [
              `Apply ${parameters.holdDuration}-minute hold at current platform`,
              parameters.priorityOverride ? 'Priority train given immediate clearance' : 'Standard scheduling maintained',
              'Platform allocation optimized for minimal passenger impact'
            ]
          }
          break
          
        case 'speed':
          scenarioResults = {
            scenario: 'Speed Adjustment Analysis',
            action: `Adjust speed by ${parameters.speedDelta > 0 ? '+' : ''}${parameters.speedDelta} km/h over ${parameters.horizon} km horizon`,
            speedModification: `Target trains: ${parameters.selectedTrains.length || 1} train(s)`,
            originalMetrics: { avgDelay: 12.5, throughput: 45, conflicts: 3 },
            simulatedMetrics: { 
              avgDelay: 12.5 + (parameters.speedDelta < 0 ? 2 : -1), 
              throughput: 45 + (parameters.speedDelta > 0 ? 2 : -1), 
              conflicts: Math.max(0, 3 + (parameters.speedDelta < 0 ? 1 : -1))
            },
            recommendations: [
              `Speed modification: ${parameters.speedDelta > 0 ? 'Increase' : 'Decrease'} by ${Math.abs(parameters.speedDelta)} km/h`,
              `Acceleration/deceleration limits respected over ${parameters.horizon} km`,
              'Energy efficiency and safety parameters maintained'
            ]
          }
          break
          
        case 'reroute':
          const selectedRoute = alternateRoutes.find(r => r.id === parameters.alternateRoute) || alternateRoutes[0]
          scenarioResults = {
            scenario: 'Alternative Routing Analysis',
            action: `Reroute via ${selectedRoute.name}`,
            routeCalculation: `NetworkX shortest path: ${selectedRoute.distance}, ${selectedRoute.time}`,
            originalMetrics: { avgDelay: 12.5, throughput: 45, conflicts: 3 },
            simulatedMetrics: { avgDelay: 15.8, throughput: 42, conflicts: 2 },
            recommendations: [
              `Primary route: ${selectedRoute.name}`,
              `Distance impact: ${selectedRoute.distance}`,
              'Platform availability confirmed at alternate stations'
            ]
          }
          break
          
        default:
          scenarioResults = {
            scenario: 'General Analysis',
            originalMetrics: { avgDelay: 12.5, throughput: 45, conflicts: 3 },
            simulatedMetrics: { avgDelay: 13.1, throughput: 44, conflicts: 2 },
            recommendations: ['Select a specific scenario for detailed analysis']
          }
      }
      
      setResults({
        ...scenarioResults,
        timeline: [
          { time: '10:00', event: `${scenarioResults.scenario} initiated` },
          { time: '10:05', event: 'Conflict detection and analysis completed' },
          { time: '10:10', event: 'Alternative solutions calculated' },
          { time: '10:15', event: 'Optimal strategy determined' },
          { time: '10:20', event: 'Implementation ready' }
        ]
      })
      setIsRunning(false)
    }, 3000)
  }

  const resetSimulation = () => {
    setResults(null)
    setScenario('')
    setParameters({
      holdDuration: 5,
      selectedTrain: '',
      priorityOverride: false,
      speedDelta: 0,
      selectedTrains: [],
      horizon: 10,
      alternateRoute: '',
      showMapPreview: false
    })
  }

  const renderScenarioParameters = () => {
    switch (scenario) {
      case 'hold':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Hold Duration (minutes)
              </label>
              <input
                type="range"
                min="1"
                max="30"
                value={parameters.holdDuration}
                onChange={(e) => setParameters(prev => ({ ...prev, holdDuration: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 min</span>
                <span className="font-medium">{parameters.holdDuration} minutes</span>
                <span>30 min</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Train
              </label>
              <select
                value={parameters.selectedTrain}
                onChange={(e) => setParameters(prev => ({ ...prev, selectedTrain: e.target.value }))}
                className="input-field"
              >
                <option value="">Choose train to hold...</option>
                {availableTrains.map((train) => (
                  <option key={train.id} value={train.id}>
                    {train.id} - {train.name} (ETA: {train.eta})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={parameters.priorityOverride}
                  onChange={(e) => setParameters(prev => ({ ...prev, priorityOverride: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Priority Override (Emergency/VIP)
                </span>
              </label>
            </div>
          </div>
        )

      case 'speed':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Speed Delta (km/h)
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                value={parameters.speedDelta}
                onChange={(e) => setParameters(prev => ({ ...prev, speedDelta: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>-50 km/h</span>
                <span className="font-medium">{parameters.speedDelta > 0 ? '+' : ''}{parameters.speedDelta} km/h</span>
                <span>+50 km/h</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Train(s)
              </label>
              <select
                multiple
                value={parameters.selectedTrains}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value)
                  setParameters(prev => ({ ...prev, selectedTrains: values }))
                }}
                className="input-field h-24"
              >
                {availableTrains.map((train) => (
                  <option key={train.id} value={train.id}>
                    {train.id} - {train.name} ({train.currentSpeed} km/h)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple trains</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Horizon Distance (km)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={parameters.horizon}
                onChange={(e) => setParameters(prev => ({ ...prev, horizon: parseInt(e.target.value) }))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>5 km</span>
                <span className="font-medium">{parameters.horizon} km</span>
                <span>50 km</span>
              </div>
            </div>
          </div>
        )

      case 'reroute':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alternate Route Options
              </label>
              <select
                value={parameters.alternateRoute}
                onChange={(e) => setParameters(prev => ({ ...prev, alternateRoute: e.target.value }))}
                className="input-field"
              >
                <option value="">Select alternate route...</option>
                {alternateRoutes.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.name} - {route.distance} ({route.time})
                  </option>
                ))}
              </select>
            </div>

            {parameters.alternateRoute && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Route Preview</h4>
                {(() => {
                  const selectedRoute = alternateRoutes.find(r => r.id === parameters.alternateRoute)
                  return selectedRoute ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-medium">{selectedRoute.distance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Est. Time:</span>
                        <span className="font-medium">{selectedRoute.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Route:</span>
                        <span className="font-medium">{selectedRoute.name}</span>
                      </div>
                    </div>
                  ) : null
                })()}
              </div>
            )}

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={parameters.showMapPreview}
                  onChange={(e) => setParameters(prev => ({ ...prev, showMapPreview: e.target.checked }))}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Show Network Topology Map Preview
                </span>
              </label>
            </div>

            {parameters.showMapPreview && (
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center text-gray-600 dark:text-gray-400">
                  <MapPin className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Network topology map would be displayed here</p>
                  <p className="text-xs mt-1">Showing alternative paths and platform availability</p>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />
      
      <div className="pt-16 p-6 main-content">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('simulation')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Support what-if simulation and scenario analysis to evaluate alternative routings, holding strategies, and platform allocations
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Simulation Setup */}
            <div className="lg:col-span-1">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  {t('simulationSetup')}
                </h3>

                {/* Scenario Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('selectScenario')}
                  </label>
                  <div className="space-y-3">
                    {scenarios.map((s) => {
                      const Icon = s.icon
                      return (
                        <label key={s.id} className="flex items-start cursor-pointer">
                          <input
                            type="radio"
                            name="scenario"
                            value={s.id}
                            checked={scenario === s.id}
                            onChange={(e) => setScenario(e.target.value)}
                            className="mr-3 mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
                              <Icon className="w-4 h-4" />
                              {s.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.description}</div>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Scenario-specific Parameters */}
                {scenario && (
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Configuration Options
                    </h4>
                    {renderScenarioParameters()}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={runSimulation}
                    disabled={!scenario || isRunning}
                    className="btn-primary flex items-center gap-2 flex-1 disabled:opacity-50"
                  >
                    <Play className="w-4 h-4" />
                    {isRunning ? t('running') : t('runSimulation')}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {t('reset')}
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {isRunning && (
                <div className="card p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-railway-blue mx-auto mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('runningSimulation')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('analyzingScenarioImpact')}
                  </p>
                </div>
              )}

              {results && !isRunning && (
                <div className="space-y-6">
                  {/* Metrics Comparison */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      {results.scenario} - {t('impactAnalysis')}
                    </h3>
                    
                    {results.action && (
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          Action: {results.action}
                        </p>
                        {results.conflictDetection && (
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            {results.conflictDetection}
                          </p>
                        )}
                        {results.speedModification && (
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            {results.speedModification}
                          </p>
                        )}
                        {results.routeCalculation && (
                          <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                            {results.routeCalculation}
                          </p>
                        )}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('averageDelay')}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {results.originalMetrics.avgDelay} → {results.simulatedMetrics.avgDelay}
                        </div>
                        <div className={`text-sm ${results.simulatedMetrics.avgDelay > results.originalMetrics.avgDelay ? 'text-red-600' : 'text-green-600'}`}>
                          {results.simulatedMetrics.avgDelay > results.originalMetrics.avgDelay ? '+' : ''}{(results.simulatedMetrics.avgDelay - results.originalMetrics.avgDelay).toFixed(1)} {t('min')}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('throughput')}</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {results.originalMetrics.throughput} → {results.simulatedMetrics.throughput}
                        </div>
                        <div className={`text-sm ${results.simulatedMetrics.throughput < results.originalMetrics.throughput ? 'text-red-600' : 'text-green-600'}`}>
                          {results.simulatedMetrics.throughput > results.originalMetrics.throughput ? '+' : ''}{results.simulatedMetrics.throughput - results.originalMetrics.throughput} {t('trainsPerHour')}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Conflicts</div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {results.originalMetrics.conflicts} → {results.simulatedMetrics.conflicts}
                        </div>
                        <div className={`text-sm ${results.simulatedMetrics.conflicts > results.originalMetrics.conflicts ? 'text-red-600' : 'text-green-600'}`}>
                          {results.simulatedMetrics.conflicts > results.originalMetrics.conflicts ? '+' : ''}{results.simulatedMetrics.conflicts - results.originalMetrics.conflicts}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {t('aiRecommendationsTitle')}
                    </h3>
                    <div className="space-y-3">
                      {results.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <p className="text-gray-900 dark:text-gray-100">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {t('simulationTimeline')}
                    </h3>
                    <div className="space-y-3">
                      {results.timeline.map((event, index) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 text-sm font-mono text-gray-600 dark:text-gray-400">
                            {event.time}
                          </div>
                          <div className="w-3 h-3 bg-railway-blue rounded-full"></div>
                          <div className="flex-1 text-gray-900 dark:text-gray-100">
                            {event.event}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {!results && !isRunning && (
                <div className="card p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Play className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    {t('readyToSimulate')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('selectScenarioAndConfigure')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Simulation
