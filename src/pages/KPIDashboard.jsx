import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import TopNavigation from '../components/TopNavigation'
import ErrorBoundary from '../components/ErrorBoundary'
import { TrendingUp, TrendingDown, Clock, Activity, AlertTriangle, CheckCircle } from 'lucide-react'

const KPIDashboard = () => {
  const { t } = useLanguage()
  const [kpiData, setKpiData] = useState({
    avgDelay: 12.5,
    throughput: 45,
    blockUtilization: 78,
    conflictsResolved: 23,
    delayTrend: 'down',
    throughputTrend: 'up'
  })

  const delayTrendData = [
    { time: '06:00', delay: 15 },
    { time: '08:00', delay: 18 },
    { time: '10:00', delay: 12 },
    { time: '12:00', delay: 10 },
    { time: '14:00', delay: 8 },
    { time: '16:00', delay: 14 },
    { time: '18:00', delay: 16 }
  ]

  const utilizationData = [
    { block: 'A1-A5', utilization: 85 },
    { block: 'B1-B5', utilization: 72 },
    { block: 'C1-C5', utilization: 91 },
    { block: 'D1-D5', utilization: 68 },
    { block: 'E1-E5', utilization: 79 }
  ]

  const decisionData = [
    { name: t('accepted'), value: 75, color: '#10B981' },
    { name: t('rethink'), value: 20, color: '#F59E0B' },
    { name: 'Rejected', value: 5, color: '#EF4444' }
  ]

  const KPICard = ({ title, value, unit, trend, icon: Icon, color }) => (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
            {value}{unit}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend === 'up' ? (
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
          )}
          <span className="text-sm text-green-600 dark:text-green-400">
            {trend === 'up' ? t('improving') : t('reducing')}
          </span>
        </div>
      )}
    </div>
  )

  // Simple chart components as fallbacks
  const SimpleLineChart = ({ data, dataKey, color = '#3B82F6' }) => (
    <div className="h-64 flex items-end justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-8 bg-blue-500 rounded-t"
            style={{ 
              height: `${(item[dataKey] / Math.max(...data.map(d => d[dataKey]))) * 150}px`,
              backgroundColor: color
            }}
          ></div>
          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{item.time}</span>
        </div>
      ))}
    </div>
  )

  const SimpleBarChart = ({ data, dataKey, color = '#10B981' }) => (
    <div className="h-64 flex items-end justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center">
          <div 
            className="w-12 rounded-t"
            style={{ 
              height: `${(item[dataKey] / 100) * 150}px`,
              backgroundColor: color
            }}
          ></div>
          <span className="text-xs mt-2 text-gray-600 dark:text-gray-400">{item.block}</span>
        </div>
      ))}
    </div>
  )

  const SimplePieChart = ({ data }) => (
    <div className="h-64 flex items-center justify-center">
      <div className="relative w-48 h-48">
        {data.map((item, index) => {
          const percentage = item.value
          const angle = (percentage / 100) * 360
          return (
            <div key={index} className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-32 h-32 rounded-full border-8"
                style={{ 
                  borderColor: item.color,
                  transform: `rotate(${index * 120}deg)`
                }}
              ></div>
            </div>
          )
        })}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">100%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{t('total')}</div>
          </div>
        </div>
      </div>
    </div>
  )

  // Dynamic import for Recharts with better error handling
  const ChartsComponent = () => {
    const [chartsLoaded, setChartsLoaded] = useState(false)
    const [chartsError, setChartsError] = useState(false)
    const [RechartsComponents, setRechartsComponents] = useState(null)

    useEffect(() => {
      let timeoutId = setTimeout(() => {
        setChartsError(true)
        setChartsLoaded(true)
      }, 5000) // 5 second timeout

      import('recharts').then((recharts) => {
        clearTimeout(timeoutId)
        setRechartsComponents(recharts)
        setChartsLoaded(true)
      }).catch((error) => {
        clearTimeout(timeoutId)
        console.log('Recharts not available, using fallback charts:', error)
        setChartsError(true)
        setChartsLoaded(true)
      })

      return () => clearTimeout(timeoutId)
    }, [])

    if (!chartsLoaded) {
      return <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-64 rounded"></div>
    }

    if (chartsError || !RechartsComponents) {
      return (
        <>
          <SimpleLineChart data={delayTrendData} dataKey="delay" />
          <SimpleBarChart data={utilizationData} dataKey="utilization" />
        </>
      )
    }

    const { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = RechartsComponents

    return (
      <>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={delayTrendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="delay" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="block" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="utilization" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />
      
      <div className="pt-16 p-6 main-content">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('kpiDashboard')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {t('realTimePerformanceMetrics')}
            </p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <KPICard
              title={t('averageDelay')}
              value={kpiData.avgDelay}
              unit={` ${t('min')}`}
              trend={kpiData.delayTrend}
              icon={Clock}
              color="bg-blue-500"
            />
            <KPICard
              title={t('throughput')}
              value={kpiData.throughput}
              unit={` ${t('trainsPerHour')}`}
              trend={kpiData.throughputTrend}
              icon={Activity}
              color="bg-green-500"
            />
            <KPICard
              title={t('blockUtilization')}
              value={kpiData.blockUtilization}
              unit="%"
              icon={TrendingUp}
              color="bg-orange-500"
            />
            <KPICard
              title={t('conflictsResolved')}
              value={kpiData.conflictsResolved}
              unit=""
              icon={CheckCircle}
              color="bg-purple-500"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Delay Trend Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('delayTrendToday')}
              </h3>
              <ErrorBoundary>
                <ChartsComponent />
              </ErrorBoundary>
            </div>

            {/* Block Utilization Chart */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('blockUtilization')}
              </h3>
              <ErrorBoundary>
                <SimpleBarChart data={utilizationData} dataKey="utilization" />
              </ErrorBoundary>
            </div>
          </div>

          {/* Decision Outcomes and Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('decisionOutcomesLast24h')}
              </h3>
              <ErrorBoundary>
                <SimplePieChart data={decisionData} />
              </ErrorBoundary>
            </div>

            {/* Performance Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                {t('performanceSummary')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-sm font-medium">{t('onTimePerformance')}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">87%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <Activity className="w-5 h-5 text-blue-500 mr-2" />
                    <span className="text-sm font-medium">{t('systemEfficiency')}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">92%</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-sm font-medium">{t('activeAlerts')}</span>
                  </div>
                  <span className="text-sm font-bold text-orange-600">3</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="flex items-center">
                    <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                    <span className="text-sm font-medium">{t('aiAccuracy')}</span>
                  </div>
                  <span className="text-sm font-bold text-purple-600">94%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default KPIDashboard
