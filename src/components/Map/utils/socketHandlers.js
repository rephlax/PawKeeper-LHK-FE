export const setupSocketListeners = (socket, map, setUserLocation, loadUserPin, setShowPinForm) => {
    if (!socket) {
      console.warn('Socket not available for setup');
      return;
    }
  
    console.log('Setting up socket listeners');
  
    socket.on('center_map', (location) => {
      console.log('Received center_map event:', location);
      if (location && location.lat && location.lng) {
        setUserLocation(location);
        map?.panTo(location);
      }
    });
  
    socket.on('toggle_pin_creation', (data) => {
      console.log('Received toggle_pin_creation event:', data);
      if (setShowPinForm) {
        setShowPinForm(data.isCreating);
      } else {
        console.warn('setShowPinForm not provided to socket handlers');
      }
    });
  
    socket.on('pin_created', () => {
      console.log('Received pin_created event');
      loadUserPin();
    });
  
    return () => {
      console.log('Cleaning up socket listeners');
      socket.off('center_map');
      socket.off('toggle_pin_creation');
      socket.off('pin_created');
    };
  };