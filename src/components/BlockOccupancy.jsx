import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'

const BlockOccupancy = ({ blocks }) => {
  const { t } = useLanguage()

  // Generate time slots for the next 60 minutes (12 slots of 5 minutes each)
  const generateTimeSlots = () => {
    const slots = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const time = new Date(now.getTime() + i * 5 * 60000)
      slots.push({
        time: time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        timestamp: time.getTime(),
        minutes: i * 5
      })
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const getBlockStatus = (block, slotMinutes) => {
    // Simulate realistic block occupancy patterns
    const blockNum = parseInt(block.id.replace(/\D/g, ''))
    
    // Current occupancy
    if (block.currentTrain && slotMinutes < block.estimatedClearTime) {
      return { 
        status: 'occupied', 
        train: block.currentTrain,
        details: `${block.currentTrain} - ETA: ${block.estimatedClearTime - slotMinutes}min`
      }
    }
    
    // Future reservations based on realistic patterns
    const patterns = [
      // Express trains - regular intervals
      { trainPrefix: '12', interval: 20, duration: 8, type: t('express') },
      // Freight trains - longer occupancy
      { trainPrefix: '22', interval: 35, duration: 15, type: t('freight') },
      // Passenger trains - frequent but shorter
      { trainPrefix: '18', interval: 15, duration: 6, type: t('passenger') }
    ]
    
    for (const pattern of patterns) {
      const cyclePosition = (slotMinutes + blockNum * 5) % pattern.interval
      if (cyclePosition < pattern.duration) {
        const trainId = `${pattern.trainPrefix}${String(blockNum + Math.floor(slotMinutes / pattern.interval)).padStart(3, '0')}`
        return {
          status: slotMinutes < 5 ? 'reserved' : 'occupied',
          train: trainId,
          details: `${trainId} (${pattern.type}) - ${pattern.duration}min slot`
        }
      }
    }
    
    return { status: 'free', train: null, details: t('available') }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'occupied':
        return 'bg-red-500 text-white animate-pulse'
      case 'reserved':
        return 'bg-yellow-500 text-white'
      case 'free':
        return 'bg-green-500 text-white opacity-60'
      default:
        return 'bg-gray-300 dark:bg-gray-600'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'occupied':
        return '🚂'
      case 'reserved':
        return '⏳'
      case 'free':
        return '✓'
      default:
        return '?'
    }
  }

  return (
    <div className="block-occupancy-container">
      {/* Time Header - Sticky */}
      <div className="block-occupancy-header">
        <div className="flex">
          <div className="w-48 p-4 font-semibold text-gray-900 dark:text-gray-100 border-r-2 border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
            <div className="text-sm">{t('blockSection')}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('currentStatus')}</div>
          </div>
          {timeSlots.map((slot, index) => (
            <div key={index} className="w-28 p-3 text-center border-r border-gray-200 dark:border-gray-700 flex-shrink-0 bg-white dark:bg-gray-900">
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {slot.time}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                +{slot.minutes}{t('min')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block Rows - Scrollable Content */}
      <div className="bg-white dark:bg-gray-900">
        {blocks.map((block) => (
          <div key={block.id} className="flex items-stretch border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {/* Block Info Column - Fixed Width */}
            <div className="w-48 p-4 border-r-2 border-gray-200 dark:border-gray-700 flex-shrink-0 flex flex-col justify-center bg-white dark:bg-gray-900">
              <div className="font-bold text-lg text-railway-blue dark:text-blue-400">
                {block.id}
              </div>
              <div className="text-sm text-gray-900 dark:text-gray-100 font-medium truncate">
                {block.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {block.currentTrain ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    {block.currentTrain}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {t('available')}
                  </span>
                )}
              </div>
            </div>

            {/* Timeline Slots - Horizontally Scrollable */}
            {timeSlots.map((slot, index) => {
              const blockStatus = getBlockStatus(block, slot.minutes)
              return (
                <div key={index} className="w-28 p-2 border-r border-gray-200 dark:border-gray-700 flex-shrink-0 flex items-center justify-center bg-white dark:bg-gray-900">
                  <div 
                    className={`w-full h-12 rounded-lg flex items-center justify-center text-sm font-bold cursor-pointer transition-all hover:scale-105 hover:shadow-md ${getStatusClass(blockStatus.status)}`}
                    title={blockStatus.details}
                  >
                    <div className="text-center">
                      <div className="text-lg">
                        {getStatusIcon(blockStatus.status)}
                      </div>
                      {blockStatus.train && (
                        <div className="text-xs font-mono truncate max-w-full">
                          {blockStatus.train.length > 6 ? blockStatus.train.substring(0, 6) : blockStatus.train}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {/* Enhanced Legend - Below the table */}
      <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl">
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
          {t('blockOccupancyTimelineLegend')}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Status Legend */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('trackStatus')}</h5>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center opacity-60">
                  <span className="text-sm">✓</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('free')} - {t('freeAvailableForScheduling')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-500 text-white rounded-lg flex items-center justify-center">
                  <span className="text-sm">⏳</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('reserved')} - {t('reservedScheduledApproaching')}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center animate-pulse">
                  <span className="text-sm">🚂</span>
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('occupied')} - {t('occupiedTrainCurrentlyPresent')}</span>
              </div>
            </div>
          </div>

          {/* Train Types */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('trainTypes')}</h5>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-mono text-blue-600 dark:text-blue-400">12xxx</span>
                <span className="text-gray-700 dark:text-gray-300">{t('expressTrains8minSlots')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-green-600 dark:text-green-400">18xxx</span>
                <span className="text-gray-700 dark:text-gray-300">{t('passengerTrains6minSlots')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-orange-600 dark:text-orange-400">22xxx</span>
                <span className="text-gray-700 dark:text-gray-300">{t('freightTrains15minSlots')}</span>
              </div>
            </div>
          </div>

          {/* Timeline Info */}
          <div>
            <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3">{t('timelineDetails')}</h5>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div>{t('eachColumn5MinuteInterval')}</div>
              <div>{t('totalView60MinutesAhead')}</div>
              <div>{t('hoverForTrainDetails')}</div>
              <div>{t('realTimeUpdatesEvery30Seconds')}</div>
              <div>{t('scrollHorizontallyOnMobile')}</div>
            </div>
          </div>
        </div>

        {/* Current Time Indicator */}
        <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-600 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-railway-blue text-white rounded-full">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            <span className="font-medium">
              {t('currentTime')}: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlockOccupancy
