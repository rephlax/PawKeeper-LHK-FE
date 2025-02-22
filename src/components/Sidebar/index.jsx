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
  resetStates,
}) => {
  const { isMapLoaded } = useMap()
  const { isOpen, setIsOpen } = useChat()

  // Root container styles - all structural styling is inline
  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  }

  // Inner container styles - all structural styling is inline
  const innerContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  }

  // Controls container styles - all structural styling is inline
  const controlsContainerStyle = {
    flexShrink: '0',
  }

  // List container styles - all structural styling is inline
  const listContainerStyle = {
    flex: '1',
    overflowY: 'auto',
  }

  // List content styles - all structural styling is inline
  const listContentStyle = {
    padding: '1rem', // p-4
  }

  // List title styles - all structural styling is inline
  const listTitleStyle = {
    fontSize: '1.125rem', // text-lg
    fontWeight: '600',
    marginBottom: '1rem', // mb-4
  }

  const handleResetStates = useCallback(() => {
    if (setIsCreatingReview) setIsCreatingReview(false)
    if (setIsEditing) setIsEditing(false)
    if (setEditData) setEditData(null)
  }, [setIsCreatingReview, setIsEditing, setEditData])

  useEffect(() => {
    if (!selectedPin) {
      handleResetStates()
    }
  }, [selectedPin, handleResetStates])

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
      handleResetStates()
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
    handleResetStates,
    setIsCreatingPin,
    setIsEditing,
    setEditData,
    setIsCreatingReview,
  ])

  if (!isMapPage) {
    return <RegularSidebar user={user} />
  }

  return (
    <div style={containerStyle} className='bg-white'>
      <div style={innerContainerStyle}>
        <div style={controlsContainerStyle}>
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
          <div style={listContainerStyle} className='bg-cream-50'>
            <div style={listContentStyle}>
              <h2 style={listTitleStyle} className='text-cream-800'>
                Available Pet Sitters
              </h2>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
