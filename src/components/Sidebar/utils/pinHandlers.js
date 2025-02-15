export const handlePinCreation = (
  isCreatingPin,
  setIsCreatingPin,
  socket,
  pinData = null,
) => {
  console.log('Pin creation handler called with:', {
    isCreatingPin,
    socket: !!socket,
    isEditing: !!pinData,
  })

  try {
    setIsCreatingPin(!isCreatingPin)

    if (socket) {
      console.log('Emitting toggle_pin_creation:', {
        isCreating: !isCreatingPin,
        isEditing: !!pinData,
        pinData,
      })
      socket.emit('toggle_pin_creation', {
        isCreating: !isCreatingPin,
        isEditing: !!pinData,
        pinData,
      })
    } else {
      console.warn('Socket not available for pin creation')
    }
  } catch (error) {
    console.error('Error in handlePinCreation:', error)
  }
}
