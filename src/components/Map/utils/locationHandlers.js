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
        console.log('Panning map to:', location)
        try {
          // Center the map
          map.setCenter([location.lng, location.lat])
          // Set zoom
          map.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            essential: true,
          })
        } catch (error) {
          console.error('Error moving map:', error)
        }
      } else {
        console.error('Map instance not available')
      }

      if (socket && socket.emit) {
        console.log('Socket state:', {
          isConnected: socket.connected,
          socketId: socket.id,
        })

        socket.emit('share_location', location, response => {
          if (response?.error) {
            console.error('Location sharing error:', response.error)
          } else {
            console.log('Location shared successfully:', response)
          }
        })
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
