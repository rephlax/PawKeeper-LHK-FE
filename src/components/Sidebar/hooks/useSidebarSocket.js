import { useEffect, useCallback } from 'react'

export const useSidebarSocket = ({
  socket,
  onResetStates,
  setIsCreatingPin,
  setIsEditing,
  setEditData,
  setIsCreatingReview,
}) => {
  useEffect(() => {
    if (!socket) return

    const handlePinCreated = () => {
      onResetStates()
      if (setIsCreatingPin) setIsCreatingPin(false)
    }

    const handleTogglePinCreation = data => {
      if (setIsCreatingPin) setIsCreatingPin(data.isCreating)
      if (setIsEditing) setIsEditing(data.isEditing || false)
      if (setEditData && data.pinData) setEditData(data.pinData)
    }

    const handleReviewCreated = () => {
      if (setIsCreatingReview) setIsCreatingReview(false)
    }

    socket.on('pin_created', handlePinCreated)
    socket.on('pin_updated', handlePinCreated)
    socket.on('toggle_pin_creation', handleTogglePinCreation)
    socket.on('review_created', handleReviewCreated)

    return () => {
      socket.off('pin_created', handlePinCreated)
      socket.off('pin_updated', handlePinCreated)
      socket.off('toggle_pin_creation', handleTogglePinCreation)
      socket.off('review_created', handleReviewCreated)
    }
  }, [
    socket,
    onResetStates,
    setIsCreatingPin,
    setIsEditing,
    setEditData,
    setIsCreatingReview,
  ])

  const startPrivateChat = useCallback(
    userId => {
      if (socket) {
        socket.emit('start_private_chat', { targetUserId: userId })
      }
    },
    [socket],
  )

  const toggleReviewCreation = useCallback(
    pin => {
      if (socket && setIsCreatingReview) {
        socket.emit('toggle_review_creation', {
          isCreating: true,
          targetPin: pin,
        })
        setIsCreatingReview(true)
      }
    },
    [socket, setIsCreatingReview],
  )

  const deletePin = useCallback(
    async pinId => {
      try {
        if (socket) {
          socket.emit('delete_pin', pinId)
        }
      } catch (error) {
        console.error('Error deleting pin:', error)
      }
    },
    [socket],
  )

  return {
    startPrivateChat,
    toggleReviewCreation,
    deletePin,
  }
}
