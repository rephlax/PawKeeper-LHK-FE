export const handlePinCreation = (isCreatingPin, setIsCreatingPin, socket) => {
  console.log('Pin creation handler called', { isCreatingPin })

  try {
    setIsCreatingPin(true)

    if (socket) {
      socket.emit('toggle_pin_creation', {
        isCreating: true,
        isEditing: false,
      })
    }
  } catch (error) {
    console.error('Error in handlePinCreation:', error)
  }
}

export const handlePinEdit = (
  setIsCreatingPin,
  setIsEditing,
  setEditData,
  socket,
  pinData,
) => {
  console.log('Pin edit handler called')

  try {
    setIsCreatingPin(true)
    setIsEditing(true)
    setEditData(pinData)

    if (socket) {
      socket.emit('toggle_pin_creation', {
        isCreating: true,
        isEditing: true,
        pinData,
      })
    }
  } catch (error) {
    console.error('Error in handlePinEdit:', error)
  }
}
