import React, { useEffect, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { RegularSidebar } from './components'
import { MapControls } from '../Map'
import { useMap } from '../../context/MapContext'
import PinList from '../Map/PinList'
import { handlePinEdit } from '../Map/utils/pinHandlers'
import { useChat } from '../../context/ChatContext'

const Sidebar = ({
  isMapPage,
  userPin,
  allPins = [],
  selectedPin,
  onPinSelect,
  user,
  socket,
  isCreatingPin,
  setIsCreatingPin,
  isCreatingReview,
  setIsCreatingReview,
  isEditing,
  setIsEditing,
  editData,
  setEditData,
  startChat,
  map,
}) => {
  const { isMapLoaded } = useMap()
  const { isOpen, setIsOpen } = useChat()

  const resetStates = useCallback(() => {
    if (setIsCreatingReview) setIsCreatingReview(false)
    if (setIsEditing) setIsEditing(false)
    if (setEditData) setEditData(null)
  }, [setIsCreatingReview, setIsEditing, setEditData])

  useEffect(() => {
    if (!selectedPin) {
      resetStates()
    }
  }, [selectedPin, resetStates])

  const handleStartChat = useCallback(
    userId => {
      if (socket) {
        socket.emit('start_private_chat', { targetUserId: userId })
      }
    },
    [socket],
  )

  const handleReview = useCallback(
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

  const handleEditPin = useCallback(
    pin => {
      handlePinEdit(setIsCreatingPin, setIsEditing, setEditData, socket, pin)
    },
    [socket, setIsCreatingPin, setIsEditing, setEditData],
  )

  const handlePinDelete = useCallback(
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

  useEffect(() => {
    if (!socket) return

    const handlePinCreated = () => {
      resetStates()
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
    resetStates,
    setIsCreatingPin,
    setIsEditing,
    setEditData,
    setIsCreatingReview,
  ])

  if (!isMapPage) {
    return <RegularSidebar user={user} />
  }

  return (
    <div className='w-80 h-full bg-white shadow-lg'>
      <div className='flex flex-col h-full'>
        <div className='shrink-0'>
          <MapControls
            user={user}
            socket={socket}
            isCreatingPin={isCreatingPin}
            setIsCreatingPin={setIsCreatingPin}
            isCreatingReview={isCreatingReview}
            setIsCreatingReview={setIsCreatingReview}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editData={editData}
            setEditData={setEditData}
            userPin={userPin}
            selectedPin={selectedPin}
            startChat={startChat}
            map={map}
            isMapLoaded={isMapLoaded}
          />
        </div>

        {!isCreatingPin && !isCreatingReview && (
          <div className='flex-1 overflow-y-auto'>
            <PinList
              pins={allPins}
              user={user}
              selectedPin={selectedPin}
              onPinSelect={onPinSelect}
              onStartChat={handleStartChat}
              onReview={handleReview}
              onEdit={handleEditPin}
              onDelete={handlePinDelete}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
