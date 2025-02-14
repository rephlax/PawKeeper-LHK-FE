export const handlePinCreation = (isCreatingPin, setIsCreatingPin, socket) => {
    const newState = !isCreatingPin;
    setIsCreatingPin(newState);
    if (socket) {
      socket.emit('toggle_pin_creation', { isCreating: newState });
    }
  };