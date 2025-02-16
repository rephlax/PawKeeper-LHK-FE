import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { RegularSidebar } from './components'
import { MapControls } from '../Map'
import { useMap } from '../../context/MapContext'
import PinList from './PinList'

const Sidebar = ({
  isMapPage,
  userPin,
  allPins,
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
  startChat,
  map,
}) => {
  const { isMapLoaded } = useMap()
  const [editData, setEditData] = useState(null)

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
    if (socket) {
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
        console.log('Sidebar: Received pin_created event')
        setIsCreatingPin(false)
        setIsEditing(false)
        setEditData(null)
      }

      const handleTogglePinCreation = data => {
        console.log('Received toggle_pin_creation:', data)
        setIsCreatingPin(data.isCreating)
        setIsEditing(data.isEditing || false)
        if (data.pinData) {
          console.log('Received pin data for editing:', data.pinData)
          setEditData(data.pinData)
        }
      }

      const handleReviewCreated = () => {
        console.log('Sidebar: Received review_created event')
        setIsCreatingReview(false)
      }

      socket.on('pin_created', handlePinCreated)
      socket.on('pin_updated', handlePinCreated)
      socket.on('toggle_pin_creation', handleTogglePinCreation)
      socket.on('review_created', handleReviewCreated)

      return () => {
        console.log('Cleaning up sidebar socket listeners')
        socket.off('pin_created', handlePinCreated)
        socket.off('pin_updated', handlePinCreated)
        socket.off('toggle_pin_creation', handleTogglePinCreation)
        socket.off('review_created', handleReviewCreated)
      }
    }
  }, [socket])

  useEffect(() => {
    if (!selectedPin) {
      setIsCreatingReview(false)
      setIsEditing(false)
      setEditData(null)
    }
  }, [selectedPin])

  console.log('Sidebar render:', {
    isMapPage,
    isCreatingPin,
    isCreatingReview,
    isEditing,
    hasEditData: !!editData,
    hasSocket: !!socket,
    hasUser: !!user,
    selectedPin: !!selectedPin,
    totalPins: allPins?.length,
  })

  if (!isMapPage) {
    return <RegularSidebar user={user} />
  }

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
          pins={allPins}
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
