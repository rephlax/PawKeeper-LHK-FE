export const handleLocationRequest = (socket, map) => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      if (map) {
        map.flyTo({
          center: [location.lng, location.lat],
          zoom: 14,
        })
      }
      if (socket && socket.emit) {
        console.log('Sending location to server:', location)
        socket.emit('center_user_map', location)
        socket.emit('share_location', location)
      }
    },
    error => {
      console.error('Location error:', error)
      let message = 'Unable to get your location. '
      if (error.code === error.PERMISSION_DENIED) {
        message += 'Please enable location access in your browser settings.'
      }
      alert(message)
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
  )
}
