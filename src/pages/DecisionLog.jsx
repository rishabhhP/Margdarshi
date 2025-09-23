import React, { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import TopNavigation from '../components/TopNavigation'
import { Search, Filter, Download, Calendar } from 'lucide-react'

const DecisionLog = () => {
  const { t } = useLanguage()
  const [decisions, setDecisions] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch decision log
    setTimeout(() => {
      setDecisions([
        {
          id: 1,
          timestamp: '2024-01-15 10:30:00',
          trainId: '12432',
          planSummary: 'Hold train for 3 mins at Aligarh Jn',
          action: 'Accept',
          reason: '',
          delayReduction: 5,
          throughputGain: 2,
          confidence: 87
        },
        {
          id: 2,
          timestamp: '2024-01-15 10:25:00',
          trainId: '12951',
          planSummary: 'Priority override for VIP train',
          action: 'Rethink',
          reason: 'Emergency medical passenger',
          delayReduction: -2,
          throughputGain: 0,
          confidence: 95
        },
        {
          id: 3,
          timestamp: '2024-01-15 10:20:00',
          trainId: '18448',
          planSummary: 'Reroute via alternate track',
          action: 'Accept',
          reason: '',
          delayReduction: 8,
          throughputGain: 3,
          confidence: 92
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  const filteredDecisions = decisions.filter(decision => {
    const matchesSearch = decision.trainId.includes(searchTerm) || 
                         decision.planSummary.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === 'all' || decision.action.toLowerCase() === filterType
    return matchesSearch && matchesFilter
  })

  const exportToCSV = () => {
    const headers = [t('timestamp'), t('trainId'), t('planSummary'), t('action'), t('reason'), 'Delay Reduction', 'Throughput Gain', 'Confidence']
    const csvContent = [
      headers.join(','),
      ...filteredDecisions.map(decision => [
        decision.timestamp,
        decision.trainId,
        `"${decision.planSummary}"`,
        decision.action,
        `"${decision.reason}"`,
        decision.delayReduction,
        decision.throughputGain,
        decision.confidence
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'decision-log.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <TopNavigation />
      
      <div className="pt-16 p-6 main-content">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {t('decisionLog')}
            </h1>
            
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder={t('searchTrainsOrPlans')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="input-field"
                >
                  <option value="all">{t('allActions')}</option>
                  <option value="accept">{t('accepted')}</option>
                  <option value="rethink">{t('rethink')}</option>
                </select>
                
                <button
                  onClick={exportToCSV}
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {t('export')} CSV
                </button>
              </div>
            </div>
          </div>

          {/* Decision Table */}
          <div className="card overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-railway-blue mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{t('loading')}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('timestamp')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('trainId')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('planSummary')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('action')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('reason')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {t('metrics')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredDecisions.map((decision) => (
                      <tr key={decision.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {decision.timestamp}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-railway-blue dark:text-blue-400">
                          {decision.trainId}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {decision.planSummary}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            decision.action === 'Accept' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {decision.action === 'Accept' ? t('accepted') : t('rethink')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          {decision.reason || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                          <div className="space-y-1">
                            <div>{t('delay')}: {decision.delayReduction > 0 ? '-' : '+'}{Math.abs(decision.delayReduction)} {t('min')}</div>
                            <div>{t('throughput')}: +{decision.throughputGain} {t('trainsPerHour')}</div>
                            <div>Confidence: {decision.confidence}%</div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DecisionLog
