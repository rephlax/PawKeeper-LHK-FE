import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { RegularSidebar } from './components'
import { MapControls } from '../Map'
import { useMap } from '../../context/MapContext'

const Sidebar = ({ isMapPage, userPin, selectedPin, startChat, map }) => {
  const { user } = useAuth()
  const { socket } = useSocket()
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [isCreatingReview, setIsCreatingReview] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState(null)
  const { isMapLoaded } = useMap()

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
  })

  return isMapPage ? (
    <MapControls
      isMapLoaded={isMapLoaded}
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
    />
  ) : (
    <RegularSidebar user={user} />
  )
}

export default Sidebar
