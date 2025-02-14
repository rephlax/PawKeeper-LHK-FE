export const setupSocketListeners = (socket, map, setUserLocation, loadUserPin, setShowPinForm) => {
    if (!socket) return;
  
    socket.on('center_map', (location) => {
      if (location && location.lat && location.lng) {
        setUserLocation(location);
        map?.panTo(location);
      }
    });
  
    socket.on('toggle_pin_creation', ({ isCreating }) => {
      setShowPinForm(isCreating);
    });
  
    socket.on('pin_created', () => {
      loadUserPin();
    });
  
    return () => {
      socket.off('center_map');
      socket.off('toggle_pin_creation');
      socket.off('pin_created');
    };
  };