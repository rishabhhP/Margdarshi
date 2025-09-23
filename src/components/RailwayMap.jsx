import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import ErrorBoundary from './ErrorBoundary'

const RailwayMap = ({ trains }) => {
  const { t } = useLanguage()
  const mapRef = useRef()
  const [mapError, setMapError] = useState(false)
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [loadingLeaflet, setLoadingLeaflet] = useState(true)
  const mapInstanceRef = useRef(null)

  // CHANGED: Simplified to just 3 cities - Mumbai, Delhi, Kolkata with basic connection
  const cityCoordinates = {
    mumbai: { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
    delhi: { lat: 28.6139, lng: 77.2090, name: 'Delhi' },
    kolkata: { lat: 22.5726, lng: 88.3639, name: 'Kolkata' }
  }

  useEffect(() => {
    let timeoutId
    
    // Check if Leaflet is available
    if (typeof window !== 'undefined' && window.L) {
      setLeafletLoaded(true)
      setLoadingLeaflet(false)
    } else {
      // Set timeout for loading
      timeoutId = setTimeout(() => {
        setMapError(true)
        setLoadingLeaflet(false)
      }, 5000) // 5 second timeout

      // Load Leaflet dynamically
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = () => {
        clearTimeout(timeoutId)
        setLeafletLoaded(true)
        setLoadingLeaflet(false)
      }
      script.onerror = () => {
        clearTimeout(timeoutId)
        setMapError(true)
        setLoadingLeaflet(false)
      }
      document.head.appendChild(script)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  // Loading state
  if (loadingLeaflet) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading railway map...</p>
        </div>
      </div>
    )
  }

  // CHANGED: Simplified fallback map - just shows the 3 cities with static route lines
  const FallbackMap = () => (
    <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg relative">
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Railway Network Map
        </h3>
        
        {/* CHANGED: Simple static route visualization - removed train animation */}
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs">Mumbai</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-400 mx-2">
              {/* REMOVED: Train animation div completely */}
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs">Delhi</span>
            </div>
            <div className="flex-1 h-0.5 bg-gray-400 mx-2"></div>
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-1"></div>
              <span className="text-xs">Kolkata</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // CHANGED: Simplified Leaflet map - just shows 3 cities with connecting lines, no train animation
  const SimpleLeafletMap = () => {
    const mapContainerRef = useRef(null)

    useEffect(() => {
      if (!window.L || !mapContainerRef.current) return

      let map
      try {
        // Initialize map centered on India
        map = window.L.map(mapContainerRef.current).setView([23.5937, 78.9629], 5)
        mapInstanceRef.current = map

        // Add tile layer
        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 18
        }).addTo(map)

        // CHANGED: Add city markers
        Object.values(cityCoordinates).forEach(city => {
          window.L.marker([city.lat, city.lng])
            .addTo(map)
            .bindPopup(city.name)
        })

        // CHANGED: Add connecting lines between cities
        const mumbaiToDelhi = window.L.polyline([
          [cityCoordinates.mumbai.lat, cityCoordinates.mumbai.lng],
          [cityCoordinates.delhi.lat, cityCoordinates.delhi.lng]
        ], { color: 'blue', weight: 3 }).addTo(map)

        const delhiToKolkata = window.L.polyline([
          [cityCoordinates.delhi.lat, cityCoordinates.delhi.lng],
          [cityCoordinates.kolkata.lat, cityCoordinates.kolkata.lng]
        ], { color: 'blue', weight: 3 }).addTo(map)

        // REMOVED: All train marker and animation code completely

        // Cleanup
        return () => {
          if (map) {
            try {
              map.remove()
              mapInstanceRef.current = null
            } catch (error) {
              console.error('Error removing map:', error)
            }
          }
        }

      } catch (error) {
        console.error('Error initializing map:', error)
        setMapError(true)
      }
    }, [])

    return <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} />
  }

  if (mapError || !leafletLoaded) {
    return <FallbackMap />
  }

  return (
    <div className="h-full relative">
      <ErrorBoundary>
        <SimpleLeafletMap />
      </ErrorBoundary>
    </div>
  )
}

export default RailwayMap
