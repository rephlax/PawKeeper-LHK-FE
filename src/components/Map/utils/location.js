export const DEFAULT_CENTER = { lat: 51.509865, lng: -0.118092 };

export const getUserLocation = (setUserLocation, setLocationError, map, socket) => {
  if (!navigator.geolocation) {
    setLocationError('Geolocation is not supported by your browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setUserLocation(location);
      setLocationError(null);
      map?.panTo(location);
      if (socket) {
        socket.emit('share_location', location);
      }
    },
    error => {
      const message =
        error.code === error.PERMISSION_DENIED
          ? 'Please enable location access in your browser settings to use this feature.'
          : 'Unable to get your location. Please try again.';
      setLocationError(message);
      setUserLocation(DEFAULT_CENTER);
    }
  );
};
