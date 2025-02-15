import React, { createContext, useContext, useEffect, useState } from 'react'
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

  const initializeMap = container => {
    if (map) return

    const newMap = new mapboxgl.Map({
      container,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-74.5, 40],
      zoom: 9,
    })

    newMap.addControl(new mapboxgl.NavigationControl(), 'top-right')
    newMap.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
    )

    setMap(newMap)
    return newMap
  }

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

      if (map) {
        flyTo(location)
      }

      if (socket) {
        socket.emit('share_location', location)
        socket.emit('center_user_map', location)
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

  const setupSocketListeners = (socket, loadUserPin) => {
    if (!socket) return null

    const handlePinCreation = data => {
      if (loadUserPin) loadUserPin()
    }

    const handleMapCenter = location => {
      if (location && location.lat && location.lng) {
        setUserLocation(location)
        if (map) flyTo([location.lng, location.lat])
      }
    }

    socket.on('pin_created', handlePinCreation)
    socket.on('pin_updated', handlePinCreation)
    socket.on('center_map', handleMapCenter)

    // Return cleanup function
    return () => {
      socket.off('pin_created', handlePinCreation)
      socket.off('pin_updated', handlePinCreation)
      socket.off('center_map', handleMapCenter)
    }
  }

  const addMarker = (id, lngLat, options = {}) => {
    if (!map || !rateLimiter.checkLimit()) return

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
  }

  const removeMarker = id => {
    const marker = markers.get(id)
    if (marker) {
      marker.remove()
      setMarkers(prev => {
        const newMarkers = new Map(prev)
        newMarkers.delete(id)
        return newMarkers
      })
    }
  }

  const flyTo = (lngLat, zoom = 14) => {
    if (!map || !rateLimiter.checkLimit()) return

    map.flyTo({
      center: lngLat,
      zoom,
      essential: true,
    })
  }

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
