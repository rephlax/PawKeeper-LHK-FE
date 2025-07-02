export const handlePinEdit = (
  setIsCreatingPin,
  setIsEditing,
  setEditData,
  socket,
  pin,
) => {
  if (setIsCreatingPin) setIsCreatingPin(false)
  if (setIsEditing) setIsEditing(true)
  if (setEditData) setEditData(pin)

  if (socket) {
    socket.emit('toggle_pin_creation', {
      isCreating: false,
      isEditing: true,
      pinData: pin,
    })
  }
}

export const handlePinCreate = (socket, pinData) => {
  if (socket) {
    socket.emit('create_pin', pinData)
  }
}

export const handlePinUpdate = (socket, pinId, pinData) => {
  if (socket) {
    socket.emit('update_pin', { pinId, ...pinData })
  }
}

export const handlePinDelete = (socket, pinId) => {
  if (socket) {
    socket.emit('delete_pin', pinId)
  }
}
