import React, { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { RegularSidebar } from './components'
import { MapControls } from '../Map'
import { useMap } from '../../context/MapContext'
import PinList from '../Map/PinList'

const Sidebar = ({
  isMapPage,
  userPin,
  allPins = [], // Provide default empty array
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

  const handleStartChat = userId => {
    if (socket) {
      socket.emit('start_private_chat', { targetUserId: userId })
    }
  }

  const handleReview = pin => {
    if (socket) {
      socket.emit('toggle_review_creation', {
        isCreating: true,
        targetPin: pin,
      })
      setIsCreatingReview(true)
    }
  }

  const handleEdit = pin => {
    if (socket && pin) {
      socket.emit('toggle_pin_creation', {
        isCreating: true,
        isEditing: true,
        pinData: pin,
      })
      setIsCreatingPin(true)
      setIsEditing(true)
      setEditData(pin)
    }
  }

  useEffect(() => {
    if (socket) {
      console.log('Setting up sidebar socket listeners')

      const handlePinCreated = () => {
        setIsCreatingPin(false)
        setIsEditing(false)
        setEditData(null)
      }

      const handleTogglePinCreation = data => {
        setIsCreatingPin(data.isCreating)
        setIsEditing(data.isEditing || false)
        if (data.pinData) {
          setEditData(data.pinData)
        }
      }

      const handleReviewCreated = () => {
        setIsCreatingReview(false)
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
    }
  }, [socket, setIsCreatingPin, setIsEditing, setEditData, setIsCreatingReview])

  useEffect(() => {
    if (!selectedPin) {
      setIsCreatingReview(false)
      setIsEditing(false)
      setEditData(null)
    }
  }, [selectedPin, setIsCreatingReview, setIsEditing, setEditData])

  if (!isMapPage) {
    return <RegularSidebar user={user} />
  }

  // Ensure allPins is always an array
  const safePins = Array.isArray(allPins) ? allPins : []

  return (
    <div className='w-80 h-full bg-white shadow-lg flex flex-col'>
      <MapControls
        user={user}
        socket={socket}
        isCreatingPin={isCreatingPin}
        setIsCreatingPin={setIsCreatingPin}
        isCreatingReview={isCreatingReview}
        setIsCreatingReview={setIsCreatingReview}
        isEditing={isEditing}
        editData={editData}
        userPin={userPin}
        selectedPin={selectedPin}
        startChat={startChat}
        map={map}
        isMapLoaded={isMapLoaded}
      />

      <div className='flex-1 overflow-hidden'>
        <PinList
          pins={safePins}
          user={user}
          selectedPin={selectedPin}
          onPinSelect={onPinSelect}
          onStartChat={handleStartChat}
          onReview={handleReview}
          onEdit={handleEdit}
        />
      </div>
    </div>
  )
}

export default Sidebar
