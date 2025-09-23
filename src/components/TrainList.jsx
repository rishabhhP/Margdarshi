import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Train, Clock, Zap, Users } from 'lucide-react'

const TrainList = ({ trains }) => {
  const { t } = useLanguage()

  const getTrainIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'express':
        return <Train className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
      case 'freight':
        return <Zap className="w-2.5 h-2.5 text-orange-600 dark:text-orange-400 flex-shrink-0" />
      case 'passenger':
        return <Users className="w-2.5 h-2.5 text-green-600 dark:text-green-400 flex-shrink-0" />
      default:
        return <Train className="w-2.5 h-2.5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
    }
  }

  const getDelayColor = (delay) => {
    if (delay === 0) return 'text-green-600 dark:text-green-400'
    if (delay <= 5) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getSpeedColor = (speed) => {
    if (speed >= 80) return 'text-green-600 dark:text-green-400'
    if (speed >= 40) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getTrainTypeText = (type) => {
    switch (type.toLowerCase()) {
      case 'express':
        return t('express')
      case 'freight':
        return t('freight')
      case 'passenger':
        return t('passenger')
      default:
        return type
    }
  }

  return (
    <div className="p-1">
      <div className="space-y-1">
        {trains.map((train) => (
          <div
            key={train.id}
            className="p-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer bg-white dark:bg-gray-900"
          >
            {/* Train ID and Icon */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                {getTrainIcon(train.type)}
                <span className="font-bold text-railway-blue dark:text-blue-400 text-xs">
                  {train.id}
                </span>
              </div>
              <span className={`text-xs font-medium ${getDelayColor(train.delay)}`}>
                {train.delay === 0 ? t('onTime') : `+${train.delay}m`}
              </span>
            </div>

            {/* Train Name */}
            <div className="text-xs text-gray-900 dark:text-gray-100 font-medium mb-1 truncate">
              {train.name}
            </div>

            {/* ETA and Speed */}
            <div className="flex items-center justify-between text-xs mb-1">
              <div className="flex items-center gap-1">
                <Clock className="w-2 h-2 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">
                  {train.eta}
                </span>
              </div>
              <span className={`font-medium ${getSpeedColor(train.currentSpeed)}`}>
                {Math.round(train.currentSpeed)} km/h
              </span>
            </div>

            {/* Current Block */}
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {t('block')}: <span className="font-medium text-gray-800 dark:text-gray-200">{train.currentBlock}</span>
            </div>

            {/* Type Badge */}
            <div className="flex justify-center">
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${
                train.type === 'Express' 
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : train.type === 'Freight'
                  ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {getTrainTypeText(train.type)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrainList
