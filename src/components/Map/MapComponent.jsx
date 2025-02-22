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
import { useTranslation } from 'react-i18next'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const MapComponent = ({
  setUserPin,
  setAllPins,
  selectedPin,
  setSelectedPin,
}) => {
  const mapContainer = useRef(null)
  const [showLocationPrompt, setShowLocationPrompt] = useState(true)
  const [isLocating, setIsLocating] = useState(true)
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
  const isProcessing = isLoading || isLocating || !isMapLoaded

  // Container
  const containerStyle = {
    position: 'relative',
    width: '100%',
    height: '100%',
  }

  // Location prompt overlay
  const promptOverlayStyle = {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '30',
    backdropFilter: 'blur(4px)',
  }

  // Prompt dialog
  const promptDialogStyle = {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: '28rem',
    textAlign: 'center',
  }

  // Dialog title
  const dialogTitleStyle = {
    fontSize: '1.25rem',
    fontWeight: '600',
    marginBottom: '1rem',
  }

  // Dialog text
  const dialogTextStyle = {
    marginBottom: '1rem',
  }

  // Button container
  const buttonContainerStyle = {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  }

  // Primary button
  const primaryButtonStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
  }

  // Primary button hover
  const handlePrimaryButtonHover = e => {
    e.target.classList.remove('bg-cream-600')
    e.target.classList.add('bg-cream-700')
  }

  const handlePrimaryButtonLeave = e => {
    e.target.classList.remove('bg-cream-700')
    e.target.classList.add('bg-cream-600')
  }

  // Secondary button
  const secondaryButtonStyle = {
    padding: '0.5rem 1rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    transition: 'background-color 0.2s',
  }

  // Secondary button hover
  const handleSecondaryButtonHover = e => {
    e.target.classList.remove('bg-transparent')
    e.target.classList.add('bg-cream-50')
  }

  const handleSecondaryButtonLeave = e => {
    e.target.classList.remove('bg-cream-50')
    e.target.classList.add('bg-transparent')
  }

  // Error message
  const errorMessageStyle = {
    position: 'absolute',
    top: '1rem',
    left: '1rem',
    zIndex: '10',
    padding: '0.75rem 1rem',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '0.5rem',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    maxWidth: '28rem',
  }

  // Loading overlay
  const loadingOverlayStyle = {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '20',
    backdropFilter: 'blur(4px)',
  }

  // Loading dialog
  const loadingDialogStyle = {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  }

  // Loading spinner
  const spinnerStyle = {
    height: '2rem',
    width: '2rem',
    borderRadius: '9999px',
    borderBottom: '2px solid',
    animation: 'spin 1s linear infinite',
  }

  // Add spinner animation
  const spinKeyframes = `
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `

  useEffect(() => {
    // Add the keyframes to the document
    const styleElement = document.createElement('style')
    styleElement.innerHTML = spinKeyframes
    document.head.appendChild(styleElement)

    return () => {
      // Clean up the style element when the component unmounts
      document.head.removeChild(styleElement)
    }
  }, [])

  // Map error
  const mapErrorStyle = {
    position: 'absolute',
    inset: '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }

  // Map error message
  const mapErrorMessageStyle = {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    boxShadow:
      '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  }

  // Map container
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  }

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

  const requestLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true)
      navigator.geolocation.getCurrentPosition(
        position => {
          setIsLocating(false)
          const location = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          }
          setUserLocation(location)
          setShowLocationPrompt(false)

          // Center map on user location and zoom
          map?.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            essential: true,
          })

          // Emit location for socket updates
          if (socket) {
            socket.emit('viewport_update', {
              longitude: location.lng,
              latitude: location.lat,
              zoom: 14,
              bounds: map.getBounds(),
            })
          }
        },
        error => {
          setIsLocating(false)
          console.error('Error getting location:', error)
          setLocationError(
            error.code === 1
              ? 'Please enable location access in your browser settings.'
              : 'Unable to get your location. Please try again.',
          )
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      )
    }
  }

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
    if (map && isMapLoaded && userLocation) {
      const bounds = map.getBounds()
      if (bounds) {
        const boundingBox = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        }

        fetchPinsInBounds(boundingBox)
      }
    }
  }, [map, isMapLoaded, userLocation, fetchPinsInBounds])

  useEffect(() => {
    if (isMapLoaded) {
      setIsLoading(false)
    }
  }, [isMapLoaded])

  const { t } = useTranslation()
  return (
    <MapErrorBoundary>
      <div style={containerStyle}>
        {showLocationPrompt && (
          <div style={promptOverlayStyle} className='bg-black/30'>
            <div style={promptDialogStyle} className='bg-white'>
              <h3 style={dialogTitleStyle} className='text-cream-800'>
                {t('map.enablelocation')}
              </h3>
              <p style={dialogTextStyle} className='text-cream-700'>
                {t('map.showsitters')}
              </p>
              <div style={buttonContainerStyle}>
                <button
                  onClick={() => {
                    setShowLocationPrompt(false)
                    requestLocation()
                  }}
                  style={primaryButtonStyle}
                  className='bg-cream-600 text-white'
                  onMouseOver={handlePrimaryButtonHover}
                  onMouseOut={handlePrimaryButtonLeave}
                >
                  {t('map.allowlocation')}
                </button>
                <button
                  onClick={() => setShowLocationPrompt(false)}
                  style={secondaryButtonStyle}
                  className='border-cream-400 text-cream-700 bg-transparent'
                  onMouseOver={handleSecondaryButtonHover}
                  onMouseOut={handleSecondaryButtonLeave}
                >
                  {t('map.notnow')}
                </button>
              </div>
            </div>
          </div>
        )}

        {locationError && (
          <div
            style={errorMessageStyle}
            className='bg-red-50 border-red-200 text-red-700'
          >
            <p>{locationError}</p>
          </div>
        )}

        {isProcessing ? (
          <div style={loadingOverlayStyle} className='bg-white/80'>
            <div style={loadingDialogStyle} className='bg-white'>
              <div style={spinnerStyle} className='border-b-cream-600'></div>
              <p className='text-cream-700'>
                {isLocating
                  ? 'Getting your location...'
                  : !isMapLoaded
                    ? 'Initializing map...'
                    : 'Loading...'}
              </p>
            </div>
          </div>
        ) : initError ? (
          <div style={mapErrorStyle}>
            <div
              style={mapErrorMessageStyle}
              className='bg-red-50 text-red-700'
            >
              {initError}
            </div>
          </div>
        ) : null}

        <div ref={mapContainer} style={mapContainerStyle} />
      </div>
    </MapErrorBoundary>
  )
}

export default MapComponent
