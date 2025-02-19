import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useMap } from '../../context/MapContext'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import {
  createMarker,
  setupMapInteractions,
  DEFAULT_CENTER,
} from './utils/mapHandlers'
import MapErrorBoundary from './MapErrorBoundary'
import Sidebar from '../Sidebar'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const MapComponent = ({
  setUserPin,
  setAllPins,
  selectedPin,
  setSelectedPin,
}) => {
  const mapContainer = useRef(null)
  const markersRef = useRef(new Map())
  const { user } = useAuth()
  const { socket } = useSocket()
  const {
    map,
    initializeMap,
    getUserLocation,
    locationError,
    setLocationError,
    userLocation,
    setUserLocation,
    isMapLoaded,
  } = useMap()

  const [viewport, setViewport] = useState({
    longitude: DEFAULT_CENTER[0],
    latitude: DEFAULT_CENTER[1],
    zoom: 9,
  })

  const isValidViewport = viewport => {
    return (
      viewport &&
      typeof viewport.longitude === 'number' &&
      !isNaN(viewport.longitude) &&
      viewport.longitude >= -180 &&
      viewport.longitude <= 180 &&
      typeof viewport.latitude === 'number' &&
      !isNaN(viewport.latitude) &&
      viewport.latitude >= -90 &&
      viewport.latitude <= 90 &&
      typeof viewport.zoom === 'number' &&
      !isNaN(viewport.zoom) &&
      viewport.zoom >= 0
    )
  }

  const [currentPopup, setCurrentPopup] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initError, setInitError] = useState(null)

  const getAuthConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }),
    [],
  )

  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      if (marker && marker.remove) {
        marker.remove()
      }
    })
    markersRef.current.clear()
  }, [])

  const addPinMarker = useCallback(
    (pin, index) => {
      if (!map || !isMapLoaded) return

      // Remove existing marker if it exists
      const existingMarker = markersRef.current.get(pin._id)
      if (existingMarker) {
        existingMarker.remove()
      }

      // Create new marker
      const marker = createMarker(
        [pin.location.coordinates[0], pin.location.coordinates[1]],
        {
          map,
          type: pin.user === user?._id ? 'user' : 'sitter',
          className: pin.user === user?._id ? 'user-marker' : 'sitter-marker',
          onClick: () => setSelectedPin(pin),
          index,
        },
      )

      // Store the new marker
      markersRef.current.set(pin._id, marker)
      return marker
    },
    [map, user, isMapLoaded],
  )

  const fetchPinsInBounds = useCallback(
    async bounds => {
      try {
        const center = map.getCenter()
        const response = await axios.get(
          `${BACKEND_URL}/api/location-pins/in-bounds`,
          {
            params: {
              ...bounds,
              longitude: center.lng,
              latitude: center.lat,
            },
            ...getAuthConfig(),
          },
        )

        if (response.data && Array.isArray(response.data)) {
          setAllPins(prevPins => {
            // Only show pins within 50km
            const validPins = response.data.filter(pin => pin.distance <= 50000)

            const newPinsMap = new Map()
            validPins.forEach(pin => {
              newPinsMap.set(pin._id, pin)
            })

            // Clean up markers for deleted/out-of-range pins
            markersRef.current.forEach((marker, pinId) => {
              if (!newPinsMap.has(pinId)) {
                marker.remove()
                markersRef.current.delete(pinId)
              }
            })

            // Update markers for remaining pins
            if (isMapLoaded) {
              validPins.forEach((pin, index) => {
                const existingMarker = markersRef.current.get(pin._id)
                if (!existingMarker) {
                  addPinMarker(pin, index)
                }
              })
            }

            return Array.from(newPinsMap.values())
          })
        } else {
          console.log('No pins found in current bounds')
        }
      } catch (error) {
        console.warn('Error fetching pins in bounds:', error.response || error)
      }
    },
    [getAuthConfig, addPinMarker, isMapLoaded, map],
  )

  const fetchAllPins = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/all-pins`,
        getAuthConfig(),
      )

      if (response.data && Array.isArray(response.data)) {
        const validPins = response.data.filter(pin => pin && pin._id)
        setAllPins(validPins)

        if (isMapLoaded) {
          // Clear existing markers
          clearAllMarkers()

          // Add markers for valid pins
          validPins.forEach((pin, index) => {
            addPinMarker(pin, index)
          })
        }
      } else {
        setAllPins([])
        clearAllMarkers()
      }
    } catch (error) {
      console.error('Error fetching pins:', error)

      if (error.response?.status === 404 && error.response?.data?.pinId) {
        setAllPins(prevPins =>
          prevPins.filter(pin => pin._id !== error.response.data.pinId),
        )

        const marker = markersRef.current.get(error.response.data.pinId)
        if (marker) {
          marker.remove()
          markersRef.current.delete(error.response.data.pinId)
        }
      } else {
        // For other errors, maintain existing state
        console.warn('Error fetching pins, maintaining current state')
      }
    } finally {
      setIsLoading(false)
    }
  }, [setAllPins, getAuthConfig, clearAllMarkers, addPinMarker, isMapLoaded])

  const cleanupDeletedPins = useCallback(
    pinId => {
      setAllPins(prevPins => prevPins.filter(pin => pin._id !== pinId))
      const marker = markersRef.current.get(pinId)
      if (marker) {
        marker.remove()
        markersRef.current.delete(pinId)
      }
    },
    [setAllPins],
  )

  const loadUserPin = useCallback(async () => {
    if (!user?._id) return

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/search`,
        {
          params: { userId: user._id },
          ...getAuthConfig(),
        },
      )

      if (response.data.length > 0) {
        setUserPin(response.data[0])
      }
    } catch (error) {
      console.error('Error loading user pin:', error)
    }
  }, [user, getAuthConfig])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map) return

    const initMap = async () => {
      try {
        setIsLoading(true)
        setInitError(null)
        await initializeMap(mapContainer.current)
      } catch (error) {
        console.error('Map initialization error:', error)
        setInitError('Failed to initialize map')
        setLocationError('Failed to initialize map')
      }
    }

    initMap()

    return () => {
      clearAllMarkers()
    }
  }, [])
  useEffect(() => {
    if (!map || !isMapLoaded) return

    let debounceTimeout

    const cleanup = setupMapInteractions(map, {
      onMapClick: () => {
        if (currentPopup) {
          currentPopup.remove()
          setCurrentPopup(null)
        }
      },
      onViewportChange: newViewport => {
        if (!isValidViewport(newViewport)) {
          console.warn('Invalid viewport data:', newViewport)
          return
        }

        setViewport(newViewport)

        if (debounceTimeout) {
          clearTimeout(debounceTimeout)
        }

        debounceTimeout = setTimeout(() => {
          try {
            const bounds = map.getBounds()
            if (!bounds) {
              console.warn('Unable to get map bounds')
              return
            }

            const boundingBox = {
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            }

            // Validate bounds before fetching
            if (Object.values(boundingBox).some(val => !val && val !== 0)) {
              console.warn('Invalid bounds values:', boundingBox)
              return
            }

            if (newViewport.zoom >= 9) {
              fetchPinsInBounds(boundingBox)

              if (socket) {
                socket.emit('viewport_update', {
                  ...newViewport,
                  bounds: boundingBox,
                })
              }
            }
          } catch (error) {
            console.error('Error handling viewport change:', error)
          }
        }, 500)
      },
    })

    return () => {
      cleanup()
      if (debounceTimeout) {
        clearTimeout(debounceTimeout)
      }
    }
  }, [map, isMapLoaded, currentPopup, fetchPinsInBounds, socket])

  // Load initial pins
  useEffect(() => {
    if (map && isMapLoaded) {
      fetchAllPins()
      loadUserPin()
    }
  }, [map, isMapLoaded, fetchAllPins, loadUserPin])

  // Socket listeners
  useEffect(() => {
    if (!socket || !isMapLoaded) return

    const handleUserPinCreated = data => {
      if (data.userId === user?._id) {
        console.log('Received user pin created:', data)

        clearAllMarkers()
        fetchAllPins()
        loadUserPin()

        if (data.pin?.location?.coordinates && map) {
          map.flyTo({
            center: data.pin.location.coordinates,
            zoom: 14,
            essential: true,
          })
        }
      }
    }

    const handleUserPinUpdated = data => {
      // Only update for the current user
      if (data.userId === user?._id) {
        console.log('Received user pin updated:', data)

        clearAllMarkers()
        fetchAllPins()
        loadUserPin()

        if (data.pin?.location?.coordinates && map) {
          map.flyTo({
            center: data.pin.location.coordinates,
            zoom: 14,
            essential: true,
          })
        }
      }
    }

    socket.on('user_pin_created', handleUserPinCreated)
    socket.on('user_pin_updated', handleUserPinUpdated)
    socket.on('pin_deleted', cleanupDeletedPins)
    socket.on('center_map', location => {
      if (location && location.userId === user?._id && map) {
        setUserLocation(location)
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
        })
      }
    })

    socket.emit('viewport_update', viewport)

    return () => {
      socket.off('user_pin_created', handleUserPinCreated)
      socket.off('user_pin_updated', handleUserPinUpdated)
      socket.off('pin_deleted')
      socket.off('center_map')
    }
  }, [
    socket,
    map,
    isMapLoaded,
    fetchAllPins,
    loadUserPin,
    clearAllMarkers,
    viewport,
    user,
    cleanupDeletedPins,
  ])

  useEffect(() => {
    if (isMapLoaded) {
      setIsLoading(false)
    }
  }, [isMapLoaded])

  return (
    <MapErrorBoundary>
      <div className='w-full h-full relative'>
        {locationError && (
          <div className='absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md'>
            <p>{locationError}</p>
          </div>
        )}
        {isLoading ? (
          <div className='absolute inset-0 bg-white/50 flex items-center justify-center z-20'>
            <div className='bg-white p-4 rounded-lg shadow flex flex-col items-center gap-2'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
              <p>Loading map...</p>
            </div>
          </div>
        ) : initError ? (
          <div className='absolute inset-0 flex items-center justify-center'>
            <div className='bg-red-50 p-4 rounded-lg shadow text-red-600'>
              {initError}
            </div>
          </div>
        ) : null}
        <div ref={mapContainer} className='w-full h-full' />
      </div>
    </MapErrorBoundary>
  )
}

export default MapComponent
