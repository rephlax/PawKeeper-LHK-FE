import React, { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { useMap } from '../../../context/MapContext'
import { useSocket } from '../../../context/SocketContext'
import { useAuth } from '../../../context/AuthContext'
import { styles } from './MapComponent.styles'
import { createMapMarkers, updateMapMarkers } from '../utils/mapHelpers'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapComponent = ({
  setUserPin,
  setAllPins,
  selectedPin,
  setSelectedPin,
  setEditData,
}) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const markersRef = useRef({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const { setMap, setIsMapLoaded } = useMap()
  const { socket } = useSocket()
  const { user } = useAuth()

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Default center
        zoom: 9,
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Map load event
      map.current.on('load', () => {
        setIsLoading(false)
        setIsMapLoaded(true)
        setMap(map.current)

        // Load initial pins
        if (socket) {
          socket.emit('get_pins')
        }
      })

      // Map error event
      map.current.on('error', e => {
        console.error('Map error:', e)
        setError('Failed to load map')
        setIsLoading(false)
      })
    } catch (err) {
      console.error('Error initializing map:', err)
      setError('Failed to initialize map')
      setIsLoading(false)
    }

    return () => {
      map.current?.remove()
      setIsMapLoaded(false)
    }
  }, [setMap, setIsMapLoaded, socket])

  // Socket event listeners
  useEffect(() => {
    if (!socket || !map.current) return

    const handlePinsData = pins => {
      console.log('Received pins:', pins)
      setAllPins(pins)

      // Find user's pin
      const userPin = pins.find(pin => pin.user._id === user?._id)
      if (userPin) {
        setUserPin(userPin)
      }

      // Update markers on map
      updateMapMarkers(map.current, pins, markersRef.current, {
        onMarkerClick: handleMarkerClick,
        selectedPin,
      })
    }

    const handlePinCreated = newPin => {
      console.log('Pin created:', newPin)
      socket.emit('get_pins') // Refresh all pins
    }

    const handlePinUpdated = updatedPin => {
      console.log('Pin updated:', updatedPin)
      socket.emit('get_pins') // Refresh all pins
    }

    const handlePinDeleted = deletedPinId => {
      console.log('Pin deleted:', deletedPinId)
      socket.emit('get_pins') // Refresh all pins
    }

    socket.on('pins_data', handlePinsData)
    socket.on('pin_created', handlePinCreated)
    socket.on('pin_updated', handlePinUpdated)
    socket.on('pin_deleted', handlePinDeleted)

    return () => {
      socket.off('pins_data', handlePinsData)
      socket.off('pin_created', handlePinCreated)
      socket.off('pin_updated', handlePinUpdated)
      socket.off('pin_deleted', handlePinDeleted)
    }
  }, [socket, user, setUserPin, setAllPins, selectedPin])

  const handleMarkerClick = pin => {
    setSelectedPin(pin)

    // Center map on selected pin
    if (map.current && pin.location?.coordinates) {
      map.current.flyTo({
        center: [
          pin.location.coordinates.longitude,
          pin.location.coordinates.latitude,
        ],
        zoom: 14,
        duration: 1000,
      })
    }
  }

  const handleRetry = () => {
    setError(null)
    setIsLoading(true)
    window.location.reload()
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <p style={styles.errorMessage}>{error}</p>
          <button
            onClick={handleRetry}
            style={styles.retryButton}
            className='hover:bg-cream-700'
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      {isLoading && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingContent}>
            <div style={styles.loadingSpinner} className='text-cream-600'>
              <svg fill='currentColor' viewBox='0 0 24 24'>
                <path d='M12 2v4m0 12v4m10-10h-4M6 12H2m16.24-6.24l-2.83 2.83M7.76 16.24l-2.83 2.83m12.31 0l-2.83-2.83M7.76 7.76L4.93 4.93' />
              </svg>
            </div>
            <p className='text-cream-700'>Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapContainer} style={styles.map} />
    </div>
  )
}

export default MapComponent
