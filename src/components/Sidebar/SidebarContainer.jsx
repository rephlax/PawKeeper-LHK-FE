import React, { useCallback, useEffect } from 'react'
import { useMap } from '../../context/MapContext'
import { useChat } from '../../context/ChatContext'
import { useSidebarSocket } from './hooks/useSidebarSocket'
import { handlePinEdit } from '../Map/utils/pinHandlers'
import MapSidebar from './MapSidebar'
import RegularSidebar from './RegularSidebar'

const SidebarContainer = ({
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
  const { isOpen: isChatOpen, setIsOpen: setChatOpen } = useChat()

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

  const { startPrivateChat, toggleReviewCreation, deletePin } =
    useSidebarSocket({
      socket,
      onResetStates: handleResetStates,
      setIsCreatingPin,
      setIsEditing,
      setEditData,
      setIsCreatingReview,
    })

  const handleEditPin = useCallback(
    pin => {
      handlePinEdit(setIsCreatingPin, setIsEditing, setEditData, socket, pin)
    },
    [socket, setIsCreatingPin, setIsEditing, setEditData],
  )

  if (!isMapPage) {
    return <RegularSidebar user={user} />
  }

  const controlProps = {
    isCreatingPin,
    setIsCreatingPin,
    isCreatingReview,
    setIsCreatingReview,
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    startChat,
  }

  const pinProps = {
    userPin,
    allPins,
    map,
  }

  const handlers = {
    startChat: startPrivateChat,
    review: toggleReviewCreation,
    edit: handleEditPin,
    delete: deletePin,
  }

  return (
    <MapSidebar
      user={user}
      socket={socket}
      controls={controlProps}
      pins={pinProps}
      selectedPin={selectedPin}
      onPinSelect={onPinSelect}
      handlers={handlers}
      isMapLoaded={isMapLoaded}
    />
  )
}

export default SidebarContainer
