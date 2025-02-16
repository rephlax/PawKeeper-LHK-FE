import mapboxgl from 'mapbox-gl'

export const DEFAULT_CENTER = [-0.118092, 51.509865]

export const createMarker = (coordinates, options = {}) => {
  const { map, type = 'default', onClick, className = '', index } = options

  const el = document.createElement('div')

  el.className = `
    marker-pin
    ${type === 'user' ? 'user-pin' : 'sitter-pin'}
    w-8 h-8 
    rounded-full 
    flex items-center justify-center 
    text-base 
    cursor-pointer 
    shadow-lg 
    border-2 border-white 
    transform transition-transform hover:scale-110
    ${type === 'user' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-green-500 text-white hover:bg-green-600'}
    ${className}
  `

  // Use numbers instead of icons
  el.innerHTML = `<span class="font-bold">${index + 1}</span>`

  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'center',
    offset: [0, 0],
    zIndexOffset: type === 'user' ? 999 : Math.floor(Math.random() * 100),
    draggable: false,
    clickTolerance: 10,
  }).setLngLat(coordinates)

  if (map) {
    marker.addTo(map)
  }

  if (onClick) {
    el.addEventListener('click', e => {
      e.stopPropagation()
      e.preventDefault()
      onClick()
    })
  }

  return marker
}

export const setupMapControls = map => {
  // Add navigation controls
  map.addControl(
    new mapboxgl.NavigationControl({
      showCompass: true,
      showZoom: true,
      visualizePitch: true,
    }),
    'top-right',
  )

  // Add geolocation control with tracking
  map.addControl(
    new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    }),
    'top-right',
  )

  // Add scale control
  map.addControl(new mapboxgl.ScaleControl(), 'bottom-left')
}

export const handleMapSearch = async query => {
  if (!query.trim()) return []

  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?` +
        `access_token=${mapboxgl.accessToken}&limit=5`,
    )

    if (!response.ok) {
      throw new Error('Search request failed')
    }

    const data = await response.json()
    return data.features
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
}

export const setupMapInteractions = (map, options = {}) => {
  const { onMapClick, onViewportChange } = options
  const cleanup = []

  // Handle map clicks
  if (onMapClick) {
    const clickHandler = e => {
      if (!e.originalEvent.target.className.includes('marker-pin')) {
        onMapClick(e)
      }
    }
    map.on('click', clickHandler)
    cleanup.push(() => map.off('click', clickHandler))
  }

  // Handle viewport changes
  if (onViewportChange) {
    const moveEndHandler = () => {
      const center = map.getCenter()
      const bounds = map.getBounds()
      onViewportChange({
        longitude: center.lng,
        latitude: center.lat,
        zoom: map.getZoom(),
        bounds: {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest(),
        },
      })
    }
    map.on('moveend', moveEndHandler)
    cleanup.push(() => map.off('moveend', moveEndHandler))
  }

  setupMapControls(map)

  return () => cleanup.forEach(fn => fn())
}

// Helper function for manipulating map view
export const flyToLocation = (map, coordinates, zoom = 14) => {
  if (!map) return

  try {
    map.flyTo({
      center: coordinates,
      zoom,
      essential: true,
      duration: 2000,
    })
  } catch (error) {
    console.error('FlyTo error:', error)
    // Fallback to instant jump if animation fails
    try {
      map.jumpTo({
        center: coordinates,
        zoom,
      })
    } catch (fallbackError) {
      console.error('JumpTo fallback error:', fallbackError)
    }
  }
}
