import mapboxgl from 'mapbox-gl'

export const DEFAULT_CENTER = [-0.118092, 51.509865]

export const createMarker = (coordinates, options = {}) => {
  const { map, type = 'default', onClick, className = '' } = options

  const el = document.createElement('div')

  el.className = `
    w-10 h-10 
    rounded-full 
    flex items-center justify-center 
    text-2xl 
    cursor-pointer 
    shadow-md 
    border-2 border-white 
    transform transition-transform hover:scale-110
    ${type === 'user' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-green-500 text-white hover:bg-green-600'}
    ${className}
  `

  const icon = type === 'user' ? '🏠' : type === 'sitter' ? '🐾' : '📌'
  el.innerHTML = `<span style="font-size: 1.5rem;">${icon}</span>`

  // Create and configure the marker
  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
    draggable: false,
  }).setLngLat(coordinates)

  if (map) {
    marker.addTo(map)
  }

  if (onClick) {
    el.addEventListener('click', e => {
      e.stopPropagation() // Prevent map click event
      onClick()
    })
  }

  return marker
}

export const createPinPopup = (pin, user, options = {}) => {
  const { onChat, onReview, onEdit } = options
  const popupContent = document.createElement('div')
  popupContent.className = 'p-4 max-w-sm bg-white rounded-lg'

  const isOwnPin = pin.user === user?._id

  // Enhanced popup content with more details
  popupContent.innerHTML = `
    <div class="space-y-3">
      <h3 class="font-bold text-lg">${pin.title}</h3>
      <p class="text-gray-700">${pin.description}</p>
      <div class="text-gray-600">
        <p class="font-medium">Services:</p>
        <p class="ml-2">${pin.services.join(', ')}</p>
        <p class="font-medium mt-2">Availability:</p>
        <p class="ml-2">${pin.availability}</p>
        <p class="font-medium mt-2">Rate:</p>
        <p class="ml-2">$-${pin.hourlyRate}/hr</p>
      </div>
      <div class="pt-2">
        ${
          isOwnPin
            ? '<button class="edit-pin-btn w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Edit Pin</button>'
            : `
              <button class="chat-btn w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mb-2 transition-colors">
                Chat with Sitter
              </button>
              <button class="review-btn w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
                Leave Review
              </button>
            `
        }
      </div>
    </div>
  `

  // Add event listeners
  if (!isOwnPin) {
    const chatBtn = popupContent.querySelector('.chat-btn')
    const reviewBtn = popupContent.querySelector('.review-btn')

    chatBtn?.addEventListener('click', () => onChat?.(pin.user))
    reviewBtn?.addEventListener('click', () => onReview?.(pin))
  } else {
    const editBtn = popupContent.querySelector('.edit-pin-btn')
    editBtn?.addEventListener('click', () => onEdit?.(pin))
  }

  return new mapboxgl.Popup({
    closeButton: true,
    closeOnClick: false,
    maxWidth: '300px',
    className: 'pin-popup',
    offset: [0, -20], // Offset to account for marker height
  }).setDOMContent(popupContent)
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
      if (!e.originalEvent.target.className.includes('marker')) {
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

  // Return cleanup function
  return () => cleanup.forEach(fn => fn())
}
