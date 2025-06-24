import mapboxgl from 'mapbox-gl'

export const createMapMarker = (pin, options = {}) => {
  const { onClick, isSelected } = options

  // Create marker element
  const el = document.createElement('div')
  el.className = 'map-marker'
  el.style.width = '32px'
  el.style.height = '32px'
  el.style.borderRadius = '50%'
  el.style.backgroundColor = isSelected ? '#d6d3d1' : '#fef3c7'
  el.style.border = `3px solid ${isSelected ? '#a8a29e' : '#fde68a'}`
  el.style.cursor = 'pointer'
  el.style.transition = 'all 0.2s'
  el.style.display = 'flex'
  el.style.alignItems = 'center'
  el.style.justifyContent = 'center'

  // Add icon
  const icon = document.createElement('div')
  icon.innerHTML = '🐾'
  icon.style.fontSize = '16px'
  el.appendChild(icon)

  // Hover effect
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'scale(1.1)'
    el.style.zIndex = '10'
  })

  el.addEventListener('mouseleave', () => {
    el.style.transform = 'scale(1)'
    el.style.zIndex = '1'
  })

  // Click handler
  if (onClick) {
    el.addEventListener('click', () => onClick(pin))
  }

  // Create marker
  const marker = new mapboxgl.Marker({ element: el }).setLngLat([
    pin.location.coordinates.longitude,
    pin.location.coordinates.latitude,
  ])

  // Add popup
  const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="padding: 8px;">
        <h3 style="margin: 0 0 4px 0; font-weight: 600;">${pin.title || 'Pet Sitter'}</h3>
        <p style="margin: 0 0 4px 0; color: #666;">${pin.user.username}</p>
        ${pin.rate ? `<p style="margin: 0; font-weight: 500;">$${pin.rate}/hour</p>` : ''}
      </div>
    `)

  marker.setPopup(popup)

  return marker
}

export const updateMapMarkers = (map, pins, markersRef, options = {}) => {
  // Remove existing markers
  Object.values(markersRef).forEach(marker => marker.remove())

  // Clear markers object
  Object.keys(markersRef).forEach(key => delete markersRef[key])

  // Add new markers
  pins.forEach(pin => {
    if (pin.location?.coordinates) {
      const marker = createMapMarker(pin, {
        onClick: options.onMarkerClick,
        isSelected: options.selectedPin?._id === pin._id,
      })

      marker.addTo(map)
      markersRef[pin._id] = marker
    }
  })

  // Fit map to show all markers
  if (pins.length > 0) {
    const bounds = new mapboxgl.LngLatBounds()

    pins.forEach(pin => {
      if (pin.location?.coordinates) {
        bounds.extend([
          pin.location.coordinates.longitude,
          pin.location.coordinates.latitude,
        ])
      }
    })

    map.fitBounds(bounds, { padding: 50 })
  }
}

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in km
}
