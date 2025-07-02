import { useState, useEffect, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { debounce } from 'lodash'

export const useMapbox = (options = {}) => {
  const {
    initialCenter = [-0.118092, 51.509865],
    initialZoom = 13,
    onMarkerClick,
    onMapClick,
    onMapLoad,
  } = options

  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState(new Map())
  const [popups, setPopups] = useState(new Map())
  const [isLoading, setIsLoading] = useState(true)

  // Debounced search function
  const searchLocation = useCallback(
    debounce(async query => {
      if (!query.trim()) return []

      try {
        const response = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
            `access_token=${mapboxgl.accessToken}&limit=5`,
        )

        const data = await response.json()
        return data.features
      } catch (error) {
        console.error('Search error:', error)
        return []
      }
    }, 300),
    [],
  )

  // Initialize map
  const initializeMap = useCallback(
    container => {
      if (!container) return

      const newMap = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: initialCenter,
        zoom: initialZoom,
      })

      newMap.addControl(new mapboxgl.NavigationControl(), 'top-right')
      newMap.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: { enableHighAccuracy: true },
          trackUserLocation: true,
        }),
      )

      newMap.on('load', () => {
        setIsLoading(false)
        if (onMapLoad) onMapLoad(newMap)
      })

      if (onMapClick) {
        newMap.on('click', onMapClick)
      }

      setMap(newMap)
      return newMap
    },
    [initialCenter, initialZoom, onMapClick, onMapLoad],
  )

  // Marker management
  const addMarker = useCallback(
    (id, coordinates, options = {}) => {
      if (!map) return

      const el = document.createElement('div')
      el.className = `marker ${options.className || ''} ${options.isNew ? 'marker-new' : ''}`
      el.innerHTML = options.html || '📍'

      const marker = new mapboxgl.Marker(el).setLngLat(coordinates).addTo(map)

      if (options.popup) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(options.popup)
        marker.setPopup(popup)
        setPopups(prev => new Map(prev.set(id, popup)))
      }

      if (onMarkerClick) {
        el.addEventListener('click', () => onMarkerClick(id, marker))
      }

      setMarkers(prev => new Map(prev.set(id, marker)))
      return marker
    },
    [map, onMarkerClick],
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

        const popup = popups.get(id)
        if (popup) {
          popup.remove()
          setPopups(prev => {
            const newPopups = new Map(prev)
            newPopups.delete(id)
            return newPopups
          })
        }
      }
    },
    [markers, popups],
  )

  // Cleanup
  useEffect(() => {
    return () => {
      markers.forEach(marker => marker.remove())
      popups.forEach(popup => popup.remove())
      if (map) map.remove()
    }
  }, [])

  return {
    map,
    markers,
    popups,
    isLoading,
    initializeMap,
    addMarker,
    removeMarker,
    searchLocation,
    flyTo: useCallback(
      (coordinates, zoom = 14) => {
        if (!map) return
        map.flyTo({
          center: coordinates,
          zoom,
          essential: true,
        })
      },
      [map],
    ),
  }
}
