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

export const handlePinDelete = (pinId, socket, setPins) => {
  console.log('Pin delete handler called', { pinId })

  try {
    if (socket) {
      socket.emit('delete_pin', { pinId })
    }

    // Update local state to remove the deleted pin
    setPins(prevPins => prevPins.filter(pin => pin._id !== pinId))
  } catch (error) {
    console.error('Error in handlePinDelete:', error)
  }
}