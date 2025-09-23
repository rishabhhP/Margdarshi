export const mockTrains = [
  {
    id: '12432',
    name: 'Rajdhani Express',
    type: 'Express',
    eta: '10:32',
    delay: 5,
    currentSpeed: 120,
    currentBlock: 'A12',
    route: 'Delhi-Mumbai',
    passengerLoad: 85
  },
  {
    id: '12951',
    name: 'Mumbai Rajdhani',
    type: 'Express',
    eta: '11:15',
    delay: 0,
    currentSpeed: 110,
    currentBlock: 'B08',
    route: 'Mumbai-Delhi',
    passengerLoad: 92
  },
  {
    id: '18448',
    name: 'Hirakud Express',
    type: 'Passenger',
    eta: '12:45',
    delay: 12,
    currentSpeed: 85,
    currentBlock: 'C15',
    route: 'Bhubaneswar-Delhi',
    passengerLoad: 78
  },
  {
    id: '16032',
    name: 'Andaman Express',
    type: 'Express',
    eta: '13:20',
    delay: 3,
    currentSpeed: 95,
    currentBlock: 'D22',
    route: 'Chennai-Jammu',
    passengerLoad: 88
  },
  {
    id: '22691',
    name: 'Freight Special',
    type: 'Freight',
    eta: '14:10',
    delay: 8,
    currentSpeed: 65,
    currentBlock: 'E05',
    route: 'Mumbai-Kolkata',
    passengerLoad: 0
  },
  {
    id: '12002',
    name: 'Shatabdi Express',
    type: 'Express',
    eta: '15:30',
    delay: 0,
    currentSpeed: 130,
    currentBlock: 'F18',
    route: 'Delhi-Chandigarh',
    passengerLoad: 95
  },
  {
    id: '19037',
    name: 'Avadh Express',
    type: 'Passenger',
    eta: '16:45',
    delay: 15,
    currentSpeed: 75,
    currentBlock: 'G12',
    route: 'Lucknow-Mumbai',
    passengerLoad: 82
  },
  {
    id: '22470',
    name: 'Cargo Express',
    type: 'Freight',
    eta: '17:20',
    delay: 5,
    currentSpeed: 70,
    currentBlock: 'H09',
    route: 'Delhi-Chennai',
    passengerLoad: 0
  }
]

export const mockRecommendations = [
  {
    id: 1,
    trainId: '12432',
    description: 'Hold Train 12432 for 3 mins at Aligarh Jn to allow Express 12951 priority passage. This will optimize overall network throughput.',
    confidence: 87,
    impact: 'high',
    metrics: {
      throughputGain: 2,
      delayReduction: 5,
      efficiency: 94
    },
    alternatives: [
      'Reduce speed of 12432 to 80 km/h for next 10 km',
      'Reroute via alternate track (adds 8 min journey time)'
    ]
  },
  {
    id: 2,
    trainId: '18448',
    description: 'Reroute Train 18448 via alternate track due to maintenance work on primary route. Expected delay: +6 minutes.',
    confidence: 92,
    impact: 'medium',
    metrics: {
      throughputGain: 1,
      delayReduction: 8,
      efficiency: 89
    },
    alternatives: [
      'Wait for maintenance completion (15 min delay)',
      'Transfer passengers to next available train'
    ]
  },
  {
    id: 3,
    trainId: '22691',
    description: 'Prioritize freight train 22691 during off-peak hours to maximize track utilization efficiency.',
    confidence: 78,
    impact: 'low',
    metrics: {
      throughputGain: 3,
      delayReduction: 2,
      efficiency: 91
    },
    alternatives: [
      'Schedule during night hours (22:00-04:00)',
      'Split cargo across multiple smaller trains'
    ]
  }
]

export const mockBlocks = [
  {
    id: 'A12',
    name: 'Delhi-Ghaziabad Section',
    currentTrain: '12432',
    estimatedClearTime: 15,
    status: 'occupied'
  },
  {
    id: 'B08',
    name: 'Agra-Mathura Section',
    currentTrain: '12951',
    estimatedClearTime: 8,
    status: 'occupied'
  },
  {
    id: 'C15',
    name: 'Kanpur-Lucknow Section',
    currentTrain: null,
    estimatedClearTime: 0,
    status: 'free'
  },
  {
    id: 'D22',
    name: 'Allahabad-Varanasi Section',
    currentTrain: null,
    estimatedClearTime: 0,
    status: 'reserved'
  },
  {
    id: 'E05',
    name: 'Patna-Gaya Section',
    currentTrain: '22691',
    estimatedClearTime: 25,
    status: 'occupied'
  },
  {
    id: 'F18',
    name: 'Howrah-Kharagpur Section',
    currentTrain: null,
    estimatedClearTime: 0,
    status: 'free'
  },
  {
    id: 'G12',
    name: 'Bhubaneswar-Cuttack Section',
    currentTrain: '19037',
    estimatedClearTime: 12,
    status: 'occupied'
  },
  {
    id: 'H09',
    name: 'Chennai-Bangalore Section',
    currentTrain: null,
    estimatedClearTime: 0,
    status: 'reserved'
  }
]

export const mockKPIData = {
  avgDelay: 12.5,
  throughput: 45,
  blockUtilization: 78,
  conflictsResolved: 23,
  onTimePerformance: 87,
  systemEfficiency: 92,
  activeAlerts: 3,
  aiAccuracy: 94
}
