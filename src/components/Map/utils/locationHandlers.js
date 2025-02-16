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
      console.log('Got position:', location)

      if (map) {
        console.log('Updating map position')
        map.setCenter([location.lng, location.lat])
        map.setZoom(14)
      }

      if (socket && socket.emit) {
        console.log('Socket state:', {
          isConnected: socket.connected,
          socketId: socket.id,
          socketUser: socket.user,
        })

        socket.emit('share_location', location, response => {
          if (response?.error) {
            console.error('Location sharing error:', {
              error: response.error,
              location,
              response,
            })
          } else {
            console.log('Location shared successfully:', response)
          }
        })
      } else {
        console.error('Socket not available:', { socket })
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
