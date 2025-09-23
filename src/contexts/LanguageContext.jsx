import React, { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    decisionLog: 'Decision Log',
    kpiDashboard: 'KPI Dashboard',
    simulation: 'What-if Simulation',
    notifications: 'Push Notifications',
    logout: 'Logout',
    
    // Login
    login: 'Login',
    username: 'Username',
    password: 'Password',
    section: 'Section',
    poweredBy: 'Powered by AI Decision Support – MargDarshi',
    selectSection: 'Select Section',
    enterUsername: 'Enter username',
    enterPassword: 'Enter password',
    allFieldsRequired: 'All fields are required',
    
    // Dashboard
    liveTrains: 'Live Train List',
    railwayMap: 'Real-Time Railway Map',
    aiRecommendations: 'AI Recommendations',
    blockOccupancy: 'Block Occupancy & Timeline',
    next60Minutes: 'Next 60 Minutes',
    realTimeBlockOccupancy: 'Real-time block occupancy status and timeline (Gantt-style view)',
    
    // Train details
    trainId: 'Train ID',
    trainName: 'Train Name',
    type: 'Type',
    eta: 'ETA',
    delay: 'Delay',
    speed: 'Speed',
    currentBlock: 'Current Block',
    onTime: 'On Time',
    block: 'Block',
    
    // Train types
    express: 'Express',
    freight: 'Freight',
    passenger: 'Passenger',
    
    // Actions
    accept: 'Accept',
    rethink: 'Rethink',
    send: 'Send',
    export: 'Export',
    search: 'Search',
    filter: 'Filter',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    confirm: 'Confirm',
    reset: 'Reset',
    run: 'Run',
    
    // Status
    free: 'Free',
    reserved: 'Reserved',
    occupied: 'Occupied',
    available: 'Available',
    
    // Time
    mins: 'mins',
    hours: 'hours',
    min: 'min',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    
    // Decision Log
    timestamp: 'Timestamp',
    planSummary: 'Plan Summary',
    action: 'Action',
    reason: 'Reason',
    metrics: 'Metrics',
    allActions: 'All Actions',
    accepted: 'Accepted',
    overridden: 'Overridden',
    searchTrainsOrPlans: 'Search trains or plans...',
    
    // KPI Dashboard
    averageDelay: 'Average Delay',
    throughput: 'Throughput',
    blockUtilization: 'Block Utilization',
    conflictsResolved: 'Conflicts Resolved',
    improving: 'Improving',
    reducing: 'Reducing',
    delayTrendToday: 'Delay Trend (Today)',
    decisionOutcomesLast24h: 'Decision Outcomes (Last 24h)',
    performanceSummary: 'Performance Summary',
    onTimePerformance: 'On-time Performance',
    systemEfficiency: 'System Efficiency',
    activeAlerts: 'Active Alerts',
    aiAccuracy: 'AI Accuracy',
    realTimePerformanceMetrics: 'Real-time performance metrics and analytics',
    
    // Simulation
    simulationSetup: 'Simulation Setup',
    selectScenario: 'Select Scenario',
    trackBlockage: 'Track Blockage',
    simulateBlockedSection: 'Simulate a blocked section',
    trainBreakdown: 'Train Breakdown',
    simulateTrainMechanicalFailure: 'Simulate train mechanical failure',
    vipPriority: 'VIP Priority',
    simulateVipTrainPriorityOverride: 'Simulate VIP train priority override',
    weatherDelay: 'Weather Delay',
    simulateWeatherRelatedDelays: 'Simulate weather-related delays',
    trainIdOptional: 'Train ID (optional)',
    blockIdOptional: 'Block ID (optional)',
    durationMinutes: 'Duration (minutes)',
    severity: 'Severity',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    critical: 'Critical',
    runSimulation: 'Run Simulation',
    running: 'Running...',
    runningSimulation: 'Running Simulation...',
    analyzingScenarioImpact: 'Analyzing scenario impact on railway operations',
    impactAnalysis: 'Impact Analysis',
    aiRecommendationsTitle: 'AI Recommendations',
    simulationTimeline: 'Simulation Timeline',
    readyToSimulate: 'Ready to Simulate',
    selectScenarioAndConfigure: 'Select a scenario and configure parameters to run your simulation',
    testDifferentScenarios: 'Test different scenarios and analyze their impact on railway operations',
    
    // Notifications
    alertType: 'Alert Type',
    delayAlert: 'Delay Alert',
    conflictAlert: 'Conflict Alert',
    safetyAlert: 'Safety Alert',
    priorityAlert: 'Priority Alert',
    sendTo: 'Send To',
    allControllers: 'All Controllers',
    sectionControllers: 'Section Controllers',
    stationMasters: 'Station Masters',
    maintenanceTeam: 'Maintenance Team',
    passengers: 'Passengers',
    customMessage: 'Custom Message',
    customMessageOptional: 'Custom Message (Optional)',
    enterCustomMessage: 'Enter custom message or leave blank for default template...',
    preview: 'Preview',
    sendNotification: 'Send Notification',
    notificationSentSuccessfully: 'Notification sent successfully!',
    
    // AI Recommendations
    alternatives: 'Alternatives',
    noRecommendations: 'No recommendations',
    allSystemsOptimal: 'All systems optimal',
    recommendationAcceptedSuccessfully: 'Recommendation accepted successfully!',
    recommendationOverriddenSuccessfully: 'Recommendation overridden successfully!',
    overrideRecommendation: 'Override Recommendation',
    pleaseProvideReasonForOverride: 'Please provide a reason for overriding this recommendation:',
    enterReasonForOverride: 'Enter reason for override...',
    confirmOverride: 'Confirm Override',
    pleaseProvideReason: 'Please provide a reason for override',
    
    // Block Occupancy
    blockSection: 'Block Section',
    currentStatus: 'Current Status',
    blockOccupancyTimelineLegend: 'Block Occupancy Timeline Legend',
    trackStatus: 'Track Status',
    freeAvailableForScheduling: 'Available for scheduling',
    reservedScheduledApproaching: 'Scheduled/Approaching',
    occupiedTrainCurrentlyPresent: 'Train currently present',
    trainTypes: 'Train Types',
    expressTrains8minSlots: 'Express Trains (8min slots)',
    passengerTrains6minSlots: 'Passenger Trains (6min slots)',
    freightTrains15minSlots: 'Freight Trains (15min slots)',
    timelineDetails: 'Timeline Details',
    eachColumn5MinuteInterval: '• Each column = 5-minute interval',
    totalView60MinutesAhead: '• Total view = 60 minutes ahead',
    hoverForTrainDetails: '• Hover for train details',
    realTimeUpdatesEvery30Seconds: '• Real-time updates every 30 seconds',
    scrollHorizontallyOnMobile: '• Scroll horizontally on mobile',
    currentTime: 'Current Time',
    
    // Railway Map
    railwayNetworkMap: 'Railway Network Map',
    interactiveMapTemporarilyUnavailable: 'Interactive map temporarily unavailable',
    legend: 'Legend',
    freeTrack: 'Free Track',
    reservedTrack: 'Reserved Track',
    occupiedTrack: 'Occupied Track',
    expressTrain: 'Express Train',
    freightTrain: 'Freight Train',
    passengerTrain: 'Passenger Train',
    
    // Error messages
    somethingWentWrong: 'Something went wrong',
    errorOccurredWhileLoading: 'An error occurred while loading this component. Please refresh the page to try again.',
    refreshPage: 'Refresh Page',
    
    // Settings
    settings: 'Settings',
    toggleTheme: 'Toggle theme',
    toggleLanguage: 'Toggle language',
    
    // Government branding
    irctc: 'IRCTC',
    indianRailways: 'Indian Railways',
    govtOfIndia: 'Govt. of India',
    indianRailwaysTrafficManagementSystem: 'Indian Railways Traffic Management System',
    
    // Misc
    initializingMargdarshi: 'Initializing MargDarshi...',
    trainsPerHour: 'trains/hr',
    efficiency: 'eff',
    total: 'Total'
  },
  hi: {
    // Navigation
    dashboard: 'डैशबोर्ड',
    decisionLog: 'निर्णय लॉग',
    kpiDashboard: 'KPI डैशबोर्ड',
    simulation: 'क्या-यदि सिमुलेशन',
    notifications: 'पुश नोटिफिकेशन',
    logout: 'लॉगआउट',
    
    // Login
    login: 'लॉगिन',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    section: 'अनुभाग',
    poweredBy: 'AI निर्णय सहायता द्वारा संचालित – मार्गदर्शी',
    selectSection: 'अनुभाग चुनें',
    enterUsername: 'उपयोगकर्ता नाम दर्ज करें',
    enterPassword: 'पासवर्ड दर्ज करें',
    allFieldsRequired: 'सभी फील्ड आवश्यक हैं',
    
    // Dashboard
    liveTrains: 'लाइव ट्रेन सूची',
    railwayMap: 'रियल-टाइम रेलवे मैप',
    aiRecommendations: 'AI सिफारिशें',
    blockOccupancy: 'ब्लॉक कब्जा और समयरेखा',
    next60Minutes: 'अगले 60 मिनट',
    realTimeBlockOccupancy: 'रियल-टाइम ब्लॉक कब्जा स्थिति और समयरेखा (गैंट-स्टाइल दृश्य)',
    
    // Train details
    trainId: 'ट्रेन ID',
    trainName: 'ट्रेन नाम',
    type: 'प्रकार',
    eta: 'ETA',
    delay: 'देरी',
    speed: 'गति',
    currentBlock: 'वर्तमान ब्लॉक',
    onTime: 'समय पर',
    block: 'ब्लॉक',
    
    // Train types
    express: 'एक्सप्रेस',
    freight: 'मालगाड़ी',
    passenger: 'यात्री',
    
    // Actions
    accept: 'स्वीकार करें',
    rethink: 'पुनर्विचार',
    send: 'भेजें',
    export: 'निर्यात',
    search: 'खोजें',
    filter: 'फिल्टर',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    close: 'बंद करें',
    confirm: 'पुष्टि करें',
    reset: 'रीसेट',
    run: 'चलाएं',
    
    // Status
    free: 'मुक्त',
    reserved: 'आरक्षित',
    occupied: 'कब्जे में',
    available: 'उपलब्ध',
    
    // Time
    mins: 'मिनट',
    hours: 'घंटे',
    min: 'मिनट',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफलता',
    
    // Decision Log
    timestamp: 'समयचिह्न',
    planSummary: 'योजना सारांश',
    action: 'कार्य',
    reason: 'कारण',
    metrics: 'मेट्रिक्स',
    allActions: 'सभी कार्य',
    accepted: 'स्वीकृत',
    overridden: 'ओवरराइड',
    searchTrainsOrPlans: 'ट्रेन या योजनाएं खोजें...',
    
    // KPI Dashboard
    averageDelay: 'औसत देरी',
    throughput: 'थ्रूपुट',
    blockUtilization: 'ब्लॉक उपयोग',
    conflictsResolved: 'संघर्ष हल',
    improving: 'सुधार हो रहा है',
    reducing: 'कम हो रहा है',
    delayTrendToday: 'देरी की प्रवृत्ति (आज)',
    decisionOutcomesLast24h: 'निर्णय परिणाम (पिछले 24 घंटे)',
    performanceSummary: 'प्रदर्शन सारांश',
    onTimePerformance: 'समय पर प्रदर्शन',
    systemEfficiency: 'सिस्टम दक्षता',
    activeAlerts: 'सक्रिय अलर्ट',
    aiAccuracy: 'AI सटीकता',
    realTimePerformanceMetrics: 'रियल-टाइम प्रदर्शन मेट्रिक्स और विश्लेषण',
    
    // Simulation
    simulationSetup: 'सिमुलेशन सेटअप',
    selectScenario: 'परिदृश्य चुनें',
    trackBlockage: 'ट्रैक अवरोध',
    simulateBlockedSection: 'अवरुद्ध अनुभाग का सिमुलेशन',
    trainBreakdown: 'ट्रेन खराबी',
    simulateTrainMechanicalFailure: 'ट्रेन यांत्रिक विफलता का सिमुलेशन',
    vipPriority: 'VIP प्राथमिकता',
    simulateVipTrainPriorityOverride: 'VIP ट्रेन प्राथमिकता ओवरराइड का सिमुलेशन',
    weatherDelay: 'मौसम देरी',
    simulateWeatherRelatedDelays: 'मौसम संबंधी देरी का सिमुलेशन',
    trainIdOptional: 'ट्रेन ID (वैकल्पिक)',
    blockIdOptional: 'ब्लॉक ID (वैकल्पिक)',
    durationMinutes: 'अवधि (मिनट)',
    severity: 'गंभीरता',
    low: 'कम',
    medium: 'मध्यम',
    high: 'उच्च',
    critical: 'गंभीर',
    runSimulation: 'सिमुलेशन चलाएं',
    running: 'चल रहा है...',
    runningSimulation: 'सिमुलेशन चल रहा है...',
    analyzingScenarioImpact: 'रेलवे संचालन पर परिदृश्य प्रभाव का विश्लेषण',
    impactAnalysis: 'प्रभाव विश्लेषण',
    aiRecommendationsTitle: 'AI सिफारिशें',
    simulationTimeline: 'सिमुलेशन समयरेखा',
    readyToSimulate: 'सिमुलेशन के लिए तैयार',
    selectScenarioAndConfigure: 'अपना सिमुलेशन चलाने के लिए एक परिदृश्य चुनें और पैरामीटर कॉन्फ़िगर करें',
    testDifferentScenarios: 'विभिन्न परिदृश्यों का परीक्षण करें और रेलवे संचालन पर उनके प्रभाव का विश्लेषण करें',
    
    // Notifications
    alertType: 'अलर्ट प्रकार',
    delayAlert: 'देरी अलर्ट',
    conflictAlert: 'संघर्ष अलर्ट',
    safetyAlert: 'सुरक्षा अलर्ट',
    priorityAlert: 'प्राथमिकता अलर्ट',
    sendTo: 'भेजें',
    allControllers: 'सभी नियंत्रक',
    sectionControllers: 'अनुभाग नियंत्रक',
    stationMasters: 'स्टेशन मास्टर',
    maintenanceTeam: 'रखरखाव टीम',
    passengers: 'यात्री',
    customMessage: 'कस्टम संदेश',
    customMessageOptional: 'कस्टम संदेश (वैकल्पिक)',
    enterCustomMessage: 'कस्टम संदेश दर्ज करें या डिफ़ॉल्ट टेम्प्लेट के लिए खाली छोड़ें...',
    preview: 'पूर्वावलोकन',
    sendNotification: 'नोटिफिकेशन भेजें',
    notificationSentSuccessfully: 'नोटिफिकेशन सफलतापूर्वक भेजा गया!',
    
    // AI Recommendations
    alternatives: 'विकल्प',
    noRecommendations: 'कोई सिफारिश नहीं',
    allSystemsOptimal: 'सभी सिस्टम इष्टतम',
    recommendationAcceptedSuccessfully: 'सिफारिश सफलतापूर्वक स्वीकार की गई!',
    recommendationOverriddenSuccessfully: 'सिफारिश सफलतापूर्वक ओवरराइड की गई!',
    overrideRecommendation: 'सिफारिश ओवरराइड करें',
    pleaseProvideReasonForOverride: 'कृपया इस सिफारिश को ओवरराइड करने का कारण प्रदान करें:',
    enterReasonForOverride: 'ओवरराइड का कारण दर्ज करें...',
    confirmOverride: 'ओवरराइड की पुष्टि करें',
    pleaseProvideReason: 'कृपया ओवरराइड का कारण प्रदान करें',
    
    // Block Occupancy
    blockSection: 'ब्लॉक अनुभाग',
    currentStatus: 'वर्तमान स्थिति',
    blockOccupancyTimelineLegend: 'ब्लॉक कब्जा समयरेखा लेजेंड',
    trackStatus: 'ट्रैक स्थिति',
    freeAvailableForScheduling: 'शेड्यूलिंग के लिए उपलब्ध',
    reservedScheduledApproaching: 'निर्धारित/पहुंच रहा है',
    occupiedTrainCurrentlyPresent: 'ट्रेन वर्तमान में मौजूद',
    trainTypes: 'ट्रेन प्रकार',
    expressTrains8minSlots: 'एक्सप्रेस ट्रेनें (8 मिनट स्लॉट)',
    passengerTrains6minSlots: 'यात्री ट्रेनें (6 मिनट स्लॉट)',
    freightTrains15minSlots: 'मालगाड़ी ट्रेनें (15 मिनट स्लॉट)',
    timelineDetails: 'समयरेखा विवरण',
    eachColumn5MinuteInterval: '• प्रत्येक कॉलम = 5-मिनट अंतराल',
    totalView60MinutesAhead: '• कुल दृश्य = 60 मिनट आगे',
    hoverForTrainDetails: '• ट्रेन विवरण के लिए होवर करें',
    realTimeUpdatesEvery30Seconds: '• हर 30 सेकंड में रियल-टाइम अपडेट',
    scrollHorizontallyOnMobile: '• मोबाइल पर क्षैतिज रूप से स्क्रॉल करें',
    currentTime: 'वर्तमान समय',
    
    // Railway Map
    railwayNetworkMap: 'रेलवे नेटवर्क मैप',
    interactiveMapTemporarilyUnavailable: 'इंटरैक्टिव मैप अस्थायी रूप से अनुपलब्ध',
    legend: 'लेजेंड',
    freeTrack: 'मुक्त ट्रैक',
    reservedTrack: 'आरक्षित ट्रैक',
    occupiedTrack: 'कब्जे में ट्रैक',
    expressTrain: 'एक्सप्रेस ट्रेन',
    freightTrain: 'मालगाड़ी ट्रेन',
    passengerTrain: 'यात्री ट्रेन',
    
    // Error messages
    somethingWentWrong: 'कुछ गलत हुआ',
    errorOccurredWhileLoading: 'इस घटक को लोड करते समय एक त्रुटि हुई। कृपया पुनः प्रयास करने के लिए पृष्ठ को रीफ्रेश करें।',
    refreshPage: 'पृष्ठ रीफ्रेश करें',
    
    // Settings
    settings: 'सेटिंग्स',
    toggleTheme: 'थीम टॉगल करें',
    toggleLanguage: 'भाषा टॉगल करें',
    
    // Government branding
    irctc: 'IRCTC',
    indianRailways: 'भारतीय रेलवे',
    govtOfIndia: 'भारत सरकार',
    indianRailwaysTrafficManagementSystem: 'भारतीय रेलवे यातायात प्रबंधन प्रणाली',
    
    // Misc
    initializingMargdarshi: 'मार्गदर्शी प्रारंभ हो रहा है...',
    trainsPerHour: 'ट्रेन/घंटा',
    efficiency: 'दक्षता',
    total: 'कुल'
  }
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en')

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en')
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  const value = {
    language,
    toggleLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
