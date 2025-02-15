export const handlePinCreation = (isCreatingPin, setIsCreatingPin, socket) => {
  console.log('Pin creation handler called with:', {
    isCreatingPin,
    socket: !!socket,
  });

  try {
    setIsCreatingPin(!isCreatingPin);

    if (socket) {
      console.log('Emitting toggle_pin_creation:', {
        isCreating: !isCreatingPin,
      });
      socket.emit('toggle_pin_creation', {
        isCreating: !isCreatingPin,
      });
    } else {
      console.warn('Socket not available for pin creation');
    }
  } catch (error) {
    console.error('Error in handlePinCreation:', error);
  }
};
