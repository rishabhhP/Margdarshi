import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import fetch from 'node-fetch'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// In-memory secrets storage (encrypted)
const secrets = new Map()
const ENCRYPTION_KEY = crypto.randomBytes(32)

const encrypt = (text) => {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY)
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return iv.toString('hex') + ':' + encrypted
}

const decrypt = (text) => {
  try {
    const textParts = text.split(':')
    const iv = Buffer.from(textParts.shift(), 'hex')
    const encryptedText = textParts.join(':')
    const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY)
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (error) {
    return null
  }
}

// Secrets endpoints
app.get('/api/secrets/:key', (req, res) => {
  const { key } = req.params
  const encryptedValue = secrets.get(key)
  if (encryptedValue) {
    const decryptedValue = decrypt(encryptedValue)
    res.json({ value: decryptedValue })
  } else {
    res.status(404).json({ error: 'Secret not found' })
  }
})

app.post('/api/secrets/:key', (req, res) => {
  const { key } = req.params
  const { value } = req.body
  const encryptedValue = encrypt(value)
  secrets.set(key, encryptedValue)
  res.json({ success: true })
})

// Enhanced RailRadar API proxy endpoint with realistic train data
app.get('/api/trains', async (req, res) => {
  try {
    // Multiple RailRadar API endpoints to try
    const railRadarEndpoints = [
      'https://railradar.trainman.in/api/v1/trains',
      'https://api.railradar.trainman.in/trains',
      'https://railradar.trainman.in/api/trains'
    ]
    
    let data = null
    let lastError = null

    // Try each endpoint
    for (const endpoint of railRadarEndpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://railradar.trainman.in/',
            'Origin': 'https://railradar.trainman.in',
            'Connection': 'keep-alive',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin'
          },
          timeout: 8000 // 8 second timeout
        })

        if (response.ok) {
          data = await response.json()
          break // Success, exit loop
        } else {
          lastError = `HTTP ${response.status}: ${response.statusText}`
        }
      } catch (error) {
        lastError = error.message
        continue // Try next endpoint
      }
    }

    if (data && data.trains) {
      // Transform the real RailRadar data
      const transformedTrains = data.trains.map(train => ({
        id: train.train_number || train.trainNumber || train.id,
        name: train.train_name || train.trainName || 'Unknown Train',
        number: train.train_number || train.trainNumber,
        lat: parseFloat(train.current_lat || train.latitude || train.lat),
        lng: parseFloat(train.current_lng || train.longitude || train.lng),
        speed: parseInt(train.current_speed || train.speed || 0),
        status: train.status || (train.current_speed > 0 ? 'Running' : 'Stopped'),
        currentStation: train.current_station || train.currentStation,
        nextStation: train.next_station || train.nextStation || 'Unknown',
        delay: parseInt(train.delay || 0),
        type: train.train_type || train.type || (train.train_number?.startsWith('12') ? 'Express' : 'Passenger'),
        bearing: train.bearing || train.direction || Math.random() * 360, // Direction for arrow rotation
        lastUpdated: train.last_updated || new Date().toISOString()
      })).filter(train => train.lat && train.lng && !isNaN(train.lat) && !isNaN(train.lng))

      res.json({
        success: true,
        trains: transformedTrains,
        count: transformedTrains.length,
        lastUpdated: new Date().toISOString(),
        source: 'railradar'
      })
      return
    }

    throw new Error(lastError || 'No valid data from any RailRadar endpoint')

  } catch (error) {
    console.error('Error fetching train data:', error)
    
    // Return enhanced mock data with realistic Indian train positions and movements
    const mockTrains = [
      {
        id: '12432',
        name: 'Rajdhani Express',
        number: '12432',
        lat: 28.6139 + (Math.random() - 0.5) * 0.1, // Delhi area with slight movement
        lng: 77.2090 + (Math.random() - 0.5) * 0.1,
        speed: 110 + Math.floor(Math.random() * 20),
        status: 'Running',
        currentStation: 'New Delhi',
        nextStation: 'Ghaziabad',
        delay: Math.floor(Math.random() * 10),
        type: 'Express',
        bearing: 90 + (Math.random() - 0.5) * 30, // Eastward direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '12951',
        name: 'Mumbai Rajdhani',
        number: '12951',
        lat: 19.0760 + (Math.random() - 0.5) * 0.1, // Mumbai area
        lng: 72.8777 + (Math.random() - 0.5) * 0.1,
        speed: 95 + Math.floor(Math.random() * 25),
        status: 'Running',
        currentStation: 'Mumbai Central',
        nextStation: 'Borivali',
        delay: Math.floor(Math.random() * 5),
        type: 'Express',
        bearing: 45 + (Math.random() - 0.5) * 30, // Northeast direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '18448',
        name: 'Hirakud Express',
        number: '18448',
        lat: 22.5726 + (Math.random() - 0.5) * 0.1, // Kolkata area
        lng: 88.3639 + (Math.random() - 0.5) * 0.1,
        speed: 75 + Math.floor(Math.random() * 20),
        status: 'Running',
        currentStation: 'Howrah',
        nextStation: 'Kharagpur',
        delay: Math.floor(Math.random() * 15),
        type: 'Passenger',
        bearing: 270 + (Math.random() - 0.5) * 30, // Westward direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '16032',
        name: 'Andaman Express',
        number: '16032',
        lat: 13.0827 + (Math.random() - 0.5) * 0.1, // Chennai area
        lng: 80.2707 + (Math.random() - 0.5) * 0.1,
        speed: 85 + Math.floor(Math.random() * 15),
        status: 'Running',
        currentStation: 'Chennai Central',
        nextStation: 'Arakkonam',
        delay: Math.floor(Math.random() * 8),
        type: 'Express',
        bearing: 180 + (Math.random() - 0.5) * 30, // Southward direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '22691',
        name: 'Freight Special',
        number: '22691',
        lat: 26.9124 + (Math.random() - 0.5) * 0.1, // Jaipur area
        lng: 75.7873 + (Math.random() - 0.5) * 0.1,
        speed: 45 + Math.floor(Math.random() * 25),
        status: 'Running',
        currentStation: 'Jaipur',
        nextStation: 'Ajmer',
        delay: Math.floor(Math.random() * 20),
        type: 'Freight',
        bearing: 225 + (Math.random() - 0.5) * 30, // Southwest direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '12002',
        name: 'Shatabdi Express',
        number: '12002',
        lat: 30.7333 + (Math.random() - 0.5) * 0.1, // Chandigarh area
        lng: 76.7794 + (Math.random() - 0.5) * 0.1,
        speed: 120 + Math.floor(Math.random() * 20),
        status: 'Running',
        currentStation: 'Chandigarh',
        nextStation: 'Ambala',
        delay: 0,
        type: 'Express',
        bearing: 135 + (Math.random() - 0.5) * 30, // Southeast direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '19037',
        name: 'Avadh Express',
        number: '19037',
        lat: 26.8467 + (Math.random() - 0.5) * 0.1, // Lucknow area
        lng: 80.9462 + (Math.random() - 0.5) * 0.1,
        speed: 65 + Math.floor(Math.random() * 20),
        status: 'Running',
        currentStation: 'Lucknow',
        nextStation: 'Kanpur',
        delay: Math.floor(Math.random() * 12),
        type: 'Passenger',
        bearing: 315 + (Math.random() - 0.5) * 30, // Northwest direction
        lastUpdated: new Date().toISOString()
      },
      {
        id: '22470',
        name: 'Cargo Express',
        number: '22470',
        lat: 17.3850 + (Math.random() - 0.5) * 0.1, // Hyderabad area
        lng: 78.4867 + (Math.random() - 0.5) * 0.1,
        speed: 55 + Math.floor(Math.random() * 20),
        status: 'Running',
        currentStation: 'Hyderabad',
        nextStation: 'Secunderabad',
        delay: Math.floor(Math.random() * 25),
        type: 'Freight',
        bearing: 0 + (Math.random() - 0.5) * 30, // Northward direction
        lastUpdated: new Date().toISOString()
      }
    ]

    res.json({
      success: false,
      error: error.message,
      trains: mockTrains,
      count: mockTrains.length,
      lastUpdated: new Date().toISOString(),
      fallback: true,
      source: 'mock'
    })
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`RailRadar proxy available at http://localhost:${PORT}/api/trains`)
})
