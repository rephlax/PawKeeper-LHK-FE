export const handleLocationRequest = (socket) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        if (socket) {
          socket.emit('center_map', location);
        }
      },
      (error) => {
        console.error('Location error:', error);
        alert('Unable to get your location. Please check your browser settings.');
      }
    );
  };