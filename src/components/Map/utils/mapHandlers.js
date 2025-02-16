import mapboxgl from 'mapbox-gl'

export const DEFAULT_CENTER = [-0.118092, 51.509865]

export const createMarker = (coordinates, options = {}) => {
  const { map, type = 'default', onClick, className = '' } = options

  // Create marker element with better styling
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
    el.addEventListener('click', (e) => {
      e.stopPropagation()
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

  // Popup content
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
        <p class="ml-2">$${pin.hourlyRate}/hr</p>