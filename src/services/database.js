// Simplified database service for production deployment
import { mockTrains, mockBlocks } from '../data/mockData'

// For production deployment, we'll use mock data and localStorage
const STORAGE_PREFIX = 'margdarshi_'

export const initializeDatabase = async () => {
  try {
    // Initialize localStorage with mock data if not exists
    if (!localStorage.getItem(`${STORAGE_PREFIX}trains`)) {
      localStorage.setItem(`${STORAGE_PREFIX}trains`, JSON.stringify(mockTrains))
    }
    
    if (!localStorage.getItem(`${STORAGE_PREFIX}blocks`)) {
      localStorage.setItem(`${STORAGE_PREFIX}blocks`, JSON.stringify(mockBlocks))
    }
    
    if (!localStorage.getItem(`${STORAGE_PREFIX}decisions`)) {
      localStorage.setItem(`${STORAGE_PREFIX}decisions`, JSON.stringify([]))
    }

    console.log('Database initialized successfully with localStorage')
    return { success: true, message: 'Database initialized successfully' }
  } catch (error) {
    console.error('Database initialization error:', error)
    return { success: false, error: error.message }
  }
}

export const getTrains = async () => {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}trains`)
    if (stored) {
      return JSON.parse(stored)
    }
    return mockTrains
  } catch (error) {
    console.error('Error fetching trains:', error)
    return mockTrains
  }
}

export const updateTrain = async (trainId, updates) => {
  try {
    const trains = await getTrains()
    const updatedTrains = trains.map(train => 
      train.id === trainId ? { ...train, ...updates } : train
    )
    localStorage.setItem(`${STORAGE_PREFIX}trains`, JSON.stringify(updatedTrains))
    return updatedTrains.find(train => train.id === trainId)
  } catch (error) {
    console.error('Error updating train:', error)
    return null
  }
}

export const getBlocks = async () => {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}blocks`)
    if (stored) {
      return JSON.parse(stored)
    }
    return mockBlocks
  } catch (error) {
    console.error('Error fetching blocks:', error)
    return mockBlocks
  }
}

export const updateBlock = async (blockId, updates) => {
  try {
    const blocks = await getBlocks()
    const updatedBlocks = blocks.map(block => 
      block.id === blockId ? { ...block, ...updates } : block
    )
    localStorage.setItem(`${STORAGE_PREFIX}blocks`, JSON.stringify(updatedBlocks))
    return updatedBlocks.find(block => block.id === blockId)
  } catch (error) {
    console.error('Error updating block:', error)
    return null
  }
}

export const getDecisions = async (limit = 50) => {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}decisions`)
    const decisions = stored ? JSON.parse(stored) : []
    return decisions.slice(0, limit)
  } catch (error) {
    console.error('Error fetching decisions:', error)
    return []
  }
}

export const saveDecision = async (decision) => {
  try {
    const decisions = await getDecisions()
    const newDecision = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...decision
    }
    decisions.unshift(newDecision)
    localStorage.setItem(`${STORAGE_PREFIX}decisions`, JSON.stringify(decisions.slice(0, 100))) // Keep only last 100
    return newDecision
  } catch (error) {
    console.error('Error saving decision:', error)
    return null
  }
}
