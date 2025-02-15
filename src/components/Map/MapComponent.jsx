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
    [map, user],
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

        // Update markers
        response.data.forEach(pin => {
          if (!markersRef.current.has(pin._id)) {
            addPinMarker(pin)
          }
        })

        // Remove markers that are no longer visible
        markersRef.current.forEach((marker, pinId) => {
          if (!response.data.find(pin => pin._id === pinId)) {
            marker.remove()
            markersRef.current.delete(pinId)
          }
        })
      } catch (error) {
        console.error('Error fetching pins in bounds:', error)
      }
    },
    [getAuthConfig, addPinMarker],
  )

  const fetchAllPins = useCallback(async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/location-pins/all-pins`,
        getAuthConfig(),
      )

      setAllPins(response.data)
      clearAllMarkers()

      response.data.forEach(pin => {
        addPinMarker(pin)
      })
    } catch (error) {
      console.error('Error fetching pins:', error)
    }
  }, [getAuthConfig, clearAllMarkers, addPinMarker])

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
    initializeMap(mapContainer.current)

    return () => {
      clearAllMarkers()
    }
  }, [])

  // Set up map interactions
  useEffect(() => {
    if (!map?.current) return

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
  }, [map, currentPopup, fetchPinsInBounds])

  // Load initial pins
  useEffect(() => {
    if (map?.current) {
      fetchAllPins()
      loadUserPin()
    }
  }, [map, fetchAllPins, loadUserPin])

  // Socket listeners
  useEffect(() => {
    if (!socket) return

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
  }, [socket, map, fetchAllPins, loadUserPin, viewport])

  return (
    <div className='w-full h-full relative'>
      {locationError && (
        <div className='absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md'>
          <p>{locationError}</p>
        </div>
      )}
      <div ref={mapContainer} className='w-full h-full' />
      <style jsx>{`
        .marker {
          cursor: pointer;
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          transition: transform 0.2s;
        }
        .marker:hover {
          transform: scale(1.1);
        }
        .user-marker {
          background-color: rgba(66, 135, 245, 0.1);
          border: 2px solid #4287f5;
          border-radius: 50%;
        }
        .sitter-marker {
          background-color: rgba(245, 158, 66, 0.1);
          border: 2px solid #f59e42;
          border-radius: 50%;
        }
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}

export default MapComponent
