import React, { useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Send, X, AlertTriangle, Clock, Zap, Shield } from 'lucide-react'

const NotificationDropdown = ({ onClose }) => {
  const { t } = useLanguage()
  const [selectedType, setSelectedType] = useState('delay')
  const [message, setMessage] = useState('')
  const [recipient, setRecipient] = useState('all')

  const notificationTypes = [
    { id: 'delay', name: t('delayAlert'), icon: Clock, color: 'text-yellow-600 dark:text-yellow-400' },
    { id: 'conflict', name: t('conflictAlert'), icon: AlertTriangle, color: 'text-red-600 dark:text-red-400' },
    { id: 'safety', name: t('safetyAlert'), icon: Shield, color: 'text-orange-600 dark:text-orange-400' },
    { id: 'priority', name: t('priorityAlert'), icon: Zap, color: 'text-blue-600 dark:text-blue-400' }
  ]

  const recipients = [
    { id: 'all', name: t('allControllers') },
    { id: 'section', name: t('sectionControllers') },
    { id: 'station', name: t('stationMasters') },
    { id: 'maintenance', name: t('maintenanceTeam') },
    { id: 'passengers', name: 'Passengers' }
  ]

  const generatePreview = () => {
    const type = notificationTypes.find(t => t.id === selectedType)
    const recipientName = recipients.find(r => r.id === recipient)?.name || t('allControllers')
    
    const templates = {
      delay: `🚂 ${t('delayAlert').toUpperCase()}: Train 12432 delayed by 15 minutes at Aligarh Junction. Expected arrival: 11:45. Reason: Signal clearance.`,
      conflict: `⚠️ ${t('conflictAlert').toUpperCase()}: Potential collision risk detected between trains 12432 and 18448 at Block A12. Immediate action required.`,
      safety: `🛡️ ${t('safetyAlert').toUpperCase()}: Track maintenance scheduled on Section B5-B8 from 14:00-16:00. All trains rerouted via alternate track.`,
      priority: `⚡ ${t('priorityAlert').toUpperCase()}: VIP train 12951 requires immediate clearance. Hold all conflicting trains until further notice.`
    }
    
    return message || templates[selectedType] || 'Custom notification message...'
  }

  const handleSend = async () => {
    try {
      const notification = {
        message: generatePreview(),
      };
  
      const response = await fetch("/api/sendNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: notification.message }),
      });

    // clone response for safe fallback
    let data;
    try {
      const resClone = response.clone();
      data = await response.json();
    } catch (err) {
      const text = await response.clone().text(); // safe fallback
      console.error("Server returned invalid JSON:", text);
      alert("Server returned invalid JSON. Check Vercel logs.");
      return;
    }

    if (data.success) {
      alert("Notification sent successfully!");
    } else {
      alert("Failed: " + data.error);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("Error sending notification: " + err.message);
  }
};




  return (
    <div className="notification-dropdown">
      {/* Header */}
      <div className="notification-header p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {t('notifications')}
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Content */}
      <div className="notification-content p-4 space-y-4">
        {/* Notification Type */}
        <div>
          <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('alertType')}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {notificationTypes.map((type) => {
              const Icon = type.icon
              const isSelected = selectedType === type.id
              return (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`notification-type-btn p-2 rounded-lg border text-left transition-all duration-200 ${
                    isSelected
                      ? 'selected border-railway-blue bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${type.color}`} />
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {type.name}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Recipients */}
        <div>
          <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('sendTo')}
          </label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="form-input w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-railway-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
          >
            {recipients.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>

        {/* Custom Message */}
        <div>
          <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('customMessageOptional')}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-input w-full h-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-railway-blue focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none transition-colors"
            placeholder={t('enterCustomMessage')}
          />
        </div>

        {/* WhatsApp-style Preview */}
        <div>
          <label className="form-label block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('preview')}
          </label>
          <div className="whatsapp-preview">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {generatePreview()}
            </p>
            <div className="flex justify-end mt-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full bg-railway-blue hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg"
        >
          <Send className="w-4 h-4" />
          {t('sendNotification')}
        </button>
      </div>
    </div>
  )
}

export default NotificationDropdown
