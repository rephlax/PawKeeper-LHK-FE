import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

const MapContext = createContext(null)

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState(new Map())
  const [selectedPin, setSelectedPin] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isMapVisible, setIsMapVisible] = useState(true)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [viewport, setViewport] = useState({
    longitude: -74.5,
    latitude: 40,
    zoom: 9,
  })

  const rateLimiter = {
    lastCall: 0,
    minInterval: 1000,
    checkLimit: () => {
      const now = Date.now()
      if (now - rateLimiter.lastCall >= rateLimiter.minInterval) {
        rateLimiter.lastCall = now
        return true
      }
      return false
    },
  }

  const initializeMap = useCallback(
    container => {
      if (map) return

      console.log('Initializing map...')

      const newMap = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [viewport.longitude, viewport.latitude],
        zoom: viewport.zoom,
      })

      // Map load handler
      newMap.on('load', () => {
        console.log('Map loaded successfully')
        setIsMapLoaded(true)
        newMap.resize()
        if (userLocation) {
          flyTo([userLocation.lng, userLocation.lat])
        }
      })

      // Error handler
      newMap.on('error', e => {
        console.error('Map error:', e)
        setLocationError('Error loading map. Please refresh the page.')
      })

      // Viewport change handler
      newMap.on('moveend', () => {
        const center = newMap.getCenter()
        const bounds = newMap.getBounds()
        const newViewport = {
          longitude: center.lng,
          latitude: center.lat,
          zoom: newMap.getZoom(),
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
        }

        setViewport(newViewport)
      })

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right')
      newMap.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
          showAccuracyCircle: true,
        }),
      )

      setMap(newMap)
      console.log('Map instance created')
      return newMap
    },
    [map, userLocation, viewport],
  )

  const getUserLocation = async socket => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return null
    }

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      const location = {
        lng: position.coords.longitude,
        lat: position.coords.latitude,
      }

      setUserLocation(location)
      setLocationError(null)

      if (map && isMapLoaded) {
        // Get bounds after moving
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
          essential: true,
        })

        // Wait for move to finish
        map.once('moveend', () => {
          const bounds = map.getBounds()
          if (socket && socket.emit) {
            socket.emit('viewport_update', {
              longitude: location.lng,
              latitude: location.lat,
              zoom: 14,
              bounds: {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest(),
              },
            })
          }
        })
      }

      return location
    } catch (error) {
      const message =
        error.code === 1
          ? 'Please enable location access in your browser settings.'
          : 'Unable to get your location. Please try again.'
      setLocationError(message)
      return null
    }
  }

  useEffect(() => {
    return () => {
      if (map) {
        map.remove()
        setMap(null)
        setIsMapLoaded(false)
      }
      markers.forEach(marker => marker.remove())
      setMarkers(new Map())
    }
  }, [])

  const setupSocketListeners = useCallback(
    (socket, loadUserPin) => {
      if (!socket) return null

      const handlePinCreation = data => {
        if (loadUserPin) loadUserPin()
      }

      const handleMapCenter = location => {
        if (location && location.lat && location.lng) {
          setUserLocation(location)
          if (map && isMapLoaded) flyTo([location.lng, location.lat])
        }
      }

      socket.on('pin_created', handlePinCreation)
      socket.on('pin_updated', handlePinCreation)
      socket.on('center_map', handleMapCenter)

      return () => {
        socket.off('pin_created', handlePinCreation)
        socket.off('pin_updated', handlePinCreation)
        socket.off('center_map', handleMapCenter)
      }
    },
    [map, isMapLoaded],
  )

  const addMarker = useCallback(
    (id, lngLat, options = {}) => {
      if (!map || !isMapLoaded || !rateLimiter.checkLimit()) return

      const el = document.createElement('div')
      el.className = `marker ${options.className || ''}`
      el.innerHTML = options.html || '📍'

      const marker = new mapboxgl.Marker(el).setLngLat(lngLat).addTo(map)

      if (options.popup) {
        marker.setPopup(options.popup)
      }

      if (options.onClick) {
        el.addEventListener('click', options.onClick)
      }

      setMarkers(prev => new Map(prev.set(id, marker)))
      return marker
    },
    [map, isMapLoaded],
  )

  const removeMarker = useCallback(
    id => {
      const marker = markers.get(id)
      if (marker) {
        marker.remove()
        setMarkers(prev => {
          const newMarkers = new Map(prev)
          newMarkers.delete(id)
          return newMarkers
        })
      }
    },
    [markers],
  )

  const flyTo = useCallback(
    (lngLat, zoom = 14) => {
      if (!map || !isMapLoaded || !rateLimiter.checkLimit()) return

      console.log('Flying to:', { lngLat, zoom, mapInstance: map })

      try {
        map.off('moveend')

        map.flyTo({
          center: lngLat,
          zoom,
          essential: true,
          duration: 2000,
        })

        map.once('moveend', () => {
          const bounds = map.getBounds()
          setViewport({
            longitude: lngLat[0],
            latitude: lngLat[1],
            zoom,
            bounds: {
              north: bounds.getNorth(),
              south: bounds.getSouth(),
              east: bounds.getEast(),
              west: bounds.getWest(),
            },
          })
        })
      } catch (error) {
        console.error('FlyTo error:', error)
        try {
          map.jumpTo({
            center: lngLat,
            zoom,
          })
        } catch (fallbackError) {
          console.error('JumpTo fallback error:', fallbackError)
        }
      }
    },
    [map, isMapLoaded],
  )

  const value = {
    map,
    initializeMap,
    addMarker,
    removeMarker,
    flyTo,
    selectedPin,
    setSelectedPin,
    userLocation,
    setUserLocation,
    markers,
    getUserLocation,
    locationError,
    setLocationError,
    setupSocketListeners,
    isMapVisible,
    setIsMapVisible,
    isMapLoaded,
    viewport,
    setViewport,
  }

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
}
