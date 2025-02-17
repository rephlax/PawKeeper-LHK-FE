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
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [isCreatingReview, setIsCreatingReview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)

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
        const normalizedBounds = {
          north: Number(bounds.north.toFixed(6)),
          south: Number(bounds.south.toFixed(6)),
          east: Number(bounds.east.toFixed(6)),
          west: Number(bounds.west.toFixed(6)),
        }

        console.log('Fetching pins with bounds:', normalizedBounds)

        const response = await axios.get(
          `${BACKEND_URL}/api/location-pins/in-bounds`,
          {
            params: normalizedBounds,
            ...getAuthConfig(),
          },
        )

        if (response.data) {
          setAllPins(prevPins => {
            const existingPinsMap = new Map(prevPins.map(pin => [pin._id, pin]))

            response.data.forEach(pin => {
              existingPinsMap.set(pin._id, pin)
            })

            return Array.from(existingPinsMap.values())
          })

          if (isMapLoaded) {
            markersRef.current.forEach((marker, pinId) => {
              if (!response.data.find(pin => pin._id === pinId)) {
                marker.remove()
                markersRef.current.delete(pinId)
              }
            })
            response.data.forEach((pin, index) => {
              if (!markersRef.current.has(pin._id)) {
                addPinMarker(pin, index)
              }
            })
          }
        }
      } catch (error) {
        console.error('Error fetching pins in bounds:', error.response || error)
        if (error.response?.status === 500) {
          console.warn(
            'Server error when fetching pins, retaining existing pins',
          )
        }
      }
    },
    [getAuthConfig, addPinMarker, isMapLoaded],
  )

  const fetchAllPins = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/all-pins`,
        getAuthConfig(),
      )

      if (response.data) {
        setAllPins(response.data)

        if (isMapLoaded) {
          clearAllMarkers()

          response.data.forEach((pin, index) => {
            addPinMarker(pin, index)
          })
        }
      }
    } catch (error) {
      console.error('Error fetching pins:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      })

      if (error.response?.status !== 500) {
        alert('Failed to load pins. Please try refreshing the page.')
      }
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
        setViewport(newViewport)

        if (debounceTimeout) {
          clearTimeout(debounceTimeout)
        }

        debounceTimeout = setTimeout(() => {
          const bounds = map.getBounds()
          const boundingBox = {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          }

          if (newViewport.zoom >= 9) {
            fetchPinsInBounds(boundingBox)
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
  }, [map, isMapLoaded, currentPopup, fetchPinsInBounds])

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

    const handlePinUpdate = data => {
      console.log('Received pin update:', data)

      // Clear markers and refetch all pins to ensure clean state
      clearAllMarkers()
      fetchAllPins()
      loadUserPin()

      if (data?.location?.coordinates && map) {
        map.flyTo({
          center: data.location.coordinates,
          zoom: 14,
          essential: true,
        })
      }
    }

    socket.on('pin_created', handlePinUpdate)
    socket.on('pin_updated', handlePinUpdate)
    socket.on('pin_deleted', handlePinUpdate)
    socket.on('center_map', location => {
      if (location && map) {
        setUserLocation(location)
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
        })
      }
    })

    socket.emit('viewport_update', viewport)

    return () => {
      socket.off('pin_created', handlePinUpdate)
      socket.off('pin_updated', handlePinUpdate)
      socket.off('pin_deleted', handlePinUpdate)
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
  ])

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
          allPins={allPins}
          onPinSelect={setSelectedPin}
          user={user}
          socket={socket}
          isCreatingPin={isCreatingPin}
          setIsCreatingPin={setIsCreatingPin}
          isCreatingReview={isCreatingReview}
          setIsCreatingReview={setIsCreatingReview}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editData={editData}
          map={map}
        />
      </div>
    </MapErrorBoundary>
  )
}

export default MapComponent
