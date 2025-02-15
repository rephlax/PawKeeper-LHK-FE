import React, { useRef, useEffect, useState, useCallback } from 'react'
import { useMap } from '../../context/MapContext'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import {
  createMarker,
  createPinPopup,
  setupMapInteractions,
  DEFAULT_CENTER,
} from './utils/mapHandlers'
import MapErrorBoundary from './MapErrorBoundary'
import Sidebar from '../Sidebar'
import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const MapComponent = () => {
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
  const [userPin, setUserPin] = useState(null)
  const [allPins, setAllPins] = useState([])
  const [selectedPin, setSelectedPin] = useState(null)
  const [currentPopup, setCurrentPopup] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [initError, setInitError] = useState(null)

  useEffect(() => {
    console.log('Map loading state:', {
      isLoading,
      hasMap: !!map,
      isMapLoaded,
      hasSocket: !!socket,
    })
  }, [isLoading, map, isMapLoaded, socket])

  const getAuthConfig = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    }),
    [],
  )

  const clearAllMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current.clear()
  }, [])

  const addPinMarker = useCallback(
    pin => {
      if (!map?.current || !isMapLoaded) return

      const marker = createMarker(
        [pin.location.coordinates[0], pin.location.coordinates[1]],
        {
          map: map.current,
          type: pin.user === user?._id ? 'user' : 'sitter',
          className: pin.user === user?._id ? 'user-marker' : 'sitter-marker',
          onClick: () => handlePinClick(pin),
        },
      )
      markersRef.current.set(pin._id, marker)
      return marker
    },
    [map, user, isMapLoaded],
  )

  const startChat = useCallback(
    userId => {
      if (socket) {
        socket.emit('start_private_chat', { targetUserId: userId })
      }
    },
    [socket],
  )

  const handlePinClick = useCallback(
    pin => {
      if (currentPopup) {
        currentPopup.remove()
      }

      setSelectedPin(pin)

      const popup = createPinPopup(pin, user, {
        onChat: userId => {
          if (socket) {
            socket.emit('start_private_chat', { targetUserId: userId })
          }
        },
        onReview: pin => {
          if (socket) {
            socket.emit('toggle_review_creation', {
              isCreating: true,
              targetPin: pin,
            })
          }
        },
        onEdit: pin => {
          if (socket) {
            socket.emit('toggle_pin_creation', {
              isCreating: true,
              isEditing: true,
              pinData: pin,
            })
          }
        },
      })

      popup.setLngLat(pin.location.coordinates).addTo(map.current)
      setCurrentPopup(popup)

      popup.on('close', () => {
        setSelectedPin(null)
        setCurrentPopup(null)
      })
    },
    [socket, user, currentPopup, map],
  )

  const fetchPinsInBounds = useCallback(
    async bounds => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/location-pins/in-bounds`,
          {
            params: bounds,
            ...getAuthConfig(),
          },
        )

        setAllPins(prevPins => {
          const newPins = response.data
          const pinsOutsideBounds = prevPins.filter(pin => {
            const [lng, lat] = pin.location.coordinates
            return !(
              lng >= bounds.west &&
              lng <= bounds.east &&
              lat >= bounds.south &&
              lat <= bounds.north
            )
          })

          return [...pinsOutsideBounds, ...newPins]
        })

        if (isMapLoaded) {
          // Update markers
          response.data.forEach(pin => {
            if (!markersRef.current.has(pin._id)) {
              addPinMarker(pin)
            }
          })

          markersRef.current.forEach((marker, pinId) => {
            if (!response.data.find(pin => pin._id === pinId)) {
              marker.remove()
              markersRef.current.delete(pinId)
            }
          })
        }
      } catch (error) {
        console.error('Error fetching pins in bounds:', error)
      }
    },
    [getAuthConfig, addPinMarker, isMapLoaded],
  )

  const fetchAllPins = useCallback(async () => {
    try {
      setIsLoading(true)
      console.log('Fetching pins with auth:', getAuthConfig())

      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/all-pins`,
        getAuthConfig(),
      )

      console.log('Received pins:', response.data)

      setAllPins(response.data)
      clearAllMarkers()

      if (isMapLoaded) {
        response.data.forEach(pin => {
          addPinMarker(pin)
        })
      }
    } catch (error) {
      console.error('Error fetching pins:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })

      alert('Failed to load pins. Please try refreshing the page.')
    } finally {
      setIsLoading(false)
    }
  }, [getAuthConfig, clearAllMarkers, addPinMarker, isMapLoaded])

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
      } finally {
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      clearAllMarkers()
    }
  }, [])

  // Set up map interactions
  useEffect(() => {
    if (!map?.current || !isMapLoaded) return

    const cleanup = setupMapInteractions(map.current, {
      onMapClick: () => {
        if (currentPopup) {
          currentPopup.remove()
          setCurrentPopup(null)
        }
      },
      onViewportChange: newViewport => {
        setViewport(newViewport)

        const bounds = map.current.getBounds()
        const boundingBox = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        }

        if (newViewport.zoom >= 9) {
          fetchPinsInBounds(boundingBox)
        }
      },
    })

    return cleanup
  }, [map, isMapLoaded, currentPopup, fetchPinsInBounds])

  // Load initial pins
  useEffect(() => {
    if (map?.current && isMapLoaded) {
      fetchAllPins()
      loadUserPin()
    }
  }, [map, isMapLoaded, fetchAllPins, loadUserPin])

  // Socket listeners
  useEffect(() => {
    if (!socket || !isMapLoaded) return

    const handlePinUpdate = () => {
      fetchAllPins()
      loadUserPin()
    }

    socket.on('pin_created', handlePinUpdate)
    socket.on('pin_updated', handlePinUpdate)
    socket.on('center_map', location => {
      if (location && map?.current) {
        setUserLocation(location)
        map.current.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
        })
      }
    })

    socket.emit('viewport_update', viewport)

    return () => {
      socket.off('pin_created', handlePinUpdate)
      socket.off('pin_updated', handlePinUpdate)
      socket.off('center_map')
    }
  }, [socket, map, isMapLoaded, fetchAllPins, loadUserPin, viewport])

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
        <Sidebar
          isMapPage={true}
          userPin={userPin}
          selectedPin={selectedPin}
          startChat={startChat}
          map={map?.current}
        />
      </div>
    </MapErrorBoundary>
  )
}

export default MapComponent
