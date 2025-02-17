export const handleLocationRequest = (socket, map) => {
  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser')
    return
  }

  console.log('Location request initiated with:', { hasMap: !!map })

  navigator.geolocation.getCurrentPosition(
    position => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      console.log('Got position:', location)

      if (map) {
        console.log('Updating map position')
        try {
          map.flyTo({
            center: [location.lng, location.lat],
            zoom: 14,
            essential: true,
            duration: 2000,
          })
        } catch (error) {
          console.error('Map movement error:', error)
          // Fallback
          try {
            map.jumpTo({
              center: [location.lng, location.lat],
              zoom: 14,
            })
          } catch (fallbackError) {
            console.error('Fallback movement error:', fallbackError)
          }
        }
      }

      if (socket && socket.emit) {
        console.log('Emitting location update')
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
